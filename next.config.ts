import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';
import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

const nextConfig: NextConfig = {
  // 1. ✅ 正确的配置位置：顶层配置
  // 允许通过 IP 访问开发服务器
  allowedDevOrigins: ["localhost:3000", "192.168.50.188:3000"],

  // 2. 依然保留 Server Actions 的允许源 (双保险)
  // 因为表单提交 (Server Actions) 有独立的安全检查
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "dev.motaiot.com","192.168.50.188:3000"],
    },
  },

  // 3. 静态资源跨域头 (CORS)
  // 确保字体文件 (.woff2) 能被加载
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET, POST, OPTIONS" },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'github.com', // 预防性添加，有些 GitHub 图片也是这个域名
      },
    ],
  },
  // 🟢 核心修复
  webpack: (config) => {
    // 使用 require.resolve 获取绝对路径
    // 这比简单的字符串 'zod' 更强硬，直接指向文件，绕过 package.json 检查
    try {
      config.resolve.alias['zod/v3'] = require.resolve('zod');
    } catch (e) {
      // 容错处理：如果 require.resolve 失败，回退到字符串
      config.resolve.alias['zod/v3'] = 'zod';
    }
    return config;
  },
};

export default async function config() {
 // 开发环境初始化 Cloudflare Platform (如果有)
  if (process.env.NODE_ENV === 'development') {
    // 加上 try-catch 防止因为这个函数报错导致整个配置挂掉
    try {
      await setupDevPlatform();
    } catch (e) {
      console.warn('Failed to setup Cloudflare Dev Platform:', e);
    }
  }

  // 返回被 next-intl 包裹后的配置对象
  return withNextIntl(nextConfig);
}