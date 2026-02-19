import { defineRouting } from 'next-intl/routing';

// 定义支持的语言（这是唯一的真相来源）
export const locales = ['en', 'zh'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'always',
});
