"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import {
  getDayPool,
  getNightPool,
  pickRandom,
  getStoredImages,
} from "@/lib/hero-images";

/**
 * Fixed background image layer that stays in place while content scrolls
 * over it. The hero section's own image sits on top of this (same image),
 * creating a seamless "from where it came, to where it goes" effect:
 * the hero image is both the hero AND the site-wide backdrop.
 *
 * Content sections use frosted-glass backgrounds to let this show through.
 */
export function FixedBackground() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const showNight = mounted ? resolvedTheme === "dark" : true;

  const [isPortrait, setIsPortrait] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(orientation: portrait)");
    const update = () => setIsPortrait(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const dayPool = isPortrait ? getDayPool(true) : getDayPool(false);
  const nightPool = isPortrait ? getNightPool(true) : getNightPool(false);

  const [dayImg, setDayImg] = React.useState<string | null>(null);
  const [nightImg, setNightImg] = React.useState<string | null>(null);
  React.useEffect(() => {
    const stored = getStoredImages();
    setDayImg(stored.day ?? pickRandom(dayPool));
    setNightImg(stored.night ?? pickRandom(nightPool));
  }, [isPortrait]);

  const currentImg = showNight ? nightImg : dayImg;

  const prevThemeRef = React.useRef(showNight);
  React.useEffect(() => {
    if (!mounted) return;
    if (prevThemeRef.current !== showNight) {
      prevThemeRef.current = showNight;
      if (showNight) {
        setNightImg((prev) => pickRandom(nightPool, prev ?? undefined));
      } else {
        setDayImg((prev) => pickRandom(dayPool, prev ?? undefined));
      }
    }
  }, [showNight, mounted, nightPool, dayPool]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-20 overflow-hidden"
    >
      {/* Fixed hero image — stays in place while content scrolls */}
      <AnimatePresence>
        {currentImg && (
          <motion.img
            key={currentImg}
            src={currentImg}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            style={{ willChange: "opacity" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            fetchPriority="high"
          />
        )}
      </AnimatePresence>

      {/* Readability overlay — heavier than hero's own, since this shows
          through frosted glass. Adapts to theme. */}
      <div className="absolute inset-0 bg-background/40 dark:bg-background/55" />
      {/* Top + bottom fade for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background/60" />
      {/* Subtle vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.3) 100%)",
        }}
      />
      {/* Multi-layer soft glows for atmosphere */}
      <div className="absolute -left-[15%] top-[8%] h-[50vh] w-[50vh] rounded-full bg-accent/8 blur-[140px]" />
      <div className="absolute right-[-12%] top-[45%] h-[45vh] w-[45vh] rounded-full bg-primary/6 blur-[140px]" />
      <div className="absolute left-[30%] top-[90%] h-[40vh] w-[40vh] rounded-full bg-accent/5 blur-[120px]" />
      {/* Fine noise texture */}
      <div
        className="absolute inset-0 opacity-[0.02] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
