"use client";

import { motion } from "framer-motion";
import { Reveal, SectionHeading, staggerContainer, staggerItem } from "@/components/motion-helpers";
import { interests } from "@/lib/content";

/**
 * Interests section — asymmetric layout per v9.0 §0.5.5 ("换构成").
 * First card spans 2 columns (visual anchor), rest are single-column.
 * This breaks the monotonous 3-column grid template feel.
 *
 * Layout: on lg — [big][small] / [small][small][small]
 *         on sm — [big] / [small] / [small]
 *         on xs  — stacked
 */
export function InterestsSection() {
  return (
    <section
      id="interests"
      className="relative scroll-mt-24 border-y border-border/30 py-28 sm:py-32"
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
          {interests.map((item, idx) => {
            // First card: spans 2 columns on lg, becomes the visual anchor
            const isFirst = idx === 0;
            return (
              <motion.article
                key={item.title}
                variants={staggerItem}
                className={`card-premium group relative overflow-hidden rounded-3xl p-6 hover:-translate-y-1 ${
                  isFirst ? "sm:col-span-2 lg:col-span-2" : ""
                }`}
              >
                <div
                  className={`pointer-events-none absolute -right-10 -top-10 rounded-full bg-gradient-to-br ${item.accent} opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100 ${
                    isFirst ? "h-60 w-60" : "h-40 w-40"
                  }`}
                />
                <div className={`relative ${isFirst ? "sm:flex sm:items-start sm:gap-6" : ""}`}>
                  <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-border/60 bg-background/60 text-accent transition-all duration-500 group-hover:scale-110 group-hover:border-accent/40">
                    <item.icon className="h-5.5 w-5.5" strokeWidth={1.7} />
                  </div>
                  <div className={isFirst ? "mt-3 sm:mt-0 sm:flex-1" : ""}>
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-[0.92rem] leading-relaxed text-muted-foreground">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
