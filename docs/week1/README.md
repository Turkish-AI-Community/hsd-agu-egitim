# Hafta 1 - Temel Veri Bilimi Kavramları ve Kredi Risk Modelleme

## 📋 Eğitim Genel Bakış

**Bootcamp:** From Model to Agent Boot Camp
**Eğitmen:** Enes Fehiman (Data Scientist, Bankacılık Sektörü)
**Proje:** Kredi Pusula - Uçtan uca kredi risk modelleme ve agent destekli chatbot uygulaması

### 3 Haftalık Yol Haritası

| Hafta | Konu | İçerik |
|-------|------|--------|
| 1 | Veri Bilimi Temelleri | EDA, Feature Engineering, Model Eğitimi, Metrik Değerlendirme |
| 2 | MLOps & Deployment | ML Flow, REST API (FastAPI), Model Monitoring, Data/Model Drift |
| 3 | LLM & Agent | LLM temelleri, Prompt teknikleri, Agent & RAG mimarileri, Ürün entegrasyonu |

---

## 1. Makine Öğrenmesi Temelleri

### 1.1 Gerçek Hayatta Bir ML Projesi Nasıl Başlar?

Eğitimlerde genellikle Kaggle'dan hazır bir CSV alınır; target belli, kolonlar belli, problem tanımlıdır. **Gerçek hayatta** ise:

1. **Problem gelir** — iş birimlerinden, pazarlamadan veya üst yönetimden.
2. **Data kontrolü yapılır** — Bu problemi çözecek veri DB'de var mı?
3. **Target belirlenir** — Eğer daha önce tanımlanmamışsa, business kurallarıyla ya da geçmiş verilerden flag oluşturulur.
4. **Yeterli veri birikimi beklenir** — Modelleyecek kadar data yoksa birikmesi beklenir.

> **Anahtar:** Gerçek hayatta elinize paket CSV gelmez; siz, problem ve database ile baş başa kalırsınız.

### 1.2 Bağımlı ve Bağımsız Değişkenler

- **Bağımlı Değişken (Target):** Tahmin etmeye çalıştığımız kolon. Örn: Kredi riski (good/bad), fraud durumu (0/1), maaş miktarı.
- **Bağımsız Değişkenler (Feature):** Target'ı açıklamak/modellemek için kullandığımız diğer tüm kolonlar. Örn: yaş, cinsiyet, meslek, konum, hesap bakiyesi vb.

### 1.3 Makine Öğrenmesi Türleri

```
Makine Öğrenmesi
├── Denetimli (Supervised) → Label VAR
│   ├── Sınıflandırma (Classification) → Target kesikli (0/1, kedi/köpek)
│   └── Regresyon (Regression) → Target sürekli (maaş, fiyat)
│
└── Denetimsiz (Unsupervised) → Label YOK
    └── Kümeleme (Clustering) → K-Means, vb.
```

**Classification vs Regression ayrımı:**
- Target **kesikli** (kategorik) → Classification
- Target **sürekli** (sayısal, aralıktaki her değeri alabilir) → Regression

**Önemli:** Neredeyse her regresyon problemi threshold atayarak classification'a çevrilebilir. Örn: Maaş → "düşük / orta / yüksek" gibi kategorilere dönüştürülebilir.

### 1.4 Açıklanabilirlik (Explainability)

Bankacılıkta kredi skorlamada **açıklanabilirlik** yasal bir zorunluluktur:
- Kredi başvurusu reddedilen kişi neden reddedildiğini sorgulama hakkına sahiptir.
- **Yapay sinir ağları** (kara kutu) bu açıklamayı yapamaz → Bu yüzden kredi modellemede pek kullanılmaz.
- **Karar ağaçları, regresyon, boosting modelleri** if-else kuralları takip edilebildiği için açıklanabilirdir.

### 1.5 Karar Ağaçları (Decision Trees) — Nasıl Çalışır?

1. Entropi veya Gini algoritması ile en uygun bölünme noktası aranır.
2. Target'ı en homojen şekilde ayıran değişken ve değer bulunur.
3. Recursive olarak ağaç dallanır; yeterince homojen ayrım bulunamazsa durur.
4. Sonuç: If-else kuralları zinciri → Açıklanabilir tahmin.

### 1.6 Regresyon — Temel Mantık

Regresyon denklemi: **y = β₀ + β₁x + ε**
- **y:** Target (tahmin edilen değer)
- **β₀:** Kesişim (intercept)
- **β₁:** Eğim (slope)
- **ε:** Hata terimi (noktaların çizgiye uzaklığı)

Amaç: Noktaların çizgiye olan toplam uzaklığını (hatayı) minimize eden doğruyu bulmak.

> Sonsuz tane çizgi çizilebilir; optimal olan, hata toplamı en küçük olanıdır.

---

## 2. Proje Repo Yapısı

```
kredi-pusula/
├── data/               # Veri dosyaları
├── docs/               # Dokümanlar, deney sonuçları
├── models/             # Eğitilmiş modeller, ML Flow logları
├── notebooks/          # Jupyter notebook'lar
│   ├── 01_eda.ipynb
│   ├── 02_baseline.ipynb
│   └── 03_feature_engineering.ipynb
├── src/                # Kaynak kodları
│   ├── api/            # REST API (FastAPI)
│   ├── tests/          # Testler
│   └── frontend/       # Kredi Pusula arayüzü
├── .gitignore
├── pyproject.toml      # UV bağımlılık yönetimi
└── README.md
```

### Önemli Noktalar

- **Bağımlılık yönetimi:** `requirements.txt` yerine **UV** (Rust tabanlı paket yöneticisi) tercih edildi. Sürüm çakışmalarını otomatik çözer.
- **Git & Versiyon kontrolü:** Büyük dosyalar (CSV, model) `.gitignore`'a eklenir. Data ayrı bir object storage'da tutulur.
- **Python versiyonu:** Projenin çalışacağı Python versiyonuna dikkat. Şirket ortamlarında sabit bir versiyona kitlenir.

---

## 3. EDA (Exploratory Data Analysis)

### 3.1 Veri Seti: German Credit Risk

- **1000 satır, 10 kolon**
- **Target:** `risk` kolonu → good (ödemiş) / bad (batırmış)
- **Dağılım:** 700 good / 300 bad (gerçek hayatta çok daha dengesiz olur)

### 3.2 İlk Adımlar

1. **Data tipleri kontrolü** — Sürekli mi kategorik mi? Yanlış gelen varsa düzelt.
2. **Target dağılımı** — Dengesizlik var mı? (Kredi risk modellerinde her zaman dengesizdir)
3. **Eksik değerler** — Hangi kolonlarda, ne oranda?
4. **Betimsel istatistikler** — Ortalama, medyan, standart sapma, çarpıklık, basıklık.
5. **Görselleştirmeler** — Dağılımlar, kutu grafikleri, korelasyon matrisi.

### 3.3 Eksik Değer Yönetimi

| Değişken Tipi | Yöntem | Açıklama |
|---|---|---|
| Kategorik | **Mod (en sık değer)** ile doldurma | En yaygın ve pratik yöntem |
| Kategorik | Business kuralı ile doldurma | Neden boş olduğunu anla, buna göre doldur |
| Kategorik | "Missing" etiketi atama | Boşluğu ayrı bir kategori olarak tut |
| Sürekli | **Medyan** ile doldurma | Aykırı değerlerden etkilenmez (ortalamaya göre daha robust) |
| Sürekli | Ortalama ile doldurma | Aykırı değerlerden etkilenir, dikkatli kullan |
| Her iki tip | KNN ile doldurma | Teoride güzel, pratikte büyük datalarda çok yavaş |

> **Ortalama vs Medyan:** Ortalama aykırı değerlerden çok etkilenir (Bill Gates barı örneği). Medyan daha güvenilirdir.

> **%70-80'den fazlası boşsa** o kolonu atmayı düşün.

### 3.4 Sağduyu (Domain Knowledge)

EDA yaparken her zaman **sağduyu** ile yaklaş:
- Hesabında az parası olan insanların daha çok krediye başvurması → **Beklenen**
- Alman datasında %70'inin ev sahibi olması → **Türkiye'de bu patern olmaz** (model transferi başarısız olur)
- Genç müşterilerin daha çok krediye başvurması → **Beklenen**

---

## 4. Model Eğitimi

### 4.1 Train-Test-Validation Ayrımı

```
Dataset
├── Test Seti (%20) → Hiç dokunma! Son değerlendirme için.
└── Train Seti (%80)
    └── Cross Validation (5-Fold)
        ├── Fold 1: [Train | Val]
        ├── Fold 2: [Train | Val]
        ├── Fold 3: [Train | Val]
        ├── Fold 4: [Train | Val]
        └── Fold 5: [Train | Val]
```

- **Stratified split:** Dengesiz verilerde train ve test'teki class oranlarını korur.
- **Cross Validation:** Küçük datalarda daha robust sonuç verir. 5 farklı bölünmede eğitip ortalamasını alır.
- **Data Leak'e dikkat:** Fit/transform sadece train'de yapılır. Test'te sadece transform!

### 4.2 Kullanılan Modeller

| Model | Özellik |
|-------|---------|
| Logistic Regression | Basit, açıklanabilir, baseline için ideal |
| Decision Tree | Açıklanabilir, overfitting riski yüksek |
| Random Forest | Ensemble, birçok ağacın ortalaması |
| XGBoost | Gradient boosting, güçlü performans |
| LightGBM | Hızlı eğitim, büyük datalarda tercih edilir |
| CatBoost | Kategorik değişkenleri iyi handle eder |

> **Baseline için:** Logistic Regression + LightGBM ile başla. Biri açıklanabilirlik, diğeri hız avantajı sağlar.

### 4.3 Pipeline Kullanımı

Sklearn Pipeline ile ön işleme adımları zincire bağlanır:
- Sayısal: Medyan ile doldurma → Standard Scaler (ortalama=0, std=1)
- Kategorik: Mod/Missing ile doldurma → One-Hot Encoding

> **One-Hot Encoding vs Label Encoding:** Bağımsız değişkenlerde One-Hot tercih edilir. Label Encoding sadece target'ta kullanılmalıdır.

---

## 5. Metrikler ve Değerlendirme

### 5.1 Accuracy Tuzağı

Dengesiz verilerde accuracy **yanıltıcıdır**:
- %95 sıfır, %5 bir olan bir datasette model hep "0" dese bile accuracy %95 çıkar.
- Ama "1" sınıfını hiç yakalayamaz!

### 5.2 Temel Metrikler

| Metrik | Açıklama | Ne Zaman Önemli? |
|--------|----------|-------------------|
| **Precision** | "Bad" dediklerinin gerçekten bad olma oranı | Yanlış alarm maliyeti yüksekse |
| **Recall** | Gerçek bad'lerin ne kadarını yakaladın | Kaçırma maliyeti yüksekse (kredi riski!) |
| **F1 Score** | Precision ve Recall'un harmonik ortalaması | Dengeli değerlendirme |
| **AUC** | Threshold'dan bağımsız genel ayırt edebilme gücü | Model karşılaştırma |

### 5.3 Kredi Risk'te Maliyet Asimetrisi

```
Senaryo 1: İyi müşteriyi reddetmek
  → Kayıp: Kazanılacak faiz geliri (5K)

Senaryo 2: Kötü müşteriyi onaylamak
  → Kayıp: Verilen kredi + Kazanılacak gelir (25K)
  → MALİYET 2 KATI!
```

Bu yüzden kredi modellemede **Recall önceliklidir** — kötü müşteriyi kaçırmamak, iyi müşteriyi yanlışlıkla reddetmekten çok daha kritiktir.

### 5.4 Overfitting Kontrolü

CV AUC ile Test AUC arasındaki farka bak:
- Yakınlarsa → Model genelleyebiliyor ✅
- Büyük gap varsa → Overfitting var ⚠️

---

## 6. Feature Engineering

### Türetilen Değişkenler

| Yeni Değişken | Formül | Anlam |
|---|---|---|
| `credit_per_month` | credit_amount / duration | Aylık tahmini ödeme yükü |
| `credit_to_age` | credit_amount / age | Yaşa oranla kredi büyüklüğü |
| `savings_score` | Kategorik → sayısal mapping | Birikim hesabı seviyesi (skorlanmış) |
| `checking_score` | Kategorik → sayısal mapping | Vadesiz hesap seviyesi (skorlanmış) |

> Her yeni feature eklendikten sonra AUC'ye katkısını kontrol et. Artırmıyorsa at — gereksiz boyut ekleme!

---

## 7. Hyperparameter Tuning

### Optuna ile Bayesian Optimizasyon

- **Arama uzayı:** Model parametrelerinin olası değer aralıkları (learning rate, depth, n_estimators vb.)
- **Bayesian arama:** Rastgele aramak yerine, başarı olasılığının yüksek olduğu bölgelere doğru yönelir.
- **Trial sayısı:** Uzayda kaç farklı kombinasyon deneneceği (örn: 100 trial).

### Threshold Optimizasyonu

Default threshold 0.5'tir. Business ihtiyacına göre ayarlanır:
- **Threshold düşürme (örn: 0.3)** → Daha fazla bad yakalanır ama daha fazla iyi müşteri de yanlışlıkla reddedilir.
- **Threshold yükseltme** → Daha az yanlış alarm ama daha çok bad kaçırılır.
- **Optimal threshold:** Kaybedilen ve kazanılan paranın matematiksel analizi ile belirlenir.

---

## 8. Pratik Tavsiyeler

### Proje & Kariyer

- **LLM'den destek almaktan kaçınmayın** — Görselleştirme kodları, EDA şablonları gibi klasik işler artık LLM ile hızlıca yapılabilir.
- **Uçtan uca proje yapın** — Sadece notebook değil, ürüne dönüştürün.
- **Domain bilgisi edinin** — Hangi sektörde çalışacaksanız o alanı anlayın.
- **Portfolio oluşturun** — GitHub'da temiz, açıklamalı, İngilizce projeler.
- **CV'nizi Overleaf'te hazırlayın** — ATS sistemleri daha iyi parse eder.
- **Sosyal medyada görünür olun** — LinkedIn'de paylaşım yapın.
- **Notebook'lara analitik yorumlar ekleyin** — Markdown hücrelerine domain bazlı açıklamalar yazın.

### Teknik

- EDA'da her zaman **sağduyu** ile yaklaş.
- Dengesiz verilerde **accuracy'ye bakma**.
- **Fit sadece train'de**, test'te sadece transform.
- Feature engineering'de her değişkenin **katkısını ölç**.
- Modeli kaydet (pickle), gelecek hafta inference ve deployment'a geçilecek.

---

## 📚 Kaynaklar

- [Veri Kavramına Giriş Yayını](https://www.youtube.com/watch?v=0_VL5iE6dKM) - Yeni başlayanların aklındaki sorulara cevap bulabileceği kapsamlı bir yayın.
- [Model için Veri Hazırlama](https://www.youtube.com/watch?v=L3jZxf7KMtg) - Sektörel anlamda kapsamlı bir EDA ve DS in anlatılmayan yönlerine değindiğim yayın. 
- [Staj mülakatında neye dikkat etmeli?](https://www.youtube.com/watch?v=rv8GLgmtKQE&) - Staj mülakatlarında veya genel bir startup a giderken nasıl bir kafa yapısında olmak gerektiğini güzel anlatan video.
- [İleri seviye Credit Risk Model Reposu](https://github.com/enesmanan/credit-risk-model)
- [LLM Auto EDA Python Paketi](https://github.com/enesmanan/LLMAutoEDA) — LLM destekli otomatik EDA
- [Overleaf](https://www.overleaf.com/) — LaTeX tabanlı CV hazırlama

---

## 🔜 Gelecek Hafta: MLOps & Deployment

- ML Flow ile model tracking
- FastAPI ile REST API tasarımı
- Model monitoring (data drift, model drift)
- Eğitilen modelden inference alma pipeline'ı