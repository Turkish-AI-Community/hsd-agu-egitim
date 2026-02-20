import os
import re
import pickle
import time
import logging
from pathlib import Path

import numpy as np
import faiss
from dotenv import load_dotenv
from google import genai
from google.genai import types

logger = logging.getLogger(__name__)

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
INDEX_DIR = PROJECT_ROOT / "data" / "index_store"
INDEX_PATH = INDEX_DIR / "faiss_index.bin"
DOCS_PATH = INDEX_DIR / "documents.pkl"
QA_DATA_PATH = PROJECT_ROOT / "data" / "soru_cevap_data.md"

EMBED_MODEL = "gemini-embedding-001"
LLM_MODEL = "gemini-2.5-flash"
BATCH_SIZE = 100
WAIT_SEC = 30
THRESHOLD = 0.30

_client: genai.Client | None = None
_index: faiss.IndexFlatIP | None = None
_documents: list[str] = []

SYSTEM_PROMPT = """Sen KrediPusula uygulamasının samimi ve yardımcı asistanısın. Adın KrediPusula Asistan.

Görevin:
- Kredi risk skorlama hakkında soruları yanıtlamak
- Kullanıcılara başvuru süreci ve uygulama hakkında yardımcı olmak
- Samimi, sıcak ve anlaşılır bir dil kullanmak

Uygulama bilgileri:
- KrediPusula, LightGBM tabanlı bir kredi risk değerlendirme uygulamasıdır
- Kullanıcılar yaş, cinsiyet, meslek seviyesi (0-3), konut durumu (own/rent/free), birikim hesabı, çek hesabı, kredi miktarı, süre ve amaç bilgilerini girer
- Model 0-1 arası bir olasılık (probability) üretir
- Eşik değeri (threshold): 0.30
- probability >= 0.30 → "riskli" (bad), probability < 0.30 → "güvenli" (good)
- Feature engineering: credit_per_month, credit_to_age, saving_score, checking_score

Tool'un var: evaluate_risk_score(probability) - Modelin ürettiği 0-1 arası olasılık değerini alır, 0.30 eşiğine göre "riskli" veya "güvenli" döner.
Kullanıcı bir olasılık değeri verdiğinde bu tool'u kullan.

Aşağıdaki bağlamı kullanarak soruları yanıtla. Bağlamda yoksa bilmediğini samimi şekilde belirt.

BAĞLAM:
{context}"""

evaluate_risk_declaration = types.FunctionDeclaration(
    name="evaluate_risk_score",
    description="Modelin ürettiği 0-1 arası olasılık değerini alır, 0.30 eşiğine göre risk değerlendirmesi yapar",
    parameters={
        "type": "object",
        "properties": {
            "probability": {
                "type": "number",
                "description": "0-1 arası risk olasılığı (modelin ürettiği probability değeri)",
            }
        },
        "required": ["probability"],
    },
)

_tools = types.Tool(function_declarations=[evaluate_risk_declaration])


def evaluate_risk_score(probability: float) -> str:
    if probability >= THRESHOLD:
        return f"riskli (bad) — olasılık {probability:.2f}, eşik {THRESHOLD} üzerinde"
    return f"güvenli (good) — olasılık {probability:.2f}, eşik {THRESHOLD} altında"


def _load_qa_docs() -> list[str]:
    text = QA_DATA_PATH.read_text(encoding="utf-8")
    pattern = r"\*\*KRD-\d+\s*\|\s*S:\s*(.+?)\*\*\s*\nC:\s*(.+?)(?=\n\n\*\*KRD-|\n\n---|\Z)"
    matches = re.findall(pattern, text, re.DOTALL)
    return [f"S: {q.strip()}\nC: {a.strip()}" for q, a in matches if q.strip() and a.strip()]


def _embed_documents(texts: list[str]) -> np.ndarray:
    embeddings: list[list[float]] = []
    for i in range(0, len(texts), BATCH_SIZE):
        batch = texts[i : i + BATCH_SIZE]
        for attempt in range(5):
            try:
                res = _client.models.embed_content(model=EMBED_MODEL, contents=batch)
                embeddings.extend([e.values for e in res.embeddings])
                break
            except Exception as e:
                if "429" in str(e) and attempt < 4:
                    time.sleep(WAIT_SEC)
                else:
                    raise
        if i + BATCH_SIZE < len(texts):
            time.sleep(WAIT_SEC)
    return np.array(embeddings, dtype=np.float32)


def _build_and_save_index(documents: list[str]):
    logger.info("Building FAISS index for %d documents...", len(documents))
    vecs = _embed_documents(documents)
    faiss.normalize_L2(vecs)
    index = faiss.IndexFlatIP(vecs.shape[1])
    index.add(vecs)
    INDEX_DIR.mkdir(parents=True, exist_ok=True)
    # Python I/O to avoid FAISS C++ unicode path issues on Windows
    index_bytes = faiss.serialize_index(index)
    INDEX_PATH.write_bytes(index_bytes)
    with open(DOCS_PATH, "wb") as f:
        pickle.dump(documents, f)
    logger.info("FAISS index saved to %s", INDEX_PATH)
    return index, documents


def init_rag():
    """Initialize Gemini client and load FAISS index. Call once at startup."""
    global _client, _index, _documents

    load_dotenv()
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        logger.warning("GEMINI_API_KEY not set - chat endpoint will be unavailable")
        return

    _client = genai.Client(api_key=api_key)

    try:
        _load_or_build_index()
    except Exception:
        logger.exception("Failed to initialize FAISS index - chat will be unavailable")


def _load_or_build_index():
    global _index, _documents

    if INDEX_PATH.exists() and DOCS_PATH.exists():
        try:
            index_bytes = INDEX_PATH.read_bytes()
            _index = faiss.deserialize_index(np.frombuffer(index_bytes, dtype=np.uint8))
            with open(DOCS_PATH, "rb") as f:
                _documents = pickle.load(f)
            logger.info("Loaded FAISS index: %d documents", len(_documents))
            return
        except Exception:
            logger.warning("Could not read cached index, rebuilding...")

    docs = _load_qa_docs()
    if not docs:
        logger.warning("No Q&A data found at %s", QA_DATA_PATH)
        return
    _index, _documents = _build_and_save_index(docs)


def is_available() -> bool:
    return _client is not None and _index is not None


def search_similar(query: str, k: int = 5) -> list[str]:
    if not is_available():
        return []
    q_emb = _client.models.embed_content(model=EMBED_MODEL, contents=[query])
    q = np.array([q_emb.embeddings[0].values], dtype=np.float32)
    faiss.normalize_L2(q)
    _, indices = _index.search(q, k=min(k, len(_documents)))
    return [_documents[i] for i in indices[0] if i >= 0]


def _format_prediction_context(pred: dict) -> str:
    inp = pred["inputs"]
    res = pred["result"]
    prediction_label = "riskli (bad)" if res["prediction"] == "bad" else "güvenli (good)"
    return (
        f"\n\n--- KULLANICININ EN GÜNCEL KREDİ HESAPLAMASI (bu her zaman en günceldir, sohbet geçmişinde farklı değerler varsa onları GÖRMEZDEN GEL) ---\n"
        f"- Yaş: {inp.get('age')}, Cinsiyet: {inp.get('sex')}, İş seviyesi: {inp.get('job')}, Konut: {inp.get('housing')}\n"
        f"- Birikim hesabı: {inp.get('saving_accounts', 'bilinmiyor')}, Vadesiz hesap: {inp.get('checking_account', 'bilinmiyor')}\n"
        f"- Kredi tutarı: {inp.get('credit_amount')} DM, Vade: {inp.get('duration')} ay, Amaç: {inp.get('purpose')}\n"
        f"- Sonuç: {prediction_label}, Olasılık: {res.get('probability')}, Eşik: {res.get('threshold')}\n"
        f"--- SON ---\n\n"
        f"ÖNEMLİ: Yukarıdaki hesaplama kullanıcının EN SON yaptığı hesaplamadır. "
        f"Sohbet geçmişinde eski hesaplamalar tartışılmış olabilir, HER ZAMAN bu en güncel verileri kullan. "
        f"Neden riskli/güvenli çıktığını, hangi faktörlerin etkili olabileceğini açıkla."
    )


def chat(user_message: str, history: list[dict] | None = None, prediction_context: dict | None = None) -> str:
    """Generate a response using RAG context + function calling."""
    if not is_available():
        return "Asistan şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin."

    context = "\n".join(search_similar(user_message, k=5))
    system = SYSTEM_PROMPT.format(context=context)

    if prediction_context:
        system += _format_prediction_context(prediction_context)

    contents = []
    if history:
        for msg in history[-10:]:
            contents.append(types.Content(
                role=msg["role"],
                parts=[types.Part.from_text(text=msg["content"])],
            ))
    contents.append(types.Content(
        role="user",
        parts=[types.Part.from_text(text=user_message)],
    ))

    config = types.GenerateContentConfig(
        system_instruction=system,
        tools=[_tools],
        temperature=0.4,
        max_output_tokens=1024,
    )

    for _ in range(5):
        response = _client.models.generate_content(
            model=LLM_MODEL,
            contents=contents,
            config=config,
        )
        parts = response.candidates[0].content.parts
        for part in parts:
            if hasattr(part, "function_call") and part.function_call:
                fc = part.function_call
                args = dict(fc.args) if fc.args else {}
                result = evaluate_risk_score(args.get("probability", 0))
                contents.append(types.Content(role="model", parts=[part]))
                contents.append(types.Content(
                    role="user",
                    parts=[types.Part.from_function_response(
                        name=fc.name, response={"result": result}
                    )],
                ))
                break
        else:
            return "".join(
                p.text for p in parts if hasattr(p, "text") and p.text
            )
    return "Üzgünüm, yanıt oluşturulamadı. Lütfen tekrar deneyin."
