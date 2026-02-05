'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // 实际项目中这里应该返回错误信息给前端显示
    // 为了简化，暂时重定向回登录页并带上错误参数
    return redirect('/login?error=auth');
  }

  // 登录成功，重定向到后台
  // 注意：需要使用 next/navigation 的 redirect
  redirect('/dashboard');
}

export async function signup(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const supabase = await createClient();
  
  // 获取当前 origin 用于生成确认链接
  const origin = (await headers()).get('origin');

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return redirect('/login?error=signup');
  }

  return redirect('/login?message=check_email');
}