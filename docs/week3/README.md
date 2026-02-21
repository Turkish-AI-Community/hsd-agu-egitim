# Hafta 3: Generative AI Temelleri ve RAG & Agent Mimarisi


## 1. Büyük Dil Modelleri (LLM) Temelleri

### LLM Nedir?

Büyük Dil Modelleri (Large Language Models), internetteki devasa veriyle eğitilmiş, metin tabanlı çıktı üreten modellerdir. Temel görevleri metin üretmektir.

**Eğitim Aşamaları:**

1. **Pre-training:** Modelin internetteki büyük veri üzerinde ham olarak eğitilmesi. Bu aşamada model, dil kalıplarını öğrenir.
2. **Post-training:** Modele çeşitli kabiliyetler (kod yazma, özetleme, yaratıcı yazarlık vb.) kazandırılır. Farklı dillerde geliştirilir.

### Transformer Mimarisi ve Attention Mekanizması

LLM'lerin temel yapı taşı, Google'ın 2017'de yayımladığı makaleyle tanıtılan **Transformer** mimarisidir. Bu mimarinin kalbi **Self-Attention** (Öz-Dikkat) mekanizmasıdır.

**Attention Mekanizması Nasıl Çalışır?**

Modelin yaptığı şey özünde büyülü değildir: bir olasılık uzayındaki en yüksek olasılıklı kelimeyi, kendinden önceki kelime ve kelime öbeklerine bakarak art arda dizmektir.

Örnek: *"Biz şu anda HSD Abdullah Gül Üniversitesi'nde Türkiye Yapay Zeka Topluluğuyla bir eğitimdeyiz"* cümlesinde, bağlam olmadan "biz"den sonra gelen en yüksek olasılıklı kelime "kafedeyiz" de olabilirdi. Ancak önceki bağlam, "eğitimdeyiz" kelimesinin olasılığını yükseltir.

### Temel Kavramlar

| Kavram | Açıklama |
|---|---|
| **Token** | LLM'in işleyebildiği en küçük birim. Bir hece, harf, kök veya kelime olabilir. Kullanım başına ücretlendirme bu birimi esas alır. |
| **Context Window** | Modelin tek seferde "aklında tutabildiği" maksimum token sayısı. Bu dolunca eski konuşmalar unutulmaya başlar. |
| **Hallucination (Halüsinasyon)** | Modelin bilmediği bir şeyi kesinmiş gibi sunması. Gerçek bir risk, özellikle ürün geliştirirken minimize edilmesi gerekir. |
| **Thinking / Düşünme** | Bazı modeller (örn. Gemini 2.5) cevap vermeden önce iç bir düşünme süreci yürütür. Daha doğru sonuçlar üretir; ancak daha fazla token harcar. |
| **Multimodality** | Modelin metin dışında görsel, ses ve video gibi farklı veri tiplerini de işleyebilmesi. |
| **System Instruction** | Modele kimlik ve davranış kuralları veren, kullanıcıdan önce tanımlanan yönerge. Modelin "sen kimsin, nasıl konuşursun" gibi sorulara cevabını belirler. |

---

## 2. API ile LLM Uygulama Geliştirme

### Model Seçimi

**API Tabanlı Modeller:**
- Anthropic Claude, OpenAI GPT, Google Gemini
- Avantaj: Büyük, güçlü modeller. Ölçeklenebilir.
- Dezavantaj: Veriler üçüncü tarafla paylaşılır. Token başına maliyet.

**Lokal Modeller:**
- Google Gemma, QWEN, Kumru (Türkçe)
- Avantaj: Veri gizliliği tam anlamıyla korunur.
- Dezavantaj: Model boyutuna (parametre sayısı) göre donanım gereksinimi artar.

**Model Boyutu:** `2B`, `7B`, `27B` ifadelerindeki "B" **milyar parametre** anlamına gelir. Örneğin 2B model, 2 milyar parametrelidir. Daha büyük parametre sayısı genellikle daha iyi performans ve daha fazla dil desteği anlamına gelir ancak çalıştırma maliyeti de artar.

### Temel Model Parametreleri

| Parametre | Açıklama | Önerilen Değer Aralığı |
|---|---|---|
| **Temperature** | Yaratıcılık/deterministiklik dengesi. Yüksek değer = geniş arama uzayı = daha yaratıcı/tahmin edilemez. Düşük değer = dar uzay = tutarlı/tekrar eden cevaplar. | 0.2 – 0.7 (genel kullanım) |
| **Max Output Token** | Tek yanıtta üretilebilecek maksimum token sayısı. Düşük verilirse cevap yarım kalabilir. | Göreve göre ayarlanmalı |
| **Top-P / Top-K** | Olasılık kütlesinden örnekleme parametreleri. Kelime seçim sürecini etkiler. | Genellikle default bırakılır |
| **Thinking Budget** | Düşünme sürecine ayrılan token bütçesi. Kapatılabilir, öğrenme/basit görevlerde kapalı tutmak maliyet tasarrufu sağlar. | Göreve göre |

### Prompt Teknikleri

**Kötü Prompt:** `"Bana Python hakkında bir şeyler söyle."`

**İyi Prompt:** `"Python dilinde şu özellikleri açıkla: 1) List comprehensions, 2) Decorators, 3) Generator functions"`

---

**Zero-Shot Prompting:**
Modele hiç örnek vermeden doğrudan görevi tanımlamak. Modelin zaten bildiği görevlerde tercih edilir.
```
Aşağıdaki müşteri mesajlarını şu kategorilerde sınıflandır:
[Şikayet, Öneri, Bilgi Talebi, Teknik Destek]
Aciliyet seviyesini de belirt: [Yüksek, Orta, Düşük]

Mesaj: "Siparişim 5 gündür gelmedi, çok sinirli oldum."
```

---

**Few-Shot Prompting:**
Modele birkaç örnek vererek beklenen çıktı formatını öğretmek. Özellikle özel veya alışılmadık çıktı formatları için güçlüdür.

---

**Chain-of-Thought (Düşünce Zinciri):**
Modelin adım adım muhakeme yapmasını istemek. Karmaşık senaryolarda doğruluğu artırır.
```
Aşağıdaki analiz formatında adım adım düşünerekten yanıtla:
1. Veri yapısını analiz et
2. Her seçenek için avantaj/dezavantajları listele
3. Ölçeklenme gereksinimlerini değerlendir
4. Nihai önerini gerekçesiyle sun
```

---

**Role-Based Prompting (Rol Tanımlama):**
Modele belirli bir rol (junior developer, senior architect, product manager vb.) vererek farklı bakış açılarından yanıt almak.

---

**Structured Output (Yapılandırılmış Çıktı):**
Modelden belirli bir JSON şemasına uygun çıktı istemek. Farklı formatlardaki ham veriyi (örn. CV'ler) standart bir yapıya dönüştürmede kullanılır.

---

**Bağlam Koruyarak Sohbet (Chat History):**
Model her çağrıda sıfırdan başlar. Sohbet geçmişini korumak için önceki mesajlar bir listede tutulup her istekte modele tekrar gönderilmelidir. Gemini SDK'daki `chat` oturumu bu işlemi kolaylaştırır.

---

## 3. RAG (Retrieval-Augmented Generation)

### RAG Nedir?

**Retrieval-Augmented Generation:** Modelin kendi aklından bilgi üretmek yerine, sağlanan bir bilgi tabanından ilgili bölümleri arayıp bularak cevap üretmesi yaklaşımıdır.

**Temel Sorunlar RAG'ın Çözdüğü:**
- Modelin özel/kurumsal bilgiye erişimi yoktur.
- Model halüsinasyon yapabilir.
- Bilgi tabanı güncel tutulabilir.

### RAG Pipeline'ı
```
[Ham Veri (PDF, MD, TXT...)]
        |
   [Temizleme & Chunking]
        |
   [Embedding Modeli]
        |
   [Vektör Veritabanı]
        |
   <-- Kullanıcı Sorusu
        |
   [Sorgu Embedding'i]
        |
   [Benzerlik Araması (Cosine Similarity)]
        |
   [İlgili Chunk'lar → LLM Context'i]
        |
   [LLM Yanıt Üretir]
```

### Temel Kavramlar

**Embedding:**
Metni sayısal vektöre dönüştürme işlemi. Anlamsal olarak benzer metinler, vektör uzayında birbirine yakın konumlanır.

**Cosine Similarity (Kosinüs Benzerliği):**
İki vektör arasındaki açıyı ölçerek anlamsal yakınlığı hesaplar. 0 ile 1 arasında değer alır, 1'e yakın = çok benzer.

**Chunking (Parçalama):**
Uzun metinleri daha küçük, anlamlı parçalara bölme işlemi. Büyük belgeler tek seferde vektöre dönüştürülemez.

**Overlap (Örtüşme):**
Ardışık chunk'ların başlangıç ve bitiş kısımlarını birbirleriyle paylaşması. Bir chunk'ın sonunda yarım kalan bilginin bir sonraki chunk'ta da yer almasını sağlar.

**Top-K:**
Arama sorgusuna en benzer K adet chunk'ı döndürme parametresi.

**Vektör Veritabanları:**
- Hafif / Lokal: **FAISS**, **Chroma**
- Gelişmiş / Bulut: **Pinecone**, **Weaviate**

---

## 4. Agent (Ajan) Mimarisi

### LLM Agent Nedir?

Klasik agent kavramı, çevreyle etkileşime girerek belirlenmiş kurallara göre aksiyon alan sistemleri tanımlar. **LLM Agent** ise bu yapıya bir LLM'in karar verme yeteneğini ekler.

Fark şudur: Klasik ajanlar hardcoded kurallara göre çalışırken, LLM ajanlar ellerindeki araçları (tool) duruma göre değerlendirip **akıllıca** kullanabilir.

### Tool Calling (Araç Çağırma)

LLM'e dışarıdan fonksiyonlar tanımlanabilir. LLM, ihtiyaç duyduğunda bu fonksiyonları çağırır, sonucu context'ine alır ve yanıtını buna göre üretir.

**Örnek:**
```python
def get_risk_level(probability: float) -> str:
    if probability < 0.33:
        return "Yüksek Risk"
    elif probability < 0.66:
        return "Orta Risk"
    else:
        return "Düşük Risk"
```

### Agentic RAG

RAG ve Agent mimarilerinin birleşimi. LLM hem:
- Vektör veritabanında bilgi arayabilir (RAG),
- İhtiyaç duyduğunda harici fonksiyonlar çağırabilir (Tool Calling).

**Kredi Pusula Örneği:**
Kullanıcı "kredi başvurum neden reddedildi?" diye sorduğunda ajan:
1. `get_latest_prediction()` tool'unu çağırarak en güncel tahmin sonucunu alır,
2. `get_prediction_features()` tool'unu çağırarak hangi özelliklerin skoru etkilediğini getirir,
3. RAG ile bilgi tabanından ilgili içerikleri çeker,
4. Tüm bu bilgileri birleştirerek kullanıcıya açıklayıcı bir yanıt üretir.

---

## 5. Üründe Implementasyon

### Veritabanı Yapısı

Üretim ortamlarında sohbet geçmişi ve tahmin sonuçları kalıcı olarak saklanmalıdır.

Bu projede **SQLite** kullanılmıştır. Tablolar:
- `chat_messages`: Kullanıcı ve asistan mesajları, zaman damgası, kullanıcı ID'si
- `predictions`: Kredi başvuru sonuçları ve feature değerleri

### RAG Servisinin Backend'e Entegrasyonu

Notebook'ta geliştirilen RAG kodları `rag_service.py` dosyasına taşınmıştır. FastAPI endpoint'lerine `/chat` rotası eklenerek frontend'e bağlanmıştır.

### Sistem Instruction (Ürün İçin)
```
Sen "Kredi Pusula" uygulamasının samimi ve yardımsever yapay zeka asistanısın.
Adın: Kredi Pusula Asistan.
Görevin: Kullanıcılara kredi başvuru süreci, kredi skorlama ve uygulama 
hakkında yardımcı olmak.
Elindeki araçları (evaluate_risk_score) gerektiğinde kullan.
Bilmediğin bir konuda "bilmiyorum" de, asla uydurma.
```

### Kullanılan Araçlar ve Kütüphaneler

| Araç | Kullanım Amacı |
|---|---|
| `google-generativeai` | Gemini API SDK |
| `FAISS` | Vektör veritabanı |
| `python-dotenv` | API anahtarını environment'tan okuma |
| `SQLite` | Sohbet geçmişi ve tahmin saklama |
| `Gradio` | Hızlı notebook arayüzü prototipi |

---

## 6. Proje Özeti: 3 Haftalık Yolculuk

| Hafta | Konu |
|---|---|
| **Hafta 1** | Temel Makine Öğrenmesi, model eğitimi, kredi risk verisiyle sınıflandırma, pickle ile kaydetme |
| **Hafta 2** | Model inference, FastAPI ile REST API, Render üzerinde deployment |
| **Hafta 3** | Generative AI temelleri, RAG mimarisi, Tool Calling, Agentic RAG, chat geçmişi yönetimi, tam ürün entegrasyonu |

---

## Ek Kaynaklar

- [TikTokenizer](https://tiktokenizer.vercel.app/) — Farklı modellerin nasıl tokenize ettiğini görselleştirme
- [System Prompt Leak Repo](https://github.com/jujumilk3/leaked-system-prompts) — Büyük modellerin sistem prompt'larını inceleyin
- [Google AI Studio](https://aistudio.google.com/) — Ücretsiz Gemini API anahtarı edinme
- [Artificial Intelligence: A Modern Approach](https://aima.cs.berkeley.edu/)