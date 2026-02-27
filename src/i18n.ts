import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, defaultLocale } from './routing';
import type { Locale } from './routing';
import enMessages from '@content/locales/en.json';
import zhMessages from '@content/locales/zh.json';
import jaMessages from '@content/locales/ja.json';

// 重新导出，方便其他地方引用
export { locales, defaultLocale };
export type { Locale };

const messageRegistry: Record<string, Record<string, unknown>> = {
  en: enMessages,
  zh: zhMessages,
  ja: jaMessages,
};

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;

  // 验证: 确保 locale 存在且在允许列表中
  if (!locale || !locales.includes(locale)) {
    notFound();
  }

  return {
    locale, 
    messages: messageRegistry[locale],
  };
});