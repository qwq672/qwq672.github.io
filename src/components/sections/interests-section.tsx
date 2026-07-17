"use client";

import { motion } from "framer-motion";
import { Reveal, SectionHeading, staggerContainer, staggerItem } from "@/components/motion-helpers";
import { interests } from "@/lib/content";

export function InterestsSection() {
  return (
    <section
      id="interests"
      className="relative scroll-mt-24 border-y border-border/40 bg-card/20 py-24 sm:py-28"
    >
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeading
          eyebrow="Interests"
          title={
            <>
              都在玩点啥<span className="text-accent">?</span>
            </>
          }
          description="游戏、老设备、代码、音乐、复古……东一点西一点，凑一起就是现在的我。"
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-10% 0px" }}
          className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {interests.map((item) => (
            <motion.article
              key={item.title}
              variants={staggerItem}
              className="group relative overflow-hidden rounded-3xl border border-border/60 bg-card/70 p-6 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_24px_70px_-36px_var(--glow)]"
            >
              {/* glow */}
              <div
                className={`pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br ${item.accent} opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100`}
              />
              <div className="relative">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-border/60 bg-background/60 text-accent transition-all duration-500 group-hover:scale-110 group-hover:border-accent/40">
                  <item.icon className="h-5.5 w-5.5" strokeWidth={1.7} />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-[0.92rem] leading-relaxed text-muted-foreground">
                  {item.desc}
                </p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
