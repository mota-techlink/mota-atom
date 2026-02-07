import Link from "next/link"
import { siteConfig } from "@/config/site";
import { emailLogin, signup } from "@/app/auth/actions";
import { getTranslations } from 'next-intl/server';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Image from "next/image";
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import ClientOAuthHandler from "./client-oauth-handler";
import { TypewriterText } from "@/components/ui/typewriter-text"; 

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

  // 合并所有需要显示的 Providers
  const specificProviders = siteConfig.oauth.regionSpecific[locale] || [];
  const commonProviders = siteConfig.oauth.common;
  const allProviders = [...commonProviders, ...specificProviders ]; // 修正顺序：特定的在前面

  const errorMessage = Array.isArray(error) ? error[0] : error;
  const msgString = Array.isArray(message) ? message[0] : message;

  return (
    // 1. 最外层容器
    // min-h-screen: 占满全屏高度
    // flex items-center justify-center: 确保卡片在屏幕正中间 (解决“移到太上”的问题)
    // p-4: 防止卡片贴边
    // landscape:items-start: 手机横屏时，改为顶部对齐，防止垂直居中导致头部被切掉
    // landscape:py-6: 横屏时给上下留点空隙
    
    
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 landscape:justify-start landscape:py-6 md:landscape:justify-center relative overflow-y-auto">

      {/* 2. 主卡片容器
         w-full max-w-[1000px]: 桌面端宽屏限制
         min-h-[500px]: 最小高度，保证视觉分量
         grid-cols-1 md:grid-cols-5: 移动端单列，桌面端 2:3 分割
      */}
      <div className="z-10 w-full max-w-[1000px] grid grid-cols-1 md:grid-cols-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden rounded-2xl md:rounded-3xl min-h-[500px]">

        {/* 3. 左侧品牌/视觉区 (仅在桌面端显示) */}
        <div className="hidden md:flex md:col-span-2 relative bg-slate-900 items-center justify-center p-8 text-white overflow-hidden">
          {/* 背景装饰 */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-black opacity-80 z-0" />
          
          {/* 品牌内容 */}
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

        {/* 4. 右侧表单区
           flex flex-col justify-center: 竖屏/桌面端垂直居中
           landscape:grid landscape:grid-cols-2: 手机横屏改为左右两列网格布局
           md:landscape:flex: 平板/桌面横屏强制回退到 Flex 列布局 (防止布局崩坏)
        */}
        <div className="col-span-1 md:col-span-3 p-6 md:p-8 lg:p-12 relative 
                        flex flex-col justify-center 
                        landscape:grid landscape:grid-cols-2 landscape:gap-x-8 landscape:content-center
                        md:landscape:flex md:landscape:flex-col md:landscape:gap-0">

          {/* ==================== 第一板块 (Logo/标题/OAuth) ==================== */}
          <div className="w-full flex flex-col justify-center landscape:justify-start">
            
            {/* 移动端 Logo (横屏时为了省空间，建议隐藏或缩小) */}
            <div className="md:hidden flex justify-center mb-6 landscape:hidden">
              <Link href="/" > 
               {siteConfig.logoDark && <Image src={siteConfig.logoDark} alt="Logo" width={100} height={100} className="object-contain dark:hidden" />}
               {siteConfig.logoDark && <Image src={siteConfig.logoDark} alt="Logo" width={100} height={100} className="object-contain hidden dark:block" />}
               </Link>
            </div>

            {/* 标题 */}
            <div className="flex flex-col space-y-1 text-center md:text-left landscape:text-left mb-6 landscape:mb-3">
              <h1 className="text-2xl font-bold tracking-tight landscape:text-xl">
                {t('loginTitle', { defaultMessage: 'Welcome back' })}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 landscape:text-xs">
                {t('loginDesc', { defaultMessage: 'Sign in to your account' })}
              </p>
            </div>

            {/* OAuth 按钮组 */}
            <div className="flex flex-wrap justify-center  md:justify-start landscape:justify-start gap-3 mb-6 landscape:mb-0">
            
              {allProviders.map((provider) => (
                <ClientOAuthHandler key={provider.id} provider={provider} />
              ))}
            </div>
            
             {/* 手机横屏时的中间分割线 (视觉装饰) */}
             <div className="hidden landscape:block md:landscape:hidden absolute right-0 top-12 bottom-12 w-[1px] bg-slate-100 dark:bg-slate-800" />
          </div>


          {/* ==================== 第二板块 (分割线/表单/注册) ==================== */}
          <div className="w-full flex flex-col justify-center pt-5">
            
            {/* 分割线 OR (横屏隐藏) */}
            <div className="relative mb-6 landscape:hidden md:landscape:block">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="bg-white dark:bg-slate-900 px-3 text-slate-500">
                  Or continue with email
                </span>
              </div>
            </div>

            {/* 错误提示 */}
            {errorMessage && (
              <Alert variant="destructive" className="mb-4 py-2">
                <AlertCircle className="h-4 w-4" />                
                <AlertDescription className="text-s">{errorMessage}</AlertDescription>
              </Alert>
            )}
             {msgString && (
              <Alert className="mb-4 py-2">
                <AlertDescription className="text-xs">{msgString}</AlertDescription>
              </Alert>
            )}

            {/* 邮箱表单 */}
            <form className="space-y-3 landscape:space-y-2">
              <div className="grid gap-1.5">
                <Label htmlFor="email" className="text-s font-medium text-slate-700 dark:text-slate-300">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  className="h-10 landscape:h-9 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 text-sm"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="password" className="text-s font-medium text-slate-700 dark:text-slate-300">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="h-10 landscape:h-9 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 text-sm"
                />
              </div>

              <Button 
                formAction={emailLogin} 
                className="w-full h-10 landscape:h-9 text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-slate-200 transition-colors mt-2"
              >
                Sign In
              </Button>
            </form>

            {/* 底部注册链接 */}
            <div className="mt-6 landscape:mt-3 text-center text-xs">
              <span className="text-slate-500 dark:text-slate-400">Don&apos;t have an account? </span>
              <Button
                variant="link"
                className="p-0 h-auto font-semibold underline underline-offset-4 text-slate-900 dark:text-white hover:text-brand"
                formAction={signup}
              >
                Sign Up Now
              </Button>
            </div>
          </div>

        </div>
      </div>
      
      {/* 5. 底部版权信息 (移出卡片，放在最外层，确保显示) 
          mt-8: 与卡片保持距离
          mb-2: 底部留白
          text-slate-400: 颜色改淡一点，不抢视觉
      */}
      <p className="mt-8 mb-2 text-[10px] text-slate-400 text-center px-4 max-w-md mx-auto leading-relaxed">
          © {new Date().getFullYear()} {siteConfig.name}. By continuing, you agree to our Terms of Service and Privacy Policy.
      </p>

    </div>
  );
}