import {
  Landmark,
  Smartphone,
  ShieldCheck,
  PieChart,
  Scale,
  BarChart3,
  Target,
  TrendingUp,
  AlertTriangle,
  Database,
} from "lucide-react";

const useCases = [
  {
    icon: Landmark,
    title: "Banka Kredi Değerlendirme",
    description:
      "Kredi başvurularını ön eleme, risk skorlama ve otomatik karar destek sistemleri.",
  },
  {
    icon: Smartphone,
    title: "Fintech Uygulamalar",
    description:
      "Anında kredi onay/red kararı, kullanıcı risk profili oluşturma ve dinamik fiyatlama.",
  },
  {
    icon: ShieldCheck,
    title: "Sigorta Sektörü",
    description:
      "Prim belirleme, müşteri risk segmentasyonu ve hasar tahmin modelleri.",
  },
  {
    icon: PieChart,
    title: "Portföy Yönetimi",
    description:
      "Mevcut kredi portföyünde riskli müşterilerin tespiti ve erken uyarı sistemi.",
  },
  {
    icon: Scale,
    title: "Regülatör Uyumluluk",
    description:
      "Basel düzenlemeleri kapsamında risk modelleme ve sermaye yeterliliği hesaplamaları.",
  },
];

const metrics = [
  {
    icon: BarChart3,
    name: "AUC (Area Under Curve)",
    value: "Modelin genel ayırt etme gücü",
    description:
      "ROC eğrisi altında kalan alan. 0.5 rastgele tahmini, 1.0 mükemmel ayrımı temsil eder. Modelimizin AUC skoru kredi riski ayrımında yüksek bir başarı göstermektedir.",
  },
  {
    icon: Target,
    name: "Recall (Duyarlılık)",
    value: "Riskli müşterileri yakalama oranı",
    description:
      "Gerçekten riskli olan müşterilerin ne kadarını doğru tespit edebildiğimizi gösterir. Kredi riski probleminde en kritik metriktir; kaçırılan riskli müşteriler doğrudan finansal kayba yol açar.",
  },
  {
    icon: TrendingUp,
    name: "Precision (Kesinlik)",
    value: "Riskli dediğimizde doğru olma oranı",
    description:
      "Model 'riskli' dediğinde, bu tahminin ne kadar doğru olduğunu gösterir. Yüksek precision, gereksiz yere reddedilen iyi müşteri sayısını azaltır.",
  },
];

const strengths = [
  "Gradient boosting tabanlı güçlü tahmin gücü (LightGBM)",
  "Feature engineering ile domain bilgisi entegrasyonu",
  "Threshold optimizasyonu ile dengesiz sınıflar için ayarlanmış karar sınırı",
  "Cross-validation ile güvenilir performans tahmini",
  "Pipeline mimarisi ile veri sızıntısı önleme",
];

const limitations = [
  "German Credit Risk veri seti üzerinde eğitilmiştir (1000 gözlem)",
  "Veri seti 1990'lardan gelmektedir, güncel piyasa koşullarını yansıtmayabilir",
  "Sadece sınırlı sayıda özellik (feature) kullanılmaktadır",
  "Gerçek dünya uygulamasında ek verilerle (gelir, kredi geçmişi vb.) desteklenmelidir",
  "Bu uygulama eğitim amaçlıdır, gerçek finansal kararlar için kullanılmamalıdır",
];

export default function InfoPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-16 py-12">
      {/* Header */}
      <div>
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-accent/20 px-4 py-1.5 text-sm font-medium text-accent-foreground">
          <Database className="h-4 w-4" />
          Bilgi Merkezi
        </div>
        <h1 className="text-3xl font-bold text-foreground">
          Model ve Kredi Risk Bilgileri
        </h1>
        <p className="mt-2 text-muted-foreground">
          Kullanılan modelin detayları, değerlendirme metrikleri ve potansiyel
          kullanım alanları hakkında bilgi edinin.
        </p>
      </div>

      {/* Use cases */}
      <section>
        <h2 className="mb-6 text-2xl font-bold text-foreground">
          Kullanım Alanları
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {useCases.map((uc) => (
            <div
              key={uc.title}
              className="rounded-xl border border-border bg-card p-5 transition-all hover:shadow-sm"
            >
              <div className="mb-3 inline-flex rounded-lg bg-primary/10 p-2.5">
                <uc.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mb-1.5 font-semibold text-foreground">
                {uc.title}
              </h3>
              <p className="text-sm text-muted-foreground">{uc.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Metrics */}
      <section>
        <h2 className="mb-6 text-2xl font-bold text-foreground">
          Değerlendirme Metrikleri
        </h2>
        <div className="space-y-4">
          {metrics.map((m) => (
            <div
              key={m.name}
              className="rounded-xl border border-border bg-card p-5"
            >
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-accent/20 p-2.5">
                  <m.icon className="h-5 w-5 text-accent-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{m.name}</h3>
                  <p className="text-sm font-medium text-primary">
                    {m.value}
                  </p>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    {m.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Strengths and limitations */}
      <section className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-primary">
            <ShieldCheck className="h-5 w-5" />
            Güçlü Yönler
          </h2>
          <ul className="space-y-2.5">
            {strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                <span className="text-foreground/80">{s}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-accent/30 bg-accent/10 p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-accent-foreground">
            <AlertTriangle className="h-5 w-5" />
            Sınırlılıklar
          </h2>
          <ul className="space-y-2.5">
            {limitations.map((l, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                <span className="text-foreground/80">{l}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Dataset info */}
      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 text-2xl font-bold text-foreground">
          Veri Seti Hakkında
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-muted-foreground">Veri Seti</span>
              <span className="font-medium">German Credit Risk (UCI)</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-muted-foreground">Gözlem Sayısı</span>
              <span className="font-medium">1,000</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-muted-foreground">Özellik Sayısı</span>
              <span className="font-medium">9 (+ mühendislik yapılmış)</span>
            </div>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-muted-foreground">Hedef Değişken</span>
              <span className="font-medium">Risk (good/bad)</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-muted-foreground">Model</span>
              <span className="font-medium">LightGBM (Optuna tuned)</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-muted-foreground">Kaynak</span>
              <span className="font-medium">Kaggle / UCI ML Repository</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
