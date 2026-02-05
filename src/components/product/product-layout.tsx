"use client"

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Check, Clock, RefreshCcw, ShieldCheck, ArrowRight, LayoutGrid } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

// 模拟 props，实际使用时替换为你的 MDX 数据
interface ProductLayoutProps {
  data: any; // 你的 MDX frontmatter 数据
  content: React.ReactNode; // MDX 正文内容
}

export function ProductLayout({ data, content }: ProductLayoutProps) {
  const [selectedImage, setSelectedImage] = useState(data.gallery[0]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* 1. Breadcrumb & Title Area */}
      <div className="mb-8">
        <nav className="text-sm text-muted-foreground mb-4">
           Products / {data.category || "AI Solutions"} / <span className="text-foreground font-medium">{data.title}</span>
        </nav>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">{data.title}</h1>
      </div>

      <div className="grid lg:grid-cols-[1fr_400px] gap-10">
        
        {/* === LEFT COLUMN: Content & Gallery === */}
        <div className="space-y-10">
          
          {/* A. Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-video w-full overflow-hidden rounded-xl border bg-muted">
              <Image 
                src={selectedImage} 
                alt={data.title} 
                fill 
                className="object-cover"
              />
            </div>
            {/* Thumbnails */}
            <div className="flex gap-4 overflow-x-auto pb-2">
              {data.gallery.map((img: string, idx: number) => (
                <button 
                  key={idx} 
                  onClick={() => setSelectedImage(img)}
                  className={`relative h-20 w-32 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${selectedImage === img ? 'border-primary' : 'border-transparent opacity-70 hover:opacity-100'}`}
                >
                  <Image src={img} alt="thumbnail" fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* B. About This Service (MDX Content) */}
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h3 className="text-xl font-bold mb-4">About This Service</h3>
            {content}
          </div>

          {/* C. Tech Stack (Icons) */}
          <div className="border rounded-xl p-6 bg-muted/30">
            <h3 className="text-lg font-semibold mb-4">Technologies We Use</h3>
            <div className="flex flex-wrap gap-3">
              {data.techStack.map((tech: string) => (
                <Badge key={tech} variant="secondary" className="px-3 py-1 text-sm">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          {/* D. Comparison Table (Fiverr Style) - 可选 */}
          <div className="hidden md:block">
            <h3 className="text-xl font-bold mb-6">Compare Packages</h3>
            <div className="border rounded-xl overflow-hidden">
               {/* 这里可以放一个 Table 组件对比三个套餐的详细参数 */}
               <div className="p-8 text-center text-muted-foreground bg-muted/20">
                  Detailed Feature Comparison Table Component Here
               </div>
            </div>
          </div>

          {/* E. FAQ Section */}
          <div>
            <h3 className="text-xl font-bold mb-6">Frequently Asked Questions</h3>
            <Accordion type="single" collapsible className="w-full">
              {data.faq.map((item: any, idx: number) => (
                <AccordionItem key={idx} value={`item-${idx}`}>
                  <AccordionTrigger>{item.question}</AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* F. Success Cases (Replacing Reviews) */}
          <div id="showcase">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Success Stories</h3>
              <Link href="/showcase" className="text-primary text-sm hover:underline flex items-center">
                View All <ArrowRight className="w-4 h-4 ml-1"/>
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
               {/* 这里应该循环渲染 data.relatedShowcases */}
               <Card className="hover:shadow-md transition-all cursor-pointer group">
                  <div className="aspect-video bg-muted relative overflow-hidden rounded-t-xl">
                    {/* Placeholder for showcase image */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"/>
                    <div className="absolute bottom-3 left-3 z-20 text-white font-medium">FinTech RAG Solution</div>
                  </div>
                  <CardFooter className="p-4 pt-3 text-sm text-muted-foreground group-hover:text-primary transition-colors">
                     See how we helped Client X reduce costs by 40%.
                  </CardFooter>
               </Card>
               {/* Repeat... */}
            </div>
          </div>

        </div>

        {/* === RIGHT COLUMN: Sticky Pricing Card === */}
        <div className="relative">
          <div className="sticky top-24 space-y-6">
            
            {/* 1. Pricing Tabs (The Fiverr Core) */}
            <Card className="border-2 border-primary/10 shadow-lg">
              <Tabs defaultValue="standard" className="w-full">
                <TabsList className="grid w-full grid-cols-3 rounded-none border-b h-14 bg-transparent p-0">
                  <TabsTrigger value="basic" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary h-full">Basic</TabsTrigger>
                  <TabsTrigger value="standard" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary h-full">Standard</TabsTrigger>
                  <TabsTrigger value="premium" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary h-full">Premium</TabsTrigger>
                </TabsList>
                
                {/* 重复用于 Basic, Standard, Premium */}
                {['basic', 'standard', 'premium'].map((tier) => {
                   // 获取对应数据
                   const tierData = data.pricing.find((p:any) => p.name.toLowerCase() === tier);
                   if (!tierData) return null;

                   return (
                    <TabsContent key={tier} value={tier} className="p-6 space-y-6 mt-0">
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-2xl">{tierData.price}</span>
                        <span className="text-muted-foreground uppercase text-xs font-semibold">{tierData.name}</span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground min-h-[60px]">
                        {tierData.description}
                      </p>

                      <div className="flex items-center gap-4 text-sm font-medium text-foreground/80">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {tierData.deliveryTime} Delivery
                        </div>
                        <div className="flex items-center gap-1">
                          <RefreshCcw className="w-4 h-4" />
                          Unlimited Revisions
                        </div>
                      </div>

                      <ul className="space-y-2 text-sm">
                        {tierData.features.map((feat: string, i: number) => (
                           <li key={i} className="flex gap-2 text-muted-foreground">
                             <Check className="w-4 h-4 text-green-500 shrink-0" />
                             {feat}
                           </li>
                        ))}
                      </ul>

                      <Button className="w-full h-12 text-base" size="lg">
                        Request to Order
                      </Button>
                      
                      <Button variant="outline" className="w-full">
                        Contact Sales
                      </Button>
                    </TabsContent>
                   )
                })}
              </Tabs>
            </Card>

            {/* 2. Company Trust (B2C Adjustment) */}
            <Card className="bg-muted/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                   <ShieldCheck className="w-5 h-5 text-primary" />
                   Why MOTA ATOM?
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-3">
                 <p>🏆 <strong>Proven Expertise:</strong> Over 50+ enterprise AI solutions delivered.</p>
                 <p>🔒 <strong>Data Privacy:</strong> Enterprise-grade security & compliance.</p>
                 <p>🤝 <strong>Full Support:</strong> 3-month free maintenance included.</p>
              </CardContent>
            </Card>

          </div>
        </div>

      </div>
    </div>
  )
}