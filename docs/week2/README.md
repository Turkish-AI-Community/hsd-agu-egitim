# Hafta 2: MLOps ve Deployment

## Genel Bakış

Bu haftanın amacı Week 1'de eğittiğimiz **KrediPusula** modelini production-ready bir REST API'ye dönüştürmek ve modern MLOps pratiklerini uygulamak.

---

## Konu Başlıkları

### 1. MLOps ve DevOps Temelleri
- DevOps nedir?
- MLOps nedir ve neden önemli?
- Development vs Production farkları
- CI/CD kavramları

### 2. MLOps Lifecycle ve Best Practice'ler
- Model lifecycle management
- Experiment tracking
- Model registry
- Reproducibility
- Version control for ML

### 3. Model Drift ve Data Drift Metrikleri
- Data drift nedir?
- Model drift nedir?
- Monitoring stratejileri
- Alert mekanizmaları
- Retraining triggers

### 4. FastAPI ile REST API Tasarımı
- FastAPI framework özellikleri
- Request/Response schemas (Pydantic)
- Error handling
- API documentation (Swagger/OpenAPI)
- Async endpoints

### 5. Docker Containerization
- Container vs Virtual Machine
- Dockerfile best practices
- Multi-stage builds
- docker-compose orchestration
- Resource management

### 6. MLflow ile Model Monitoring ve Tracking
- Experiment tracking
- Model registry
- Model versioning
- Metrics logging
- Artifact management

---

## Uygulamalı Çalışma

### Adım 1: FastAPI Development
```python
# Endpoint'ler:
POST /api/v1/predict       # Kredi tahmin
GET  /api/v1/health        # Health check
GET  /api/v1/model-info    # Model bilgileri
```

### Adım 2: Model Integration
- Model loading ve caching
- Input validation (Pydantic)
- Preprocessing pipeline
- Response formatting
- Error handling

### Adım 3: Dockerization
- Dockerfile oluşturma
- Base image selection
- Dependencies installation
- Multi-stage build
- docker-compose setup

### Adım 4: MLflow Setup
- Tracking server kurulumu
- Experiment oluşturma
- Metrics logging
- Model registration
- Artifact storage

### Adım 5: Monitoring System
- Prediction logging
- Performance metrics
- Drift detection setup
- Dashboard oluşturma

---

## Kullanılan Teknolojiler

| Teknoloji | Kullanım Alanı |
|-----------|----------------|
| **FastAPI** | REST API framework |
| **Uvicorn** | ASGI server |
| **Pydantic** | Data validation |
| **Docker** | Containerization |
| **MLflow** | Experiment tracking, model registry |

---

## API Endpoint'leri

### Prediction Request
```bash
curl -X POST "http://localhost:8000/api/v1/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "income": 50000,
    "age": 35,
    "credit_history": "good",
    "loan_amount": 10000,
    "employment_years": 5
  }'
```

### Response
```json
{
  "approved": true,
  "credit_score": 0.85,
  "confidence": 0.92,
  "recommendation": "Başvuru onaylandı",
  "timestamp": "2025-01-03T12:00:00Z"
}
```

### Health Check
```bash
curl "http://localhost:8000/api/v1/health"
```

---

## Docker Commands

```bash
# Build image
docker build -t kredipusula-api:latest .

# Run container
docker run -p 8000:8000 kredipusula-api:latest

# Using docker-compose
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop services
docker-compose down
```

---

## Çıktılar

```
week2-mlops-deployment/
├── api/
│   ├── main.py           # FastAPI application
│   ├── models.py         # Pydantic schemas
│   ├── predict.py        # Prediction logic
│   └── utils.py          # Utility functions
├── monitoring/
│   └── mlflow_setup.py   # MLflow configuration
├── tests/
│   └── test_api.py       # API tests
├── Dockerfile
├── docker-compose.yml
└── requirements.txt
```

---

## Ek Kaynaklar

### Dokümantasyon
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Docker Documentation](https://docs.docker.com/)
- [MLflow Documentation](https://mlflow.org/)
- [Pydantic Documentation](https://docs.pydantic.dev/)

### Best Practices
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [FastAPI Best Practices](https://fastapi.tiangolo.com/tutorial/bigger-applications/)


