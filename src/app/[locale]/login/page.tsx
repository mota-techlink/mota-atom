// app/[locale]/login/page.tsx
import { siteConfig } from "@/config/site";
import { getTranslations } from 'next-intl/server';
import { LoginPanel } from "@/components/auth/login-panel";

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
    forgotPassword: t('forgotPassword', { defaultMessage: 'Forgot password?' }),
  };

  return (
    <div className="flex w-full flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 landscape:justify-start landscape:py-6 md:landscape:justify-center relative overflow-y-auto">

      <LoginPanel
        specificProviders={specificProviders}
        commonProviders={commonProviders}
        dict={dict}
        mode="page"
        error={errorMessage}
        message={msgString}
      />

      <p className="mt-8 mb-2 text-[15px] text-slate-400 text-center px-4 max-w-md mx-auto leading-relaxed pb-20">
        © {new Date().getFullYear()} {siteConfig.name}. By continuing, you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  );
}