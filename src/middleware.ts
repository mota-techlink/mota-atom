import { type NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { createServerClient } from '@supabase/ssr';
import { locales } from './i18n'; // 确保引入了你定义的 locales

// 1. 初始化 Intl 中间件
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale: 'en',
  localePrefix: 'as-needed' // 建议显式显示语言前缀，利于 SEO 和逻辑统一
  
});

export async function middleware(request: NextRequest) {
  // 2. 创建一个可变的 Response 对象，先让 intl 处理路由
  // 这样我们就能拿到带有正确 locale Header 的 response
  const response = intlMiddleware(request);

  // 3. 初始化 Supabase Client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // 在 response 上设置 cookie，以保持 Session
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // 4. 刷新 Session (Supabase 核心逻辑)
  // 如果用户未登录，getUser 会返回 null，但我们这里只负责刷新 Token
  // 具体的页面保护逻辑（如重定向到登录页）建议在 Layout 或 Page 中做
  await supabase.auth.getUser();

  return response;
}

export const config = {
  // 匹配规则：跳过内部路径、静态资源等
  matcher: [
    '/((?!_next/static|_next/image|videos|search.json|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    
  ],
};