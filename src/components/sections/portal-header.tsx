'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { siteConfig } from "@/config/site"
import { MainNav } from "@/components/sections/main-nav"
import { MobileNav } from "@/components/sections/mobile-nav" 
import { ScrollToTop } from "@/components/scroll-to-top" 
import { BionicToggle } from '@/components/ui/bionic-toggle';
import { SiteFooter } from "@/components/sections/site-footer"
import { GlobalToggles } from '@/components/global-toggles';
import { LoginModal } from '@/components/auth/login-modal';
import { UserNav } from "@/components/sections/user-nav";
import { createBrowserClient } from "@supabase/ssr";
import { DashboardLogo } from '../dashboard-logo';

interface PortalHeaderProps {
  locale: string;
  specificProviders: any[];
  commonProviders: any[];
}

export function PortalHeader({
  locale,
  specificProviders,
  commonProviders,
}: PortalHeaderProps) {
  const t = useTranslations('Nav');
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [signupModalOpen, setSignupModalOpen] = useState(false);
  const [user, setUser] = useState<any>(undefined); // 使用 undefined 来区分"加载中"和"未登录"
  const [isLoading, setIsLoading] = useState(true);

  // 初始化 Supabase 客户端
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // 获取当前用户信息
  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error("Failed to get user:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getUser();

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
      } else if (event === 'SIGNED_IN') {
        setUser(session?.user || null);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [supabase]);

  const dict = {
    loginTitle: 'Welcome back',
    signupTitle: 'Create an account',
    loginDesc: 'Sign in to your account',
    signupDesc: 'Enter your email below to create your account',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    noAccount: "Don't have an account?",
    hasAccount: 'Already have an account?',
    signUpNow: 'Sign Up Now',
    signInNow: 'Sign In Now',
    forgotPassword: 'Forgot password?',
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center max-w-screen-xl mx-auto pl-[2%] pr-[2%] ">                    
          <DashboardLogo/>

          <div className="hidden md:flex flex-1 justify-center">
             <MainNav />
          </div>

          <div className="flex flex-1 items-center justify-end space-x-2 md:justify-end">
            <nav className="flex items-center space-x-2">
              
              <div className="hidden md:flex items-center space-x-2">
                {user !== undefined ? (
                  // 已完成加载：要么有用户，要么没有用户
                  user ? (
                    // 用户已登录，显示 UserNav
                    <UserNav user={user} />
                  ) : (
                    // 用户未登录，显示登录和注册按钮
                    <>
                      <button
                        onClick={() => setLoginModalOpen(true)}
                        className={cn(
                          buttonVariants({ variant: "ghost", size: "sm" }),
                          "px-4"
                        )}
                      >
                        {t('login')}
                      </button>
                      <button
                        onClick={() => setSignupModalOpen(true)}
                        className={cn(
                          buttonVariants({ variant: "default", size: "sm" }),
                          "px-4"
                        )}
                      >
                        {t('getStarted')}
                      </button>
                    </>
                  )
                ) : (
                  // 还在加载中，显示空（不显示任何东西，避免闪烁）
                  null
                )}
              </div>
              <GlobalToggles position="inline" zIndex={51} />
              <BionicToggle />
              
              <div className="md:hidden">
                 <MobileNav />
              </div>
            </nav>
          </div>
        </div>
      </header>

      <LoginModal
        open={loginModalOpen}
        onOpenChange={setLoginModalOpen}
        specificProviders={specificProviders}
        commonProviders={commonProviders}
        isSignup={false}
        dict={dict}
      />

      <LoginModal
        open={signupModalOpen}
        onOpenChange={setSignupModalOpen}
        specificProviders={specificProviders}
        commonProviders={commonProviders}
        isSignup={true}
        dict={dict}
      />
    </>
  );
}
