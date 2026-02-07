// app/auth/callback/route.ts
// import { createClient } from '@/lib/supabase/server';
// import { NextResponse } from 'next/server';
// import { cookies } from 'next/headers';
// export const runtime = 'edge'

// export async function GET(request: Request) {
//   const { searchParams, origin } = new URL(request.url);
//   const code = searchParams.get('code');
//   const next = searchParams.get('next') ?? '/dashboard';

//   if (code) {
//     const supabase = await createClient();
//     const { error } = await supabase.auth.exchangeCodeForSession(code);
//     if (!error) {
//       return NextResponse.redirect(`${origin}${next}`);
//     }
//   }

//   // 登录失败，重定向回登录页
//   return NextResponse.redirect(`${origin}/login?error=auth`);
// }
// src/app/auth/callback/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  
  // 1. 获取重定向目标（如果有 next 参数则优先，否则跳 dashboard）
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // 2. 关键点：手动获取用户之前的语言
      const cookieStore = await cookies();
      // 读取 next-intl 设置的 cookie，如果没有则默认为 en
      const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en';

      // 3. 拼接出带语言的最终跳转地址： /en/dashboard
      // 注意：确保 next 路径不以 / 开头，或者自己处理斜杠逻辑
      const cleanNext = next.startsWith('/') ? next.slice(1) : next;
      const forwardedUrl = `${origin}/${locale}/${cleanNext}`;

      return NextResponse.redirect(forwardedUrl);
    }
  }

  // 错误处理
  return NextResponse.redirect(`${origin}/login?error=auth_code_error`);
}