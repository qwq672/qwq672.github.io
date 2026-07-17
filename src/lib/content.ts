import type { LucideIcon } from "lucide-react";
import {
  Gamepad2,
  Smartphone,
  Music4,
  Globe,
  Clapperboard,
  type LucideProps,
} from "lucide-react";

export interface Interest {
  icon: LucideIcon;
  title: string;
  desc: string;
  accent: string;
}

export const interests: Interest[] = [
  {
    icon: Gamepad2,
    title: "游戏",
    desc: "常玩 Minecraft、地平线 5、Phigros，偶尔也碰碰《主播女孩重度依赖》《底特律：变人》之类的。",
    accent: "from-amber-500/20 to-orange-500/10",
  },
  {
    icon: Smartphone,
    title: "老设备折腾",
    desc: "iPod touch 4、安卓 4.2 的古董机……最近还把 iPhone 4（Rev A）从 iOS 7.1.2「完美」降级到了 iOS 6.1.3 并越狱成功！越狱、root、装老游戏，折腾本身比用它们还有意思。",
    accent: "from-rose-500/20 to-amber-500/10",
  },
  {
    icon: Music4,
    title: "音乐 & MIDI",
    desc: "用 FL Studio 把一些歌重制成 MIDI 版本，也在做 Arvgrid 这个网页端 MIDI 编曲工具。",
    accent: "from-violet-500/20 to-fuchsia-500/10",
  },
  {
    icon: Globe,
    title: "Web 1.0 复古站",
    desc: "用 HTML 3.2 + GB2312 编码搭了个老设备兼容站，复古味拉满，怀旧党狂喜。",
    accent: "from-cyan-500/20 to-sky-500/10",
  },
  {
    icon: Clapperboard,
    title: "影迷 & 番剧",
    desc: "曾经算个影迷，也追番看日漫，现在碍于学业不太追了，但有空大概率还是会看的。",
    accent: "from-orange-500/20 to-red-500/10",
  },
];

export type ProjectLogoKind = "img" | "svg";

export interface Project {
  slug: string;
  name: string;
  tagline: string;
  status: "开发中" | "进行中" | "接近正式版";
  desc: string;
  tags: string[];
  website: { url: string; label: string };
  logo: { src: string; kind: ProjectLogoKind };
  accent: string;
}

export const projects: Project[] = [
  {
    slug: "lavaarcade",
    name: "LavaArcade",
    tagline: "Minecraft 模组 · AI + 离线多人小游戏",
    status: "开发中",
    desc: "一个把 AI 智能玩家和离线多人小游戏塞进 Minecraft 的模组。项目特别大，涉及多个方面，机器学习都已经涉及了，所以进度不算快——但确实在一点点推进。",
    tags: ["Minecraft", "Mod", "AI", "Fabric"],
    website: { url: "https://lava.awa.lat", label: "lava.awa.lat" },
    logo: { src: "/logo/lavaarcade.png", kind: "img" },
    accent: "from-orange-500/25 to-amber-500/10",
  },
  {
    slug: "tinycraft",
    name: "TinyCraft",
    tagline: "C 语言命令行迷你启动器",
    status: "开发中",
    desc: "用 C 语言写的 Minecraft 命令行迷你启动器，主打一个轻量。目前卡在 Minecraft 登录的 API 申请那边，等搞定继续推进。",
    tags: ["Minecraft", "Launcher", "C"],
    website: { url: "https://tinycraft.awa.lat", label: "tinycraft.awa.lat" },
    logo: { src: "/logo/tinycraft.png", kind: "img" },
    accent: "from-zinc-400/20 to-slate-500/10",
  },
  {
    slug: "arvgrid",
    name: "Arvgrid",
    tagline: "网页端 MIDI 编曲 & 编辑 GUI 工具",
    status: "接近正式版",
    desc: "最接近正式版阶段的项目。一个网页端的 MIDI 编曲及编辑 GUI 工具，支持多端，还能导入 SF 音色库文件，拿来编曲或修 MIDI 都挺顺手。",
    tags: ["Web", "MIDI", "Audio", "SF2"],
    website: { url: "https://grid.awa.lat", label: "grid.awa.lat" },
    logo: { src: "/logo/arvgrid.svg", kind: "svg" },
    accent: "from-emerald-500/20 to-teal-500/10",
  },
];

export interface SocialLink {
  label: string;
  handle: string;
  href: string;
  icon: string;
  note?: string;
}

export const socials: SocialLink[] = [
  {
    label: "GitHub",
    handle: "qwq672",
    href: "https://github.com/qwq672",
    icon: "github",
    note: "代码都在这，虽然仓库不多（",
  },
  {
    label: "Bilibili",
    handle: "uid 700347223",
    href: "https://space.bilibili.com/700347223",
    icon: "play",
    note: "偶尔搬运或发点视频，成分有点复杂。",
  },
  {
    label: "Email（主）",
    handle: "i@awa.lat",
    href: "mailto:i@awa.lat",
    icon: "mail",
    note: "非节假日建议联系这个。",
  },
  {
    label: "Email（备）",
    handle: "b167963232@163.com",
    href: "mailto:b167963232@163.com",
    icon: "mail",
    note: "主邮箱没回再发这个。",
  },
  {
    label: "Microsoft Teams",
    handle: "聊天邀请",
    href: "https://teams.live.com/l/invite/FEAJU8ZgWxzwQqgjQM?v=g1",
    icon: "message",
    note: "没被墙，闲聊可以来这。",
  },
];

export interface ResourceLink {
  name: string;
  url: string;
  desc: string;
  password?: string;
  badge?: string;
}

export const resources: ResourceLink[] = [
  {
    name: "老设备兼容网站",
    url: "http://672.w0.am",
    desc: "用 HTML 3.2 + GB2312 写的老设备复古站，iPod touch 4 也能访问。",
    badge: "Web 1.0",
  },
  {
    name: "旧版资源总站",
    url: "http://sky672.ysepan.com",
    desc: "永硕 e盘，资源比较杂，登录密码请看网站内的提示。",
  },
  {
    name: "123 网盘资源区",
    url: "https://123pan.cn/s/LrH6Vv-sJIo",
    desc: "123 网盘分享，下载速度还行。",
    password: "见网盘提示",
  },
  {
    name: "蓝奏云资源区",
    url: "https://xiaochat.lanzn.com/b02jkdexc",
    desc: "蓝奏云资源合集，小文件下载首选。",
    password: "0000",
  },
];

export const resourcePasswordHint = "所有资源区若有密码一律为 0000 或 Ab1234";

export const navLinks = [
  { href: "#about", label: "关于" },
  { href: "#interests", label: "兴趣" },
  { href: "#projects", label: "项目" },
  { href: "#blog", label: "随笔" },
  { href: "#gallery", label: "照片墙" },
  { href: "#resources", label: "资源" },
  { href: "#contact", label: "联系" },
] as const;

export type IconComponent = (props: LucideProps) => JSX.Element;
