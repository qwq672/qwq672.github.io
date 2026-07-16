"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTheme } from "next-themes";

/**
 * Morphing theme toggle.
 * Dark  = crescent moon (mask covers part of the disc, rays retracted)
 * Light = full sun (mask slides away, rays extend outward)
 *
 * Performance: all animations use transform/opacity (GPU-composited) instead
 * of SVG geometry attributes (cx/cy) which cause main-thread layout.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  const reduce = useReducedMotion();

  const isDark = mounted ? resolvedTheme === "dark" : true;

  const toggle = React.useCallback(() => {
    setTheme(isDark ? "light" : "dark");
  }, [isDark, setTheme]);

  const rays = Array.from({ length: 8 }, (_, i) => i);
  const ease = [0.22, 1, 0.36, 1] as const;
  const dur = reduce ? 0 : 0.45;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "切换到亮色模式" : "切换到深色模式"}
      title={isDark ? "切换到亮色模式" : "切换到深色模式"}
      className={`group relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-background/40 text-foreground/80 transition-colors duration-300 hover:border-accent/50 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 ${className ?? ""}`}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: "visible" }}
      >
        {/* Sun rays — scale + opacity, GPU friendly */}
        {rays.map((i) => {
          const angle = (i * 360) / 8;
          return (
            <motion.rect
              key={i}
              x="11.25"
              y="1.8"
              width="1.5"
              height="3"
              rx="0.75"
              fill="currentColor"
              transform={`rotate(${angle} 12 12)`}
              initial={{ opacity: isDark ? 0 : 1, scaleY: isDark ? 0.3 : 1 }}
              animate={{ opacity: isDark ? 0 : 1, scaleY: isDark ? 0.3 : 1 }}
              transition={{ duration: dur, ease }}
              style={{
                transformBox: "fill-box",
                transformOrigin: "center",
                willChange: "transform, opacity",
              }}
            />
          );
        })}

        {/* Sun/moon disc — fixed position, only scale animates */}
        <motion.circle
          cx="12"
          cy="12"
          r="5.2"
          fill="currentColor"
          initial={{ scale: isDark ? 0.96 : 1 }}
          animate={{ scale: isDark ? 0.96 : 1 }}
          transition={{ duration: dur, ease }}
          style={{
            transformBox: "fill-box",
            transformOrigin: "center",
            willChange: "transform",
          }}
        />

        {/* Crescent mask — fixed cx/cy, moves via transform translate (GPU) */}
        <motion.circle
          cx="12"
          cy="12"
          r="5.2"
          fill="var(--background)"
          initial={{
            x: isDark ? 3.2 : 12,
            y: isDark ? -2.8 : -10,
            opacity: isDark ? 1 : 0,
          }}
          animate={{
            x: isDark ? 3.2 : 12,
            y: isDark ? -2.8 : -10,
            opacity: isDark ? 1 : 0,
          }}
          transition={{ duration: dur, ease }}
          style={{ willChange: "transform, opacity" }}
        />
      </svg>
    </button>
  );
}
