"use client";

import * as React from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { ChevronDown } from "lucide-react";

/**
 * Image pools. Desktop images are 1920x1080 landscape, mobile are 800x1400
 * portrait. The right pool is chosen by viewport width.
 */
const DAY_DESKTOP = [
  "/bg/day/1764535480103.jpg",
  "/bg/day/20251212125216.jpg",
  "/bg/day/IMG_20260712_022434.jpg",
  "/bg/day/IMG_20260712_022557.jpg",
  "/bg/day/IMG_20260712_022635.jpg",
  "/bg/day/IMG_20260717_034250.jpg",
  "/bg/day/bbcc0e10bce0600208eae76d56175c25620521548.jpg",
];
const DAY_MOBILE = [
  "/bg/day-mobile/IMG_20260717_033901.jpg",
  "/bg/day-mobile/IMG_20260717_033954.jpg",
  "/bg/day-mobile/IMG_20260717_034107.jpg",
  "/bg/day-mobile/IMG_20260717_034127.jpg",
  "/bg/day-mobile/IMG_20260717_034422.jpg",
  "/bg/day-mobile/IMG_20260717_034445.jpg",
  "/bg/day-mobile/IMG_20260717_034513.jpg",
  "/bg/day-mobile/IMG_20260717_034539.jpg",
];
const NIGHT_DESKTOP = [
  "/bg/night/1765255232753.jpg",
  "/bg/night/1781673941796.jpg",
  "/bg/night/20251210211750.jpg",
  "/bg/night/45691349_p0.jpg",
  "/bg/night/IMG_20260717_034235.jpg",
];
const NIGHT_MOBILE = [
  "/bg/night-mobile/IMG_20260717_033818.jpg",
  "/bg/night-mobile/IMG_20260717_034216.jpg",
  "/bg/night-mobile/IMG_20260717_034330_edit_111494215253924.jpg",
  "/bg/night-mobile/IMG_20260717_034956.jpg",
];

function pickRandom<T>(pool: T[], avoid?: T): T {
  if (pool.length === 1) return pool[0];
  let next = pool[Math.floor(Math.random() * pool.length)];
  for (let i = 0; i < 5 && next === avoid; i++) {
    next = pool[Math.floor(Math.random() * pool.length)];
  }
  return next;
}

export function HeroSection() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  const reduce = useReducedMotion();

  const showNight = mounted ? resolvedTheme === "dark" : true;

  // Detect mobile by viewport width
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const dayPool = isMobile ? DAY_MOBILE : DAY_DESKTOP;
  const nightPool = isMobile ? NIGHT_MOBILE : NIGHT_DESKTOP;

  const [dayImg, setDayImg] = React.useState<string | null>(null);
  const [nightImg, setNightImg] = React.useState<string | null>(null);

  // Preload all images on mount (both desktop & mobile so theme/viewport
  // changes are instant)
  React.useEffect(() => {
    [...DAY_DESKTOP, ...DAY_MOBILE, ...NIGHT_DESKTOP, ...NIGHT_MOBILE].forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // (Re)pick a random image whenever pool changes (mount + viewport switch).
  // Null until first pick so we don't flash the wrong pool.
  React.useEffect(() => {
    if (!mounted) return;
    setNightImg((prev) => pickRandom(nightPool, prev ?? undefined));
    setDayImg((prev) => pickRandom(dayPool, prev ?? undefined));
  }, [mounted, isMobile]);

  const currentImg = showNight ? nightImg : dayImg;

  // When theme changes, pick a fresh random image
  const prevThemeRef = React.useRef(showNight);
  React.useEffect(() => {
    if (!mounted) return;
    if (prevThemeRef.current !== showNight) {
      prevThemeRef.current = showNight;
      if (showNight) {
        setNightImg((prev) => pickRandom(nightPool, prev));
      } else {
        setDayImg((prev) => pickRandom(dayPool, prev));
      }
    }
  }, [showNight, mounted, nightPool, dayPool]);

  const scrollNext = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
      {/* Background image — pure opacity crossfade (GPU-composited).
          Mobile uses portrait images, desktop uses landscape. */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <AnimatePresence>
          {currentImg && (
            <motion.img
              key={currentImg}
              src={currentImg}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ willChange: "opacity" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              fetchPriority="high"
            />
          )}
        </AnimatePresence>

        {/* Readability overlay — adapts to theme */}
        <div className="absolute inset-0 bg-background/35 dark:bg-background/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background" />
        {/* Subtle vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.25) 100%)",
          }}
        />
      </div>

      {/* Content — removed backdrop-blur from the paragraph which caused the
          weird blurry text background. Only the tag pill keeps a light blur. */}
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 text-center">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-foreground/5 px-4 py-1.5 text-xs font-medium tracking-wide text-foreground/80 backdrop-blur-md"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
          学生 · 老设备折腾者 · 模组作者 · 音乐小白
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-6xl font-bold tracking-tight text-foreground drop-shadow-[0_4px_24px_rgba(0,0,0,0.25)] sm:text-7xl md:text-8xl"
        >
          <span className="text-gradient-animate">qwq672</span>
        </motion.h1>

        {/* No backdrop-blur here — that was causing the blurry text background. */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.52, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-2xl text-base leading-relaxed text-foreground/90 sm:text-lg"
          style={{ textShadow: "0 2px 12px rgba(0,0,0,0.4)" }}
        >
          嗯，你好呀。我是 qwq672，一名学生，平时会玩玩游戏、折腾折腾老设备，
          也写点 Minecraft 模组和 MIDI 重制。这个站就是我的小破站，
          碎碎念和一些笔记都丢在这里啦。
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.66, ease: [0.22, 1, 0.36, 1] }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          <button
            onClick={scrollNext}
            className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background shadow-lg shadow-foreground/20 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-foreground/25 active:scale-95"
          >
            随便逛逛
            <ChevronDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
          </button>
          <a
            href="#blog"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("blog")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="inline-flex items-center gap-2 rounded-full border border-foreground/20 bg-foreground/5 px-6 py-3 text-sm font-semibold text-foreground backdrop-blur-md transition-all duration-300 hover:border-foreground/40 hover:bg-foreground/10"
          >
            看看随笔
          </a>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.button
        onClick={scrollNext}
        aria-label="向下滚动"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.1 }}
        className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2 text-foreground/60 transition-colors hover:text-foreground"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="h-6 w-6" />
        </motion.div>
      </motion.button>
    </section>
  );
}
