// app/[locale]/login/page.tsx
import Link from "next/link"
import { siteConfig } from "@/config/site";
import { getTranslations } from 'next-intl/server';
import Image from "next/image";
import { TypewriterText } from "@/components/ui/typewriter-text"; 
import AuthForm from "./auth-form"; 
import { Suspense } from 'react';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export default async function LoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { locale } = await params;
  const { error, message } = await searchParams;
  const t = await getTranslations('Auth');

  // Provider 配置
  const specificProviders = siteConfig.oauth.regionSpecific[locale] || [];
  const commonProviders = siteConfig.oauth.common;

  // 错误信息处理
  const errorMessage = Array.isArray(error) ? error[0] : error;
  const msgString = Array.isArray(message) ? message[0] : message;

  // 🟢 准备翻译字典传给客户端组件
  // 这样做是为了保持客户端组件轻量，且不用在客户端配置 i18n context
  const dict = {
    loginTitle: t('loginTitle', { defaultMessage: 'Welcome back' }),
    loginDesc: t('loginDesc', { defaultMessage: 'Sign in to your account' }),
    signupTitle: t('signupTitle', { defaultMessage: 'Create an account' }),
    signupDesc: t('signupDesc', { defaultMessage: 'Enter your email below to create your account' }),
    email: t('email', { defaultMessage: 'Email' }),
    password: t('password', { defaultMessage: 'Password' }),
    confirmPassword: t('confirmPassword', { defaultMessage: 'Confirm Password' }),
    signIn: t('signIn', { defaultMessage: 'Sign In' }),
    signUp: t('signUp', { defaultMessage: 'Sign Up' }),
    noAccount: t('noAccount', { defaultMessage: "Don't have an account?" }),
    hasAccount: t('hasAccount', { defaultMessage: 'Already have an account?' }),
    signUpNow: t('signUpNow', { defaultMessage: 'Sign Up Now' }),
    signInNow: t('signInNow', { defaultMessage: 'Sign In Now' }),
    orEmail: t('orEmail', { defaultMessage: 'Or continue with email' }),
  };

  return (
    <div className="flex w-full flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 landscape:justify-start landscape:py-6 md:landscape:justify-center relative overflow-y-auto">

      <div className="z-45 w-full max-w-[1000px] grid grid-cols-1 md:grid-cols-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden rounded-2xl md:rounded-3xl min-h-[500px]">

        {/* 左侧品牌区 (保持不变) */}
        <div className="hidden md:flex md:col-span-2 relative bg-slate-900 items-center justify-center p-8 text-white overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-black opacity-80 z-0" />
          
          <div className="relative z-10 flex flex-col items-center gap-4 text-center">
            <Link href="/" > 
              {siteConfig.logoDark && (
                <Image
                  src={siteConfig.logoDark}
                  alt="Logo"
                  width={150}
                  height={100}
                  className="object-contain opacity-90 drop-shadow-2xl"
                  priority
                />
              )}
            </Link>
            <h2 className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-400">ATOM Platform</h2>
            <p className="text-slate-300 text-[16px] max-w-[240px] leading-relaxed">
              {"Launch Your Dream Startup with "}            
             <span className="text-[16px] inline-block">
                <TypewriterText
                  words={["AI Support", " Zero Cost", "Infinite Scale"]}
                  className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-600"
                  cursorClassName="bg-blue-500 h-[0.8em]"
                />
            </span>
            </p>
          </div>
        </div>

        {/* 🟢 右侧表单区：替换为 AuthForm 组件 */}
        <Suspense fallback={<div className="col-span-1 md:col-span-3 flex items-center justify-center">Loading...</div>}>
          <AuthForm 
            specificProviders={specificProviders}
            commonProviders={commonProviders}
            error={errorMessage}
            message={msgString}
            dict={dict}
          />
        </Suspense>

      </div>
      
      <p className="mt-8 mb-2 text-[10px] text-slate-400 text-center px-4 max-w-md mx-auto leading-relaxed">
          © {new Date().getFullYear()} {siteConfig.name}. By continuing, you agree to our Terms of Service and Privacy Policy.
      </p>

    </div>
  );
}