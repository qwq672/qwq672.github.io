"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { X, Clock, CalendarDays, ChevronRight, Loader2 } from "lucide-react";
import { shortDate } from "@/lib/format";
import type { Post, PostMeta } from "@/lib/posts";

interface PostDialogProps {
  post: PostMeta | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PostDialog({ post, open, onOpenChange }: PostDialogProps) {
  const [full, setFull] = React.useState<Post | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!open || !post) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    setFull(null);
    fetch(`/api/posts/${encodeURIComponent(post.slug)}`)
      .then(async (r) => {
        if (!r.ok) throw new Error("加载失败");
        const data = (await r.json()) as { post: Post };
        if (cancelled) return;
        setFull(data.post);
      })
      .catch((e) => {
        if (!cancelled) setError(e?.message ?? "加载失败");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, post]);

  // Lock body scroll while open
  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Esc to close
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  return (
    <AnimatePresence onExitComplete={() => setFull(null)}>
      {open && post && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-background/70 backdrop-blur-md"
            onClick={() => onOpenChange(false)}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={post.title}
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl border border-border/60 bg-background shadow-2xl sm:rounded-3xl"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-border/50 px-6 py-5 sm:px-8">
              <div className="min-w-0">
                <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  {post.categories.map((c) => (
                    <span
                      key={c}
                      className="rounded-full bg-accent/12 px-2.5 py-0.5 font-medium text-accent"
                    >
                      {c}
                    </span>
                  ))}
                  <span className="inline-flex items-center gap-1">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {shortDate(post.date)}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {post.readingMinutes} 分钟
                  </span>
                </div>
                <h2 className="font-display text-xl font-bold leading-snug text-foreground sm:text-2xl">
                  {post.title}
                </h2>
                {post.description && (
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    {post.description}
                  </p>
                )}
              </div>
              <button
                onClick={() => onOpenChange(false)}
                aria-label="关闭"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 sm:py-7">
              {loading && (
                <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  加载中…
                </div>
              )}
              {error && !loading && (
                <div className="py-16 text-center text-destructive">{error}</div>
              )}
              {full && !loading && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="prose-warm max-w-none"
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkBreaks]}
                    components={{
                      a: ({ node, ...props }) => (
                        <a target="_blank" rel="noopener noreferrer" {...props} />
                      ),
                      img: ({ node, alt, ...props }) => (
                        <img alt={alt ?? ""} loading="lazy" {...props} />
                      ),
                    }}
                  >
                    {full.content}
                  </ReactMarkdown>
                </motion.div>
              )}
            </div>

            {/* Footer tag rail */}
            {full && full.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 border-t border-border/50 px-6 py-4 sm:px-8">
                {full.tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-0.5 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground"
                  >
                    <ChevronRight className="h-3 w-3" />
                    {t}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
