// app/[locale]/login/actions.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { Provider } from '@supabase/supabase-js';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect('/dashboard');
}

export async function signup(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const supabase = await createClient();
  
  const origin = (await headers()).get('origin');

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  return redirect('/login?message=check_email');
}

export async function signInWithGoogle() {
  const supabase = await createClient();
  const origin = (await headers()).get('origin');
  const redirectTo = `${origin}/auth/callback`;

  // 添加日志：打印关键信息
  console.log('--- [OAuth Debug] Starting Google Sign-In ---');
  console.log(`[OAuth Debug] Origin: ${origin}`);
  console.log(`[OAuth Debug] Redirect To: ${redirectTo}`);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectTo,
    },
  });

  if (error) {
    // 添加日志：打印详细错误信息
    console.error('[OAuth Debug] Error during signInWithOAuth:', error);
    // 返回错误信息到前端
    return redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }
  
  if (data.url) {
    // 添加日志：打印成功获取到的重定向 URL
    console.log(`[OAuth Debug] Successfully got redirect URL: ${data.url}`);
    // redirect(data.url);
    return { url: data.url };
  } else {
    // 添加日志：未获取到 URL 的异常情况
    console.error('[OAuth Debug] No redirect URL returned from signInWithOAuth. Data:', data);
    return redirect(`/login?error=oauth_no_url`);
  }
}