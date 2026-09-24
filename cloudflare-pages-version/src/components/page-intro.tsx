
import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  pickInitialImages,
  preloadOne,
  preloadAll,
} from "../lib/hero-images";

/**
 * Minimal page intro — just a progress bar on a clean background.
 * Waits for the two hero images (day + night) to preload, then slides up.
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

    const isPortrait = window.matchMedia("(orientation: portrait)").matches;
    const { day, night } = pickInitialImages(isPortrait);

    preloadAll();
    Promise.race([
      Promise.all([preloadOne(day), preloadOne(night)]),
      new Promise<void>((r) => setTimeout(r, 4000)),
    ]).then(finish);

    const safety = setTimeout(finish, 5000);
    return () => clearTimeout(safety);
  }, []);

  if (reduce) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="intro"
          className="fixed inset-x-0 top-0 z-[200] flex h-[100svh] items-center justify-center bg-background"
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Minimal progress bar — just a thin line that fills */}
          <motion.div
            className="h-px w-32 overflow-hidden rounded-full bg-foreground/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="h-full bg-accent"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{
                duration: 1.2,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
