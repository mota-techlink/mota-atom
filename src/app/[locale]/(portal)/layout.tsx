import Link from "next/link"
import Image from "next/image"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { siteConfig } from "@/config/site"
import { MainNav } from "@/components/main-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { MobileNav } from "@/components/mobile-nav" 
import { ScrollToTop } from "@/components/scroll-to-top" 
import { BionicToggle } from '@/components/ui/bionic-toggle';
import { SiteFooter } from "@/components/site-footer"
import { useTranslations } from 'next-intl';
import { LanguageToggle } from '@/components/language-toggle';

import { generateLocaleParams } from "@/lib/static-helper";

// 🔴 1. 先删掉这行，不要强制 force-static
// export const dynamic = staticMode; 


// 🟢 2. 保留这个，Next.js 会自动识别并做 SSG
export function generateStaticParams() {
  const params = generateLocaleParams();
  
  // 🔍 3. 加上这行 Log，看看到底生成了什么！
  // 在终端里看输出 (不是浏览器控制台)
  console.log('Build Params:', JSON.stringify(params, null, 2));
  
  return params;
}

interface PortalLayoutProps {
  children: React.ReactNode
}

export default function PortalLayout({ children }: PortalLayoutProps) {
  const t = useTranslations('Nav')
  return (
    <div className="flex min-h-screen flex-col bg-background ">
      
      {/* --- Header --- */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        
        {/* 🔴 关键修改：添加 max-w-screen-xl 和 mx-auto */}
        {/* 这样在大屏幕上，内容区也不会超过 1280px */}
        <div className="container flex h-14 items-center max-w-screen-xl mx-auto pl-[2%] pr-[2%] ">          
          <Link href="/" className="mr-6 pt-2 flex items-center space-x-2"> 
          {/* 1. Left: Logo*/}
          {/* 🌞 Light Mode Logo (亮色模式显示黑色 Logo) */}          

          <div className="relative w-[140px] h-[55px] dark:hidden mar-2">
              <Image 
                src={siteConfig.logoLight}
                alt="Mota Techlink" 
                fill 
                className="object-contain object-left" // object-left 确保 Logo 靠左对齐
                priority
              />
          </div>

          {/* 🌙 Dark Mode Logo (暗色模式显示白色 Logo) */}
          <div className="relative w-[140px] h-[55px] hidden dark:block">
              <Image 
                src={siteConfig.logoDark}
                alt="Mota Techlink" 
                fill 
                className="object-contain object-left"
                priority
              />
          </div>
          </Link> 

          {/* 2. Center: Navigation */}
          <div className="hidden md:flex flex-1 justify-center">
             <MainNav />
          </div>

          {/* 3. Right: Actions */}
          <div className="flex flex-1 items-center justify-end space-x-2 md:justify-end">
            <nav className="flex items-center space-x-2">
              
              <div className="hidden md:flex items-center space-x-2">
                <Link
                  href="/login"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    "px-4"
                  )}
                >
                  {t('login')}
                </Link>
                <Link
                  href="/register"
                  className={cn(
                    buttonVariants({ variant: "default", size: "sm" }),
                    "px-4"
                  )}
                >
                  {t('getStarted')}
                </Link>
              </div>
              <LanguageToggle />
              <ModeToggle />
              <BionicToggle />
              
              
              {/* 🔴 Mobile Menu Trigger (仅在小屏显示) */}
              <div className="md:hidden">
                 <MobileNav />
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* --- Main Content --- */}
      <main className="flex-1 relative">
        {/* 注意：Landing Page 内部 (page.tsx) 也有自己的宽度限制 (max-w-[64rem]) */}
        {/* 如果你希望内容也和导航栏一样宽，可以在 page.tsx 里把 max-w-[64rem] 改为 max-w-screen-xl */}
        <div className="max-w-screen-xl mx-auto px-[2%] w-full py-8 lg:py-12">
        {/* <div className="max-w-screen-xl mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 w-full "> */}
 
          {children}
 
          
        </div>
      </main>
      <SiteFooter />
      
      <ScrollToTop />
    </div>
  )
}