"use client"

import * as React from "react"
import Link, { LinkProps } from "next/link"
import { useRouter } from "next/navigation"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Menu } from "lucide-react"
import { useTranslations } from "next-intl"
import { mainNavConfig } from "@/config/nav" // 🟢 引入同一个配置
import { LoginModal } from "@/components/auth/login-modal"
import { createBrowserClient } from "@supabase/ssr"

export function MobileNav() {
  const [open, setOpen] = React.useState(false)
  const [loginModalOpen, setLoginModalOpen] = React.useState(false)
  const [signupModalOpen, setSignupModalOpen] = React.useState(false)
  const [user, setUser] = React.useState<any>(undefined) // 🟢 新增：用户状态
  const t = useTranslations('Nav') // 🟢 引入翻译

  // 🟢 初始化 Supabase 客户端
  const supabase = React.useMemo(() => 
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    ),
    []
  )

  // 🟢 获取当前用户信息
  React.useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
      } catch (error) {
        console.error("Failed to get user:", error)
      }
    }
    getUser()

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null)
      } else if (event === 'SIGNED_IN') {
        setUser(session?.user || null)
      }
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [supabase])

  // Provider 配置
  const specificProviders = siteConfig.oauth.regionSpecific['en'] || [];
  const commonProviders = siteConfig.oauth.common;

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
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="mr-1 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="pr-0">
          <MobileLink
            href="/"
            className="flex items-center"
            onOpenChange={setOpen}
          >
            <span className="font-bold">{siteConfig.name}</span>
          </MobileLink>
          <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
            <div className="flex flex-col space-y-3">
              <Accordion type="single" collapsible className="w-full">
                {mainNavConfig.map((item, index) => {
                  // 情况 1: 有子菜单
                  if ("items" in item && item.items) {
                    return (
                      <AccordionItem value={item.title} key={index} className="border-b-0">
                        <AccordionTrigger className="text-base font-medium py-4 hover:no-underline">
                          {t(item.title)}
                        </AccordionTrigger>
                        <AccordionContent className="flex flex-col space-y-2 pb-4 pl-4">
                          {item.items.map((subItem) => (
                            <MobileLink
                              key={subItem.href}
                              href={subItem.href || "#"}
                              onOpenChange={setOpen}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              {/* 移动端通常不需要描述，只显示标题 */}
                              {t(`items.${subItem.title}.title`)}
                            </MobileLink>
                          ))}
                        </AccordionContent>
                      </AccordionItem>
                    )
                  }

                  // 情况 2: 普通链接
                  return (
                    <div key={index} className="py-4 border-b border-muted/20 last:border-0">
                       <MobileLink
                        href={item.href || "#"}
                        onOpenChange={setOpen}
                        className="text-base font-medium"
                      >
                        {t(item.title)}
                      </MobileLink>
                    </div>
                  )
                })}
              </Accordion>
            </div>
            
            {/* 🟢 只在未登录时显示登录和注册按钮 */}
            {user === null && (
              <div className="flex flex-col gap-4 mt-8 pr-6">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setLoginModalOpen(true);
                    setOpen(false);
                  }}
                >
                  Log In
                </Button>
                <Button 
                  className="w-full"
                  onClick={() => {
                    setSignupModalOpen(true);
                    setOpen(false);
                  }}
                >
                  Get Started
                </Button>
              </div>
            )}

          </ScrollArea>
        </SheetContent>
      </Sheet>

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
  )
}

// MobileLink 辅助组件保持不变...
interface MobileLinkProps extends LinkProps {
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
  className?: string
}

function MobileLink({
  href,
  onOpenChange,
  className,
  children,
  ...props
}: MobileLinkProps) {
  const router = useRouter()
  return (
    <Link
      href={href}
      onClick={() => {
        router.push(href.toString())
        onOpenChange?.(false)
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </Link>
  )
}