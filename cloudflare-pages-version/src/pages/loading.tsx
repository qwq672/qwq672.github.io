/**
 * Route loading indicator — mirrors the main project's src/app/loading.tsx.
 * Shown as a Suspense fallback (or briefly during route transitions).
 */
export function LoadingPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <span className="relative flex h-12 w-12">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-2xl bg-accent opacity-40" />
          <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-primary font-display text-sm font-bold text-primary-foreground shadow-lg">
            672
          </span>
        </span>
        <span className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
          loading
        </span>
      </div>
    </div>
  );
}
