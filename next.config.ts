import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 静态导出模式，支持 GitHub Pages / Cloudflare Pages
  output: "export",
  // GitHub Pages 需要尾斜杠，Cloudflare Pages 也兼容
  trailingSlash: true,
  // 静态导出不支持 next/image 的服务端优化
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
