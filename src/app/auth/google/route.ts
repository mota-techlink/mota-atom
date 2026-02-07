import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

// 这是一个纯粹的 API，不依赖页面
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const supabase = await createClient();
  const origin = requestUrl.origin;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return NextResponse.redirect(`${origin}/login?error=${error.message}`);
  }

  // 直接跳转到 Google
  return NextResponse.redirect(data.url);
}