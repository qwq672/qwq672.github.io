"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Clock,
  ArrowUpRight,
  Inbox,
  Loader2,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Reveal, SectionHeading } from "@/components/motion-helpers";
import { shortDate } from "@/lib/format";
import type { PostMeta } from "@/lib/posts";
import { cn } from "@/lib/utils";

export function BlogSection() {
  const [posts, setPosts] = React.useState<PostMeta[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  // filter state
  const [query, setQuery] = React.useState("");
  const [activeCat, setActiveCat] = React.useState<string>("全部");

  React.useEffect(() => {
    let cancelled = false;
    fetch("/data/posts.json")
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

  // derive categories from posts
  const categories = React.useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => p.categories.forEach((c) => set.add(c)));
    return ["全部", ...Array.from(set)];
  }, [posts]);

  // filtered list
  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      if (activeCat !== "全部" && !p.categories.includes(activeCat)) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.categories.some((c) => c.toLowerCase().includes(q))
      );
    });
  }, [posts, query, activeCat]);

  // Pagination — page numbers.
  const PAGE_SIZE = 6;
  const [page, setPage] = React.useState(1);
  React.useEffect(() => {
    setPage(1);
  }, [query, activeCat]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Page numbers to display (compact: first, last, current ±1, ellipsis)
  const pageNumbers = React.useMemo(() => {
    const nums: (number | "...")[] = [];
    const add = (n: number | "...") => nums.push(n);
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) add(i);
    } else {
      add(1);
      if (currentPage > 3) add("...");
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        add(i);
      }
      if (currentPage < totalPages - 2) add("...");
      add(totalPages);
    }
    return nums;
  }, [currentPage, totalPages]);

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
          description="碎碎念、教程和整理。点开任意一篇就是独立页面，方便收藏和分享。"
        />

        {/* Search + filter controls */}
        <Reveal className="mt-10">
          <div className="flex flex-col gap-4">
            {/* search */}
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜标题、摘要、标签……"
                aria-label="搜索文章"
                className="w-full rounded-2xl border border-border/60 bg-card/60 py-3 pl-11 pr-10 text-sm text-foreground placeholder:text-muted-foreground backdrop-blur-sm transition-colors focus:border-accent/50 focus:bg-card/80 focus:outline-none"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  aria-label="清除搜索"
                  className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* category chips */}
            {!loading && !error && posts.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setActiveCat(c)}
                    className={cn(
                      "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all",
                      activeCat === c
                        ? "border-accent/40 bg-accent/15 text-accent"
                        : "border-border/50 bg-card/40 text-muted-foreground hover:border-accent/30 hover:text-foreground"
                    )}
                  >
                    {c}
                  </button>
                ))}
                <span className="ml-auto text-xs text-muted-foreground">
                  共 {filtered.length} 篇
                </span>
              </div>
            )}
          </div>
        </Reveal>

        {/* List */}
        {loading ? (
          <div className="mt-8 space-y-3">
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
        ) : error ? (
          <Reveal>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-border/60 py-20 text-muted-foreground">
              <Loader2 className="h-7 w-7 animate-spin" />
              <p>加载失败，刷新试试</p>
            </div>
          </Reveal>
        ) : filtered.length === 0 ? (
          <Reveal>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-border/60 py-20 text-muted-foreground">
              <Inbox className="h-8 w-8" />
              <p>
                {query || activeCat !== "全部"
                  ? "没找到匹配的文章，换个关键词或分类试试"
                  : "还没有文章呢（"}
              </p>
              {(query || activeCat !== "全部") && (
                <button
                  onClick={() => {
                    setQuery("");
                    setActiveCat("全部");
                  }}
                  className="mt-1 rounded-full border border-border/60 px-4 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-accent/40 hover:text-accent"
                >
                  清除筛选
                </button>
              )}
            </div>
          </Reveal>
        ) : (
          <motion.ul
            key={`${query}-${activeCat}`}
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.04 } },
            }}
            className="mt-8 space-y-3"
          >
            {visible.map((post) => (
              <motion.li
                key={post.slug}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
                  },
                }}
              >
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

        {/* Page navigation */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-1.5">
            {/* Prev */}
            <button
              onClick={() => {
                setPage((p) => Math.max(1, p - 1));
                document.getElementById("blog")?.scrollIntoView({ behavior: "smooth" });
              }}
              disabled={currentPage <= 1}
              aria-label="上一页"
              className={cn(
                "inline-flex h-9 w-9 items-center justify-center rounded-full border text-sm transition-all",
                currentPage <= 1
                  ? "cursor-not-allowed border-border/30 text-muted-foreground/30"
                  : "border-border/60 text-muted-foreground hover:border-accent/40 hover:text-accent"
              )}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {/* Page numbers */}
            {pageNumbers.map((n, i) =>
              n === "..." ? (
                <span
                  key={`ellipsis-${i}`}
                  className="px-1 text-sm text-muted-foreground"
                >
                  …
                </span>
              ) : (
                <button
                  key={n}
                  onClick={() => {
                    setPage(n);
                    document.getElementById("blog")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  aria-label={`第 ${n} 页`}
                  className={cn(
                    "inline-flex h-9 min-w-9 items-center justify-center rounded-full border px-2 text-sm font-medium transition-all",
                    n === currentPage
                      ? "border-accent/40 bg-accent/15 text-accent"
                      : "border-border/60 text-muted-foreground hover:border-accent/40 hover:text-foreground"
                  )}
                >
                  {n}
                </button>
              )
            )}

            {/* Next */}
            <button
              onClick={() => {
                setPage((p) => Math.min(totalPages, p + 1));
                document.getElementById("blog")?.scrollIntoView({ behavior: "smooth" });
              }}
              disabled={currentPage >= totalPages}
              aria-label="下一页"
              className={cn(
                "inline-flex h-9 w-9 items-center justify-center rounded-full border text-sm transition-all",
                currentPage >= totalPages
                  ? "cursor-not-allowed border-border/30 text-muted-foreground/30"
                  : "border-border/60 text-muted-foreground hover:border-accent/40 hover:text-accent"
              )}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
