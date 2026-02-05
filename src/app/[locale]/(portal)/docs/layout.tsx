// src/app/[locale]/(portal)/docs/layout.tsx
import { DocsSidebar } from "@/components/docs/docs-sidebar";
import { docsConfig } from "@/config/docs";
import { ScrollArea } from "@/components/ui/scroll-area"; // 如果你有 Shadcn UI 的 ScrollArea 最好，没有就用原生 overflow
import { DocsSearch } from "@/components/docs/docs-search";

interface DocsLayoutProps {
  children: React.ReactNode;
}

export default function DocsLayout({ children }: DocsLayoutProps) {
  return (
    <div className="border-b">
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        
        {/* 左侧侧边栏 - Desktop */}
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
            <div className="py-4 pl-2">
              <DocsSearch />
            </div>

            {/* 菜单区域 - 可独立滚动 */}
            <ScrollArea className="h-[calc(100vh-8rem)] px-2">
              <DocsSidebar items={docsConfig.sidebarNav} />
            </ScrollArea>
        </aside>

        {/* 主内容区域 */}
        <main className="relative py-6 lg:gap-10 lg:py-8 w-full min-w-0">
            {children}
        </main>
      </div>
    </div>
  );
}