import { Link } from "@/navigation";
import Image from "next/image";
import { getContents } from '@/lib/mdx';
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { Metadata } from "next";
import { PlayCircle, ArrowRight } from "lucide-react";
import { ContentLayout } from "@/components/layout/content-layout";

export const metadata: Metadata = {
  title: `Showcase - ${siteConfig.name}`,
  description: "Explore our latest projects, case studies, and technological breakthroughs.",
};

interface ShowcasePageProps {
  searchParams: Promise<{
    q?: string;
    tag?: string;
  }>;
}

export default async function ShowcasePage({ searchParams }: ShowcasePageProps) {
  const { q, tag } = await searchParams;
  const query = q?.toLowerCase() || "";
  const activeTag = tag || "";

  const allPosts = getContents("showcase");
  const allTags = Array.from(new Set(allPosts.flatMap(post => post.metadata.categories || [])));

  const filteredPosts = allPosts
    .filter((post) => !post.metadata.draft)
    .filter((post) => {
      const matchQuery = !query || 
        post.metadata.title?.toLowerCase().includes(query) || 
        post.metadata.description?.toLowerCase().includes(query);
      
      const matchTag = !activeTag || 
        post.metadata.categories?.includes(activeTag) || 
        post.metadata.tags?.includes(activeTag);

      return matchQuery && matchTag;
    })
    .sort((a, b) => {
      if (a.metadata.date && b.metadata.date) {
        return new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime();
      }
      return 0;
    });

  // 🟢 关键修改：在这里（Server端）将数据转换为 JSX 组件数组
  // 这样传递给 ContentLayout 的就是一堆已经生成好的 <Link>...</Link> 对象，这是可序列化的。
  const postItems = filteredPosts.map((post) => (
    <Link 
      key={post.slug} 
      href={`/showcase/${post.slug}`} 
      className="group block h-full"
    >
      <Card className="h-full flex flex-col overflow-hidden border-slate-200 dark:border-slate-800 bg-background/50 backdrop-blur-sm transition-all hover:shadow-lg hover:border-blue-500/50">
        
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          {post.metadata.image ? (
            <Image
              src={post.metadata.image}
              alt={post.metadata.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}

          {post.metadata.youtube_id && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="rounded-full bg-white/20 backdrop-blur-sm p-3 border border-white/50">
                <PlayCircle className="w-8 h-8 text-white fill-white/20" />
              </div>
            </div>
          )}

          <div className="absolute top-3 right-3 flex gap-2">
              {post.metadata.categories?.[0] && (
                <Badge variant="secondary" className="bg-background/80 backdrop-blur text-xs shadow-sm">
                  {post.metadata.categories[0]}
                </Badge>
              )}
          </div>
        </div>

        <CardHeader className="p-5 pb-2">
          <div className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
            {post.metadata.date && (
              <span>{formatDate(post.metadata.date)}</span>
            )}
          </div>
          <h2 className="text-xl font-bold tracking-tight text-foreground group-hover:text-blue-600 transition-colors line-clamp-2">
            {post.metadata.title}
          </h2>
        </CardHeader>

        <CardContent className="p-5 pt-2 flex-grow">
          <p className="text-muted-foreground text-sm line-clamp-3">
            {post.metadata.description}
          </p>
        </CardContent>

      </Card>
    </Link>
  ));

  return (
    <div className="container py-10 lg:py-16">
      <div className="flex flex-col items-center text-center space-y-4 mb-16">
        <h1 className="text-3xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
            Showcase
          </span>
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground md:text-xl">
          Discover how we bridge the gap between AI, Edge Computing, and real-world industrial applications.
        </p>
      </div>

      {/* 🟢 修改: 传入组件数组 postItems，而不是数据 filteredPosts */}
      <ContentLayout 
        items={postItems}
        tags={allTags}
        itemsPerPage={6}
        sectionTitle="Categories"
        searchPlaceholder="Search projects..."
        // renderItem 属性已删除
      />
    </div>
  );
}