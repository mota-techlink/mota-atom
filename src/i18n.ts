import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// 定义支持的语言
export const locales = ['en', 'zh'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale = 'en';

// ✨ 改动点 1: 解构 requestLocale 而不是 locale
export default getRequestConfig(async ({ requestLocale }) => {
  // ✨ 改动点 2: 等待 Promise 解析
  let locale = await requestLocale;

  // 验证: 确保 locale 存在且在允许列表中
  if (!locale || !locales.includes(locale as any)) {
    notFound();
  }

  // 此时 TS 已经知道 locale 一定是 string，因为上面过滤了 undefined
  return {
    locale, 
    messages: (await import(`./messages/${locale}.json`)).default,
    // timeZone: 'Asia/Shanghai',
  };
});