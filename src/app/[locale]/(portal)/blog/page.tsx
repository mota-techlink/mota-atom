import { Link } from '@/navigation';
import Image from 'next/image';
import { getBlogPosts, getAllTags } from '@/lib/mdx';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ListSearch } from '@/components/ui/list-search';
import { ListPagination } from '@/components/ui/list-pagination';
import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';

// ... metadata 保持不变 ...

interface PageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{
    page?: string
    limit?: string
    q?: string
    tag?: string
  }>
}

export default async function BlogIndex({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  const currentPage = Number(resolvedSearchParams.page) || 1;
  const pageSize = Number(resolvedSearchParams.limit) || 12;
  const query = resolvedSearchParams.q?.toLowerCase() || "";
  const activeTag = resolvedSearchParams.tag || "";

  const allPosts = getBlogPosts(locale);
  const allTags = getAllTags(locale);
  const t = await getTranslations("BlogList");

  const filteredPosts = allPosts.filter((post) => {
    const matchesSearch = 
      post.metadata.title.toLowerCase().includes(query) ||
      post.metadata.description?.toLowerCase().includes(query);
    
    const matchesTag = activeTag 
      ? post.metadata.tags?.includes(activeTag) 
      : true;

    return matchesSearch && matchesTag;
  });

  const totalItems = filteredPosts.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const offset = (currentPage - 1) * pageSize;
  const paginatedPosts = filteredPosts.slice(offset, offset + pageSize);
  
  // 定义卡片上显示的最多标签数
  const MAX_TAGS = 3;

  return (
    <div className="py-6 lg:py-10 pb-24 max-w-5xl mx-auto px-[2%]">
      
      {/* 标题区 */}
      <div className="flex flex-col space-y-2 md:flex-row md:justify-between md:items-end mb-4">
        <div>
           <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-cyan-500">
            {t("title")}
            </span>
            </h1>           
        </div>
          
          
      </div>
      
      {/* 🔴 1. 新增：移动端搜索框 (Mobile Search) */}
      {/* lg:hidden = 在大屏(Sidebar出现时)隐藏 */}
      {/* mb-6 = 与下方文章列表拉开距离 */}
      <div className="w-full mb-6 lg:hidden">
         <Suspense fallback={<div className="h-10 w-full bg-slate-100 rounded-md animate-pulse" />}>
            <ListSearch tags={allTags} sectionTitle={t("topics")} searchPlaceholder={t("searchPlaceholder")} />
         </Suspense>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* --- 左侧内容区 --- */}
        <div className="lg:col-span-3">
           {paginatedPosts.length === 0 ? (
             <div className="py-16 text-center text-sm text-muted-foreground border border-dashed rounded-lg bg-slate-50 dark:bg-slate-900/50">
               {t("noPosts")}
             </div>
           ) : (
             <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
               {paginatedPosts.map((post) => (
                 <Card key={post.slug} className="group relative flex flex-col overflow-hidden border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700">                    
                    {/* 图片区 */}
                    <div className="relative aspect-[2.4/1] w-full overflow-hidden bg-muted">
                      {post.metadata.image ? (
                        <Image 
                           src={post.metadata.image} 
                           alt={post.metadata.title}
                           fill
                           className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-slate-100 text-slate-300 dark:bg-slate-800">
                           <span className="text-xl font-bold opacity-30">Mota</span>
                        </div>
                      )}
                    </div>

                    {/* 标题区 */}
                    <CardHeader className="p-2.5 pb-1">
                       <h3 className="line-clamp-1 text-base font-bold leading-none group-hover:text-blue-600 transition-colors">
                         <Link href={`/blog/${post.slug}`} className="focus:outline-none">
                            <span className="absolute inset-0" aria-hidden="true" />
                            {post.metadata.title}
                         </Link>
                       </h3>
                    </CardHeader>

                    {/* 描述区 */}
                    <CardContent className="p-2.5 pt-1 flex-1">
                       <p className="line-clamp-2 text-[18px] text-muted-foreground leading-snug">
                          {post.metadata.description}
                       </p>
                    </CardContent>

                    {/* 底部区 */}
                    <CardFooter className="p-2.5 pt-0 mt-auto h-9 flex items-center justify-between border-t bg-slate-50/50 dark:bg-slate-900/50">
                       <div className="text-[10px] text-slate-400 font-medium shrink-0 mr-2">
                          {post.metadata.date 
                            ? new Date(post.metadata.date).toISOString().split('T')[0] 
                            : ''}                          
                       </div>
                       
                       <div className="flex items-center justify-end gap-1.5 flex-1 overflow-hidden mask-linear-fade">
                          {post.metadata.tags?.map(tag => (
                             <Badge 
                                key={tag} 
                                variant="outline" 
                                className="text-[10px] h-4 px-1.5 font-normal bg-background border-slate-200 shrink-0 whitespace-nowrap text-slate-900 dark:text-slate-300"
                            >
                               {tag}
                             </Badge>
                          ))}
                       </div>
                    </CardFooter>
                 </Card>
               ))}
             </div>
           )}
        </div>

        {/* --- 右侧 Sidebar --- */}
        <aside className="lg:col-span-1 space-y-4">
           {/* 🔴 2. 修改：桌面端搜索框 (Desktop Search) */}
           {/* hidden lg:block = 在手机端隐藏，在桌面端显示 */}
           {/* 这样防止手机端页面底部出现重复的搜索框 */}
           <div className="rounded-lg border bg-card p-3 shadow-sm sticky top-20 hidden lg:block">
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("filter")}</h2>
              <Suspense>
                <ListSearch tags={allTags} sectionTitle={t("topics")} searchPlaceholder={t("searchPlaceholder")} />
              </Suspense>
           </div>
        </aside>

      </div>

      {/* 分页栏 */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/80 backdrop-blur-md p-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className=" max-w-5xl mx-auto ">
            <ListPagination
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
            />
        </div>
      </div>

    </div>
  );
}