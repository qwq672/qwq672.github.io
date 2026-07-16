"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { navLinks } from "@/lib/content";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

export function SiteNavbar() {
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

      // Hide/show navbar based on scroll direction (only after some scroll)
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

      // --- Deterministic active-section tracking ---
      // Pick the section whose top is at or just above a target line
      // (a bit below the navbar). Tie-break by closest to the line.
      const target = y + 140;
      let best: { id: string; dist: number } | null = null;
      for (const link of navLinks) {
        const el = document.getElementById(link.href.slice(1));
        if (!el) continue;
        const top = el.offsetTop;
        const bottom = top + el.offsetHeight;
        // section must contain or be below the target line
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

  const handleNav = (href: string) => {
    setOpen(false);
    setHidden(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:px-5 sm:pt-4"
      style={{
        transform: hidden ? "translateY(-130%)" : "translateY(0)",
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
          {/* Mobile menu button */}
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/60 text-foreground/80 transition-colors hover:text-accent md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="菜单"
            aria-expanded={open}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute left-3 right-3 top-[4.5rem] z-50 md:hidden"
          >
            <div className="glass flex flex-col gap-1 rounded-2xl border border-border/50 p-2 shadow-xl">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNav(link.href)}
                  className={cn(
                    "rounded-xl px-4 py-3 text-left text-[0.95rem] font-medium transition-colors",
                    active === link.href
                      ? "bg-accent/15 text-foreground"
                      : "text-muted-foreground hover:bg-accent/10 hover:text-foreground"
                  )}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
