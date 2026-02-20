import { useState } from "react";
import type { CreditRequest, CreditResponse } from "@/lib/api";
import { predictCreditRisk } from "@/lib/api";
import { getSessionId } from "@/lib/session";
import ResultCard from "./ResultCard";
import { Loader2, Send } from "lucide-react";

const JOB_OPTIONS = [
  { value: 0, label: "Vasıfsız - Yerleşik Olmayan" },
  { value: 1, label: "Vasıfsız - Yerleşik" },
  { value: 2, label: "Vasıflı Çalışan" },
  { value: 3, label: "Yüksek Vasıflı / Yönetici" },
];

const HOUSING_OPTIONS = ["own", "rent", "free"];
const HOUSING_LABELS: Record<string, string> = {
  own: "Ev Sahibi",
  rent: "Kiracı",
  free: "Ücretsiz / Aile Yanı",
};

const SAVING_OPTIONS = ["little", "moderate", "quite rich", "rich"];
const SAVING_LABELS: Record<string, string> = {
  little: "Az",
  moderate: "Orta",
  "quite rich": "İyi",
  rich: "Zengin",
};

const CHECKING_OPTIONS = ["little", "moderate", "rich"];
const CHECKING_LABELS: Record<string, string> = {
  little: "Az",
  moderate: "Orta",
  rich: "Zengin",
};

const PURPOSE_OPTIONS = [
  "car",
  "furniture/equipment",
  "radio/TV",
  "domestic appliances",
  "repairs",
  "education",
  "business",
  "vacation/others",
];
const PURPOSE_LABELS: Record<string, string> = {
  car: "Araç",
  "furniture/equipment": "Mobilya / Ekipman",
  "radio/TV": "Elektronik",
  "domestic appliances": "Ev Aletleri",
  repairs: "Tamirat",
  education: "Eğitim",
  business: "İş",
  "vacation/others": "Tatil / Diğer",
};

const initialForm: CreditRequest = {
  age: 35,
  sex: "male",
  job: 2,
  housing: "own",
  saving_accounts: "little",
  checking_account: "little",
  credit_amount: 5000,
  duration: 24,
  purpose: "car",
};

export default function CreditForm() {
  const [form, setForm] = useState<CreditRequest>(initialForm);
  const [result, setResult] = useState<CreditResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (field: keyof CreditRequest, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await predictCreditRisk({ ...form, session_id: getSessionId() });
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const selectClass =
    "w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all";
  const inputClass = selectClass;
  const labelClass = "block text-sm font-medium text-foreground mb-1.5";

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal info */}
        <fieldset className="space-y-4">
          <legend className="text-base font-semibold text-foreground border-b border-border pb-2 w-full">
            Kişisel Bilgiler
          </legend>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className={labelClass}>Yaş</label>
              <input
                type="number"
                min={18}
                max={100}
                value={form.age}
                onChange={(e) => update("age", Number(e.target.value))}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Cinsiyet</label>
              <select
                value={form.sex}
                onChange={(e) => update("sex", e.target.value)}
                className={selectClass}
              >
                <option value="male">Erkek</option>
                <option value="female">Kadın</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>İş Durumu</label>
              <select
                value={form.job}
                onChange={(e) => update("job", Number(e.target.value))}
                className={selectClass}
              >
                {JOB_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        {/* Financial info */}
        <fieldset className="space-y-4">
          <legend className="text-base font-semibold text-foreground border-b border-border pb-2 w-full">
            Finansal Bilgiler
          </legend>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className={labelClass}>Konut Durumu</label>
              <select
                value={form.housing}
                onChange={(e) => update("housing", e.target.value)}
                className={selectClass}
              >
                {HOUSING_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {HOUSING_LABELS[opt]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Birikim Hesabı</label>
              <select
                value={form.saving_accounts ?? ""}
                onChange={(e) =>
                  update("saving_accounts", e.target.value || null)
                }
                className={selectClass}
              >
                <option value="">Bilinmiyor</option>
                {SAVING_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {SAVING_LABELS[opt]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Vadesiz Hesap</label>
              <select
                value={form.checking_account ?? ""}
                onChange={(e) =>
                  update("checking_account", e.target.value || null)
                }
                className={selectClass}
              >
                <option value="">Bilinmiyor</option>
                {CHECKING_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {CHECKING_LABELS[opt]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        {/* Credit info */}
        <fieldset className="space-y-4">
          <legend className="text-base font-semibold text-foreground border-b border-border pb-2 w-full">
            Kredi Bilgileri
          </legend>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className={labelClass}>Kredi Tutarı (DM)</label>
              <input
                type="number"
                min={100}
                max={100000}
                value={form.credit_amount}
                onChange={(e) =>
                  update("credit_amount", Number(e.target.value))
                }
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Vade (Ay)</label>
              <input
                type="number"
                min={1}
                max={120}
                value={form.duration}
                onChange={(e) => update("duration", Number(e.target.value))}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Kredi Amacı</label>
              <select
                value={form.purpose}
                onChange={(e) => update("purpose", e.target.value)}
                className={selectClass}
              >
                {PURPOSE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {PURPOSE_LABELS[opt]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analiz Ediliyor...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Risk Analizi Yap
            </>
          )}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          <p className="font-medium">Hata</p>
          <p>{error}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Backend sunucusunun çalıştığından emin olun (port 8000).
          </p>
        </div>
      )}

      {/* Result */}
      {result && <ResultCard result={result} />}
    </div>
  );
}
