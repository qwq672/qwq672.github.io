"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  FaGithub,
  FaEnvelope,
  FaBilibili,
  type IconType,
} from "react-icons/fa6";
import { ExternalLink } from "lucide-react";
import { Reveal, SectionHeading, staggerContainer, staggerItem } from "@/components/motion-helpers";
import { TeamsIcon } from "@/components/icons/teams-icon";

interface ContactItem {
  label: string;
  handle: string;
  href: string;
  note?: string;
  icon: React.ReactNode;
}

const contacts: ContactItem[] = [
  {
    label: "GitHub",
    handle: "qwq672",
    href: "https://github.com/qwq672",
    icon: <FaGithub />,
    note: "代码都在这，虽然仓库不多（",
  },
  {
    label: "Bilibili",
    handle: "uid 700347223",
    href: "https://space.bilibili.com/700347223",
    icon: <FaBilibili />,
    note: "偶尔搬运或发点视频，成分有点复杂。",
  },
  {
    label: "Email（主）",
    handle: "i@awa.lat",
    href: "mailto:i@awa.lat",
    icon: <FaEnvelope />,
    note: "非节假日建议联系这个。",
  },
  {
    label: "Email（备）",
    handle: "b167963232@163.com",
    href: "mailto:b167963232@163.com",
    icon: <FaEnvelope />,
    note: "主邮箱没回再发这个。",
  },
  {
    label: "Microsoft Teams",
    handle: "聊天邀请",
    href: "https://teams.live.com/l/invite/FEAJU8ZgWxzwQqgjQM?v=g1",
    icon: <TeamsIcon size={20} />,
    note: "没被墙，闲聊可以来这。",
  },
];

export function ContactSection() {
  return (
    <section id="contact" className="relative scroll-mt-24 py-24 sm:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeading
          eyebrow="Contact"
          title={
            <>
              找我聊聊天<span className="text-accent">?</span>
            </>
          }
          description="不限正式话题，闲聊、问问题、分享趣事都可以。不过……请别发骚扰或垃圾信息 qwq"
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-8% 0px" }}
          className="mt-12 grid gap-4 sm:grid-cols-2"
        >
          {contacts.map((s) => (
            <motion.a
              key={s.label}
              href={s.href}
              target={s.href.startsWith("http") ? "_blank" : undefined}
              rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
              variants={staggerItem}
              className="group relative flex items-center gap-4 overflow-hidden rounded-3xl border border-border/60 bg-card/60 p-5 backdrop-blur-sm transition-all duration-400 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-[0_20px_60px_-34px_var(--glow)] sm:p-6"
            >
              <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-accent/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-border/60 bg-background/60 text-xl text-accent transition-all duration-400 group-hover:scale-110 group-hover:border-accent/40">
                {s.icon}
              </div>
              <div className="relative min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-display text-sm font-semibold text-foreground">
                    {s.label}
                  </span>
                  <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <div className="mt-0.5 truncate text-sm text-foreground/80">
                  {s.handle}
                </div>
                {s.note && (
                  <div className="mt-1 text-xs text-muted-foreground line-clamp-1">
                    {s.note}
                  </div>
                )}
              </div>
            </motion.a>
          ))}
        </motion.div>

        <Reveal delay={0.1}>
          <p className="mt-8 text-center text-sm text-muted-foreground">
            手机号和 QQ / 微信因为隐私原因就不公开啦，比较熟的话私聊问我就行 awa
          </p>
        </Reveal>
      </div>
    </section>
  );
}
