# Deployment Rehberi

Bu dokuman KrediPusula uygulamasinin lokal gelistirme, sadece backend ve Render uzerinde tam deploy senaryolarini icerir.

## Gereksinimler

- Python >= 3.10
- Node.js >= 18
- npm >= 9
- uv (local gelistirme icin, opsiyonel)

## 1. Lokal Gelistirme

Lokal ortamda backend ve frontend ayri sunucularda calisir.

### Backend (port 8000)

```bash
# Proje kok dizininden
uv run uvicorn src.backend.main:app --reload
```

Alternatif (uv olmadan):

```bash
pip install -r requirements.txt
uvicorn src.backend.main:app --reload
```

Backend `http://localhost:8000` adresinde calisir. API dokumantasyonu icin `http://localhost:8000/docs` adresini ziyaret edin.

### Frontend (port 5173)

```bash
cd src/frontend
npm install
npm run dev
```

Frontend `http://localhost:5173` adresinde calisir. `src/frontend/.env` dosyasindaki `VITE_API_BASE=http://localhost:8000` ayari ile backend'e baglanir.

### API Test

```bash
# Health check
curl http://localhost:8000/health

# Tahmin istegi
curl -X POST http://localhost:8000/predict \
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


## 2. Sadece Backend Deploy

Backend tek basina bir REST API servisi olarak deploy edilebilir. Frontend olmadan sadece `/health` ve `/predict` endpointleri calisir.

### Gerekli Dosyalar

```
requirements.txt          # Python bagimliliklari
src/
  __init__.py
  backend/
    __init__.py
    main.py               # FastAPI uygulamasi
    model.py              # Model yukleme ve tahmin
    schemas.py            # Pydantic sema tanimlari
    feature_eng.py        # Feature engineering
models/
  lightgbm_tuned_pipeline.pkl   # Egitilmis model
```

### Ortam Degiskenleri

| Degisken | Aciklama | Varsayilan |
|----------|----------|------------|
| `PORT` | Sunucu portu | 8000 |
| `ALLOWED_ORIGINS` | CORS izinli originler (virgul ile ayrilmis) | `http://localhost:5173,http://127.0.0.1:5173` |

### Calistirma

```bash
pip install -r requirements.txt
uvicorn src.backend.main:app --host 0.0.0.0 --port $PORT
```

## 3. Render.com Deploy (Tek Servis)

Tek bir Render Web Service uzerinde hem backend hem frontend birlikte calisir. FastAPI, frontend build ciktisini statik dosya olarak sunar.

### Render Dashboard Ayarlari

| Alan | Deger |
|------|-------|
| **Name** | `kredipusula` (veya istediginiz isim) |
| **Region** | Frankfurt (EU Central) |
| **Branch** | `main` |
| **Runtime** | Python |
| **Build Command** | `pip install -r requirements.txt && cd src/frontend && npm install && npm run build` |
| **Start Command** | `uvicorn src.backend.main:app --host 0.0.0.0 --port $PORT` |

### Ortam Degiskenleri (Render)

| Key | Value |
|-----|-------|
| `PYTHON_VERSION` | `3.12` |

> **Not:** Tek serviste frontend ve backend ayni origin'de calistigi icin `ALLOWED_ORIGINS` ve `VITE_API_BASE` tanimlamaya gerek yoktur. Frontend build sirasinda `VITE_API_BASE` tanimli olmadigindan API istekleri otomatik olarak ayni origin'e gider.

### Nasil Calisiyor?

1. **Build asamasi:** Render once Python bagimliklarini yukler, sonra frontend'i (`npm install && npm run build`) derler. Build ciktisi `src/frontend/dist/` klasorune olusur.
2. **Calisma asamasi:** Uvicorn, FastAPI uygulamasini baslatir. FastAPI:
   - `/health` ve `/predict` endpointlerini API olarak sunar
   - `src/frontend/dist/` klasorundeki statik dosyalari (JS, CSS, gorseller) sunar
   - Diger tum route'lari `index.html`'e yonlendirir (SPA fallback)
3. Sonuc olarak `https://kredipusula.onrender.com` adresinde hem site hem API tek servisten calisir.


### Deploy Sonrasi Test

```bash
# Health check
curl https://kredipusula.onrender.com/health

# Tahmin
curl -X POST https://kredipusula.onrender.com/predict \
  -H "Content-Type: application/json" \
  -d '{"age":35,"sex":"male","job":2,"housing":"own","saving_accounts":"little","checking_account":"moderate","credit_amount":5000,"duration":24,"purpose":"car"}'
```
