// src/components/seo/analytics-pageview.tsx
'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { pageview } from '@/lib/gtag';

/**
 * 监听 Next.js 路由变化，自动发送 GA4 pageview 事件
 * 放在 layout 中即可
 */
export function AnalyticsPageview() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    pageview(url);
  }, [pathname, searchParams]);

  return null;
}
