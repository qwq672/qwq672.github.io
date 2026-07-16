import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, Noto_Sans_SC, Noto_Serif_SC, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { Scrollbar } from "@/components/scrollbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const notoSansSC = Noto_Sans_SC({
  variable: "--font-noto-sans-sc",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

const notoSerifSC = Noto_Serif_SC({
  variable: "--font-noto-serif-sc",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "qwq672 · 随笔与小破站",
  description:
    "qwq672 的个人小站 — 学生 / 老设备折腾者 / Minecraft 模组作者 / 音乐小白。游戏、复古、代码、碎碎念，都丢在这啦。",
  keywords: ["qwq672", "个人网站", "Minecraft", "LavaArcade", "老设备", "复古", "博客"],
  authors: [{ name: "qwq672" }],
  icons: {
    icon: "/icon-48.webp",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "qwq672 · 随笔与小破站",
    description: "学生 / 老设备折腾者 / Minecraft 模组作者 / 音乐小白",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f2ea" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a2e" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${notoSansSC.variable} ${notoSerifSC.variable} ${jetbrainsMono.variable} antialiased bg-background text-foreground font-sans`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          {children}
          <Toaster />
          <Scrollbar />
        </ThemeProvider>
      </body>
    </html>
  );
}
