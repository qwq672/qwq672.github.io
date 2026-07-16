"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { CalendarDays, Clock, ArrowUpRight, Inbox } from "lucide-react";
import { Reveal, SectionHeading, staggerContainer, staggerItem } from "@/components/motion-helpers";
import { PostDialog } from "@/components/post-dialog";
import { shortDate } from "@/lib/format";
import type { PostMeta } from "@/lib/posts";

export function BlogSection() {
  const [posts, setPosts] = React.useState<PostMeta[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [active, setActive] = React.useState<PostMeta | null>(null);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    fetch("/api/posts")
      .then((r) => r.json())
      .then((data: { posts: PostMeta[] }) => {
        if (!cancelled) setPosts(data.posts ?? []);
      })
      .catch(() => {
        /* keep empty */
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const openPost = (p: PostMeta) => {
    setActive(p);
    setOpen(true);
  };

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
          description="一些碎碎念、教程和整理。点开任意一篇就能读全文。"
        />

        {loading ? (
          <div className="mt-12 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-28 animate-pulse rounded-3xl border border-border/40 bg-card/40"
              />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <Reveal>
            <div className="mt-12 flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-border/60 py-20 text-muted-foreground">
              <Inbox className="h-8 w-8" />
              <p>还没有文章呢（</p>
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
                <button
                  onClick={() => openPost(post)}
                  className="group flex w-full items-center gap-4 rounded-3xl border border-border/60 bg-card/60 px-5 py-4 text-left backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:bg-card/80 hover:shadow-[0_20px_60px_-32px_var(--glow)] sm:px-7 sm:py-5"
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
                    <h3 className="font-display text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-accent sm:text-lg">
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
                </button>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </div>

      <PostDialog post={active} open={open} onOpenChange={setOpen} />
    </section>
  );
}
