import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Calculator,
  BookOpen,
  ArrowRight,
  ClipboardList,
  Cpu,
  CheckCircle2,
  Compass,
} from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Risk Tahmini",
    description:
      "Makine öğrenmesi modeli ile kredi başvurularının risk seviyesini anında analiz edin.",
    link: "/basvuru",
  },
  {
    icon: Calculator,
    title: "Kredi Hesaplayıcı",
    description:
      "Kredi tutarı, faiz oranı ve vadeye göre aylık taksit ve toplam ödeme hesaplayın.",
    link: "/hesaplayici",
  },
  {
    icon: BookOpen,
    title: "Bilgi Merkezi",
    description:
      "Modelin nasıl çalıştığını, kullanım alanlarını ve değerlendirme metriklerini keşfedin.",
    link: "/bilgi",
  },
];

const steps = [
  {
    icon: ClipboardList,
    number: "1",
    title: "Bilgileri Girin",
    description: "Yaş, gelir durumu, kredi tutarı gibi temel bilgileri form üzerinden doldurun.",
  },
  {
    icon: Cpu,
    number: "2",
    title: "Model Analiz Eder",
    description: "LightGBM modeli girilen verileri işler ve risk tahminini hesaplar.",
  },
  {
    icon: CheckCircle2,
    number: "3",
    title: "Sonucu Alın",
    description: "Düşük veya yüksek risk olarak sınıflandırılmış sonucu anında görüntüleyin.",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-20 py-12">
      {/* Hero */}
      <section className="mx-auto max-w-3xl text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
          <Compass className="h-4 w-4" />
          Makine Öğrenmesi ile Kredi Risk Tahmini
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Kredi Riskinizi{" "}
          <span className="text-primary">Anında Öğrenin</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          German Credit Risk veri seti üzerinde eğitilmiş LightGBM modeli ile
          kredi başvurularınızın risk değerlendirmesini yapın.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            to="/basvuru"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
          >
            Başvuru Yap
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/bilgi"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-semibold text-foreground transition-all hover:bg-muted"
          >
            Nasıl Çalışır?
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl">
        <h2 className="mb-8 text-center text-2xl font-bold text-foreground">
          Özellikler
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {features.map((f) => (
            <Link
              key={f.title}
              to={f.link}
              className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-md"
            >
              <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                <f.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold text-foreground group-hover:text-primary transition-colors">
                {f.title}
              </h3>
              <p className="text-sm text-muted-foreground">{f.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-4xl">
        <h2 className="mb-8 text-center text-2xl font-bold text-foreground">
          Nasıl Çalışır?
        </h2>
        <div className="grid gap-8 sm:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent/30">
                <step.icon className="h-7 w-7 text-accent-foreground" />
              </div>
              <div className="mb-2 text-xs font-bold text-accent-foreground uppercase tracking-wider">
                Adım {step.number}
              </div>
              <h3 className="mb-2 font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-3xl rounded-2xl bg-primary/5 border border-primary/10 p-8 text-center">
        <h2 className="text-2xl font-bold text-foreground">
          Hemen Deneyin
        </h2>
        <p className="mt-2 text-muted-foreground">
          Kredi başvuru formunu doldurun ve yapay zeka modelinin risk
          değerlendirmesini görün.
        </p>
        <Link
          to="/basvuru"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
        >
          Risk Analizi Yap
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}
