import Link from "next/link"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Github, LayoutDashboard } from "lucide-react"
import { HeroSection } from "@/components/sections/hero-section";

export default function IndexPage() {
  return (
    <>
      {/* --- Hero Section --- */}
      <HeroSection />

      {/* --- Features Grid Section --- */}
      <section id="features" className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24 mx-auto">
        {/* 🔴 修复点 2：Features 标题区域也加 mx-auto */}
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            Features
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            This project is an experiment to see how a modern app, with features like auth, subscriptions, API routes, and static pages would work in Next.js 15 App Router.
          </p>
        </div>

        {/* 🔴 修复点 3：Grid 容器强制 mx-auto */}
        {/* justify-center 在列数填不满一行时（比如窄屏）非常关键 */}
        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
          {siteConfig.features.map((feature) => (
            <div key={feature.title} className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <LayoutDashboard className="h-12 w-12 opacity-80" /> 
                <div className="space-y-2">
                  <h3 className="font-bold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* 底部文字区域 */}
        <div className="mx-auto text-center md:max-w-[58rem]">
          <p className="leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Taxonomy also includes a blog and a full documentation site. Built using MDX and Contentlayer.
          </p>
        </div>
      </section>
      
      {/* --- Open Source Section --- */}
      <section className="container py-8 md:py-12 lg:py-24 mx-auto">
         <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
              Proudly Open Source
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Taxonomy is open source and powered by open source software. <br /> 
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