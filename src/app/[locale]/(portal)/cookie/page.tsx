import { notFound } from "next/navigation"
import { MdxContent } from "@/components/mdx/mdx-content" 
import { getContentBySlug } from '@/lib/mdx'; 
import { formatDate } from "@/lib/utils"


export default async function showCookiePage({ params }: { params: Promise<{ slug: string }> }) {
  
  const post = getContentBySlug('legal', decodeURIComponent('cookie'));
  if (!post) {
    return notFound();
  }
  
  return (
    // 布局容器：居中，最大宽度限制，垂直留白
    <div className="container mx-auto px-4 max-w-4xl md:px-6  py-12 lg:py-24">
      
      {/* 标题区域 */}
      <div className="mb-10 border-b pb-8">
        <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl mb-4">
          {post.metadata.title}
        </h1>
        {post.metadata.date && (
          <p className="text-sm text-muted-foreground">
            Last updated: {formatDate(post.metadata.date)}
          </p>
        )}
      </div>

      {/* MDX 正文 */}
      <article className="prose prose-slate dark:prose-invert max-w-none">
        <MdxContent content={post.content} />
      </article>
      
    </div>
  );
}