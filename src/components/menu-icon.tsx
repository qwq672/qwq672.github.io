"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Animated hamburger → X icon.
 * Three bars: top & bottom rotate to form the X, middle fades out.
 */
export function MenuIcon({ open }: { open: boolean }) {
  const reduce = useReducedMotion();
  const dur = reduce ? 0 : 0.4;
  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* top bar → rotates 45deg into the X */}
      <motion.line
        x1="2"
        y1="5"
        x2="16"
        y2="5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        initial={{ rotate: 0, y: 0 }}
        animate={{
          rotate: open ? 45 : 0,
          y: open ? 4 : 0,
        }}
        style={{ transformOrigin: "center" } as React.CSSProperties}
        transition={{ duration: dur, ease }}
      />
      {/* middle bar → fades out */}
      <motion.line
        x1="2"
        y1="9"
        x2="16"
        y2="9"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        initial={{ opacity: 1, scaleX: 1 }}
        animate={{
          opacity: open ? 0 : 1,
          scaleX: open ? 0.4 : 1,
        }}
        style={{ transformOrigin: "center" } as React.CSSProperties}
        transition={{ duration: dur, ease }}
      />
      {/* bottom bar → rotates -45deg into the X */}
      <motion.line
        x1="2"
        y1="13"
        x2="16"
        y2="13"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        initial={{ rotate: 0, y: 0 }}
        animate={{
          rotate: open ? -45 : 0,
          y: open ? -4 : 0,
        }}
        style={{ transformOrigin: "center" } as React.CSSProperties}
        transition={{ duration: dur, ease }}
      />
    </svg>
  );
}
