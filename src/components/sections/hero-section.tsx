import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { GifVideo } from "@/components/mdx/gif-video";
import { TypewriterText } from "@/components/ui/typewriter-text"; 
import { Github, ArrowRight, Twitter } from "lucide-react";
import { useTranslations } from "next-intl"
import { TechStackLogos } from "@/components/ui/tech-stack-logos"; // 👈 引入新组件

export function HeroSection() {
  const t = useTranslations('Hero');
  return (
    <section className="relative w-full overflow-hidden">
      
      {/* 🔮 背景光晕 */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-500/20 dark:bg-indigo-500/10 blur-[120px] rounded-[100%] pointer-events-none -z-10" />

      {/* --- Part 1: Hero 主体 --- */}
      {/* 🟢 关键修改 1: 确保 container 自身居中，并增加上下 padding 让呼吸感更好 */}
      <div className="container mx-auto px-4 md:px-6 pt-16 pb-16 md:pt-16 md:pb-16 flex justify-center">
        
        {/* 🟢 关键修改 2: Grid 布局
           - justify-between: 将左右两边推向两端
           - gap-4 lg:gap-8: 缩小间距，避免文字换行
        */}
        <div className="grid grid-cols-1 landscape:grid-cols-2 lg:grid-cols-2 gap-2 lg:gap-2 items-center justify-between w-full max-w-6xl">
          
          {/* 左侧：文字内容 */}
          <div className="flex flex-col items-center text-center landscape:items-start landscape:text-left lg:items-start lg:text-left space-y-8 order-1">
            
            {/* Badge */}
            <Link
              href={siteConfig.links.twitter}
              className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
            >
              <Twitter className="mr-2 h-4 w-4 fill-current" />
              Follow updates on Twitter
            </Link>

            {/* 标题 */}
            {/* 🟢 关键修改 3: 放宽文字区域的最大宽度限制 (max-w-2xl / lg:max-w-3xl) */}
            <div className="space-y-4 max-w-2xl lg:max-w-3xl">
              <h1 className="font-bold tracking-tighter text-foreground font-heading leading-tight">
                <span className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl block sm:inline text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-400">
                  Structuring{" "}
                </span>

                <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl inline-block">
                    <TypewriterText
                      words={["Chaos", "SaaS", "Assets", "Future"]}
                      className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-600"
                      cursorClassName="bg-blue-500 h-[0.8em]"
                    />
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 landscape:mx-0 leading-relaxed">
                {siteConfig.description}
              </p>
            </div>

            {/* 按钮组 */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center landscape:justify-start lg:justify-start">
              <Link 
                href="/login" 
                className={cn(
                  buttonVariants({ size: "lg" }), 
                  "rounded-full px-8 h-12 text-base shadow-lg shadow-blue-500/20 w-full sm:w-auto font-semibold"
                )}
              >
                {t('getStarted')} <ArrowRight className="ml-2 w-4 h-4" />
              </Link>

              <Link
                href={siteConfig.links.github}
                target="_blank"
                rel="noreferrer"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "rounded-full px-8 h-12 text-base bg-background/50 backdrop-blur-sm w-full sm:w-auto font-semibold"
                )}
              >
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Link>
            </div>
          </div>

          {/* 右侧：视觉动画  */}          
          <div className="relative aspect-square md:aspect-video overflow-hidden rounded-2xl border bg-muted/50 mx-auto lg:mx-0 order-2 mt-8  lg:mt-0 portrait:hidden landscape:block md:block w-[80%] pt-1
            lg:justify-self-end lg:ml-auto"
          >
           <div className="relative  animate-in fade-in zoom-in duration-1000 slide-in-from-right-10 flex items-center justify-center ">
             <GifVideo 
                  src="/videos/hero-cube.mp4" 
                  align="center" 
                  width="95%"
                  
                />
           </div>
        </div>
        </div>
      </div>

      {/*闪电效果*}      
      {/* <div className="animate-ping bg-slate-50 h-0.5 w-full rounded"></div> */}
      {/* --- Part 2: 底部 Trusted By --- */}
      <div className="container mx-auto relative max-w-5xl md:max-w-7xl px-6">
        <div className="border-t border-slate-200 dark:border-slate-800 w-full relative">
          <div
            aria-hidden="true"
            className="absolute top-0 left-1/2 h-px w-[300px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{
              background: "linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(255, 255, 255, 0) 0%, rgba(143, 143, 143, 0.67) 50%, rgba(0, 0, 0, 0) 100%)",
            }}
          />          
        </div>        
        <div className="py-12 sm:py-24 flex flex-col items-center">
          
          <p className="text-base md:text-lg text-muted-foreground mb-10 text-center max-w-lg">            
            {t('TrustedByCompanies')}                        
          </p>
          <TechStackLogos />
                   
        </div>        
      </div>
       <span className="animate-ping absolute inline-flex h-1 w-full rounded-full bg-sky-400 opacity-75"></span>    
      {/* <div className="animate-ping bg-slate-50 h-0.5 w-full rounded"></div> */}
    </section>
  );
}