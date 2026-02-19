import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing, locales, defaultLocale } from './routing';
import type { Locale } from './routing';

// 重新导出，方便其他地方引用
export { locales, defaultLocale };
export type { Locale };

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  // 验证: 确保 locale 存在且在允许列表中
  if (!locale || !locales.includes(locale as any)) {
    notFound();
  }

  return {
    locale, 
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});