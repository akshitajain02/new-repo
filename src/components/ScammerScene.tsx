export default function ScammerScene() {
  return (
    <section className="relative py-16 px-4 overflow-hidden">
      <div className="max-w-5xl mx-auto rounded-3xl border bg-card/80 backdrop-blur p-8 shadow-xl">
        <h2 className="text-2xl font-bold text-center mb-8 text-primary">
          Security Protection in Action
        </h2>

        <div className="grid md:grid-cols-3 items-center gap-8">
          {/* Scammer */}
          <div className="flex flex-col items-center gap-3">
            <div className="text-6xl animate-scammer-walk">🕵️</div>
            <p className="text-sm text-muted-foreground text-center">
              Scammer attempts to steal developer data
            </p>
          </div>

          {/* Shield */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-primary/30 blur-2xl animate-pulse" />
              <div className="relative text-7xl animate-shield-glow">🛡️</div>
            </div>
            <p className="text-sm font-medium text-center text-primary">
              Protected by Phishing Guard
            </p>
          </div>

          {/* Data box */}
          <div className="flex flex-col items-center gap-3">
            <div className="rounded-2xl border bg-background p-5 shadow-md animate-data-float">
              <p className="font-semibold text-center">Your Data</p>
              <p className="text-sm text-muted-foreground text-center">
                is defended !!
              </p>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Sensitive information remains safe due to PhishingGuard
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}