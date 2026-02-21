# KrediPusula - Kredi Risk Tahmin Uygulaması (Frontend)

Makine öğrenmesi modeli ile kredi başvurularının risk değerlendirmesini yapan ve RAG tabanlı AI asistan barındıran React web uygulaması.

## Tech Stack

- **React 19** + TypeScript
- **Vite** (build tool)
- **Tailwind CSS v4** (styling)
- **React Router** (sayfa yönlendirme)
- **Lucide React** (ikonlar)
- **react-markdown** (chatbot yanıtlarında markdown render)

## Gereksinimler

- Node.js >= 18
- npm >= 9
- Backend sunucusu (FastAPI, port 8000)

## Kurulum

```bash
# Frontend klasörüne gir
cd src/frontend

# Bağımlılıkları yükle
npm install
```

## Çalıştırma

### 1. Backend sunucusunu başlat (proje kök dizininden)

```bash
uv run uvicorn src.backend.main:app --reload
```

Backend `http://localhost:8000` adresinde çalışacaktır.

### 2. Frontend geliştirme sunucusunu başlat

```bash
cd src/frontend
npm run dev
```

Frontend `http://localhost:5173` adresinde çalışacaktır.

### 3. Tarayıcıda aç

```
http://localhost:5173
```

## Sayfalar

| Sayfa | URL | Açıklama |
|-------|-----|----------|
| Ana Sayfa | `/` | Landing page, özellikler ve nasıl çalışır akışı |
| Kredi Başvurusu | `/basvuru` | 9 alanlı başvuru formu + risk sonucu |
| Hesaplayıcı | `/hesaplayici` | Kredi taksit ve amortisman hesaplayıcı |
| Bilgi Merkezi | `/bilgi` | Model detayları, metrikler ve kullanım alanları |

## Klasör Yapısı

```
src/frontend/
  src/
    components/    # Tekrar kullanılabilir UI bileşenleri
      Navbar.tsx
      Footer.tsx
      CreditForm.tsx
      ResultCard.tsx
      Calculator.tsx
      ChatWidget.tsx  # AI asistan chatbot (sağ alt köşe)
    pages/         # Sayfa bileşenleri
      HomePage.tsx
      ApplyPage.tsx
      CalculatorPage.tsx
      InfoPage.tsx
    lib/           # Yardımcı fonksiyonlar
      api.ts       # Backend API çağrıları (predict + chat)
      session.ts   # Session ID yönetimi (localStorage)
      utils.ts     # Tailwind class birleştirme
    App.tsx        # Router tanımları
    main.tsx       # Uygulama giriş noktası
    index.css      # Tailwind + tema tanımları
```

## Production Build

```bash
npm run build
npm run preview   # Build sonucunu önizle
```

Build çıktısı `dist/` klasörüne oluşturulur.

## Chatbot (AI Asistan)

Sağ alt köşedeki chatbot butonu ile KrediPusula Asistanına erişilebilir. Asistan:

- Kredi risk skorlama ve başvuru süreci hakkında sorulara yanıt verir
- Kullanıcının en son yaptığı kredi hesaplama sonucunu otomatik olarak bağlamına alır
- Markdown formatında yanıtlar üretir
- Sohbet geçmişi session bazlı saklanır

Chatbot'un çalışması için backend'de `GEMINI_API_KEY` ortam değişkeni tanımlı olmalıdır.

## Notlar

- Frontend, backend API'ye `http://localhost:8000` üzerinden bağlanır
- Backend'de CORS middleware aktif olmalıdır (varsayılan olarak eklenmiştir)
- Hesaplayıcı sayfası tamamen client-side çalışır, backend bağlantısı gerektirmez
- Chatbot, session ID ile çalışır; aynı tarayıcıda form ve chat aynı oturumu paylaşır
- Bu uygulama eğitim amaçlıdır, gerçek finansal kararlar için kullanılmamalıdır
