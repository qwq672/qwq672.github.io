"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Loader2, ChevronRight, FileText } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/motion-helpers";
import { MarkdownView } from "@/components/markdown-view";
import type { DocMeta, Doc } from "@/lib/docs";
import { cn } from "@/lib/utils";

export function DocsSection() {
  const [docs, setDocs] = React.useState<DocMeta[]>([]);
  const [active, setActive] = React.useState<string>("");
  const [doc, setDoc] = React.useState<Doc | null>(null);
  const [loadingList, setLoadingList] = React.useState(true);
  const [loadingDoc, setLoadingDoc] = React.useState(false);

  // Load TOC
  React.useEffect(() => {
    let cancelled = false;
    fetch("/api/docs")
      .then((r) => r.json())
      .then((data: { docs: DocMeta[] }) => {
        if (cancelled) return;
        const list = data.docs ?? [];
        setDocs(list);
        if (list[0]) setActive(list[0].slug);
      })
      .finally(() => {
        if (!cancelled) setLoadingList(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Load active doc
  React.useEffect(() => {
    if (!active) return;
    let cancelled = false;
    setLoadingDoc(true);
    setDoc(null);
    fetch(`/api/docs/${encodeURIComponent(active)}`)
      .then((r) => r.json())
      .then((data: { doc: Doc }) => {
        if (!cancelled) setDoc(data.doc);
      })
      .finally(() => {
        if (!cancelled) setLoadingDoc(false);
      });
    return () => {
      cancelled = true;
    };
  }, [active]);

  const scrollRef = React.useRef<HTMLDivElement>(null);
  // Reset scroll when doc changes
  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [active]);

  return (
    <section
      id="docs"
      className="relative scroll-mt-24 border-y border-border/40 bg-card/20 py-24 sm:py-28"
    >
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeading
          eyebrow="Docs"
          title={
            <>
              LavaArcade 文档<span className="text-accent">.</span>
            </>
          }
          description="模组还在开发中，先把已有的文档放出来预览，后续会持续补充。"
        />

        <div className="mt-12 grid gap-5 md:grid-cols-5">
          {/* Sidebar TOC */}
          <Reveal className="md:col-span-2">
            <div className="md:sticky md:top-24">
              <div className="mb-3 flex items-center gap-2 px-1 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                <BookOpen className="h-3.5 w-3.5" />
                目录
              </div>
              <nav className="flex gap-2 overflow-x-auto pb-1 md:flex-col md:overflow-visible md:pb-0">
                {loadingList
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-11 w-32 shrink-0 animate-pulse rounded-xl bg-muted md:w-full"
                      />
                    ))
                  : docs.map((d) => {
                      const isActive = d.slug === active;
                      return (
                        <button
                          key={d.slug}
                          onClick={() => setActive(d.slug)}
                          className={cn(
                            "group flex shrink-0 items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all duration-300 md:w-full",
                            isActive
                              ? "border-accent/40 bg-accent/10 text-foreground shadow-[0_10px_40px_-24px_var(--glow)]"
                              : "border-border/50 bg-card/40 text-muted-foreground hover:border-accent/30 hover:bg-card/70 hover:text-foreground"
                          )}
                        >
                          <span
                            className={cn(
                              "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[0.7rem] font-bold transition-colors",
                              isActive
                                ? "bg-accent text-accent-foreground"
                                : "bg-muted text-muted-foreground group-hover:bg-accent/15 group-hover:text-accent"
                            )}
                          >
                            {d.order + 1}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium">
                              {d.title}
                            </span>
                            <span className="hidden truncate text-[0.72rem] text-muted-foreground md:block">
                              {d.description}
                            </span>
                          </span>
                          <ChevronRight
                            className={cn(
                              "hidden h-4 w-4 shrink-0 transition-all md:block",
                              isActive
                                ? "text-accent opacity-100"
                                : "opacity-0 group-hover:opacity-60"
                            )}
                          />
                        </button>
                      );
                    })}
              </nav>
            </div>
          </Reveal>

          {/* Doc content */}
          <Reveal delay={0.08} className="md:col-span-3">
            <div className="relative min-h-[50vh] overflow-hidden rounded-3xl border border-border/60 bg-background/60 backdrop-blur-sm">
              {/* top bar */}
              <div className="flex items-center justify-between border-b border-border/50 px-5 py-3.5 sm:px-7">
                <div className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4 shrink-0 text-accent" />
                  <span className="truncate font-medium text-foreground">
                    {doc?.title ?? (loadingList ? "加载中…" : "选择一篇文档")}
                  </span>
                </div>
                {doc?.description && (
                  <span className="hidden truncate text-xs text-muted-foreground sm:block">
                    {doc.description}
                  </span>
                )}
              </div>

              <div
                ref={scrollRef}
                className="styled-scroll max-h-[60vh] overflow-y-auto px-5 py-6 sm:px-8 sm:py-7"
              >
                <AnimatePresence mode="wait">
                  {loadingDoc || !doc ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center justify-center gap-2 py-20 text-muted-foreground"
                    >
                      <Loader2 className="h-5 w-5 animate-spin" />
                      加载中…
                    </motion.div>
                  ) : (
                    <motion.div
                      key={doc.slug}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <MarkdownView content={doc.content} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
