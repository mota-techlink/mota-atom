import { Metadata } from "next";
import Link from "next/link";

import { getContents } from '@/lib/mdx';
import { 
  Bot, 
  Video, 
  Database, 
  Eye, 
  Cpu, 
  Eraser, 
  Layers, 
  ArrowRight, 
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "MOTA ATOM Solutions - Empower Your Business",
  description: "Explore our suite of AI products tailored for enterprise efficiency and visual innovation.",
};

// 🛠️ 配置中心：定义每个产品的图标、排序权重和所属分类
// key 必须对应你的 mdx 文件名 (slug)
const PRODUCT_CONFIG: Record<string, any> = {
  // Group 1: 视觉与交互 (Visual Experience)
  "digital-human": { 
    icon: Video, 
    order: 1, 
    color: "text-purple-500", 
    bg: "bg-purple-500/10 border-purple-500/20",
    badge: "Hot" 
  },
  "watermark-remover": { 
    icon: Eraser, 
    order: 2, 
    color: "text-pink-500", 
    bg: "bg-pink-500/10 border-pink-500/20" 
  },
  
  // Group 2: 企业效能 (Enterprise Efficiency)
  "local-knowledge-chatbot": { 
    icon: Bot, 
    order: 3, 
    color: "text-blue-500", 
    bg: "bg-blue-500/10 border-blue-500/20",
    badge: "Enterprise"
  },
  "synthetic-data-labeling": { 
    icon: Database, 
    order: 4, 
    color: "text-cyan-500", 
    bg: "bg-cyan-500/10 border-cyan-500/20" 
  },

  // Group 3: 硬核技术 (Deep Tech)
  "visual-model-training": { 
    icon: Eye, 
    order: 5, 
    color: "text-indigo-500", 
    bg: "bg-indigo-500/10 border-indigo-500/20" 
  },
  "edge-ai-quantization": { 
    icon: Cpu, 
    order: 6, 
    color: "text-emerald-500", 
    bg: "bg-emerald-500/10 border-emerald-500/20" 
  },
  "ai-custom-solutions": { 
    icon: Layers, 
    order: 7, 
    color: "text-slate-500", 
    bg: "bg-slate-500/10 border-slate-500/20",
    colSpan: "md:col-span-2 lg:col-span-3" // 让最后一个“解决方案”占满一行，显得大气
  },
};

export default async function AIProductListPage({ params }: { params: { locale: string } }) {
  const { locale } = await params;
  
  // 1. 获取所有 MOTA ATOM 产品  
  const products = getContents("mota-ai");
  // 2. 排序逻辑：有配置的按 order 排，没配置的放最后
  const sortedProducts = products.sort((a, b) => {
    const orderA = PRODUCT_CONFIG[a.slug]?.order ?? 99;
    const orderB = PRODUCT_CONFIG[b.slug]?.order ?? 99;
    return orderA - orderB;
  });

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      
      {/* 🔮 背景装饰：科技感光晕 */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/20 blur-[120px] rounded-full pointer-events-none -z-10 mix-blend-screen" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none -z-10 mix-blend-screen" />

      <div className="container mx-auto pt-2 px-4 py-16 lg:py-24">
        
        {/* === Header 区域 === */}
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-6">
          <div className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-500 mb-4">
            <Sparkles className="mr-2 h-4 w-4" />
            MOTA ATOM Intelligence Suite
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
            Intelligent Solutions for <br/>
            <span className="text-blue-500">Future Business</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            From generative digital humans to edge AI quantification, explore our cutting-edge models designed to automate and scale your operations.
          </p>
        </div>

        {/* === Product Grid (Bento Style) === */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProducts.map((product) => {
            const config = PRODUCT_CONFIG[product.slug] || { 
              icon: Layers, 
              color: "text-slate-500", 
              bg: "bg-slate-500/10 border-slate-500/20" 
            };
            const Icon = config.icon;

            return (
              <Link 
                key={product.slug} 
                href={`/products/mota-ai/${product.slug}`}
                className={cn(
                  "group relative overflow-hidden rounded-3xl border bg-card/50 backdrop-blur-sm p-8 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1",
                  "flex flex-col justify-between h-full", // 保证卡片高度一致
                  config.colSpan // 特殊布局（如最后一个占满一行）
                )}
              >
                {/* 悬停时的光效背景 */}
                <div className={cn(
                  "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10",
                  "bg-gradient-to-br from-transparent via-transparent to-blue-500/5"
                )} />

                <div>
                  {/* Header: Icon & Badge */}
                  <div className="flex justify-between items-start mb-6">
                    <div className={cn("p-3 rounded-2xl w-fit", config.bg)}>
                      <Icon className={cn("w-8 h-8", config.color)} />
                    </div>
                    {config.badge && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                        {config.badge}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <h2 className="text-2xl font-bold mb-3 group-hover:text-blue-500 transition-colors">
                    {product.metadata.title}
                  </h2>
                  <p className="text-muted-foreground line-clamp-3 mb-6">
                    {product.metadata.description}
                  </p>
                </div>

                {/* Footer: Tech Stack & CTA */}
                <div className="mt-auto">
                   {/* 这里可以放一些技术栈的小标签，如果 metadata 里有的话 */}
                   <div className="flex flex-wrap gap-2 mb-6">
                      {product.metadata.techStack?.slice(0, 3).map((tech: string) => (
                        <span key={tech} className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                          {tech}
                        </span>
                      ))}
                   </div>

                   <div className="flex items-center text-sm font-medium text-blue-500 group-hover:translate-x-1 transition-transform">
                      View Solution <ArrowRight className="ml-2 w-4 h-4" />
                   </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* === Bottom CTA Section === */}
        <div className="mt-24 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 md:p-16 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20" /> {/* 可选网格背景 */}
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold">Need a Custom AI Solution?</h2>
            <p className="text-blue-100 text-lg">
              We specialize in tailoring models for specific industry needs. From fine-tuning LLMs to embedded deployment.
            </p>
            <div className="flex justify-center gap-4 pt-4">
              <Link href="/contact">
                <Button size="lg" variant="secondary" className="font-semibold">
                  Talk to an Expert
                </Button>
              </Link>
              <Link href="/showcase">
                <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600">
                  See Success Cases
                </Button>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}