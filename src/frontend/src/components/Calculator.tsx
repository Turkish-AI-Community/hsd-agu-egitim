import { useState, useMemo } from "react";
import { Calculator as CalcIcon } from "lucide-react";

interface AmortRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

function calculateAmortization(
  amount: number,
  annualRate: number,
  months: number
): { monthly: number; totalPayment: number; totalInterest: number; rows: AmortRow[] } {
  const monthlyRate = annualRate / 100 / 12;
  const monthly =
    monthlyRate === 0
      ? amount / months
      : (amount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1);

  const rows: AmortRow[] = [];
  let balance = amount;

  for (let i = 1; i <= months; i++) {
    const interest = balance * monthlyRate;
    const principal = monthly - interest;
    balance = Math.max(0, balance - principal);
    rows.push({
      month: i,
      payment: monthly,
      principal,
      interest,
      balance,
    });
  }

  const totalPayment = monthly * months;
  const totalInterest = totalPayment - amount;

  return { monthly, totalPayment, totalInterest, rows };
}

const fmt = (n: number) =>
  new Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);

export default function CalculatorComponent() {
  const [amount, setAmount] = useState(10000);
  const [rate, setRate] = useState(2.5);
  const [months, setMonths] = useState(12);
  const [showTable, setShowTable] = useState(false);

  const result = useMemo(
    () => calculateAmortization(amount, rate, months),
    [amount, rate, months]
  );

  const inputClass =
    "w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all";
  const labelClass = "block text-sm font-medium text-foreground mb-1.5";

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className={labelClass}>Kredi Tutarı</label>
          <input
            type="number"
            min={100}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Yıllık Faiz Oranı (%)</label>
          <input
            type="number"
            min={0}
            step={0.1}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Vade (Ay)</label>
          <input
            type="number"
            min={1}
            max={360}
            value={months}
            onChange={(e) => setMonths(Number(e.target.value))}
            className={inputClass}
          />
        </div>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-primary/5 p-5 text-center">
          <p className="text-sm text-muted-foreground mb-1">Aylık Taksit</p>
          <p className="text-2xl font-bold text-primary">{fmt(result.monthly)}</p>
        </div>
        <div className="rounded-xl border border-border bg-muted/50 p-5 text-center">
          <p className="text-sm text-muted-foreground mb-1">Toplam Ödeme</p>
          <p className="text-2xl font-bold">{fmt(result.totalPayment)}</p>
        </div>
        <div className="rounded-xl border border-border bg-warning/5 p-5 text-center">
          <p className="text-sm text-muted-foreground mb-1">Toplam Faiz</p>
          <p className="text-2xl font-bold text-warning">{fmt(result.totalInterest)}</p>
        </div>
      </div>

      {/* Toggle table */}
      <button
        onClick={() => setShowTable(!showTable)}
        className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <CalcIcon className="h-4 w-4" />
        {showTable ? "Tabloyu Gizle" : "Amortisman Tablosu"}
      </button>

      {/* Amortization table */}
      {showTable && (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Ay</th>
                <th className="px-4 py-3 text-right font-medium">Taksit</th>
                <th className="px-4 py-3 text-right font-medium">Anapara</th>
                <th className="px-4 py-3 text-right font-medium">Faiz</th>
                <th className="px-4 py-3 text-right font-medium">Kalan Borç</th>
              </tr>
            </thead>
            <tbody>
              {result.rows.map((row) => (
                <tr key={row.month} className="border-t border-border">
                  <td className="px-4 py-2.5">{row.month}</td>
                  <td className="px-4 py-2.5 text-right font-mono">
                    {fmt(row.payment)}
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono">
                    {fmt(row.principal)}
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono">
                    {fmt(row.interest)}
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono">
                    {fmt(row.balance)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
