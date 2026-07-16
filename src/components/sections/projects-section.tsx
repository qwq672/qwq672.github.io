"use client";

import { motion } from "framer-motion";
import { Reveal, SectionHeading, staggerContainer, staggerItem } from "@/components/motion-helpers";
import { projects } from "@/lib/content";
import { ArrowUpRight } from "lucide-react";

export function ProjectsSection() {
  return (
    <section id="projects" className="relative scroll-mt-24 py-24 sm:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeading
          eyebrow="Projects"
          title={
            <>
              在做的小东西<span className="text-accent">.</span>
            </>
          }
          description="不保证做完，但保证在折腾（"
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-10% 0px" }}
          className="mt-12 grid gap-5 md:grid-cols-3"
        >
          {projects.map((p) => (
            <motion.article
              key={p.name}
              variants={staggerItem}
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-border/60 bg-card/70 p-6 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_28px_80px_-40px_var(--glow)]"
            >
              {/* top row */}
              <div className="flex items-start justify-between">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent/25 to-primary/15 text-accent ring-1 ring-accent/20">
                  <p.icon className="h-5.5 w-5.5" strokeWidth={1.8} />
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-[0.7rem] font-medium text-accent">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  {p.status}
                </span>
              </div>

              <div className="mt-5">
                <div className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  {p.tagline}
                </div>
                <h3 className="mt-1.5 flex items-center gap-1.5 font-display text-xl font-semibold text-foreground">
                  {p.name}
                  <ArrowUpRight className="h-4 w-4 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-60" />
                </h3>
                <p className="mt-2.5 text-[0.92rem] leading-relaxed text-muted-foreground">
                  {p.desc}
                </p>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-muted px-2.5 py-1 text-[0.72rem] font-medium text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
        </motion.div>

        <Reveal delay={0.1}>
          <p className="mt-8 text-center text-sm text-muted-foreground">
            还有几个没公开的小玩意儿在偷偷折腾，等差不多了再放出来 awa
          </p>
        </Reveal>
      </div>
    </section>
  );
}
