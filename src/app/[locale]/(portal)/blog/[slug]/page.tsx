import { getPostBySlug } from '@/lib/mdx';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { notFound } from 'next/navigation';
import { MdxContent } from '@/components/mdx/mdx-content';
import { HeaderMedia } from '@/components/mdx/header-media';


export default async function BlogPostPage({ params }: { params: { slug: string, locale: string } }) {
  const { slug, locale } = await params;
  const post = getPostBySlug(slug, locale);

  if (!post) {
    return notFound();
  }
  

  const options = {
    theme: 'github-dark-dimmed',
    keepBackground: false,
  };

  
  return (
    <article className="container  mx-auto max-w-4xl py-10 lg:py-16 ">
      
      {/* 顶部导航 */}
      <div className="sticky top-14 z-30 -mx-6 px-6 md:-mx-8 md:px-8 py-4 mb-8 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40 transition-all">
        <Link 
          href="/blog" 
          className="group inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1 " />
           Back to Blog
        </Link>                
      </div>
      
      {/* Header 区域 */}
      <div className="mb-10 text-center">        
        <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl text-slate-900 dark:text-slate-50 text-balance leading-tight mb-6">
          {post.metadata.title}
        </h1>
        <div className="flex justify-center items-center gap-4 text-xs md:text-sm text-muted-foreground mb-4">
           <span className="flex items-center gap-1">
             <Calendar className="w-3.5 h-3.5" />
             {post.metadata.date 
                ? new Date(post.metadata.date).toISOString().split('T')[0] 
                : ''}
           </span>            
        </div>
        {post.metadata.tags && (
           <div className="flex flex-wrap justify-center gap-2">
              {post.metadata.tags.map(tag => (
                 <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {tag}
                 </span>
              ))}
           </div>
        )}
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


