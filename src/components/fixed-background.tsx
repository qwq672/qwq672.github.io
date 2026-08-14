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
 * Fixed background image layer — THE single source of truth for the hero
 * image. It stays fixed in the viewport while content scrolls over it.
 * The hero section is transparent, so this image shows through there too.
 * Content sections use a frosted-glass overlay (.frosted-content) to let
 * this image show through subtly.
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
      {/* Fixed hero image — single source of truth */}
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

      {/* Readability overlay — adapts to theme */}
      <div className="absolute inset-0 bg-background/35 dark:bg-background/50" />
      {/* Top fade + bottom fade for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background/40" />
      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.3) 100%)",
        }}
      />
      {/* 2 soft glows only (more = repaint jank) */}
      <div className="absolute -left-[10%] top-[5%] h-[45vh] w-[45vh] rounded-full bg-accent/6 blur-[100px]" />
      <div className="absolute right-[-8%] top-[50%] h-[40vh] w-[40vh] rounded-full bg-primary/5 blur-[100px]" />
    </div>
  );
}
