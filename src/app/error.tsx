"use client";

import { motion } from "framer-motion";
import { AlertCircle, RotateCcw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -left-[20%] top-[10%] h-[45vh] w-[45vh] rounded-full bg-destructive/10 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center"
      >
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-destructive/30 bg-destructive/10 text-destructive">
          <AlertCircle className="h-8 w-8" />
        </div>

        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          出了点小问题
        </h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
          页面加载的时候好像崩了。可以试试重新加载，或者回首页看看。
        </p>

        {error.digest && (
          <p className="mt-4 rounded-full bg-muted px-3 py-1 font-mono text-[0.65rem] text-muted-foreground">
            {error.digest}
          </p>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={reset}
            className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background shadow-lg shadow-foreground/20 transition-all duration-300 hover:scale-[1.03] active:scale-95"
          >
            <RotateCcw className="h-4 w-4 transition-transform duration-300 group-hover:-rotate-180" />
            重新加载
          </button>
          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-6 py-3 text-sm font-semibold text-foreground backdrop-blur-sm transition-all duration-300 hover:border-accent/40"
          >
            <Home className="h-4 w-4" />
            回首页
          </a>
        </div>
      </motion.div>
    </div>
  );
}
