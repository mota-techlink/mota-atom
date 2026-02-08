// app/[locale]/login/actions.ts
'use server';

import { createClient } from '@/lib/supabase/client';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';


export async function emailLogin(formData: FormData) {
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
  
  // 获取当前域名的 origin，确保邮件里的链接跳回正确的环境 (localhost 或 生产环境)
  const origin = (await headers()).get('origin');

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // 注册成功后，用户点击邮件链接会跳回这个地址
      // Supabase 会在这里设置 Session
      emailRedirectTo: `${origin}/auth/callback`, 
    },
  });

  if (error) {
    // 注册失败，跳回注册页并显示错误
    return { error: error.message };
    // return redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  // 注册成功 (默认 Supabase 需要验证邮箱)
  // 跳转回登录页，并提示用户去查收邮件
  // return redirect(`/login?message=check_email`);
  return { success: true };
}


