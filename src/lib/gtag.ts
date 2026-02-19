// src/lib/gtag.ts
// Google Analytics 4 事件追踪工具

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// 声明 gtag 全局类型
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

/**
 * 页面浏览事件（SPA 路由切换时调用）
 */
export function pageview(url: string) {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID) return;
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
  });
}

/**
 * 自定义事件追踪
 * @example
 * event('click_cta', { category: 'engagement', label: 'hero_button', value: 1 })
 */
export function event(
  action: string,
  {
    category,
    label,
    value,
  }: {
    category?: string;
    label?: string;
    value?: number;
  } = {}
) {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID) return;
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value,
  });
}
