// app/[locale]/login/actions.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { Provider } from '@supabase/supabase-js';
import { ExtendedProvider } from '@/config/site';

export async function oAuthLogin(formData: FormData) {
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

// export async function signInWithProvider(providerId: ExtendedProvider) {
//   const supabase = await createClient();
//   const headerStore = await headers();
//   const origin = headerStore.get('origin');
  
//   // 动态构建回调地址
//   const redirectTo = `${origin}/auth/callback`;

//   console.log(`--- [OAuth Debug] Starting Sign-In with ${providerId} ---`);
//   console.log(`[OAuth Debug] Origin: ${origin}`);
//   console.log(`[OAuth Debug] RedirectTo: ${redirectTo}`);

//   // 🟢 特殊处理：如果 Provider 是 wechat，可能需要映射到 oidc 或者特殊处理
//   // 这里为了演示，我们假设它通过 standard OAuth 调用，但需要类型断言
//   let actualProvider = providerId as Provider;
//   let queryParams = {};

//   if (providerId === 'wechat') {
//     // 如果您使用的是 Casdoor 等 OIDC 中台，这里可能需要改为 'oidc'
//     // actualProvider = 'oidc'; 
//     // queryParams = { ... };
//   }

//   const { data, error } = await supabase.auth.signInWithOAuth({
//     provider: actualProvider, 
//     options: {
//       redirectTo: redirectTo,
//       queryParams: queryParams,
//     },
//   });

//   if (error) {
//     console.error(`[OAuth Debug] Error with ${providerId}:`, error);
//     return { error: error.message };
//   }
  
//   if (data.url) {
//     console.log(`[OAuth Debug] Success URL: ${data.url}`);
//     return { url: data.url };
//   } else {
//     console.error('[OAuth Debug] No redirect URL returned.');
//     return { error: 'No redirect URL returned' };
//   }
// }

// export async function signInWithGoogle() {
//   const supabase = await createClient();
//   const origin = (await headers()).get('origin');
//   const redirectTo = `${origin}/auth/callback`;
//   const headerStore = await headers();
//   const host = headerStore.get('host'); // 检查 host 和 origin 是否匹配

//   console.log('--- [OAuth Debug] Starting Google Sign-In ---');
//   console.log(`[OAuth Debug] Origin: ${origin}`);
//   console.log(`[OAuth Debug] Host: ${host}`);
//   console.log(`[OAuth Debug] Configured RedirectTo: ${redirectTo}`);
  
//   const { data, error } = await supabase.auth.signInWithOAuth({
//     provider: 'google',
//     options: {
//       redirectTo: redirectTo,
//     },
//   });

//   if (error) {
//     console.error('[OAuth Debug] Error during signInWithOAuth:', error);
//     // Return the error so the client can handle it or show a message
//     return { error: error.message };
//   }
  
//   if (data.url) {
//     console.log(`[OAuth Debug] Successfully got redirect URL: ${data.url}`);
//     // 🟢 FIX: Return the URL instead of throwing redirect()
//     // This ensures cookies (PKCE verifier) are successfully set in the response headers
//     return { url: data.url };
//   } else {
//     console.error('[OAuth Debug] No redirect URL returned.');
//     return { error: 'No redirect URL returned' };
//   }
// }

