"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Reveal, SectionHeading, staggerContainer, staggerItem } from "@/components/motion-helpers";
import { projects } from "@/lib/content";
import { ProjectLogo } from "@/components/project-logo";
import { ArrowUpRight, ExternalLink } from "lucide-react";

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
          description="三个项目进度各不相同，但都在慢慢推（"
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
              {/* glow */}
              <div
                className={`pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-gradient-to-br ${p.accent} opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100`}
              />

              {/* top row: logo + status */}
              <div className="relative flex items-start justify-between">
                <div className="inline-flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-border/60 bg-background/60 p-2.5 text-accent ring-1 ring-accent/10 transition-all duration-500 group-hover:scale-105 group-hover:ring-accent/30">
                  <ProjectLogo
                    src={p.logo.src}
                    kind={p.logo.kind}
                    alt={`${p.name} logo`}
                    className="h-full w-full [&_svg]:h-full [&_svg]:w-full"
                  />
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-[0.7rem] font-medium text-accent">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  {p.status}
                </span>
              </div>

              {/* title */}
              <div className="relative mt-5">
                <div className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  {p.tagline}
                </div>
                <h3 className="mt-1.5 font-display text-xl font-semibold text-foreground">
                  {p.name}
                </h3>
                <p className="mt-2.5 text-[0.92rem] leading-relaxed text-muted-foreground">
                  {p.desc}
                </p>
              </div>

              {/* tags */}
              <div className="relative mt-5 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-muted px-2.5 py-1 text-[0.72rem] font-medium text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* website link */}
              <div className="relative mt-auto pt-5">
                <Link
                  href={p.website.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-all hover:gap-2"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  {p.website.label}
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-70" />
                </Link>
              </div>
            </motion.article>
          ))}
        </motion.div>

        <Reveal delay={0.1}>
          <p className="mt-8 text-center text-sm text-muted-foreground">
            LavaArcade 有专门文档，往下翻翻就能看到 awa
          </p>
        </Reveal>
      </div>
    </section>
  );
}
