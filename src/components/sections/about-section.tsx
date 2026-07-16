"use client";

import { Reveal, SectionHeading } from "@/components/motion-helpers";
import { Sparkles } from "lucide-react";

export function AboutSection() {
  return (
    <section id="about" className="relative scroll-mt-24 py-24 sm:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeading
          eyebrow="About"
          title={
            <>
              关于我<span className="text-accent">.</span>
            </>
          }
          description="成分有点复杂，但大概是这样的——"
        />

        <div className="mt-12 grid gap-6 md:grid-cols-5">
          {/* Main bio card with avatar */}
          <Reveal className="md:col-span-3">
            <div className="group relative h-full overflow-hidden rounded-3xl border border-border/60 bg-card/60 p-7 backdrop-blur-sm transition-all duration-500 hover:border-accent/40 hover:shadow-[0_20px_60px_-30px_var(--glow)] sm:p-9">
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent/10 blur-3xl transition-opacity duration-500 group-hover:opacity-150" />
              <div className="relative">
                {/* Avatar + greeting */}
                <div className="mb-6 flex items-center gap-4">
                  <div className="relative shrink-0">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent to-primary opacity-30 blur-md" />
                    <img
                      src="/avatar.webp"
                      alt="qwq672 的头像"
                      width={64}
                      height={64}
                      className="relative h-16 w-16 rounded-full border border-border/60 object-cover shadow-lg"
                    />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                      <Sparkles className="h-3.5 w-3.5" />
                      你好呀
                    </div>
                    <div className="mt-1.5 font-display text-lg font-semibold text-foreground">
                      qwq672
                    </div>
                  </div>
                </div>

                <p className="text-[1.05rem] leading-[1.9] text-foreground/90">
                  我是 <span className="font-semibold text-foreground">qwq672</span>，一名学生。
                  平时喜欢玩玩游戏，也折腾一些老设备，
                  偶尔还会写写 Minecraft 模组和做点 MIDI 重制。
                </p>
                <p className="mt-4 text-[1.05rem] leading-[1.9] text-muted-foreground">
                  爱好比较多但不限于：游戏、老设备折腾、部分复古风格、
                  Minecraft 模组创作、音乐创作……嗯，成分确实蛮复杂的。
                  这个小破站就是把我的碎碎念和笔记都攒在一起，
                  顺便练练手，看看能折腾出什么花样。
                </p>
                <p className="mt-4 text-[1.05rem] leading-[1.9] text-muted-foreground">
                  未来又会多哪些兴趣、失去哪些兴趣，我也说不准（）
                </p>
              </div>
            </div>
          </Reveal>

          {/* Side facts */}
          <div className="flex flex-col gap-6 md:col-span-2">
            <Reveal delay={0.08}>
              <FactCard
                label="所在地"
                value="广东 · 深圳"
                hint="学生党，暂时定居在这"
              />
            </Reveal>
            <Reveal delay={0.16}>
              <FactCard
                label="主要在折腾"
                value="LavaArcade 模组"
                hint="大概是最花时间的项目了"
              />
            </Reveal>
            <Reveal delay={0.24}>
              <FactCard
                label="另一个小破站"
                value="Web 1.0 复古站"
                hint="HTML 3.2 + GB2312，老设备友好"
              />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function FactCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="group h-full rounded-3xl border border-border/60 bg-card/60 p-6 backdrop-blur-sm transition-all duration-500 hover:-translate-y-0.5 hover:border-accent/40">
      <div className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-2 font-display text-xl font-semibold text-foreground">
        {value}
      </div>
      <div className="mt-1.5 text-sm text-muted-foreground">{hint}</div>
    </div>
  );
}
