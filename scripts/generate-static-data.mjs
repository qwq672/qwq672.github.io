/**
 * 构建时数据生成脚本
 * 读取 content/ 下的 Markdown 和 public/photos/ 下的图片，
 * 生成静态 JSON 到 public/data/，替代原先的 API Routes。
 * 使项目支持 GitHub Pages / Cloudflare Pages 静态导出。
 */
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const POSTS_DIR = path.join(ROOT, "content", "posts");
const DOCS_ROOT = path.join(ROOT, "content", "docs");
const PHOTOS_DIR = path.join(ROOT, "public", "photos");
const OUT_DIR = path.join(ROOT, "public", "data");

// ===== Frontmatter 解析（与 src/lib/posts.ts 保持一致）=====
function parseFrontmatter(raw) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw);
  if (!match) return { data: {}, content: raw };
  const fmRaw = match[1];
  const content = match[2];
  const data = {};
  for (const line of fmRaw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const colon = trimmed.indexOf(":");
    if (colon === -1) continue;
    const key = trimmed.slice(0, colon).trim();
    let value = trimmed.slice(colon + 1).trim().replace(/\s+#.*$/, "");
    if (value === "") { data[key] = ""; continue; }
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      data[key] = value.slice(1, -1); continue;
    }
    if (value.startsWith("[") && value.endsWith("]")) {
      const inner = value.slice(1, -1).trim();
      data[key] = inner === "" ? [] : inner.split(",").map((s) => s.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
      continue;
    }
    data[key] = value;
  }
  return { data, content };
}

function toSlug(fileName) {
  return fileName.replace(/\.md$/i, "");
}

function estimateReadingMinutes(text) {
  const cnChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
  const enWords = (text.replace(/[\u4e00-\u9fa5]/g, " ").match(/[A-Za-z0-9]+/g) || []).length;
  const minutes = cnChars / 400 + enWords / 220;
  return Math.max(1, Math.round(minutes));
}

function normalizeMeta(slug, data, content) {
  const asArr = (v) => {
    if (Array.isArray(v)) return v.map(String);
    if (typeof v === "string") return v.split(/[,\s]+/).map((s) => s.trim()).filter(Boolean);
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

// ===== 文档目录（与 src/lib/docs.ts 保持一致）=====
const REGISTRY = [
  {
    project: "lavaarcade",
    name: "LavaArcade",
    tagline: "AI + 离线多人小游戏模组",
    logo: { src: "/logo/lavaarcade.png", kind: "img" },
    docs: [
      { slug: "欢迎", title: "欢迎", description: "文档首页 · 了解 LavaArcade" },
      { slug: "下载与安装", title: "下载与安装", description: "配置要求、下载渠道与安装步骤" },
      { slug: "自定义小游戏", title: "自定义小游戏", description: "编写脚本定制你的小游戏" },
      { slug: "自定义你的模型", title: "自定义你的模型", description: "接入你自己的 AI 模型" },
      { slug: "推理加速", title: "推理加速", description: "用 GPU / NPU 加速智能玩家推理" },
      { slug: "Cortex", title: "Cortex", description: "Cortex 子模块说明" },
    ],
  },
];

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function writeJson(filePath, data) {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, JSON.stringify(data), "utf-8");
}

// ===== 生成文章列表 JSON =====
async function generatePosts() {
  const files = await fs.readdir(POSTS_DIR);
  const mdFiles = files.filter((f) => f.endsWith(".md"));
  const posts = await Promise.all(
    mdFiles.map(async (f) => {
      const slug = toSlug(f);
      const raw = await fs.readFile(path.join(POSTS_DIR, f), "utf-8");
      const { data, content } = parseFrontmatter(raw);
      return { ...normalizeMeta(slug, data, content), content };
    })
  );
  const valid = posts.filter(Boolean);
  const sorted = valid.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  const list = sorted.map(({ content, ...meta }) => meta);
  await writeJson(path.join(OUT_DIR, "posts.json"), { posts: list });
  console.log(`  ✓ posts.json (${list.length} 篇)`);
}

// ===== 生成文档集 JSON =====
async function generateDocSets() {
  const sets = REGISTRY.map((entry) => ({
    project: entry.project,
    name: entry.name,
    tagline: entry.tagline,
    logo: entry.logo,
    docs: entry.docs.map((d, i) => ({
      slug: d.slug,
      title: d.title,
      order: i,
      description: d.description,
    })),
  }));
  await writeJson(path.join(OUT_DIR, "doc-sets.json"), { sets });
  console.log(`  ✓ doc-sets.json (${sets.length} 个项目)`);
  return sets;
}

// ===== 生成单个文档 JSON =====
async function generateDocs(sets) {
  for (const set of sets) {
    for (const docMeta of set.docs) {
      const filePath = path.join(DOCS_ROOT, set.project, `${docMeta.slug}.md`);
      let content = "";
      try {
        content = await fs.readFile(filePath, "utf-8");
      } catch {
        console.warn(`  ⚠ 文档缺失: ${set.project}/${docMeta.slug}.md`);
        continue;
      }
      const doc = {
        slug: docMeta.slug,
        title: docMeta.title,
        order: docMeta.order,
        description: docMeta.description,
        content,
      };
      const outPath = path.join(OUT_DIR, "docs", set.project, `${docMeta.slug}.json`);
      await writeJson(outPath, { doc });
    }
    console.log(`  ✓ docs/${set.project}/*.json (${set.docs.length} 篇)`);
  }
}

// ===== 生成照片列表 JSON（使用 sharp 读取尺寸，与 /api/photos 逻辑一致）=====
async function generatePhotos() {
  let files = [];
  try {
    files = (await fs.readdir(PHOTOS_DIR))
      .filter((f) => f.endsWith(".jpg"))
      .sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
  } catch {
    console.warn("  ⚠ public/photos/ 目录不存在，跳过照片生成");
    await writeJson(path.join(OUT_DIR, "photos.json"), { photos: [] });
    return;
  }

  const photos = [];
  for (const f of files) {
    try {
      const meta = await sharp(path.join(PHOTOS_DIR, f)).metadata();
      const w = meta.width ?? 600;
      const h = meta.height ?? 400;
      photos.push({ src: `/photos/${f}`, w, h, ratio: w / h });
    } catch {
      /* skip */
    }
  }
  await writeJson(path.join(OUT_DIR, "photos.json"), { photos });
  console.log(`  ✓ photos.json (${photos.length} 张)`);
}

async function main() {
  console.log("📦 生成静态数据到 public/data/ ...");
  // 清理旧数据
  await fs.rm(OUT_DIR, { recursive: true, force: true }).catch(() => {});
  await ensureDir(OUT_DIR);

  await generatePosts();
  const sets = await generateDocSets();
  await generateDocs(sets);
  await generatePhotos();

  console.log("✅ 静态数据生成完成");
}

main().catch((err) => {
  console.error("❌ 生成失败:", err);
  process.exit(1);
});
