# Credit Risk Prediction API

LightGBM modeli ile kredi riski tahmini yapan FastAPI servisi.

## Çalıştırma

Proje kök dizininde:

```bash
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

### Swagger UI

Tarayıcıda interaktif API dokümantasyonu:

```
http://127.0.0.1:8000/docs
```

## Request Alanları

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

## Response Alanları

| Alan | Tip | Açıklama |
|------|-----|----------|
| prediction | str | Tahmin: "good" veya "bad" |
| probability | float | "bad" sınıfı olasılığı (0-1) |
| threshold | float | Karar eşiği (0.30) |
