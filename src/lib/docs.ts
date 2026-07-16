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

export interface DocSetMeta {
  /** folder name under content/docs/ */
  project: string;
  /** display name */
  name: string;
  tagline: string;
  /** logo src (optional) */
  logo?: { src: string; kind: "img" | "svg" };
  docs: DocMeta[];
}

export interface DocSet extends DocSetMeta {
  docs: DocMeta[];
}

const DOCS_ROOT = path.join(process.cwd(), "content", "docs");

/**
 * Registry of doc sets. To add a new project's docs:
 *  1. create folder content/docs/<project-slug>/
 *  2. drop .md files in it
 *  3. add an entry here with an ordered TOC
 */
const REGISTRY: Omit<DocSetMeta, "docs"> & {
  docs: { slug: string; title: string; description?: string }[];
}[] = [
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

const DOCS_DIR = DOCS_ROOT;

export async function getDocSets(): Promise<DocSet[]> {
  return REGISTRY.map((entry) => ({
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
}

export async function getDocSet(project: string): Promise<DocSet | null> {
  const sets = await getDocSets();
  return sets.find((s) => s.project === project) ?? null;
}

export async function getDoc(
  project: string,
  slug: string
): Promise<Doc | null> {
  const set = await getDocSet(project);
  if (!set) return null;
  const meta = set.docs.find((d) => d.slug === slug);
  if (!meta) return null;
  try {
    const filePath = path.join(DOCS_DIR, project, `${slug}.md`);
    const content = await fs.readFile(filePath, "utf-8");
    return {
      slug: meta.slug,
      title: meta.title,
      order: meta.order,
      description: meta.description,
      content,
    };
  } catch {
    return null;
  }
}
