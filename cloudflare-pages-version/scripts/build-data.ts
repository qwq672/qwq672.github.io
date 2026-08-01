/**
 * Build-time data generator for the static site.
 *
 * Reads markdown posts from content/posts/*.md and emits src/data/posts.json.
 * Scans public/photos/*.jpg, reads each image's dimensions from the JPEG
 * header (pure JS, no sharp dependency), and emits src/data/photos.json.
 *
 * Run via `bun run build:data` (or automatically before `bun run build`).
 */
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

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

interface PhotoItem {
  src: string;
  w: number;
  h: number;
  ratio: number;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const POSTS_DIR = path.join(ROOT, "content", "posts");
const PHOTOS_DIR = path.join(ROOT, "public", "photos");
const OUT_POSTS = path.join(ROOT, "src", "data", "posts.json");
const OUT_PHOTOS = path.join(ROOT, "src", "data", "photos.json");

/* ----------------------------- Markdown ----------------------------- */

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

function estimateReadingMinutes(text: string): number {
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

async function getAllPosts(): Promise<Post[]> {
  try {
    const files = await fs.readdir(POSTS_DIR);
    const mdFiles = files.filter((f) => f.endsWith(".md"));
    const posts = await Promise.all(
      mdFiles.map((f) => readPostFile(f.replace(/\.md$/i, "")))
    );
    const valid = posts.filter((p): p is Post => p !== null);
    // newest first; posts without a date go to the end
    return valid.sort((a, b) =>
      a.date < b.date ? 1 : a.date > b.date ? -1 : 0
    );
  } catch {
    return [];
  }
}

/* ----------------------------- JPEG dims ----------------------------- */

/**
 * Read width/height from a JPEG file by scanning markers for SOF0/SOF1/SOF2.
 * Pure JS, no external deps. Returns null if parsing fails.
 */
async function readJpegSize(filePath: string): Promise<{ w: number; h: number } | null> {
  let handle: fs.FileHandle | null = null;
  try {
    handle = await fs.open(filePath, "r");
    const buf = Buffer.alloc(8);
    // SOI must be FF D8
    await handle.read(buf, 0, 2, 0);
    if (buf[0] !== 0xff || buf[1] !== 0xd8) return null;

    let offset = 2;
    const lenBuf = Buffer.alloc(2);
    const sofBuf = Buffer.alloc(9); // marker(2) + len(2) + precision(1) + h(2) + w(2)

    while (offset < 1024 * 1024) {
      // Read marker (2 bytes: FF xx)
      await handle.read(buf, 0, 2, offset);
      if (buf[0] !== 0xff) return null;
      const marker = buf[1];
      // Standalone markers (no length): RSTn, SOI, EOI, TEM
      if (marker === 0xd8 || marker === 0xd9 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
        offset += 2;
        continue;
      }
      // Read segment length (2 bytes, big-endian, includes itself)
      await handle.read(lenBuf, 0, 2, offset + 2);
      const segLen = (lenBuf[0] << 8) | lenBuf[1];
      if (segLen < 2) return null;

      // SOF markers: C0, C1, C2, C3, C5, C6, C7, C9, CA, CB, CD, CE, CF
      const isSof =
        (marker >= 0xc0 && marker <= 0xc3) ||
        (marker >= 0xc5 && marker <= 0xc7) ||
        (marker >= 0xc9 && marker <= 0xcb) ||
        (marker >= 0xcd && marker <= 0xcf);
      if (isSof) {
        // SOF payload: precision(1) + height(2) + width(2)
        await handle.read(sofBuf, 0, 5, offset + 4);
        const height = (sofBuf[1] << 8) | sofBuf[2];
        const width = (sofBuf[3] << 8) | sofBuf[4];
        if (height > 0 && width > 0) return { w: width, h: height };
        return null;
      }
      offset += 2 + segLen;
    }
    return null;
  } catch {
    return null;
  } finally {
    if (handle) await handle.close();
  }
}

async function getPhotos(): Promise<PhotoItem[]> {
  try {
    const files = (await fs.readdir(PHOTOS_DIR))
      .filter((f) => /\.jpg$/i.test(f))
      .sort((a, b) => {
        const na = parseInt(a, 10);
        const nb = parseInt(b, 10);
        if (Number.isNaN(na) || Number.isNaN(nb)) return a.localeCompare(b);
        return na - nb;
      });

    const photos: PhotoItem[] = [];
    for (const f of files) {
      const full = path.join(PHOTOS_DIR, f);
      const size = await readJpegSize(full);
      const w = size?.w ?? 600;
      const h = size?.h ?? 400;
      photos.push({ src: `photos/${f}`, w, h, ratio: w / h });
    }
    return photos;
  } catch {
    return [];
  }
}

/* ------------------------------- Main ------------------------------- */

async function main() {
  await fs.mkdir(path.dirname(OUT_POSTS), { recursive: true });

  const posts = await getAllPosts();
  await fs.writeFile(OUT_POSTS, JSON.stringify(posts, null, 2), "utf-8");
  console.log(`✓ Wrote ${posts.length} posts → ${path.relative(ROOT, OUT_POSTS)}`);

  const photos = await getPhotos();
  await fs.writeFile(OUT_PHOTOS, JSON.stringify({ photos }, null, 2), "utf-8");
  console.log(`✓ Wrote ${photos.length} photos → ${path.relative(ROOT, OUT_PHOTOS)}`);
}

main().catch((e) => {
  console.error("Build data failed:", e);
  process.exit(1);
});
