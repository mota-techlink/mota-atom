"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { docsConfig } from "@/config/docs"; // 引入你的菜单配置
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

interface DocsPagerProps {
  // 如果需要强制指定 slug 可以传，否则自动获取
  slug?: string;
}

export function DocsPager({ slug }: DocsPagerProps) {
  const pathname = usePathname();
  
  // 1. 将嵌套的侧边栏配置展平成一维数组，方便查找前后关系
  const pager = getPagerForDoc(docsConfig.sidebarNav, pathname);

  if (!pager) {
    return null;
  }

  return (
    <div className="flex flex-row items-center justify-between mt-10 pt-6 border-t">
      {/* 上一篇 */}
      {pager.prev && (
        <Link
          href={pager.prev.href}
          className={cn(buttonVariants({ variant: "ghost" }), "group pl-0 hover:bg-transparent")}
        >
          <ChevronLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <div className="flex flex-col items-start">
             <span className="text-xs text-muted-foreground font-medium mb-1">Previous</span>
             <span className="font-medium text-foreground">{pager.prev.title}</span>
          </div>
        </Link>
      )}
      
      {/* 占位符：如果只有下一篇，保持下一篇靠右 */}
      {!pager.prev && <div />}

      {/* 下一篇 */}
      {pager.next && (
        <Link
          href={pager.next.href}
          className={cn(buttonVariants({ variant: "ghost" }), "group pr-0 hover:bg-transparent ml-auto")}
        >
          <div className="flex flex-col items-end">
             <span className="text-xs text-muted-foreground font-medium mb-1">Next</span>
             <span className="font-medium text-foreground">{pager.next.title}</span>
          </div>
          <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}

// === 辅助函数：展平菜单并查找 ===
function getPagerForDoc(nav: any[], currentPath: string) {
  const flattenedLinks = [null, ...flatten(nav), null];
  // 查找当前路径对应的索引
  // 注意：处理 locale 前缀或尾部斜杠可能需要微调，这里假设 href 是准确的 /docs/...
  const activeIndex = flattenedLinks.findIndex(
    (link) => link && (currentPath.endsWith(link.href) || currentPath === link.href)
  );

  if (activeIndex === -1) return null;

  const prev = activeIndex > 0 ? flattenedLinks[activeIndex - 1] : null;
  const next = activeIndex < flattenedLinks.length - 1 ? flattenedLinks[activeIndex + 1] : null;

  return {
    prev,
    next,
  };
}

function flatten(links: any[]) {
  return links.reduce((flat, link) => {
    return flat.concat(link.items ? flatten(link.items) : link);
  }, []);
}