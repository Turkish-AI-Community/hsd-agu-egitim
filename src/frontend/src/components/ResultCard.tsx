import type { CreditResponse } from "@/lib/api";
import { cn } from "@/lib/utils";
import { ShieldCheck, ShieldAlert } from "lucide-react";

interface ResultCardProps {
  result: CreditResponse;
}

export default function ResultCard({ result }: ResultCardProps) {
  const isGood = result.prediction === "good";
  const riskPercent = Math.round(result.probability * 100);

  return (
    <div
      className={cn(
        "rounded-xl border-2 p-6 shadow-sm transition-all",
        isGood
          ? "border-primary/30 bg-primary/5"
          : "border-destructive/30 bg-destructive/5"
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        {isGood ? (
          <ShieldCheck className="h-10 w-10 text-primary" />
        ) : (
          <ShieldAlert className="h-10 w-10 text-destructive" />
        )}
        <div>
          <h3
            className={cn(
              "text-xl font-bold",
              isGood ? "text-primary" : "text-destructive"
            )}
          >
            {isGood ? "Düşük Risk" : "Yüksek Risk"}
          </h3>
          <p className="text-sm text-muted-foreground">
            Model tahmini: <span className="font-mono">{result.prediction}</span>
          </p>
        </div>
      </div>

      {/* Probability bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-muted-foreground">Risk Olasılığı</span>
          <span className="font-semibold">%{riskPercent}</span>
        </div>
        <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-700",
              riskPercent > 50 ? "bg-destructive" : "bg-primary"
            )}
            style={{ width: `${riskPercent}%` }}
          />
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg bg-white/60 p-3">
          <p className="text-muted-foreground">Olasılık</p>
          <p className="font-mono font-semibold">
            {(result.probability * 100).toFixed(1)}%
          </p>
        </div>
        <div className="rounded-lg bg-white/60 p-3">
          <p className="text-muted-foreground">Eşik Değer</p>
          <p className="font-mono font-semibold">
            {(result.threshold * 100).toFixed(0)}%
          </p>
        </div>
      </div>

      {/* Advice */}
      <div className="mt-4 rounded-lg bg-white/60 p-4 text-sm">
        <p className="font-medium mb-1">
          {isGood ? "Değerlendirme" : "Uyarı"}
        </p>
        <p className="text-muted-foreground">
          {isGood
            ? "Bu profil düşük risk grubunda yer almaktadır. Kredi başvurusu olumlu değerlendirilebilir."
            : "Bu profil yüksek risk grubunda yer almaktadır. Ek teminat veya daha düşük kredi tutarı değerlendirilebilir."}
        </p>
      </div>
    </div>
  );
}
