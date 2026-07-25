/**
 * Build-time data generator for the static (Cloudflare Pages / GitHub Pages)
 * version of qwq672's site.
 *
 * What it does:
 *   1. Reads the *main* project's markdown posts at
 *      /home/z/my-project/content/posts/*.md — parses YAML frontmatter
 *      (title / date / categories / tags / description / icon / order) and
 *      the markdown body, estimates reading time, and writes a JSON array
 *      to src/data/posts.json (sorted newest-first).
 *   2. Scans the main project's /home/z/my-project/public/photos/*.jpg,
 *      writes src/data/photos.json with each file's relative URL. Real
 *      pixel dimensions aren't needed here — the photo wall uses a fixed
 *      CSS Grid with `grid-auto-flow: row dense` so any ratio works; we
 *      assign a deterministic pseudo-ratio per filename so the masonry
 *      layout stays stable between builds.
 *
 * The generated JSON is imported by the SPA at runtime — no server, no
 * fs, no sharp required in production.
 *
 * Run with:  bun run scripts/build-data.ts
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// The main project root (read-only — we never touch it).
const MAIN_PROJECT_ROOT = "/home/z/my-project";
const POSTS_DIR = path.join(MAIN_PROJECT_ROOT, "content", "posts");
const PHOTOS_DIR = path.join(MAIN_PROJECT_ROOT, "public", "photos");

// Output goes inside this project.
const OUT_DIR = path.resolve(__dirname, "..", "src", "data");

interface PostMeta {
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

interface Post extends PostMeta {
  content: string;
}

/** Minimal, safe YAML frontmatter parser (matches main project's lib/posts.ts). */
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
      .replace(/\s+#.*$/, "");

    if (value === "") {
      data[key] = "";
      continue;
    }

    if (
      (typeof value === "string" && value.startsWith('"') && value.endsWith('"')) ||
      (typeof value === "string" && value.startsWith("'") && value.endsWith("'"))
    ) {
      data[key] = (value as string).slice(1, -1);
      continue;
    }

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
  const cnChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
  const enWords = (
    text.replace(/[\u4e00-\u9fa5]/g, " ").match(/[A-Za-z0-9]+/g) || []
  ).length;
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

async function buildPosts(): Promise<Post[]> {
  try {
    const files = await fs.readdir(POSTS_DIR);
    const mdFiles = files.filter((f) => f.endsWith(".md"));
    const posts = await Promise.all(mdFiles.map((f) => readPostFile(toSlug(f))));
    const valid = posts.filter((p): p is Post => p !== null);
    return valid.sort((a, b) =>
      a.date < b.date ? 1 : a.date > b.date ? -1 : 0
    );
  } catch (e) {
    console.warn(
      "[build-data] Could not read posts dir",
      POSTS_DIR,
      e instanceof Error ? e.message : e
    );
    return [];
  }
}

interface PhotoItem {
  src: string;
  ratio: number;
}

async function buildPhotos(): Promise<PhotoItem[]> {
  try {
    const files = await fs.readdir(PHOTOS_DIR);
    const jpgs = files
      .filter((f) => /\.jpe?g$/i.test(f))
      .sort((a, b) => {
        const na = parseInt(a, 10);
        const nb = parseInt(b, 10);
        if (Number.isNaN(na) || Number.isNaN(nb)) return a.localeCompare(b);
        return na - nb;
      });

    // Deterministic pseudo-ratio per filename so the dense grid masonry
    // stays stable between builds (real dimensions require sharp, which we
    // explicitly avoid for the static version). Rotating through a small
    // set of common ratios gives a varied, natural-looking wall.
    const RATIOS = [1.5, 1.33, 0.75, 1.0, 1.78, 0.67, 1.25, 0.8];
    return jpgs.map((f, i) => ({
      // Use a relative URL so it works under any base path (Cloudflare
      // root domain or GitHub Pages /repo/ sub-path).
      src: `./photos/${f}`,
      ratio: RATIOS[i % RATIOS.length],
    }));
  } catch (e) {
    console.warn(
      "[build-data] Could not read photos dir",
      PHOTOS_DIR,
      e instanceof Error ? e.message : e
    );
    return [];
  }
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });

  const [posts, photos] = await Promise.all([buildPosts(), buildPhotos()]);

  const postsJson = JSON.stringify(posts, null, 2);
  const photosJson = JSON.stringify({ photos }, null, 2);

  await fs.writeFile(path.join(OUT_DIR, "posts.json"), postsJson, "utf-8");
  await fs.writeFile(path.join(OUT_DIR, "photos.json"), photosJson, "utf-8");

  console.log(
    `[build-data] Wrote ${posts.length} posts and ${photos.length} photos → ${path.relative(
      process.cwd(),
      OUT_DIR
    )}`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
