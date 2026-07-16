import { promises as fs } from "fs";
import path from "path";

export interface DocMeta {
  slug: string;
  title: string;
  order: number;
  description?: string;
}

export interface Doc extends DocMeta {
  content: string;
}

const DOCS_DIR = path.join(process.cwd(), "content", "docs");

/** Ordered table of contents for LavaArcade docs. */
const TOC: { slug: string; title: string; order: number; description?: string }[] = [
  {
    slug: "欢迎",
    title: "欢迎",
    order: 0,
    description: "文档首页 · 了解 LavaArcade",
  },
  {
    slug: "下载与安装",
    title: "下载与安装",
    order: 1,
    description: "配置要求、下载渠道与安装步骤",
  },
  {
    slug: "自定义小游戏",
    title: "自定义小游戏",
    order: 2,
    description: "编写脚本定制你的小游戏",
  },
  {
    slug: "自定义你的模型",
    title: "自定义你的模型",
    order: 3,
    description: "接入你自己的 AI 模型",
  },
  {
    slug: "推理加速",
    title: "推理加速",
    order: 4,
    description: "用 GPU / NPU 加速智能玩家推理",
  },
  {
    slug: "Cortex",
    title: "Cortex",
    order: 5,
    description: "Cortex 子模块说明",
  },
];

function extractTitle(content: string, fallback: string): string {
  const m = /^#\s+(.+)$/m.exec(content);
  return m ? m[1].trim() : fallback;
}

export async function getAllDocs(): Promise<DocMeta[]> {
  return TOC.map(({ slug, title, order, description }) => ({
    slug,
    title,
    order,
    description,
  })).sort((a, b) => a.order - b.order);
}

export async function getDoc(slug: string): Promise<Doc | null> {
  const meta = TOC.find((t) => t.slug === slug);
  if (!meta) return null;
  try {
    const filePath = path.join(DOCS_DIR, `${slug}.md`);
    const content = await fs.readFile(filePath, "utf-8");
    return {
      slug,
      title: meta.title,
      order: meta.order,
      description: meta.description,
      content,
    };
  } catch {
    return null;
  }
}

export { extractTitle };
