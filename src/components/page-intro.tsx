"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  pickInitialImages,
  preloadOne,
  getDayPool,
  getNightPool,
  preloadAll,
} from "@/lib/hero-images";

/**
 * Page intro overlay.
 * Picks one day + one night hero image, waits for both to load (with a
 * 4s timeout fallback), then reveals the page by sliding the curtain up.
 * The picked images are stored so HeroSection uses them as initial images.
 */
export function PageIntro() {
  const reduce = useReducedMotion();
  const [show, setShow] = React.useState(true);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("__intro_seen") === "1") {
      setShow(false);
      return;
    }

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      sessionStorage.setItem("__intro_seen", "1");
      setShow(false);
    };

    // Pick initial images based on viewport
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const { day, night } = pickInitialImages(isMobile);

    // Preload both picked images + all others (for later switches)
    preloadAll();
    Promise.race([
      Promise.all([preloadOne(day), preloadOne(night)]),
      new Promise<void>((r) => setTimeout(r, 4000)), // timeout fallback
    ]).then(finish);

    // Safety: force finish after 5s no matter what
    const safety = setTimeout(finish, 5000);
    return () => clearTimeout(safety);
  }, []);

  if (reduce) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[200] flex items-center justify-center bg-background"
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
        >
          <IntroMark />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function IntroMark() {
  const reduce = useReducedMotion();
  return (
    <div className="relative flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        <motion.span
          className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-primary font-display text-base font-bold text-primary-foreground shadow-2xl shadow-accent/30"
          animate={reduce ? undefined : { y: [0, -6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          672
        </motion.span>
        <motion.span
          className="absolute inset-0 -z-10 rounded-2xl bg-accent/40 blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.6, 0.3] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Loading bar */}
      <motion.div
        className="mt-7 h-px overflow-hidden rounded-full bg-foreground/10"
        initial={{ width: 0 }}
        animate={{ width: 120 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <motion.div
          className="h-full bg-accent"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{
            duration: 1.2,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      <motion.span
        className="mt-4 text-[0.7rem] font-medium uppercase tracking-[0.3em] text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.5 }}
      >
        loading
      </motion.span>
    </div>
  );
}
