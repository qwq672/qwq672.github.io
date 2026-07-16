"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTheme } from "next-themes";
import { ChevronDown } from "lucide-react";

const DAY_IMG = "/bg/day/sunset-terrace.jpg";
const NIGHT_IMG = "/bg/night/cosmic-field.jpg";

export function HeroSection() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  const reduce = useReducedMotion();

  const showNight = mounted ? resolvedTheme === "dark" : true;

  const scrollNext = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
      {/* Background images — crossfade between day/night */}
      <div className="absolute inset-0 -z-10">
        <motion.img
          src={NIGHT_IMG}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
          initial={{ opacity: 1 }}
          animate={{
            opacity: showNight ? 1 : 0,
            scale: reduce ? 1 : showNight ? 1.08 : 1.12,
          }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          fetchPriority="high"
        />
        <motion.img
          src={DAY_IMG}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
          initial={{ opacity: 0 }}
          animate={{
            opacity: showNight ? 0 : 1,
            scale: reduce ? 1 : showNight ? 1.12 : 1.08,
          }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          fetchPriority="high"
        />
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
          <span className="text-gradient">qwq672</span>
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
