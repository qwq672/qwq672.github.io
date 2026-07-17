"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Loader2, ChevronRight, FileText, Folder } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/motion-helpers";
import { MarkdownView } from "@/components/markdown-view";
import type { DocMeta, Doc, DocSetMeta } from "@/lib/docs";
import { cn } from "@/lib/utils";

export function DocsSection() {
  const [sets, setSets] = React.useState<DocSetMeta[]>([]);
  const [activeProject, setActiveProject] = React.useState<string>("");
  const [activeSlug, setActiveSlug] = React.useState<string>("");
  const [doc, setDoc] = React.useState<Doc | null>(null);
  const [loadingList, setLoadingList] = React.useState(true);
  const [loadingDoc, setLoadingDoc] = React.useState(false);

  // Load all doc sets (project switcher + TOCs come in one request)
  React.useEffect(() => {
    let cancelled = false;
    fetch("/data/doc-sets.json")
      .then((r) => r.json())
      .then((data: { sets: DocSetMeta[] }) => {
        if (cancelled) return;
        const list = data.sets ?? [];
        setSets(list);
        if (list[0]) {
          setActiveProject(list[0].project);
          setActiveSlug(list[0].docs[0]?.slug ?? "");
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingList(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Load active doc when project/slug changes
  React.useEffect(() => {
    if (!activeProject || !activeSlug) return;
    let cancelled = false;
    setLoadingDoc(true);
    setDoc(null);
    fetch(`/data/docs/${encodeURIComponent(activeProject)}/${encodeURIComponent(activeSlug)}.json`)
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
  }, [activeProject, activeSlug]);

  const scrollRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [activeProject, activeSlug]);

  const activeSet = sets.find((s) => s.project === activeProject);
  const hasMultipleSets = sets.length > 1;

  const handleProjectChange = (project: string) => {
    setActiveProject(project);
    const set = sets.find((s) => s.project === project);
    setActiveSlug(set?.docs[0]?.slug ?? "");
  };

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
              项目文档<span className="text-accent">.</span>
            </>
          }
          description="目前只有 LavaArcade 的文档，等其它项目文档写好了会陆续放上来。"
        />

        {/* Project switcher — only shows when >1 set */}
        {hasMultipleSets && (
          <Reveal className="mt-8">
            <div className="flex flex-wrap gap-2">
              {sets.map((s) => (
                <button
                  key={s.project}
                  onClick={() => handleProjectChange(s.project)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all",
                    s.project === activeProject
                      ? "border-accent/40 bg-accent/10 text-foreground"
                      : "border-border/50 bg-card/40 text-muted-foreground hover:border-accent/30 hover:text-foreground"
                  )}
                >
                  <Folder className="h-3.5 w-3.5" />
                  {s.name}
                </button>
              ))}
            </div>
          </Reveal>
        )}

        <div className="mt-12 grid gap-5 md:grid-cols-5">
          {/* Sidebar TOC */}
          <Reveal className="min-w-0 md:col-span-2">
            <div className="md:sticky md:top-24">
              <div className="mb-3 flex items-center gap-2 px-1 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                <BookOpen className="h-3.5 w-3.5" />
                {activeSet ? activeSet.name : "目录"}
                {activeSet && (
                  <span className="ml-auto hidden truncate text-[0.7rem] font-normal normal-case tracking-normal text-muted-foreground/70 md:block">
                    {activeSet.tagline}
                  </span>
                )}
              </div>
              <nav className="flex gap-2 overflow-x-auto pb-1 md:flex-col md:overflow-visible md:pb-0">
                {loadingList
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-11 w-32 shrink-0 animate-pulse rounded-xl bg-muted md:w-full"
                      />
                    ))
                  : (activeSet?.docs ?? []).map((d) => {
                      const isActive = d.slug === activeSlug;
                      return (
                        <button
                          key={d.slug}
                          onClick={() => setActiveSlug(d.slug)}
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
          <Reveal delay={0.08} className="min-w-0 md:col-span-3">
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
                className="styled-scroll max-h-[60vh] overflow-y-auto overflow-x-hidden px-5 py-6 sm:px-8 sm:py-7"
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
                      key={`${activeProject}-${doc.slug}`}
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
