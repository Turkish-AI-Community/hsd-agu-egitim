# Credit Risk Prediction API

LightGBM modeli ile kredi riski tahmini yapan ve RAG tabanlı chatbot asistan barındıran FastAPI servisi.

## Dosya Yapısı

| Dosya | Açıklama |
|-------|----------|
| `main.py` | FastAPI uygulaması, endpoint tanımları, CORS, statik dosya servisi |
| `model.py` | LightGBM pipeline yükleme ve tahmin |
| `schemas.py` | Pydantic request/response şemaları |
| `feature_eng.py` | Feature engineering (inference sırasında pipeline öncesi) |
| `rag_service.py` | RAG chatbot servisi: FAISS index, Gemini embedding/generation, tool calling |
| `database.py` | SQLite ile sohbet geçmişi ve tahmin bağlamı yönetimi |

## Çalıştırma

Proje kök dizininde:

```bash
# Gemini API anahtarını .env dosyasına ekle (chatbot için gerekli)
# GEMINI_API_KEY=your-api-key

uv run uvicorn src.backend.main:app --reload
```

Sunucu varsayılan olarak `http://127.0.0.1:8000` adresinde başlar.

## Endpoint'ler

### GET /health

Servisin ayakta olduğunu kontrol eder.

```bash
curl http://127.0.0.1:8000/health
```

Yanıt:

```json
{"status": "ok"}
```

### POST /predict

Tek bir müşteri için kredi riski tahmini yapar.

```bash
curl -X POST http://127.0.0.1:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "age": 35,
    "sex": "male",
    "job": 2,
    "housing": "own",
    "saving_accounts": "little",
    "checking_account": "moderate",
    "credit_amount": 5000,
    "duration": 24,
    "purpose": "car"
  }'
```

PowerShell ile:

```powershell
$body = @{
    age = 35
    sex = "male"
    job = 2
    housing = "own"
    saving_accounts = "little"
    checking_account = "moderate"
    credit_amount = 5000
    duration = 24
    purpose = "car"
} | ConvertTo-Json

Invoke-RestMethod -Uri http://127.0.0.1:8000/predict -Method Post -Body $body -ContentType "application/json"
```

Yanıt:

```json
{
  "prediction": "bad",
  "probability": 0.4816,
  "threshold": 0.3
}
```

### POST /chat

Chatbot asistanına mesaj gönderir. RAG ile bilgi tabanından bağlam çeker, varsa en güncel kredi hesaplama sonucunu da kullanır.

```bash
curl -X POST http://127.0.0.1:8000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Kredi skorum neden riskli çıktı?",
    "session_id": "test-session-123"
  }'
```

Yanıt:

```json
{
  "reply": "Merhaba! Hesaplama sonucuna baktığımda...",
  "session_id": "test-session-123"
}
```

### GET /chat/history/{session_id}

Belirli bir oturumun sohbet geçmişini döndürür.

```bash
curl http://127.0.0.1:8000/chat/history/test-session-123
```

### Swagger UI

Tarayıcıda interaktif API dokümantasyonu:

```
http://127.0.0.1:8000/docs
```

## Request Alanları (POST /predict)

| Alan | Tip | Açıklama |
|------|-----|----------|
| age | int | Müşteri yaşı (>=18) |
| sex | str | Cinsiyet: male / female |
| job | int | İş beceri seviyesi: 0-3 |
| housing | str | Konut: own / rent / free |
| saving_accounts | str veya null | Birikim: little / moderate / quite rich / rich |
| checking_account | str veya null | Vadesiz hesap: little / moderate / rich |
| credit_amount | int | Kredi tutarı (>0) |
| duration | int | Kredi süresi, ay (>0) |
| purpose | str | Kredi amacı: car, furniture/equipment, radio/TV, domestic appliances, repairs, education, business, vacation/others |

## Response Alanları (POST /predict)

| Alan | Tip | Açıklama |
|------|-----|----------|
| prediction | str | Tahmin: "good" veya "bad" |
| probability | float | "bad" sınıfı olasılığı (0-1) |
| threshold | float | Karar eşiği (0.30) |

## Ortam Değişkenleri

| Değişken | Açıklama | Zorunlu |
|----------|----------|---------|
| `GEMINI_API_KEY` | Gemini API anahtarı (chatbot için) | Chatbot kullanılacaksa evet |
| `ALLOWED_ORIGINS` | CORS izinli originler (virgülle ayrılmış) | Hayır (varsayılan: localhost) |
