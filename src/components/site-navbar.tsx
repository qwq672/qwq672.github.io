"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { navLinks } from "@/lib/content";
import { ThemeToggle } from "@/components/theme-toggle";
import { MenuIcon } from "@/components/menu-icon";
import { cn } from "@/lib/utils";

export function SiteNavbar() {
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState<string>("");
  const [hidden, setHidden] = React.useState(false);

  // Scroll handler: scrolled state + hide-on-scroll-down/show-on-scroll-up
  React.useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;
    let lastActive = "";

    const update = () => {
      const y = window.scrollY;
      setScrolled(y > 24);

      if (y > 200) {
        if (y > lastY + 6 && !open) {
          setHidden(true);
        } else if (y < lastY - 6) {
          setHidden(false);
        }
      } else {
        setHidden(false);
      }
      lastY = y;

      const target = y + 140;
      let best: { id: string; dist: number } | null = null;
      for (const link of navLinks) {
        const el = document.getElementById(link.href.slice(1));
        if (!el) continue;
        const top = el.offsetTop;
        const bottom = top + el.offsetHeight;
        if (bottom < target) continue;
        const dist = Math.abs(top - target);
        if (!best || dist < best.dist) {
          best = { id: link.href, dist };
        }
      }
      const next = best?.id ?? "";
      if (next && next !== lastActive) {
        lastActive = next;
        setActive(next);
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  // Lock body scroll when mobile menu open
  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Esc to close mobile menu
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const handleNav = (href: string) => {
    setOpen(false);
    setHidden(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:px-5 sm:pt-4"
        style={{
          transform: hidden && !open ? "translateY(-130%)" : "translateY(0)",
          transition: "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <nav
          className={cn(
            "flex w-full max-w-5xl items-center justify-between rounded-2xl border px-4 py-2.5 transition-all duration-500 sm:px-5",
            scrolled
              ? "glass border-border/50 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.25)]"
              : "border-transparent bg-transparent"
          )}
        >
          {/* Logo */}
          <button
            onClick={() => {
              setHidden(false);
              setOpen(false);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="group flex items-center gap-2.5"
            aria-label="回到顶部"
          >
            <span className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-primary text-[0.7rem] font-bold text-primary-foreground shadow-lg shadow-accent/20 transition-transform duration-300 group-hover:scale-105">
              672
            </span>
            <span className="font-display text-[0.95rem] font-semibold tracking-tight text-foreground">
              qwq672
            </span>
          </button>

          {/* Desktop links */}
          <div className="hidden items-center gap-0.5 md:flex">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNav(link.href)}
                className={cn(
                  "relative rounded-full px-3.5 py-1.5 text-[0.85rem] font-medium transition-colors duration-300",
                  active === link.href
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {active === link.href && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 -z-10 rounded-full bg-accent/15 ring-1 ring-accent/25"
                    transition={{ type: "spring", stiffness: 520, damping: 38 }}
                  />
                )}
                {link.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {/* Mobile menu button — morphs to X */}
            <button
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/60 text-foreground/80 transition-colors hover:text-accent md:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "关闭菜单" : "打开菜单"}
              aria-expanded={open}
            >
              <MenuIcon open={open} />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Full-screen mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.3 }}
          >
            {/* backdrop */}
            <motion.div
              className="absolute inset-0 bg-background/95 backdrop-blur-2xl"
              initial={{ clipPath: "circle(0% at 100% 0%)" }}
              animate={{ clipPath: "circle(150% at 100% 0%)" }}
              exit={{ clipPath: "circle(0% at 100% 0%)" }}
              transition={{ duration: reduce ? 0 : 0.5, ease: [0.76, 0, 0.24, 1] }}
            />
            {/* ambient glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 overflow-hidden"
            >
              <div className="absolute -left-[10%] top-[10%] h-[40vh] w-[40vh] rounded-full bg-accent/15 blur-[100px]" />
              <div className="absolute right-[-10%] bottom-[10%] h-[35vh] w-[35vh] rounded-full bg-primary/15 blur-[100px]" />
            </div>

            {/* nav links */}
            <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-2 px-8">
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.href}
                  onClick={() => handleNav(link.href)}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{
                    duration: reduce ? 0 : 0.4,
                    delay: reduce ? 0 : 0.1 + i * 0.06,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={cn(
                    "group relative flex w-full max-w-xs items-center justify-between rounded-2xl px-6 py-4 text-left transition-colors",
                    active === link.href
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span className="font-display text-2xl font-semibold tracking-tight">
                    {link.label}
                  </span>
                  <span
                    className={cn(
                      "font-mono text-xs tabular-nums transition-colors",
                      active === link.href ? "text-accent" : "text-muted-foreground/50"
                    )}
                  >
                    0{i + 1}
                  </span>
                  {active === link.href && (
                    <motion.span
                      layoutId="mobile-nav-active"
                      className="absolute inset-0 -z-10 rounded-2xl border border-accent/30 bg-accent/10"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>

            {/* footer hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: reduce ? 0 : 0.4, duration: reduce ? 0 : 0.4 }}
              className="relative z-10 px-8 pb-10 text-center text-xs text-muted-foreground"
            >
              点按任意项跳转 · 或按 Esc 关闭
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
