//// src/app/[locale]/(partal)/layout.tsx
import { PortalHeader } from "@/components/sections/portal-header"
import { ScrollToTop } from "@/components/scroll-to-top" 
import { SiteFooter } from "@/components/sections/site-footer"
import { generateLocaleParams } from "@/lib/static-helper";
import { siteConfig } from "@/config/site";

// 🟢 2. 保留这个，Next.js 会自动识别并做 SSG
export function generateStaticParams() {
  const params = generateLocaleParams();
  
  // 🔍 3. 加上这行 Log，看看到底生成了什么！
  // 在终端里看输出 (不是浏览器控制台)
  console.log('Build Params:', JSON.stringify(params, null, 2));
  
  return params;
}

interface PortalLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function PortalLayout({ children, params }: PortalLayoutProps) {
  const { locale } = await params;

  // Provider 配置
  const specificProviders = siteConfig.oauth.regionSpecific[locale] || [];
  const commonProviders = siteConfig.oauth.common;

  return (
    <div className="flex min-h-screen flex-col bg-background ">
      
      {/* --- Header with Modal --- */}
      <PortalHeader
        locale={locale}
        specificProviders={specificProviders}
        commonProviders={commonProviders}
      />

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