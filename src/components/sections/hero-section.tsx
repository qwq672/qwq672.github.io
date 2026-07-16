"use client";

import * as React from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { ChevronDown, RefreshCw } from "lucide-react";

const DAY_IMAGES = [
  "/bg/day/sunset-terrace.jpg",
  "/bg/day/dreamy-birds.jpg",
  "/bg/day/starry-lake.jpg",
];
const NIGHT_IMAGES = [
  "/bg/night/cosmic-field.jpg",
  "/bg/night/lantern-night.jpg",
  "/bg/night/campfire-night.jpg",
];

function pickRandom<T>(pool: T[], avoid?: T): T {
  if (pool.length === 1) return pool[0];
  let next = pool[Math.floor(Math.random() * pool.length)];
  // try to avoid repeating the same image
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
  const pool = showNight ? NIGHT_IMAGES : DAY_IMAGES;

  // Currently displayed image per theme (so switching back doesn't jump)
  const [dayImg, setDayImg] = React.useState(DAY_IMAGES[0]);
  const [nightImg, setNightImg] = React.useState(NIGHT_IMAGES[0]);
  const [refreshing, setRefreshing] = React.useState(false);

  // Preload all images on mount
  React.useEffect(() => {
    [...DAY_IMAGES, ...NIGHT_IMAGES].forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Pick a random image on first mount (per theme)
  React.useEffect(() => {
    if (!mounted) return;
    setNightImg((prev) => (prev === NIGHT_IMAGES[0] ? pickRandom(NIGHT_IMAGES) : prev));
    setDayImg((prev) => (prev === DAY_IMAGES[0] ? pickRandom(DAY_IMAGES) : prev));
  }, [mounted]);

  const currentImg = showNight ? nightImg : dayImg;

  // Manual refresh — pick a new random image from current theme's pool
  const refreshImage = React.useCallback(() => {
    setRefreshing(true);
    if (showNight) {
      setNightImg((prev) => pickRandom(NIGHT_IMAGES, prev));
    } else {
      setDayImg((prev) => pickRandom(DAY_IMAGES, prev));
    }
    setTimeout(() => setRefreshing(false), 500);
  }, [showNight]);

  // When theme changes, pick a fresh random image from the new theme's pool
  const prevThemeRef = React.useRef(showNight);
  React.useEffect(() => {
    if (!mounted) return;
    if (prevThemeRef.current !== showNight) {
      prevThemeRef.current = showNight;
      if (showNight) {
        setNightImg((prev) => pickRandom(NIGHT_IMAGES, prev));
      } else {
        setDayImg((prev) => pickRandom(DAY_IMAGES, prev));
      }
    }
  }, [showNight, mounted]);

  const scrollNext = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
      {/* Background image — single visible layer with AnimatePresence crossfade */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <AnimatePresence mode="sync">
          <motion.img
            key={currentImg}
            src={currentImg}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              scale: reduce ? 1 : 1.06,
            }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
              scale: { duration: 12, ease: "easeOut" },
            }}
            fetchPriority="high"
          />
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

      {/* Manual image refresh button */}
      <button
        onClick={refreshImage}
        aria-label="换张背景图"
        title="换张背景图"
        className="group absolute right-4 top-20 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-foreground/15 bg-foreground/5 text-foreground/70 backdrop-blur-md transition-all duration-300 hover:border-foreground/30 hover:text-foreground sm:top-24"
      >
        <RefreshCw
          className={`h-4 w-4 transition-transform duration-500 ${refreshing ? "rotate-180" : ""}`}
        />
      </button>

      {/* Content */}
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

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.52, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-2xl text-base leading-relaxed text-foreground/85 backdrop-blur-[2px] sm:text-lg"
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
