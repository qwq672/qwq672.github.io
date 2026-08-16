"use client";

import * as React from "react";
import { useTheme } from "next-themes";

/**
 * Theme toggle with sun↔moon morph using the user-provided SVG paths.
 *
 * - Sun: icons8 sun icon (viewBox 0 0 30 30)
 * - Moon: Font Awesome moon (viewBox 0 0 384 512), tilted -15° for style
 *
 * Both icons cross-fade + scale + rotate on toggle. Pure CSS transitions
 * with GPU-friendly properties (opacity, transform) for smoothness.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const isDark = mounted ? resolvedTheme === "dark" : true;

  const toggle = React.useCallback(() => {
    setTheme(isDark ? "light" : "dark");
  }, [isDark, setTheme]);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "切换到亮色模式" : "切换到深色模式"}
      title={isDark ? "切换到亮色模式" : "切换到深色模式"}
      className={`group relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-background/40 text-foreground/80 transition-colors duration-300 hover:border-accent/50 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 ${className ?? ""}`}
    >
      {/* Sun icon — visible in light mode */}
      <svg
        className="theme-sun-icon"
        width="22"
        height="22"
        viewBox="0 0 30 30"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: "absolute",
          opacity: isDark ? 0 : 1,
          transform: isDark ? "scale(0.4) rotate(-120deg)" : "scale(1) rotate(0deg)",
          transition: "opacity 0.45s cubic-bezier(0.4,0,0.2,1), transform 0.45s cubic-bezier(0.4,0,0.2,1)",
          willChange: "opacity, transform",
        }}
      >
        <path d="M 14.984375 0.98632812 A 1.0001 1.0001 0 0 0 14 2 L 14 5 A 1.0001 1.0001 0 1 0 16 5 L 16 2 A 1.0001 1.0001 0 0 0 14.984375 0.98632812 z M 5.796875 4.7988281 A 1.0001 1.0001 0 0 0 5.1015625 6.515625 L 7.2226562 8.6367188 A 1.0001 1.0001 0 1 0 8.6367188 7.2226562 L 6.515625 5.1015625 A 1.0001 1.0001 0 0 0 5.796875 4.7988281 z M 24.171875 4.7988281 A 1.0001 1.0001 0 0 0 23.484375 5.1015625 L 21.363281 7.2226562 A 1.0001 1.0001 0 1 0 22.777344 8.6367188 L 24.898438 6.515625 A 1.0001 1.0001 0 0 0 24.171875 4.7988281 z M 15 8 A 7 7 0 0 0 8 15 A 7 7 0 0 0 15 22 A 7 7 0 0 0 22 15 A 7 7 0 0 0 15 8 z M 2 14 A 1.0001 1.0001 0 1 0 2 16 L 5 16 A 1.0001 1.0001 0 1 0 5 14 L 2 14 z M 25 14 A 1.0001 1.0001 0 1 0 25 16 L 28 16 A 1.0001 1.0001 0 1 0 28 14 L 25 14 z M 7.9101562 21.060547 A 1.0001 1.0001 0 0 0 7.2226562 21.363281 L 5.1015625 23.484375 A 1.0001 1.0001 0 1 0 6.515625 24.898438 L 8.6367188 22.777344 A 1.0001 1.0001 0 0 0 7.9101562 21.060547 z M 22.060547 21.060547 A 1.0001 1.0001 0 0 0 21.363281 22.777344 L 23.484375 24.898438 A 1.0001 1.0001 0 1 0 24.898438 23.484375 L 22.777344 21.363281 A 1.0001 1.0001 0 0 0 22.060547 21.060547 z M 14.984375 23.986328 A 1.0001 1.0001 0 0 0 14 25 L 14 28 A 1.0001 1.0001 0 1 0 16 28 L 16 25 A 1.0001 1.0001 0 0 0 14.984375 23.986328 z" />
      </svg>

      {/* Moon icon — visible in dark mode, tilted -15° for style */}
      <svg
        className="theme-moon-icon"
        width="18"
        height="18"
        viewBox="0 0 384 512"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: "absolute",
          opacity: isDark ? 1 : 0,
          transform: isDark
            ? "scale(1) rotate(-15deg)"
            : "scale(0.4) rotate(105deg)",
          transition: "opacity 0.45s cubic-bezier(0.4,0,0.2,1), transform 0.45s cubic-bezier(0.4,0,0.2,1)",
          willChange: "opacity, transform",
        }}
      >
        <path d="M223.5 32C100 32 0 132.3 0 256S100 480 223.5 480c60.6 0 115.5-24.2 155.8-63.4c5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6c-96.9 0-175.5-78.8-175.5-176c0-65.8 36-123.1 89.3-153.3c6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z" />
      </svg>
    </button>
  );
}
