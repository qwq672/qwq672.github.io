/**
 * Static post data — generated at build time by `scripts/build-data.ts`
 * and bundled into the SPA. No server / fs access at runtime.
 *
 * Importing JSON directly works in Vite (it's resolved as a module).
 */
import postsData from "@/data/posts.json";
import type { Post, PostMeta } from "@/lib/posts";

export const allPosts: Post[] = postsData as Post[];

/** Post list (no body), newest-first — same shape the main API returned. */
export const postList: PostMeta[] = allPosts.map(({ content: _content, ...meta }) => meta);

/** Lookup a single post by slug. Returns null if not found. */
export function getPost(slug: string): Post | null {
  return allPosts.find((p) => p.slug === slug) ?? null;
}

/** Prev (newer) + next (older) posts, matching the main site's nav logic. */
export function getAdjacentPosts(slug: string): {
  prev: PostMeta | null;
  next: PostMeta | null;
} {
  const idx = allPosts.findIndex((p) => p.slug === slug);
  if (idx === -1) return { prev: null, next: null };
  const prev = idx > 0 ? allPosts[idx - 1] : null;
  const next =
    idx >= 0 && idx < allPosts.length - 1 ? allPosts[idx + 1] : null;
  return { prev, next };
}
