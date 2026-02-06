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
  const headerStore = await headers();
  const host = headerStore.get('host'); // 检查 host 和 origin 是否匹配

  console.log('--- [OAuth Debug] Starting Google Sign-In ---');
  console.log(`[OAuth Debug] Origin: ${origin}`);
  console.log(`[OAuth Debug] Host: ${host}`);
  console.log(`[OAuth Debug] Configured RedirectTo: ${redirectTo}`);
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectTo,
    },
  });

  if (error) {
    console.error('[OAuth Debug] Error during signInWithOAuth:', error);
    // Return the error so the client can handle it or show a message
    return { error: error.message };
  }
  
  if (data.url) {
    console.log(`[OAuth Debug] Successfully got redirect URL: ${data.url}`);
    // 🟢 FIX: Return the URL instead of throwing redirect()
    // This ensures cookies (PKCE verifier) are successfully set in the response headers
    return { url: data.url };
  } else {
    console.error('[OAuth Debug] No redirect URL returned.');
    return { error: 'No redirect URL returned' };
  }
}