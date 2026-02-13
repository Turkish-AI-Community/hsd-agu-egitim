import CreditForm from "@/components/CreditForm";
import { Compass } from "lucide-react";

export default function ApplyPage() {
  return (
    <div className="mx-auto max-w-2xl py-12">
      <div className="mb-8">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-accent/20 px-4 py-1.5 text-sm font-medium text-accent-foreground">
          <Compass className="h-4 w-4" />
          Kredi Başvurusu
        </div>
        <h1 className="text-3xl font-bold text-foreground">
          Kredi Risk Analizi
        </h1>
        <p className="mt-2 text-muted-foreground">
          Aşağıdaki formu doldurarak kredi başvurunuzun risk değerlendirmesini
          alabilirsiniz. Model, girdiğiniz bilgilere göre başvurunuzu düşük veya
          yüksek risk olarak sınıflandıracaktır.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <CreditForm />
      </div>
    </div>
  );
}
