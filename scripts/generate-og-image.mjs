#!/usr/bin/env node
// scripts/generate-og-image.mjs
// ─────────────────────────────────────────────────────────
// 构建时生成默认的 OG (Open Graph) 图片
// 输出: public/images/og.png (1200×630, 社交媒体分享预览图)
//
// 使用项目已有的 Logo 和品牌色彩，生成一张
// 包含 Logo + 站名 + 描述 + 域名 的 OG 预览图
// ─────────────────────────────────────────────────────────

import sharp from 'sharp';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const WIDTH = 1200;
const HEIGHT = 630;
const OUTPUT = path.join(ROOT, 'public', 'images', 'og.png');

// ── 品牌配置 ────────────────────────────────────────────
const SITE_NAME = 'MOTA TECHLINK';
const TAGLINE = 'Launch Your Dream Startup with AI';
const DOMAIN = 'atom.motaiot.com';

// Logo 路径 (白色 Logo 用于深色背景)
const LOGO_PATH = path.join(ROOT, 'public', 'logos', 'mota-logo-v2.webp');

async function generateOgImage() {
  console.log('🖼️  Generating OG image...');

  // 1. 读取并处理 Logo
  let logoBuffer;
  let logoWidth = 120;
  let logoHeight = 120;

  if (fs.existsSync(LOGO_PATH)) {
    logoBuffer = await sharp(LOGO_PATH)
      .resize(logoWidth, logoHeight, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();
  }

  // 2. 构建 SVG overlay (文字 + 装饰元素)
  //    sharp 支持 SVG compositing，我们用它来叠加文字
  const svg = `
<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- 背景渐变 -->
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0f172a"/>
      <stop offset="50%" style="stop-color:#1e293b"/>
      <stop offset="100%" style="stop-color:#334155"/>
    </linearGradient>
    <!-- 装饰光晕 -->
    <radialGradient id="glow1" cx="20%" cy="30%" r="40%">
      <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:0.15"/>
      <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="80%" cy="70%" r="35%">
      <stop offset="0%" style="stop-color:#8b5cf6;stop-opacity:0.12"/>
      <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:0"/>
    </radialGradient>
  </defs>

  <!-- 背景 -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow1)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow2)"/>

  <!-- 微妙的网格线装饰 -->
  <g opacity="0.05" stroke="white" stroke-width="1">
    ${Array.from({ length: 12 }, (_, i) => `<line x1="${i * 100}" y1="0" x2="${i * 100}" y2="${HEIGHT}"/>`).join('\n    ')}
    ${Array.from({ length: 7 }, (_, i) => `<line x1="0" y1="${i * 100}" x2="${WIDTH}" y2="${i * 100}"/>`).join('\n    ')}
  </g>

  <!-- Logo 占位符圆角方块 (如果没有 logo 图片时的 fallback) -->
  ${!logoBuffer ? `
  <rect x="540" y="140" width="120" height="120" rx="24" 
        fill="url(#logoGrad)" />
  <defs>
    <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6"/>
      <stop offset="100%" style="stop-color:#8b5cf6"/>
    </linearGradient>
  </defs>
  <text x="600" y="218" font-family="Arial, sans-serif" font-size="60" 
        font-weight="bold" fill="white" text-anchor="middle">M</text>
  ` : ''}

  <!-- 站名 -->
  <text x="600" y="${logoBuffer ? 330 : 340}" 
        font-family="Arial, Helvetica, sans-serif" font-size="56" 
        font-weight="bold" fill="white" text-anchor="middle" 
        letter-spacing="2">
    ${SITE_NAME}
  </text>

  <!-- 标语 -->
  <text x="600" y="${logoBuffer ? 380 : 390}" 
        font-family="Arial, Helvetica, sans-serif" font-size="24" 
        fill="#94a3b8" text-anchor="middle">
    ${TAGLINE}
  </text>

  <!-- 分隔线 -->
  <line x1="450" y1="420" x2="750" y2="420" stroke="#475569" stroke-width="1" opacity="0.5"/>

  <!-- 域名 -->
  <text x="600" y="460" 
        font-family="monospace" font-size="18" 
        fill="#64748b" text-anchor="middle">
    ${DOMAIN}
  </text>

  <!-- 底部装饰条 -->
  <rect x="0" y="${HEIGHT - 4}" width="${WIDTH}" height="4">
    <animate attributeName="fill" values="#3b82f6;#8b5cf6;#3b82f6" dur="3s" repeatCount="indefinite"/>
  </rect>
  <linearGradient id="bottomBar" x1="0%" y1="0%" x2="100%" y2="0%">
    <stop offset="0%" style="stop-color:#3b82f6"/>
    <stop offset="50%" style="stop-color:#8b5cf6"/>
    <stop offset="100%" style="stop-color:#3b82f6"/>
  </linearGradient>
  <rect x="0" y="${HEIGHT - 4}" width="${WIDTH}" height="4" fill="url(#bottomBar)"/>
</svg>`;

  // 3. 先生成 SVG 背景
  const bgBuffer = await sharp(Buffer.from(svg))
    .png()
    .toBuffer();

  // 4. 组合: 背景 + Logo
  const composites = [];
  if (logoBuffer) {
    composites.push({
      input: logoBuffer,
      top: 150,
      left: Math.round((WIDTH - logoWidth) / 2),
    });
  }

  const result = await sharp(bgBuffer)
    .composite(composites)
    .png({ quality: 90, compressionLevel: 9 })
    .toFile(OUTPUT);

  console.log(`✅ OG image generated: ${path.relative(ROOT, OUTPUT)} (${result.width}×${result.height}, ${(result.size / 1024).toFixed(1)}KB)`);
}

generateOgImage().catch((err) => {
  console.error('❌ Failed to generate OG image:', err);
  process.exit(1);
});
