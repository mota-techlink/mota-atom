// src/app/auth/[provider]/route.ts
import { createClient } from '@/lib/supabase/client';
import { NextResponse } from 'next/server';
import { Provider } from '@supabase/supabase-js';

export const runtime = 'edge'; // 保持 Edge 兼容性

export async function GET(
  request: Request,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params; // Next.js 15+ params 是 Promise
  const requestUrl = new URL(request.url);
  const origin = requestUrl.origin;
  const supabase = await createClient();

  let actualProvider = provider as Provider;
  let queryParams = {};

  console.log(`--- [OAuth Debug] Starting Sign-In with ${actualProvider} ---`);
  console.log(`[OAuth Debug] Origin: ${origin}`);
  
  // 1. 处理特殊的 Provider 映射 (保留之前的逻辑)

  // 如果你有自定义逻辑，比如 wechat 走 oidc
  if (provider === 'wechat') {
    // actualProvider = 'oidc';
    // queryParams = { ... };
  }

  // 2. 构造 Supabase 回调地址
  // 这里的 redirectTo 是指 Supabase 认证完跳回 Next.js 的地址
  const redirectTo = `${origin}/auth/callback`; 
  console.log(`[OAuth Debug] RedirectTo: ${redirectTo}`);
  // 3. 调用 Supabase
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: actualProvider,
    options: {
      redirectTo: redirectTo,
      queryParams: queryParams,
    },
  });

  // 4. 处理错误：跳回登录页并带上错误信息
  if (error) {
    console.error(`[OAuth API Error] ${provider}:`, error);
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`);
  }

  // 5. 成功：直接跳转到 Identity Provider (Google/GitHub 等) 的授权页面
  return NextResponse.redirect(data.url);
}