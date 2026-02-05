import { getContentBySlug } from '@/lib/mdx'; // 使用新的通用方法
import { notFound } from 'next/navigation';
import { MdxContent } from '@/components/mdx/mdx-content'; 
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { HeaderMedia } from '@/components/mdx/header-media';
import { generatePostParams } from "@/lib/static-helper";

export function generateStaticParams() {
  return generatePostParams('showcase'); // 👈 只需要改个参数
}


export default async function ShowcasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // 1. 获取 'showcase' 类型的内容
  const post = getContentBySlug('showcase', decodeURIComponent(slug));

  if (!post) {
    return notFound();
  }

  return (
    <article className="container mx-auto max-w-4xl py-10 lg:py-16 px-6 md:px-8">
      
      {/* 顶部导航 */}
      <div className="sticky top-14 z-30 -mx-6 px-6 md:-mx-8 md:px-8 py-4 mb-8 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40">
        <Link 
          href="/showcase" // 假设你有一个 showcase 列表页
          className="group inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Showcase
        </Link>                
      </div>

      {/* Header: Showcase 可能需要更宽的布局，或者不同的标题样式 */}
      <div className="mb-10 text-center">
         <h1 className="text-3xl font-extrabold tracking-tight md:text-5xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500 pb-2">
            {post.metadata.title}
         </h1>
         
         <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
            {post.metadata.description}
         </p>

         {/* Categories */}
         <div className="flex flex-wrap justify-center gap-2">
            {post.metadata.categories?.map(cat => (
               <Badge key={cat} variant="secondary">{cat}</Badge>
            ))}
         </div>
      </div>

           <HeaderMedia 
             image={post.metadata.image} 
             youtube_id={post.metadata.youtube_id} 
             title={post.metadata.title} 
           />
           
           <MdxContent content={post.content} />

    </article>
  );
}