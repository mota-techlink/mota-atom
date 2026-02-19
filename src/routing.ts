import { defineRouting } from 'next-intl/routing';
import i18nConfig from '@/config/i18n.json';

// ── 语言配置 (唯一真相来源: src/config/i18n.json) ───────
// 所有需要语言列表的地方都从这里导入，包括：
//   - src/i18n.ts (next-intl 服务端)
//   - src/lib/mdx.ts (内容过滤)
//   - scripts/generate-sitemap.mjs (sitemap 生成)
//   - scripts/generate-assets.mjs (资产清单生成)
// ─────────────────────────────────────────────────────────
export const locales = i18nConfig.locales as readonly string[];
export type Locale = (typeof i18nConfig.locales)[number];
export const defaultLocale: Locale = i18nConfig.defaultLocale as Locale;

export const routing = defineRouting({
  locales: [...i18nConfig.locales],
  defaultLocale: i18nConfig.defaultLocale,
  localePrefix: 'always',
});
