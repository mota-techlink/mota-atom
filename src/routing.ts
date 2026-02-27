import { defineRouting } from 'next-intl/routing';
import i18nConfig from '@/generated/content-config/i18n.json';

// ── 语言配置 (唯一真相来源: content/site/i18n.yml) ──────
// 所有需要语言列表的地方都从这里导入，包括：
//   - src/i18n.ts (next-intl 服务端)
//   - src/lib/mdx.ts (内容过滤)
//   - scripts/generate-sitemap.mjs (sitemap 生成)
//   - scripts/generate-assets.mjs (资产清单生成)
// ─────────────────────────────────────────────────────────
export const locales = i18nConfig.locales as readonly string[];
export type Locale = (typeof i18nConfig.locales)[number];
export const defaultLocale: Locale = i18nConfig.defaultLocale as Locale;

// 语言显示名称映射 — 新增语言时只需在此处添加
export const localeLabels: Record<string, string> = {
  en: 'English',
  zh: '中文',
  ja: '日本語',
};

export const routing = defineRouting({
  locales: [...i18nConfig.locales],
  defaultLocale: i18nConfig.defaultLocale,
  localePrefix: 'always',
});
