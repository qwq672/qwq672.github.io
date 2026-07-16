"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTheme } from "next-themes";

/**
 * Morphing theme toggle.
 * Dark  = crescent moon (mask covers part of the disc, rays retracted)
 * Light = full sun (mask slides away, rays extend outward)
 * The whole thing also gently rotates during the transition for polish.
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

  // Ray positions around the sun
  const rays = Array.from({ length: 8 }, (_, i) => i);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "切换到亮色模式" : "切换到深色模式"}
      title={isDark ? "切换到亮色模式" : "切换到深色模式"}
      className={`group relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-background/40 text-foreground/80 transition-colors duration-300 hover:border-accent/50 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 ${className ?? ""}`}
    >
      <motion.svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        animate={{ rotate: isDark ? -15 : 0 }}
        transition={{ duration: reduce ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Sun rays — grow out when light */}
        {rays.map((i) => {
          const angle = (i * 360) / 8;
          return (
            <motion.rect
              key={i}
              x="11.25"
              y="1.5"
              width="1.5"
              height="3.4"
              rx="0.75"
              fill="currentColor"
              transform={`rotate(${angle} 12 12)`}
              initial={{ opacity: isDark ? 0 : 1, scaleY: isDark ? 0.4 : 1 }}
              animate={{
                opacity: isDark ? 0 : 1,
                scaleY: isDark ? 0.4 : 1,
              }}
              transition={{
                duration: reduce ? 0 : 0.45,
                delay: isDark ? 0.05 : 0,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            />
          );
        })}

        {/* Sun/moon disc */}
        <motion.circle
          cx="12"
          cy="12"
          r="5.2"
          fill="currentColor"
          initial={{ scale: isDark ? 0.96 : 1 }}
          animate={{ scale: isDark ? 0.96 : 1 }}
          transition={{ duration: reduce ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: "center" }}
        />

        {/* The crescent mask — a circle that covers part of the disc to form the moon.
            In dark mode it sits on top (offset to the upper-right) creating the crescent.
            In light mode it slides away to reveal the full sun. */}
        <motion.circle
          cx="12"
          cy="12"
          r="5.2"
          fill="var(--background)"
          initial={{
            cx: isDark ? 15.2 : 22,
            cy: isDark ? 9.2 : 4,
            opacity: isDark ? 1 : 0,
          }}
          animate={{
            cx: isDark ? 15.2 : 22,
            cy: isDark ? 9.2 : 4,
            opacity: isDark ? 1 : 0,
          }}
          transition={{
            duration: reduce ? 0 : 0.55,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      </motion.svg>
    </button>
  );
}
