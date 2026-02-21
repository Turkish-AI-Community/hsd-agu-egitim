# HSD AGÜ From Model to Agent Mini Bootcamp

Machine Learning temellerinden başlayarak MLOps pratikleri ve Generative AI entegrasyonuna kadar uzanan 3 haftalık yoğun eğitim programı.

---

<img src="docs/kredi-pusula.jpg" alt="KrediPusula" width="800"/>


## Proje Genel Bakış

**KrediPusula** - Kullanıcıların kredi uygunluğunu analiz eden, kişiselleştirilmiş kredi önerileri sunan ve yapay zeka destekli asistan ile 7/24 destek sağlayan akıllı kredi danışmanlık platformu.

🌐 **Canli Demo:** [kredipusula.onrender.com](https://kredipusula.onrender.com)

## Haftalik Plan

- **Hafta 1:** AI/Ml Temelleri - Kredi risk tahmin modeli
- **Hafta 2:** MLOps - REST API, deployment ve monitoring 
- **Hafta 3:** GenAI Temelleri - Generative temelli müşteri destek botu

### Tech Stack

| Kategori | Teknolojiler |
|----------|-------------|
| **Data & ML** | NumPy, Pandas, Matplotlib, Seaborn, scikit-learn, XGBoost, LightGBM, CatBoost |
| **Tuning & Tracking** | Optuna, MLflow |
| **Backend** | FastAPI, Uvicorn, SQLite |
| **Frontend** | React, TypeScript, Tailwind CSS, Vite |
| **GenAI & RAG** | Google GenAI SDK (Gemini), FAISS, Gemini Embedding |
| **Deployment** | Render.com |

## Repository Yapisi

```
hsd_agu_egitim/
├── data/
│   ├── german_credit_data.csv        # German Credit Risk veri seti
│   ├── soru_cevap_data.md            # Chatbot Q&A bilgi tabani (250 soru-cevap)
│   └── index_store/                  # FAISS index ve dokuman cache
│       ├── faiss_index.bin           # Vektor indeksi
│       └── documents.pkl             # Dokuman listesi
│
├── notebooks/
│   ├── 01_eda.ipynb                  # Kesifci veri analizi
│   ├── 02_baseline.ipynb             # Baseline model egitimi ve karsilastirma
│   ├── 03_feature_engineering.ipynb  # FE, tuning, threshold optimizasyonu
│   ├── GenAI_Fundamentals.ipynb      # GenAI temelleri egitim notebooku
│   └── GenAI_RAG_Agent_Concepts.ipynb # RAG & Agent kavramlari egitim notebooku
│
├── models/
│   └── lightgbm_tuned_pipeline.pkl   # Egitilmis LightGBM pipeline
│
├── src/
│   ├── backend/                      # FastAPI REST API
│   │   ├── main.py                   # Uygulama giris noktasi, endpointler, CORS
│   │   ├── model.py                  # Model yukleme ve tahmin
│   │   ├── schemas.py                # Pydantic veri semalari
│   │   ├── feature_eng.py            # Feature engineering (inference)
│   │   ├── rag_service.py            # RAG + Agent chatbot servisi (FAISS, Gemini)
│   │   ├── database.py               # SQLite: sohbet gecmisi ve tahmin kayitlari
│   │   └── README.md                 # Backend dokumantasyonu
│   │
│   └── frontend/                     # React + TypeScript web uygulamasi
│       ├── src/
│       │   ├── components/           # Navbar, Footer, CreditForm, ResultCard, Calculator, ChatWidget
│       │   ├── pages/                # HomePage, ApplyPage, CalculatorPage, InfoPage
│       │   └── lib/                  # API katmani, session yonetimi, yardimci fonksiyonlar
│       ├── package.json
│       └── README.md                 # Frontend dokumantasyonu
│
├── docs/
│   ├── week1/README.md               # Hafta 1 ders notlari
│   ├── week2/README.md               # Hafta 2 ders notlari
│   ├── week3/README.md               # Hafta 3 ders notlari
│   └── deployment.md                 # Deployment rehberi
│
├── requirements.txt                  # Production Python bagimliliklari
├── pyproject.toml                    # Gelistirme bagimliliklari (uv)
└── .gitignore
```

## Hizli Baslangic

```bash
# 1. Repository'yi klonla
git clone https://github.com/Turkish-AI-Community/hsd-agu-egitim.git
cd hsd-agu-egitim

# 2. Python bagimliklarini yukle
uv sync

# 3. Gemini API anahtarini ayarla (chatbot icin gerekli)
#    .env dosyasina GEMINI_API_KEY=... ekle
#    Anahtar: https://aistudio.google.com/ adresinden alinabilir

# 4. Backend'i baslat
uv run uvicorn src.backend.main:app --reload

# 5. Frontend'i baslat (ayri terminal)
cd src/frontend
npm install
npm run dev
```

Backend: `http://localhost:8000` | Frontend: `http://localhost:5173`

> Deployment detaylari icin [docs/deployment.md](docs/deployment.md) dosyasina bakin.

## Dokumantasyon

- [Hafta 1 - ML Temelleri](docs/week1/README.md): EDA, model egitimi, metrikler, feature engineering
- [Hafta 2 - MLOps & Deployment](docs/week2/README.md): Monitoring, REST API, deployment, CI/CD
- [Hafta 3 - GenAI & Agent](docs/week3/README.md): LLM, prompt engineering, agent mimarileri
- [Deployment Rehberi](docs/deployment.md): Lokal, backend-only ve Render deployment

## Iletisim

| | |
|---|---|
| **Egitmen** | [![LinkedIn](https://img.shields.io/badge/Enes_Fehmi_Manan-0077B5?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/enesfehmimanan/) [![GitHub](https://img.shields.io/badge/enesmanan-181717?style=flat&logo=github&logoColor=white)](https://github.com/enesmanan) [![X](https://img.shields.io/badge/enesfehmimanan-000000?style=flat&logo=x&logoColor=white)](https://x.com/enesfehmimanan) |
| **Topluluk** | [![LinkedIn](https://img.shields.io/badge/Turkiye_Yapay_Zeka_Toplulugu-0077B5?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/company/turkish-ai-community/) [![GitHub](https://img.shields.io/badge/Turkish--AI--Community-181717?style=flat&logo=github&logoColor=white)](https://github.com/Turkish-AI-Community) [![X](https://img.shields.io/badge/turkiyeyz-000000?style=flat&logo=x&logoColor=white)](https://x.com/turkiyeyz) |
