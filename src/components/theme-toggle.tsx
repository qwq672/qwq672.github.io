"use client";

import * as React from "react";
import { useTheme } from "next-themes";

/**
 * Theme toggle with a morphing moon↔sun icon.
 *
 * Uses pure CSS transitions (no framer-motion) for buttery-smooth animation:
 * - 8 rays scale/fade via CSS transition on group hover/state
 * - The crescent mask slides via CSS transform
 * - Everything is GPU-composited (transform/opacity only)
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const isDark = mounted ? resolvedTheme === "dark" : true;

  const toggle = React.useCallback(() => {
    setTheme(isDark ? "light" : "dark");
  }, [isDark, setTheme]);

  const rays = Array.from({ length: 8 }, (_, i) => i);

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
        className="theme-icon"
        data-dark={isDark ? "1" : "0"}
      >
        {/* Sun rays — CSS transitions on transform/opacity */}
        {rays.map((i) => {
          const angle = (i * 360) / 8;
          return (
            <rect
              key={i}
              className="theme-ray"
              x="11.25"
              y="1.8"
              width="1.5"
              height="3"
              rx="0.75"
              fill="currentColor"
              transform={`rotate(${angle} 12 12)`}
              style={{
                transformBox: "fill-box",
                transformOrigin: "center",
              }}
            />
          );
        })}

        {/* Sun/moon disc */}
        <circle
          className="theme-disc"
          cx="12"
          cy="12"
          r="5.2"
          fill="currentColor"
          style={{
            transformBox: "fill-box",
            transformOrigin: "center",
          }}
        />

        {/* Crescent mask — slides to form the moon */}
        <circle
          className="theme-mask"
          cx="12"
          cy="12"
          r="5.2"
          fill="var(--background)"
          style={{
            transformBox: "fill-box",
            transformOrigin: "center",
          }}
        />
      </svg>

      <style jsx>{`
        .theme-icon .theme-ray {
          opacity: 0;
          transform: scaleY(0.3);
          transition:
            opacity 0.4s cubic-bezier(0.22, 1, 0.36, 1),
            transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .theme-icon .theme-disc {
          transform: scale(0.96);
          transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .theme-icon .theme-mask {
          opacity: 1;
          transform: translate(3.2px, -2.8px);
          transition:
            opacity 0.45s cubic-bezier(0.22, 1, 0.36, 1),
            transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
        }
        /* Light mode (data-dark="0") → full sun */
        .theme-icon[data-dark="0"] .theme-ray {
          opacity: 1;
          transform: scaleY(1);
        }
        .theme-icon[data-dark="0"] .theme-disc {
          transform: scale(1);
        }
        .theme-icon[data-dark="0"] .theme-mask {
          opacity: 0;
          transform: translate(12px, -10px);
        }
      `}</style>
    </button>
  );
}
