export default function Footer() {
  return (
    <footer className="border-t border-border bg-muted/50 py-8">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/kredi_pusula_logo.png"
              alt="KrediPusula"
              className="h-7 opacity-70"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Bu uygulama eğitim amaçlıdır. German Credit Risk veri seti
            üzerinde eğitilmiş LightGBM modeli kullanmaktadır.
          </p>
        </div>
      </div>
    </footer>
  );
}
