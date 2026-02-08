// app/[locale]/login/auth-form.tsx
'use client';

import { useState, useEffect, FormEvent } from 'react';
import { emailLogin, signup } from "@/app/auth/actions";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ClientOAuthHandler from "./client-oauth-handler";
import { OAuthProviderConfig } from '@/config/site';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

interface AuthFormProps {
  specificProviders: OAuthProviderConfig[];
  commonProviders: OAuthProviderConfig[];
  error?: string;
  message?: string;
  dict: any;
}

export default function AuthForm({
  specificProviders,
  commonProviders,
  error,
  message,
  dict,
}: AuthFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL 参数判断视图
  const isLogin = searchParams.get('view') !== 'signup';

  // 状态管理
  const [globalError, setGlobalError] = useState<string | null>(error || null);
  const [globalMessage, setGlobalMessage] = useState<string | null>(message || null);
  
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 🟢 修复 1：初始化状态并清洗 URL
  useEffect(() => {
    // 1. 如果 props 有值，同步到本地 state (确保 URL 清洗后提示框不消失)
    if (error) setGlobalError(error);
    if (message) setGlobalMessage(message);

    // 2. 如果 URL 中包含 message 或 error，使用 replaceState 无感清除
    // 这样地址栏干净了，但 React 组件因为没有重新渲染，state 里的提示还在
    const params = new URLSearchParams(searchParams.toString());
    if (params.has('error') || params.has('message')) {
      params.delete('error');
      params.delete('message');
      
      // 构造新 URL
      const newUrl = `${pathname}${params.toString() ? `?${params.toString()}` : ''}`;
      
      // 替换历史记录 (不刷新页面，不触发 Next.js 导航)
      window.history.replaceState({}, '', newUrl);
    }
  }, [error, message, pathname, searchParams]);

  const toggleMode = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (isLogin) {
      params.set('view', 'signup');
    } else {
      params.delete('view');
    }
    setGlobalError(null);
    setGlobalMessage(null); // 切换模式时清空消息
    setPasswordError(null);
    setEmailError(null);
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // 重置错误
    setGlobalError(null);
    setGlobalMessage(null);
    setPasswordError(null);
    setEmailError(null);

    // 客户端校验
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setEmailError(dict.invalidEmail || "Invalid email address");
      return;
    }

    if (!isLogin) {
      const confirmPassword = formData.get('confirmPassword') as string;
      if (password !== confirmPassword) {
        setPasswordError(dict.passwordMismatch || "Passwords do not match");
        return;
      }
    }

    setIsLoading(true);
    try {
      if (isLogin) {
        // 登录
        await emailLogin(formData);
      } else {
        // 注册
        const result = await signup(formData);
        if (result?.error) {
          setGlobalError(result.error);
        } else if (result?.success) {
          router.push('/login?message=check_email');
        }
      }
    } catch (err: any) {
      // 🟢 修复 2：解决跳转时的闪烁报错问题
      // Next.js 的 redirect() 是通过抛出一个特定的错误来实现的
      // 这个错误的 digest 属性通常包含 'NEXT_REDIRECT'
      if (err?.digest?.includes('NEXT_REDIRECT')) {
        // 这是一个正常的重定向，不是错误，直接抛出让 Next.js 处理
        throw err;
      }

      // 只有不是重定向的错误，才显示报错信息
      console.error("Login Error:", err);
      setGlobalError("Something went wrong. Please try again.");
    } finally {
      // 注意：如果发生了 redirect (throw err)，finally 依然会执行
      // 但因为页面即将跳转卸载，这里设为 false 也无妨
      setIsLoading(false);
    }
  };

  // 优先显示本地状态，其次是 props
  const displayError = globalError;
  const displayMessage = globalMessage;

  return (
    <div className="col-span-1 md:col-span-3 p-4 md:p-10 lg:p-12 relative 
                    flex flex-col justify-center 
                    landscape:grid landscape:grid-cols-2 landscape:gap-x-8 landscape:content-center
                    md:landscape:flex md:landscape:flex-col md:landscape:gap-0">

      {/* 第一板块 (Title & OAuth) */}
      <div className="w-full flex flex-col justify-center landscape:justify-start">
        <div className="flex flex-col space-y-1 text-center md:text-left landscape:text-left mb-6 landscape:mb-3">
          <h1 className="text-2xl font-bold tracking-tight landscape:text-xl">
            {isLogin ? dict.loginTitle : dict.signupTitle}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 landscape:text-xs">
            {isLogin ? dict.loginDesc : dict.signupDesc}
          </p>
        </div>

        <div className="flex flex-wrap justify-center md:justify-start landscape:justify-start gap-3 mb-6 landscape:mb-0">
          {commonProviders.map((provider) => (
            <ClientOAuthHandler key={provider.id} provider={provider} />
          ))}              
        </div>            

        {specificProviders.length > 0 && (
          <div className="flex flex-wrap justify-center md:justify-start landscape:justify-start gap-3 mb-6 landscape:mb-0">
            {specificProviders.map((provider) => (
              <ClientOAuthHandler key={provider.id} provider={provider} />
            ))}
          </div>
        )} 
        <div className="hidden landscape:block md:landscape:hidden absolute right-0 top-12 bottom-12 w-[1px] bg-slate-100 dark:bg-slate-800" />
      </div>

      {/* 第二板块 (Form) */}
      <div className="w-full flex flex-col justify-center pt-5">
        
        <div className="relative mb-6 landscape:hidden md:landscape:block">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-200 dark:border-slate-800" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase">
            <span className="bg-white dark:bg-slate-900 px-3 text-slate-500">
              {dict.orEmail}
            </span>
          </div>
        </div>

        {/* 错误提示 */}
        {displayError && (
          <Alert variant="destructive" className="mb-4 py-2 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="h-4 w-4" />                
            <AlertDescription className="text-xs">{displayError}</AlertDescription>
          </Alert>
        )}
        {/* 成功/普通消息提示 */}
        {displayMessage && !displayError && (
          <Alert className="mb-4 py-2 border-green-500 text-green-600 bg-green-50 dark:bg-green-900/20 animate-in fade-in slide-in-from-top-2">
            <AlertDescription className="text-xs">{displayMessage}</AlertDescription>
          </Alert>
        )}

        {/* 表单 */}
        <form onSubmit={handleSubmit} className="space-y-3 landscape:space-y-2">
          <div className="grid gap-1.5">
            <Label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {dict.email}
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              required
              className={`h-10 landscape:h-9 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 text-sm ${emailError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
            />
            {emailError && (
              <p className="text-[11px] text-red-500 font-medium ml-1 animate-in slide-in-from-top-1">
                {emailError}
              </p>
            )}
          </div>
          
          <div className="grid gap-1.5">
            <Label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {dict.password}
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              className="h-10 landscape:h-9 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 text-sm"
            />
          </div>

          {!isLogin && (
            <div className="grid gap-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {dict.confirmPassword}
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className={`h-10 landscape:h-9 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 text-sm ${passwordError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              />
              {passwordError && (
                <p className="text-[20px] text-red-500 font-medium ml-1 animate-in slide-in-from-top-1">
                  {passwordError}
                </p>
              )}
            </div>
          )}

          <Button 
            type="submit"
            disabled={isLoading}
            className="w-full h-10 landscape:h-9 text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-slate-200 transition-colors mt-2"
          >
            {isLoading ? "Wait a moment..." : (isLogin ? dict.signIn : dict.signUp)}
          </Button>
        </form>

        <div className="mt-6 landscape:mt-3 text-center text-xs">
          <span className="text-slate-500 dark:text-slate-400">
            {isLogin ? dict.noAccount : dict.hasAccount}{" "}
          </span>
          <button
            type="button"
            onClick={toggleMode}
            className="font-semibold underline underline-offset-4 text-slate-900 dark:text-white hover:text-brand"
          >
            {isLogin ? dict.signUpNow : dict.signInNow}
          </button>
        </div>
      </div>
    </div>
  );
}