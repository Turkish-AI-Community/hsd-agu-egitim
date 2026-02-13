import CalculatorComponent from "@/components/Calculator";
import { Calculator } from "lucide-react";

export default function CalculatorPage() {
  return (
    <div className="mx-auto max-w-3xl py-12">
      <div className="mb-8">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-accent/20 px-4 py-1.5 text-sm font-medium text-accent-foreground">
          <Calculator className="h-4 w-4" />
          Kredi Hesaplayıcı
        </div>
        <h1 className="text-3xl font-bold text-foreground">
          Kredi Hesaplayıcı
        </h1>
        <p className="mt-2 text-muted-foreground">
          Kredi tutarı, faiz oranı ve vade bilgilerini girerek aylık taksit
          tutarını, toplam ödeme miktarını ve faiz tutarını hesaplayın.
          Amortisman tablosu ile ay ay ödeme detaylarını inceleyin.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <CalculatorComponent />
      </div>
    </div>
  );
}
