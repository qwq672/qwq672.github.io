import type { LucideIcon } from "lucide-react";
import {
  Gamepad2,
  Smartphone,
  Music4,
  Globe,
  Clapperboard,
  Blocks,
  Rocket,
  Wrench,
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
    desc: "iPod touch 4、安卓 4.2 的古董机……越狱、root、装老游戏，折腾老设备本身比用它们还有意思。",
    accent: "from-rose-500/20 to-amber-500/10",
  },
  {
    icon: Blocks,
    title: "Minecraft 模组",
    desc: "正在开发 LavaArcade 模组，大概是我最花时间的东西了（powered by AI？）。",
    accent: "from-emerald-500/20 to-teal-500/10",
  },
  {
    icon: Music4,
    title: "音乐创作",
    desc: "用 FL Studio 把一些歌重制成 MIDI 版本，小白一个，也懂点 Hi-Fi 的小知识。",
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

export interface Project {
  icon: LucideIcon;
  name: string;
  tagline: string;
  status: "开发中" | "进行中" | "已发布";
  desc: string;
  tags: string[];
}

export const projects: Project[] = [
  {
    icon: Blocks,
    name: "LavaArcade",
    tagline: "Minecraft 模组",
    status: "开发中",
    desc: "大概是我最花时间来开发完成的模组。除了这里和少数几个地方一般不会宣传。",
    tags: ["Minecraft", "Mod", "Java"],
  },
  {
    icon: Rocket,
    name: "TinyCraft Launcher",
    tagline: "启动器",
    status: "开发中",
    desc: "正在做的 Minecraft 启动器，轻量向，目标是又小又好用。",
    tags: ["Minecraft", "Launcher"],
  },
  {
    icon: Wrench,
    name: "Arvgrid",
    tagline: "工具",
    status: "进行中",
    desc: "一个正在折腾的小工具项目，细节以后再慢慢补。",
    tags: ["Tool"],
  },
];

export interface SocialLink {
  label: string;
  handle: string;
  href: string;
  icon: string; // lucide name, mapped in component
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

export const navLinks = [
  { href: "#about", label: "关于" },
  { href: "#interests", label: "兴趣" },
  { href: "#projects", label: "项目" },
  { href: "#blog", label: "随笔" },
  { href: "#contact", label: "联系" },
] as const;
