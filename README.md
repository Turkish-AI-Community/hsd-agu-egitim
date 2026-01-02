# HSD AGÜ From Model to Agent Mini Bootcamp

Machine Learning temellerinden başlayarak MLOps pratikleri ve Generative AI entegrasyonuna kadar uzanan 3 haftalık yoğun eğitim programı.

## Proje Genel Bakış

**KrediPusula** - Kullanıcıların kredi uygunluğunu analiz eden, kişiselleştirilmiş kredi önerileri sunan ve yapay zeka destekli asistan ile 7/24 destek sağlayan akıllı kredi danışmanlık platformu.


### Ne Geliştireceğiz

- **Hafta 1:** AI/Ml Temelleri - Kredi risk tahmin modeli
- **Hafta 2:** MLOps - REST API, deployment ve monitoring 
- **Hafta 3:** GenAI Temelleri - Generative temelli müşteri destek botu

### Tech Stack

- **Data & Visualization:** NumPy, Pandas, Matplotlib, Seaborn
- **Machine Learning:** scikit-learn, XGBoost, LightGBM, CatBoost, Optuna, SHAP
- **API:** FastAPI, Uvicorn
- **MLOps:** MLflow, Docker
- **LLM:** Google GenAI SDK - Gemini
- **Frontend:** HTML/CSS/JavaScript


## Program Yapısı

### Hafta 1: Machine Learning Temelleri

**Konu Başlıkları:**
- Veri Bilimi kavramına giriş
- Problem türleri, Database, Probleme yaklaşım
- Credit scoring domain bilgisi
- Exploratory Data Analysis (EDA), Veri ön işleme  
- Tabular data için feature engineering 
- Supervised learning ve classification modelleri
- Model değerlendirme metrikleri (precision, recall, ROC-AUC)

**Uygulamalı Çalışma:**
- Kredi veri setini yükleme ve keşfetme
- Data preprocessing ve feature engineering
- Classification modelleri eğitme (Logistic Regression, Random Forest, XGBoost)
- Model performansını değerlendirme
- Eğitilmiş modeli kaydetme

### Hafta 2: MLOps ve Deployment

**Konular:**
- MLOps ve DevOps temelleri
- MLOps lifecycle ve best practice'ler
- Model drift ve data drift metrikleri
- FastAPI ile REST API tasarımı
- Docker containerization
- MLflow ile model monitoring ve tracking

**Uygulamalı Çalışma:**
- Model için FastAPI endpoint'leri oluşturma
- Dockerfile ve docker-compose kurulumu
- Model monitoring sistem
- MLflow experiment tracking konfigürasyonu


### Hafta 3: LLM Entegrasyonu ve AI Agent'lar

**Konular:**
- Generative AI temelleri
- LLM Parametreleri
- Prompt engineering teknikleri
- Google Gemini Modelleri
- Agent/RAG Mimarileri
- Use case için mimari tasarımı

**Uygulamalı Çalışma:**
- LLM ile metin tabanlı chatbot geliştirme
- Custom tool'lar oluşturma (credit checker, eligibility validator)
- Chatbot'u credit scoring API ile entegre etme
- Tam sistem için web frontend geliştirme (React)
- Memory ile çok turlu konuşmaları yönetme
---

## Repository Yapısı

```
hsd-agu-egitim/
├── docs/
│   ├── week1/             # Hafta 1 dokümantasyon
│   ├── week2/             # Hafta 2 dokümantasyon
│   └── week3/             # Hafta 3 dokümantasyon
│
├── week1-ml-fundamentals/
│   ├── notebooks/         # Jupyter notebook'lar
│   ├── data/              # Ham ve işlenmiş veri setleri
│   ├── models/            # Eğitilmiş model dosyaları
│   └── src/               # Training/inference scriptleri
│
├── week2-mlops-deployment/
│   ├── api/               # FastAPI uygulaması
│   ├── tests/             # Unit ve integration testler
│   ├── monitoring/        # MLflow tracking
│   └── Dockerfile
│
├── week3-llm-agents/
│   ├── agent/             # Google AI Servisi
│   ├── frontend/          # Web frontend (React)
│   └── examples/          # Örnek konuşmalar
│
└── pyproject.toml         # uv dependency management
```

---

### Kurulum

```bash
# 1. Repository'yi klonla
git clone https://github.com/Turkish-AI-Community/hsd-agu-egitim.git
cd hsd-agu-egitim

# 2. Bağımlılıkları yükle
uv sync

# 3. Environment dosyası oluştur 
echo "GEMINI_API_KEY=your_gemini_api_key_here" > .env
```



## İletişim

| | |
|---|---|
| **Eğitmen** | [![LinkedIn](https://img.shields.io/badge/Enes_Fehmi_Manan-0077B5?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/enesfehmimanan/) [![GitHub](https://img.shields.io/badge/enesmanan-181717?style=flat&logo=github&logoColor=white)](https://github.com/enesmanan) [![X](https://img.shields.io/badge/enesfehmimanan-000000?style=flat&logo=x&logoColor=white)](https://x.com/enesfehmimanan) |
| **Topluluk** | [![LinkedIn](https://img.shields.io/badge/Türkiye_Yapay_Zeka_Topluluğu-0077B5?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/company/turkish-ai-community/) [![GitHub](https://img.shields.io/badge/Turkish--AI--Community-181717?style=flat&logo=github&logoColor=white)](https://github.com/Turkish-AI-Community) [![X](https://img.shields.io/badge/turkiyeyz-000000?style=flat&logo=x&logoColor=white)](https://x.com/turkiyeyz) |