import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock,
  ChevronRight,
} from "lucide-react";
import { getAllPosts, getPost } from "@/lib/posts";
import { formatDate } from "@/lib/format";
import { MarkdownView } from "@/components/markdown-view";
import { SiteFooter } from "@/components/site-footer";

export const dynamic = "force-static";

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} · qwq672`,
    description: post.description,
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  // Find prev/next posts (posts are sorted newest-first; "prev" = newer,
  // "next" = older, matching natural reading order)
  const allPosts = await getAllPosts();
  const idx = allPosts.findIndex((p) => p.slug === slug);
  const prevPost = idx > 0 ? allPosts[idx - 1] : null;
  const nextPost = idx >= 0 && idx < allPosts.length - 1 ? allPosts[idx + 1] : null;

  return (
    <div className="relative flex min-h-screen flex-col">
      {/* ambient bg */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-20 overflow-hidden"
      >
        <div className="absolute -left-[20%] top-[5%] h-[45vh] w-[45vh] rounded-full bg-accent/10 blur-[120px]" />
        <div className="absolute right-[-10%] top-[40%] h-[40vh] w-[40vh] rounded-full bg-primary/10 blur-[120px]" />
      </div>

      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-3.5 sm:px-8">
          <Link
            href="/#blog"
            className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
            返回
          </Link>
          <Link
            href="/#top"
            className="flex items-center gap-2 text-sm font-semibold text-foreground"
          >
            <span className="relative h-6 w-6 overflow-hidden rounded-full border border-border/60">
              <img
                src="/avatar.webp"
                alt="qwq672"
                className="h-full w-full object-cover"
              />
            </span>
            <span className="font-display tracking-tight">qwq672</span>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <article className="mx-auto max-w-3xl px-5 pb-20 pt-12 sm:px-8 sm:pt-16">
          {/* Article header */}
          <div className="mb-10 border-b border-border/50 pb-8">
            {/* Author row */}
            <div className="mb-5 flex items-center gap-3">
              <img
                src="/avatar.webp"
                alt="qwq672"
                className="h-10 w-10 rounded-full border border-border/60 object-cover"
              />
              <div className="text-sm">
                <div className="font-semibold text-foreground">qwq672</div>
                <div className="text-xs text-muted-foreground">
                  {formatDate(post.date)} · 约 {post.readingMinutes} 分钟阅读
                </div>
              </div>
            </div>

            <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
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
                {formatDate(post.date)}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                约 {post.readingMinutes} 分钟
              </span>
            </div>
            <h1 className="font-display text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl md:text-[2.6rem]">
              {post.title}
            </h1>
            {post.description && (
              <p className="mt-3 text-base leading-relaxed text-muted-foreground sm:text-lg">
                {post.description}
              </p>
            )}
          </div>

          {/* Article body */}
          <MarkdownView content={post.content} />

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mt-12 flex flex-wrap gap-2 border-t border-border/50 pt-6">
              {post.tags.map((t) => (
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

          {/* Prev / Next navigation */}
          {(prevPost || nextPost) && (
            <nav className="mt-10 grid gap-3 sm:grid-cols-2">
              {prevPost ? (
                <Link
                  href={`/posts/${prevPost.slug}`}
                  className="group flex flex-col gap-1 rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-lg"
                >
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
                    <ArrowLeft className="h-3 w-3" />
                    上一篇
                  </span>
                  <span className="font-display text-sm font-semibold text-foreground transition-colors group-hover:text-accent line-clamp-2">
                    {prevPost.title}
                  </span>
                </Link>
              ) : (
                <div className="hidden sm:block" />
              )}
              {nextPost ? (
                <Link
                  href={`/posts/${nextPost.slug}`}
                  className="group flex flex-col items-end gap-1 rounded-2xl border border-border/60 bg-card/60 p-5 text-right backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-lg"
                >
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
                    下一篇
                    <ArrowRight className="h-3 w-3" />
                  </span>
                  <span className="font-display text-sm font-semibold text-foreground transition-colors group-hover:text-accent line-clamp-2">
                    {nextPost.title}
                  </span>
                </Link>
              ) : (
                <div className="hidden sm:block" />
              )}
            </nav>
          )}

          <div className="mt-10 flex justify-center">
            <Link
              href="/#blog"
              className="group inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-5 py-2.5 text-sm font-medium text-foreground backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-lg"
            >
              <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
              返回随笔列表
            </Link>
          </div>
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}
