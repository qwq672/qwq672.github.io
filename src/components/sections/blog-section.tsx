"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarDays, Clock, ArrowUpRight, Inbox, Loader2 } from "lucide-react";
import { Reveal, SectionHeading, staggerContainer, staggerItem } from "@/components/motion-helpers";
import { shortDate } from "@/lib/format";
import type { PostMeta } from "@/lib/posts";

export function BlogSection() {
  const [posts, setPosts] = React.useState<PostMeta[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    fetch("/api/posts")
      .then((r) => r.json())
      .then((data: { posts: PostMeta[] }) => {
        if (!cancelled) setPosts(data.posts ?? []);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section
      id="blog"
      className="relative scroll-mt-24 border-y border-border/40 bg-card/20 py-24 sm:py-28"
    >
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeading
          eyebrow="Blog"
          title={
            <>
              随笔 &amp; 笔记<span className="text-accent">.</span>
            </>
          }
          description="一些碎碎念、教程和整理。点开任意一篇就是独立页面，方便收藏和分享。"
        />

        {loading ? (
          <div className="mt-12 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 rounded-3xl border border-border/40 bg-card/40 px-5 py-4 sm:px-7 sm:py-5"
              >
                <div className="hidden h-12 w-24 shrink-0 animate-pulse rounded-xl bg-muted sm:block" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
                </div>
                <div className="h-9 w-9 animate-pulse rounded-full bg-muted" />
              </div>
            ))}
          </div>
        ) : error || posts.length === 0 ? (
          <Reveal>
            <div className="mt-12 flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-border/60 py-20 text-muted-foreground">
              {error ? (
                <Loader2 className="h-7 w-7 animate-spin" />
              ) : (
                <Inbox className="h-8 w-8" />
              )}
              <p>{error ? "加载失败，刷新试试" : "还没有文章呢（"}</p>
            </div>
          </Reveal>
        ) : (
          <motion.ul
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-8% 0px" }}
            className="mt-12 space-y-3"
          >
            {posts.map((post) => (
              <motion.li key={post.slug} variants={staggerItem}>
                <Link
                  href={`/posts/${post.slug}`}
                  className="group flex w-full items-center gap-4 rounded-3xl border border-border/60 bg-card/60 px-5 py-4 text-left backdrop-blur-sm transition-all duration-400 hover:-translate-y-0.5 hover:border-accent/40 hover:bg-card/80 hover:shadow-[0_20px_60px_-32px_var(--glow)] sm:px-7 sm:py-5"
                >
                  {/* Date column */}
                  <div className="hidden w-24 shrink-0 sm:block">
                    <div className="font-display text-sm font-semibold text-foreground">
                      {shortDate(post.date).split(".").slice(1).join("/")}
                    </div>
                    <div className="text-[0.7rem] text-muted-foreground">
                      {shortDate(post.date).split(".")[0]}
                    </div>
                  </div>

                  {/* Main */}
                  <div className="min-w-0 flex-1">
                    <div className="mb-1.5 flex flex-wrap items-center gap-2 sm:hidden">
                      <span className="inline-flex items-center gap-1 text-[0.7rem] text-muted-foreground">
                        <CalendarDays className="h-3 w-3" />
                        {shortDate(post.date)}
                      </span>
                    </div>
                    <h3 className="font-display text-base font-semibold leading-snug text-foreground transition-colors duration-300 group-hover:text-accent sm:text-lg">
                      {post.title}
                    </h3>
                    {post.description && (
                      <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                        {post.description}
                      </p>
                    )}
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      {post.categories.slice(0, 2).map((c) => (
                        <span
                          key={c}
                          className="rounded-full bg-accent/12 px-2 py-0.5 text-[0.7rem] font-medium text-accent"
                        >
                          {c}
                        </span>
                      ))}
                      <span className="inline-flex items-center gap-1 text-[0.72rem] text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {post.readingMinutes} 分钟
                      </span>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="hidden shrink-0 items-center sm:flex">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-all duration-300 group-hover:border-accent/50 group-hover:bg-accent/10 group-hover:text-accent">
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </div>
    </section>
  );
}
