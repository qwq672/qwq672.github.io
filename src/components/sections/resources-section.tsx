"use client";

import { motion } from "framer-motion";
import { ExternalLink, KeyRound, HardDriveDownload } from "lucide-react";
import { Reveal, SectionHeading, staggerContainer, staggerItem } from "@/components/motion-helpers";
import { resources, resourcePasswordHint } from "@/lib/content";

export function ResourcesSection() {
  return (
    <section id="resources" className="relative scroll-mt-24 py-24 sm:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeading
          eyebrow="Resources"
          title={
            <>
              资源分享<span className="text-accent">.</span>
            </>
          }
          description="老设备复古站、网盘资源合集都在这。有密码的话一般是下面说的那两个。"
        />

        {/* Password hint banner */}
        <Reveal className="mt-8">
          <div className="flex items-start gap-3 rounded-2xl border border-accent/25 bg-accent/8 px-5 py-3.5 text-sm">
            <KeyRound className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            <span className="text-foreground/80">
              <span className="font-medium text-foreground">密码提示：</span>
              {resourcePasswordHint}
            </span>
          </div>
        </Reveal>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-8% 0px" }}
          className="mt-6 grid gap-4 sm:grid-cols-2"
        >
          {resources.map((r) => (
            <motion.a
              key={r.name}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              variants={staggerItem}
              className="group relative flex items-center gap-4 overflow-hidden rounded-3xl border border-border/60 bg-card/60 p-5 backdrop-blur-sm transition-all duration-400 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-[0_20px_60px_-34px_var(--glow)] sm:p-6"
            >
              <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-accent/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-border/60 bg-background/60 text-accent transition-all duration-400 group-hover:scale-110 group-hover:border-accent/40">
                <HardDriveDownload className="h-5 w-5" strokeWidth={1.8} />
              </div>
              <div className="relative min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-display text-sm font-semibold text-foreground">
                    {r.name}
                  </span>
                  {r.badge && (
                    <span className="rounded-full bg-accent/12 px-2 py-0.5 text-[0.65rem] font-medium text-accent">
                      {r.badge}
                    </span>
                  )}
                  <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                  {r.desc}
                </p>
                {r.password && (
                  <div className="mt-1.5 inline-flex items-center gap-1 text-[0.7rem] text-accent/80">
                    <KeyRound className="h-3 w-3" />
                    密码：{r.password}
                  </div>
                )}
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
