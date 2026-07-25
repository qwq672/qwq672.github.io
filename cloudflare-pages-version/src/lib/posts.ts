/**
 * Post types — shared between the build script (which generates
 * `posts.json`) and the runtime (which imports it).
 *
 * Mirrors `lib/posts.ts` from the main Next.js project.
 */
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
