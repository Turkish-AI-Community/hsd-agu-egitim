# Boot Camp 2. Hafta - ML Model Lifecycle, Deployment & Monitoring


## Bu Haftanın Konuları
1. Modelden inference alma
2. Modeli canlıya (production) çıkarma
3. Model monitoring ve metrikler
4. Sorun tespitinde aksiyon alma
5. REST API tasarımı & Frontend
6. Deployment (Render.com ile)

---

## 1. Gerçek Hayatta Problem Nasıl Gelir?

Bir şirkette (örn. banka) data scientist olarak çalışırken problem kaynakları:

- **Pazarlama (Marketing):** Kampanya hedef kitle belirleme, segment bazlı işlemler — en sık problem kaynağı
- **Üst Yönetim:** Özel kredi tanımlama, premium segment müşteri bulma
- **Başka Analitik Ekipler:** Modelde bozukluk keşfi, yeni alan/hacim keşfi
- **Kendi Ekip / Menajer:** İç gözlemle tespit edilen sorunlar

---

## 2. Problem Geldiğinde Yaklaşım Akışı

### Adım 1 — Business Rule ile Çözülebilir mi?
- ML pahalıdır: insan kaynağı, zaman, bakım maliyeti yüksek
- Basit bir kesme noktası (cutoff) veya kural yeterliyse → ML'e girme
- Business kurallarıyla kapatılabiliyorsa → kapat, izle

### Adım 2 — DB Kontrolü (Veri Yeterli mi?)
- Problem tanımı net olmalı, ilgili ekiple aynı noktada olunmalı
- Target belirleme → DB'ye git → Yeterli data var mı?
- Feature doluluğu, varyasyon, modellenebilirlik kontrolü
- **Data yoksa:** Business kural koy + data birikmesini bekle
- **Data Augmentation:** Dış veri ekleme (örn. KKB inputları), farklı feature/boyut ekleme

### Adım 3 — Baseline Çalışması
- En temel model + en basit ön işleme → "kutup yıldızı" sonuç
- Baseline kötüyse → DB'ye dön, farklı feature ara
- Feature set yeterliyse → deneyler aşamasına geç

### Adım 4 — Deneyler Kurgulanması & ML Flow
- Farklı feature engineering teknikleri, encoding'ler, modeller, parametreler
- Tüm deneylerin **loglanması** şart (50 notebook oluşturma hatasından kaçın)
- **MLFlow** ile deney takibi:
  - Metrikler, parametreler, artifact'ler, modeller otomatik kaydediliyor
  - `mlruns` klasörü oluşturuyor (gitignore'da tutulur, repo boyutunu büyütmemek için)
  - MLFlow UI üzerinden tüm deneyleri karşılaştırmalı inceleyebilirsin
  - İsimlendirme önemli: V1, V2 gibi versiyon vermek veya oto versiyon ataması yapmak lazım

### Adım 5 — Simülasyon Aşaması
- Model tek başına çalışmaz, büyük bir **sistemin parçası** olarak çalışır
- Eğitilen model → mevcut sisteme yerleştirilir → "canlıda çalışsaydı ne olurdu?" testi
- Gerçekleşen sonuçlar vs. simülasyon sonuçları karşılaştırılır
- Karlılık beklentileri karşılanıyor mu? Threshold ayarları (recall vs precision tradeoff)
- Kaggle yarışmalarında pratik edilemez, **gerçek hayata özgü** bir adım

### Adım 6 — Kademeli Deployment (Production)
- Tüm sisteme bir anda açılmaz → **kademeli deployment** (blue-green deployment)
- Örnek: Önce İstanbul, online kanal, kredi başvuranlar → 1 hafta izle
- Metrikler OK → yaygınlaştırma dönemine geç
- Sorun varsa → geri al veya ikinci deploy

---

## 3. Model Monitoring

### Dashboard Gerekliliği
- Power BI, Looker, Grafana vb. araçlarla dashboard oluşturulmalı
- Dashboard'da olması gerekenler:
  - **Business metrikleri:** Onay oranları, kullandırım oranları, risk segmentleri
  - **Model başarı metrikleri:** AUC, Precision, Recall, F1 vb.
  - **Karlılık metrikleri:** Model sistemde para getiriyor mu?
  - **Alert durumları**

### Monitoring Periyodu (Kredi Risk Modelleri)
- PD Model = Probability of Default (batırma olasılığı)
- Yasal takip süresi: **90+ gün** ödememe → "bad" (default)
- Bu nedenle kredi risk modelleri **3 ayda bir (90 günden 90 güne)** monitör edilir
- Farklı model türleri farklı periyotlarda: zaman serisi → daha sık, recommendation → sürekli retrain

### Drift Tespiti — PSI (Population Stability Index)
- Feature bazında hesaplanır (expected vs actual)
- **PSI < 0.10:** 🟢 Yeşil bölge — kayma yok, model stabil
- **0.10 ≤ PSI ≤ 0.25:** 🟡 Sarı bölge — hafif drift, izlemeye devam, neden araştır
  - 3 kere üst üste sarı → model bozulmuş sayılır
- **PSI > 0.25:** 🔴 Kırmızı bölge — model bozulmuş, ciddi risk, kullanılmamalı
- Alternatifler: Kolmogorov-Smirnov testi vb.

### Gini Katsayısı (Model Başarısı)
- Formül: `Gini = 2 × AUC - 1`
- Good/Bad ayrımını ne kadar iyi yapıyor?
- Accuracy, Precision, Recall, F1 ile birlikte değerlendirilir

### Drift Var Ama Model Hala İyi Çalışıyorsa?
- PSI kötü (data kaymış) ama Gini hala iyi (model iyi ayırt ediyor) → olabilir
- Karar bireysel değil: **ekip bir araya gelir**, sonuçları tartışır
- Şirket öncelikleri, KPI'lar, zaman/emek maliyeti değerlendirilir
- Yönetici kararı: eğitiyoruz / şimdilik devam ediyoruz

### Kayma ile Başa Çıkma Stratejileri
- **İndeksleme:** Sayısal değişkenleri sabit bir referansa bölme (örn. dolar kuru)
  - Kur her inference'da güncel olarak çekilir, ön işleme pipeline'ında bölünür
  - Bu sayede enflasyon/kur değişimlerinden kaynaklı drift azaltılır
- Sabit constant'lar belirleme (asgari ücret vb.)
- Business rule ile ön/arka filtre tanımlama
- Ağırlıklandırma, manuel müdahale (daha çok e-ticaret gibi case'lerde)

---

## 4. Model Deploy Etme Yöntemleri

### Yöntem 1 — Karar Kurallarını Çıkartma (If-Else Rules)
- LightGBM = karar ağaçları topluluğu → tüm kurallar if-else olarak çıkarılabilir
- Kurallar metin/kod olarak deploy edilir (örn. Experian Decision Studio)
- **Avantaj:** Şeffaf, fine-tune yapılabilir (node bazında kırılma değeri değiştirme, node kesme)
- **Dezavantaj:** Tüm ön işlemeyi baştan kodlamak gerekir

### Yöntem 2 — Pickle ile Kaydetme
- Model + sklearn pipeline birlikte pickle olarak kaydedilir → `f(x)` fonksiyonu gibi çalışır
- **Avantaj:** Ön işleme pipeline dahil, hard-coded kodlama gerekmez, basit
- **Dezavantaj:** Fine-tune (kural düzenleme) yapılamaz
- Threshold: 0.30 → üstü "bad", altı "good"

---

## 5. REST API — Backend Yapısı (FastAPI)

### Neden FastAPI?
- Sektör standardı, Flask'ın yerini aldı
- Otomatik Swagger UI, Pydantic entegrasyonu, hız
- Kitap önerisi: *Flask Web Development* (REST mantığını öğrenmek için hala iyi)

### Proje Dosya Yapısı (`source/backend/`)

| Dosya | Açıklama |
|---|---|
| `schema.py` | Pydantic ile data validasyon şemaları (input format, class tanımları) |
| `model.py` | Model yükleme, threshold ayarları, predict fonksiyonu |
| `feature_engineering.py` | Notebook'taki FE fonksiyonlarının production versiyonu (pipeline öncesi çalışır) |
| `main.py` | FastAPI uygulaması, endpoint tanımları, CORS ayarları |
| `__init__.py` | Python modül tanımlaması |

### Endpoint'ler
- `GET /health` → Server ayakta mı? (`{"status": "ok"}`)
- `POST /predict` → Feature'ları gönder, olasılık + prediction al
- `GET /model` → Model bilgilerini getir

### Önemli Mimari Noktalar
- Model **bir kez** RAM'e yüklenir (startup), sonra sürekli inference alınır
- Server kapanmadıkça model yüklü kalır
- Sklearn pipeline ile eğitildiği için ön işleme otomatik
- Bilinmeyen kategorik değerler → pipeline'da `handle_unknown='ignore'` + missing ile doldurma

### Swagger UI Demo
- `/docs` endpoint'inden erişilebilir
- POST/GET metotları doğrudan test edilebilir
- Farklı feature değerleri girilerek model davranışı gözlemlenebilir

---

## 6. Frontend (React + TypeScript)

- Cursor ile AI destekli oluşturuldu (Bolt.new, Lovable gibi vibe coding tool'ları da kullanılabilir)
- Logo: Fal.ai Banana modeli ile oluşturuldu (Legend of Zelda tarzı, pastel renkler)
- **Özellikler:**
  - Landing page ("Kredi Pusula")
  - Kredi risk analizi formu → backend'e POST → olasılık gösterimi
  - Kredi hesaplayıcı
  - Bilgi merkezi (gelecek hafta chatbot eklenecek)
- Frontend ve backend **farklı portlarda** çalışıyor, endpoint'ler bağlanmış durumda

---

## 7. Deployment — Render.com

### Neden Render?
- Docker/Linux yönetiminden kurtarıyor (abstraction/soyutlama katmanı)
- Ücretsiz tier: 512 MB RAM, 0.1 CPU
  - 15 dk istek gelmezse uyku moduna geçer (~1 dk uyanma süresi)
- GitHub repo bağlantısı → auto deploy (CI/CD)

### Best Practice vs. Demo Yaklaşımı
- **Best practice:** Frontend ve backend **ayrı container/instance** olmalı (izolasyon)
- **Demo'da:** Tek instance'a ikisi birden yüklendi (maliyet/uyku problemi nedeniyle)
- Gerçekte birinin düşmesi diğerini etkilememeli

### Deploy Adımları
1. Render'da yeni Web Service oluştur
2. GitHub repo'yu bağla
3. **Build Command:**
```
   pip install -r requirements.txt && cd source/frontend && npm install && npm run build
```
4. **Start Command:**
```
   uvicorn source.backend.main:app --host 0.0.0.0 --port $PORT
```
5. Instance seç (Free: $0)
6. Environment variables (gelecek hafta LLM API key'leri buraya eklenecek)
7. Auto deploy: Commit atıldığında otomatik yeniden deploy

### CI/CD Notu
- Render'da auto deploy aktif → repo'ya commit = otomatik production deploy
- Bu, Continuous Integration / Continuous Delivery (CI/CD) kavramına giriyor

---

## 8. Gelecek Hafta (3. Hafta — Son Yayın)
- Generative AI / LLM kavramlarına giriş
- Google Gemini modelleri kullanımı (API key gerekli)
- Projeye chatbot/asistan entegrasyonu
- GenAI case'leri ve düşünülmesi gerekenler

---

## Kariyer Tavsiyeleri
- **Junior olarak öne çıkmak için:** Uçtan uca proje yapmak (model eğitimi → serve etme → deploy → frontend)
- Sistemi bilmek şart: ML + backend + domain bilgisi
- Herkesin Titanic/e-fiyat modeli yaptığı ortamda fark yaratmak → production'a yakın, uçtan uca projeler
- **Proje fikri bulmak:** Hackathon'lara katılmak, problem çözme odaklı düşünmek
- Vibe coding tool'ları (Cursor, Bolt.new, Lovable) ile hızlı prototipleme mümkün ama temeli de öğrenmek lazım
- Sabırlı olmak, projeye zaman vermek, üstüne düşmek

---

## Genel ML Lifecycle Özet Akışı
```
Problem Geldi
    │
    ├─ Business rule ile çözülebilir mi? ──► Evet → Kural koy, izle
    │
    └─ Hayır → ML gerekli
         │
         ├─ DB'de yeterli data var mı?
         │    ├─ Hayır → Business kural + data birikmesini bekle / Data Augmentation
         │    └─ Evet ↓
         │
         ├─ Target & Periyot belirle
         ├─ Feature araştırması & EDA
         ├─ Baseline model kur (kutup yıldızı)
         │    └─ Kötüyse → DB'ye dön, feature ara
         │
         ├─ Deney kurgulanması (MLFlow ile takip)
         │    - Feature Engineering
         │    - Farklı modeller & hyperparameter optimization
         │
         ├─ Simülasyon (sistemde nasıl çalışacak?)
         │    - Karlılık testi, threshold ayarları
         │
         ├─ Kademeli Deployment (blue-green)
         │    - Önce dar kapsamda aç → izle → yaygınlaştır
         │
         ├─ Monitoring (3 ayda bir — kredi risk için)
         │    - PSI (data drift)
         │    - Gini (model başarısı)
         │    - Business metrikleri
         │
         └─ Drift/bozulma varsa → başa dön, retrain kararı
```