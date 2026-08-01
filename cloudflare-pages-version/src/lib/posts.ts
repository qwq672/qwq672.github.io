/**
 * Post data layer for the static site.
 *
 * Posts are baked into src/data/posts.json at build time by
 * scripts/build-data.ts. We import the JSON directly so it's bundled
 * into the JS (no runtime fetch needed).
 */
import postsData from "@/data/posts.json";

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  categories: string[];
  tags: string[];
  description: string;
  icon?: string;
  order?: number;
  readingMinutes: number;
}

export interface Post extends PostMeta {
  content: string;
}

const ALL_POSTS = postsData as Post[];

/** All posts (newest first), with content stripped for list views. */
export function getAllPosts(): PostMeta[] {
  return ALL_POSTS.map(({ content: _content, ...meta }) => meta);
}

/** Get a single post by slug (with content). Returns null if not found. */
export function getPost(slug: string): Post | null {
  return ALL_POSTS.find((p) => p.slug === slug) ?? null;
}

/** Get prev (newer) and next (older) posts for nav. */
export function getAdjacentPosts(slug: string): {
  prev: PostMeta | null;
  next: PostMeta | null;
} {
  const idx = ALL_POSTS.findIndex((p) => p.slug === slug);
  if (idx === -1) return { prev: null, next: null };
  const prev = idx > 0 ? ALL_POSTS[idx - 1] : null;
  const next =
    idx >= 0 && idx < ALL_POSTS.length - 1 ? ALL_POSTS[idx + 1] : null;
  // strip content for meta-only use
  const strip = (p: Post | null): PostMeta | null =>
    p ? (({ content: _c, ...m }) => m)(p) : null;
  return { prev: strip(prev), next: strip(next) };
}
