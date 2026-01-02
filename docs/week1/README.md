# Hafta 1: Machine Learning Temelleri

## Genel Bakış

Bu haftanın amacı **KrediPusula** projesi için kredi skorlama modeli geliştirmek ve temel ML kavramlarını uygulamalı olarak öğrenmek.

---

## Konu Başlıkları

### 1. Veri Bilimi Kavramına Giriş
- Veri bilimi nedir?
- AI, ML, DL kavramları arasındaki farklar
- Veri bilimcinin rolü ve iş akışı

### 2. Problem Türleri ve Yaklaşım
- Classification vs Regression
- Supervised vs Unsupervised Learning
- Problem tanımlama ve çözüm stratejisi
- Database yapıları ve veri kaynakları

### 3. Credit Scoring Domain Bilgisi
- Kredi risk faktörleri
- Finansal metrikler
- Domain-specific feature'lar
- Business requirements

### 4. Exploratory Data Analysis (EDA) ve Veri Ön İşleme
- Dataset keşfi ve temel istatistikler
- Veri dağılımı analizi
- Missing value handling
- Outlier detection
- Data cleaning stratejileri

### 5. Feature Engineering
- Categorical encoding (One-Hot, Label Encoding)
- Feature scaling (StandardScaler, MinMaxScaler)
- Feature selection ve importance
- Domain knowledge ile feature oluşturma

### 6. Supervised Learning ve Classification Modelleri
- Logistic Regression
- Decision Trees
- Random Forest
- Gradient Boosting (XGBoost, LightGBM, CatBoost)
- Hyperparameter tuning (Optuna)

### 7. Model Değerlendirme Metrikleri
- Accuracy ve sınırlamaları
- Precision, Recall, F1-Score
- ROC-AUC curve
- Confusion matrix yorumlama
- Imbalanced data stratejileri
- SHAP ile model interpretability

---

## Uygulamalı Çalışma

### Adım 1: Data Exploration
- Kredi veri setini yükleme (pandas)
- Temel istatistikler (.describe(), .info())
- Target variable balance kontrolü
- Visualization (matplotlib, seaborn)

### Adım 2: Data Preprocessing
- Missing value analizi ve imputation
- Outlier detection ve handling
- Categorical feature encoding
- Feature scaling

### Adım 3: Feature Engineering
- Domain-based feature oluşturma
- Feature selection
- Correlation analizi

### Adım 4: Model Training
- Train-test split
- Baseline: Logistic Regression
- Tree-based: Random Forest
- Gradient Boosting: XGBoost, LightGBM, CatBoost
- Optuna ile hyperparameter tuning

### Adım 5: Model Evaluation
- Confusion matrix yorumlama
- ROC-AUC analizi
- SHAP ile feature importance
- Business impact değerlendirmesi

### Adım 6: Model Persistence
- Model kaydetme (pickle/joblib)
- Scaler ve encoder kaydetme
- Model metadata saklama

---

## Kullanılan Teknolojiler

| Kütüphane | Kullanım Alanı |
|-----------|----------------|
| **pandas** | Data manipulation |
| **numpy** | Numerical computing |
| **matplotlib** | Visualization |
| **seaborn** | Statistical visualization |
| **scikit-learn** | ML algorithms, preprocessing |
| **xgboost** | Gradient boosting |
| **lightgbm** | Gradient boosting |
| **catboost** | Gradient boosting |
| **optuna** | Hyperparameter tuning |
| **shap** | Model interpretability |

---

## Çıktılar

```
week1-ml-fundamentals/
├── notebooks/
│   ├── 01_data_exploration.ipynb
│   ├── 02_preprocessing.ipynb
│   └── 03_model_training.ipynb
├── data/
│   ├── raw/
│   └── processed/
├── models/
│   ├── credit_model.pkl
│   └── preprocessor.pkl
└── src/
    ├── preprocessing.py
    └── train.py
```

---

