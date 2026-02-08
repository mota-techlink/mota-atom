import Link from "next/link"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Github, LayoutDashboard } from "lucide-react"
import { HeroSection } from "@/components/sections/hero-section";
import { FeaturesSection } from "@/components/sections/features";

export default function IndexPage() {
  return (
    <>
      {/* --- Hero Section --- */}
      <HeroSection />

      {/* --- Features Grid Section --- */}
      <section id="features" className="container space-y-6 bg-slate-50 dark:bg-transparent  mx-auto">        
        <FeaturesSection />
        
        {/* 底部文字区域 */}
        <div className="mx-auto text-center md:max-w-[58rem]">
          <p className="leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            MOTA ATOM also includes a blog and a full documentation site. Built using MDX and Contentlayer.
          </p>
        </div>
      </section>
      
      {/* --- Open Source Section --- */}
      <section className="container py-8 md:py-10 lg:py-20 mx-auto">
         <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
              Proudly Open Source
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              MOTA ATOM is open source and powered by open source software. <br /> 
              The code is available on GitHub.
            </p>
            <Link href={siteConfig.links.github} target="_blank" className="underline underline-offset-4">
               View on GitHub
            </Link>
         </div>
      </section>
    </>
  )
}