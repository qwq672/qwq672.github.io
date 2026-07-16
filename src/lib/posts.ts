import { promises as fs } from "fs";
import path from "path";

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

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

/** Minimal, safe YAML frontmatter parser for the subset we use. */
function parseFrontmatter(raw: string): {
  data: Record<string, unknown>;
  content: string;
} {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw);
  if (!match) return { data: {}, content: raw };

  const fmRaw = match[1];
  const content = match[2];
  const data: Record<string, unknown> = {};

  for (const line of fmRaw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const colon = trimmed.indexOf(":");
    if (colon === -1) continue;
    const key = trimmed.slice(0, colon).trim();
    let value: unknown = trimmed
      .slice(colon + 1)
      .trim()
      // strip inline comments after a value (only when preceded by space)
      .replace(/\s+#.*$/, "");

    if (value === "") {
      data[key] = "";
      continue;
    }

    // quoted string
    if (
      (typeof value === "string" && value.startsWith('"') && value.endsWith('"')) ||
      (typeof value === "string" && value.startsWith("'") && value.endsWith("'"))
    ) {
      data[key] = (value as string).slice(1, -1);
      continue;
    }

    // inline array: [a, b, c]
    if (typeof value === "string" && value.startsWith("[") && value.endsWith("]")) {
      const inner = value.slice(1, -1).trim();
      if (inner === "") {
        data[key] = [];
      } else {
        data[key] = inner
          .split(",")
          .map((s) => s.trim().replace(/^["']|["']$/g, ""))
          .filter(Boolean);
      }
      continue;
    }

    data[key] = value;
  }

  return { data, content };
}

function toSlug(fileName: string): string {
  return fileName.replace(/\.md$/i, "");
}

function estimateReadingMinutes(text: string): number {
  // Mixed CN/EN: ~400 chars/min for CN, count words for EN.
  const cnChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
  const enWords = (text.replace(/[\u4e00-\u9fa5]/g, " ").match(/[A-Za-z0-9]+/g) || []).length;
  const minutes = cnChars / 400 + enWords / 220;
  return Math.max(1, Math.round(minutes));
}

function normalizeMeta(
  slug: string,
  data: Record<string, unknown>,
  content: string
): PostMeta {
  const asArr = (v: unknown): string[] => {
    if (Array.isArray(v)) return v.map(String);
    if (typeof v === "string") {
      // tolerate "a, b" or "a b"
      return v
        .split(/[,\s]+/)
        .map((s) => s.trim())
        .filter(Boolean);
    }
    return [];
  };
  return {
    slug,
    title: String(data.title ?? slug),
    date: String(data.date ?? ""),
    categories: asArr(data.categories),
    tags: asArr(data.tags),
    description: String(data.description ?? ""),
    icon: typeof data.icon === "string" ? data.icon : undefined,
    order: typeof data.order === "number" ? data.order : undefined,
    readingMinutes: estimateReadingMinutes(content),
  };
}

async function readPostFile(slug: string): Promise<Post | null> {
  try {
    const filePath = path.join(POSTS_DIR, `${slug}.md`);
    const raw = await fs.readFile(filePath, "utf-8");
    const { data, content } = parseFrontmatter(raw);
    return { ...normalizeMeta(slug, data, content), content };
  } catch {
    return null;
  }
}

export async function getAllPosts(): Promise<PostMeta[]> {
  try {
    const files = await fs.readdir(POSTS_DIR);
    const mdFiles = files.filter((f) => f.endsWith(".md"));
    const posts = await Promise.all(mdFiles.map((f) => readPostFile(toSlug(f))));
    const valid = posts.filter((p): p is Post => p !== null);
    // newest first; posts without a date go to the end
    return valid
      .map(({ content, ...meta }) => meta)
      .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  } catch {
    return [];
  }
}

export async function getPost(slug: string): Promise<Post | null> {
  return readPostFile(slug);
}
