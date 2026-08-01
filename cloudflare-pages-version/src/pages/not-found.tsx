import { Link } from "react-router-dom";
import { motion } from "framer-motion";

/**
 * 404 page — mirrors the main project's src/app/not-found.tsx.
 * Shown when react-router matches the `*` catch-all route.
 */
export function NotFoundPage() {
  return (
    <div className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-6 text-center">
      {/* ambient bg */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -left-[20%] top-[10%] h-[45vh] w-[45vh] rounded-full bg-accent/10 blur-[120px]" />
        <div className="absolute right-[-10%] bottom-[10%] h-[40vh] w-[40vh] rounded-full bg-primary/10 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center"
      >
        {/* Big 404 */}
        <h1 className="font-display text-[7rem] font-bold leading-none tracking-tight text-foreground sm:text-[10rem]">
          <span className="text-gradient-animate">404</span>
        </h1>

        <p className="mt-2 text-lg font-medium text-foreground">
          这页面好像不存在
        </p>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
          可能是链接打错了，或者这个页面被我折腾的时候不小心删了（
          <br />
          要不回首页看看？
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background shadow-lg shadow-foreground/20 transition-all duration-300 hover:scale-[1.03] active:scale-95"
          >
            回到首页
          </Link>
          <Link
            to="/?s=blog"
            className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-6 py-3 text-sm font-semibold text-foreground backdrop-blur-sm transition-all duration-300 hover:border-accent/40"
          >
            看看随笔
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
