"use client";

import * as React from "react";
import { useTheme } from "next-themes";

/**
 * Theme toggle with a morphing moon↔sun icon.
 *
 * Uses pure CSS transitions (no framer-motion) for buttery-smooth animation.
 * The sun has 8 rays + a disc; in dark mode a mask slides over the disc to
 * form a crescent moon. All animation is GPU-composited (transform/opacity).
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
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: "visible" }}
        className="theme-icon"
        data-dark={isDark ? "1" : "0"}
      >
        {/* Sun rays — longer and slightly thicker for a fuller look */}
        {rays.map((i) => {
          const angle = (i * 360) / 8;
          return (
            <rect
              key={i}
              className="theme-ray"
              x="11"
              y="1.2"
              width="2"
              height="3.6"
              rx="1"
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
          r="5"
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
          r="5"
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
          transform: scaleY(0.2) translateY(-1px);
          transition:
            opacity 0.45s cubic-bezier(0.22, 1, 0.36, 1),
            transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .theme-icon .theme-disc {
          transform: scale(0.92);
          transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .theme-icon .theme-mask {
          opacity: 1;
          transform: translate(3px, -2.6px);
          transition:
            opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1),
            transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
        }
        /* Light mode (data-dark="0") → full sun */
        .theme-icon[data-dark="0"] .theme-ray {
          opacity: 1;
          transform: scaleY(1) translateY(0);
        }
        .theme-icon[data-dark="0"] .theme-disc {
          transform: scale(1);
        }
        .theme-icon[data-dark="0"] .theme-mask {
          opacity: 0;
          transform: translate(13px, -11px);
        }
      `}</style>
    </button>
  );
}
