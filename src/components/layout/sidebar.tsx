"use client";

import { Link } from "@/navigation";
import Image from "next/image"; // ✅ 引入 Image 组件
import { usePathname } from "@/navigation";
import { useSidebar } from "./sidebar-context";
import { cn } from "@/lib/utils";
import { NavItem } from "@/config/menu";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

// 🔴 1. 引入所有需要用到的图标
import { 
  PanelLeftClose, 
  PanelLeftOpen, 
  X,
  LayoutDashboard,
  Settings,
  Users,
  FileText,
  ListVideo,
  Eye,
  ListOrdered,
  Newspaper,
  Presentation,
} from "lucide-react";

// 🔴 2. 定义映射表 (String -> Component)
const IconMap = {
  dashboard: LayoutDashboard,  
  order: ListOrdered,
  settings: Settings,
  users: Users,
  logs: FileText,
  video: ListVideo,
  eye: Eye,
  newspaper: Newspaper,
  presentation: Presentation,
  // 如果有新的图标，在这里添加映射
};
interface SidebarProps {
  items: NavItem[];
  title: string;
}
const LogoContent = ({ collapsed = false }: { collapsed?: boolean }) => (
  <div className="flex items-center gap-3">
    {/* Logo 图片 */}
    <div className="relative w-8 h-8 shrink-0 overflow-hidden rounded-md">
      <Image 
        src="/logos/mota-icon-v2.webp" 
        alt="Mota Logo" 
        fill 
        className="object-cover"
        priority // 优先加载 Logo
      />
    </div>

    {/* 文字区域：支持折叠隐藏 */}
    <div className={cn(
      "flex flex-col items-start justify-center transition-all duration-300 overflow-hidden",
      collapsed ? "w-0 opacity-0 translate-x-[-10px]" : "w-auto opacity-100 translate-x-0"
    )}>
      <span className="font-bold text-md leading-none text-slate-900 dark:text-slate-100 tracking-wide">
        MOTA
      </span>
      <span className="font-bold text-[12px] leading-none text-blue-600 dark:text-blue-400 mt-0.5 tracking-wider">
        TECHLINK
      </span>
    </div>
  </div>
);

export function Sidebar({ items, title }: SidebarProps) {
  const pathname = usePathname();
  const { isCollapsed, toggleCollapse, isMobileOpen, setMobileOpen } = useSidebar();
  const t = useTranslations('Dashboard');

  // 提取出来的 Logo 组件，用于复用 (Desktop & Mobile)
  

  return (
    <>
      {/* --- Mobile Top Bar (手机端顶部栏) --- */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 dark:bg-slate-950/80 backdrop-blur border-b border-slate-200 dark:border-slate-800 z-50 flex items-center px-4 justify-between">
        <button onClick={() => setMobileOpen(true)} className="flex items-center focus:outline-none">
          {/* 手机端永远展开文字 */}
          <LogoContent collapsed={false} />
        </button>
      </div>

      {/* --- Mobile Overlay --- */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[60] md:hidden animate-in fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* --- Sidebar 本体 --- */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-[70] flex flex-col transition-[width] duration-300 ease-in-out md:relative",
          "bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800",
          isMobileOpen ? "translate-x-0 w-64 shadow-2xl" : "-translate-x-full md:translate-x-0",
          isCollapsed ? "md:w-20" : "md:w-64"
        )}
      >
        
        {/* Header Area */}
        <div className={cn(
          "h-16 flex items-center border-b border-slate-200 dark:border-slate-800 overflow-hidden shrink-0", 
          isCollapsed ? "justify-center px-0" : "justify-between px-6"
        )}>
          
          {/* Desktop Toggle Button */}
          <button 
            onClick={toggleCollapse}
            className="hidden md:flex items-center focus:outline-none hover:opacity-80 transition-opacity"
            title={isCollapsed ? "Expand" : "Collapse"}
          >
            <LogoContent collapsed={isCollapsed} />
          </button>

          {/* Mobile Close Button */}
          <div className="md:hidden flex items-center justify-between w-full pr-2">
             <LogoContent collapsed={false} />
             <button onClick={() => setMobileOpen(false)} className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-md">
               <X className="w-5 h-5" />
             </button>
          </div>
        </div>
        {/* Title Area */}
        {/* <div className="p-3 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-sm font-semibold">{title}</h2>
        </div> */}

        {/* Navigation Items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto overflow-x-hidden scrollbar-none">
          {items.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            // 🔴 3. 根据字符串 Key 获取图标组件
            // 如果找不到对应的图标，默认显示 LayoutDashboard 防止报错
            const IconComponent = IconMap[item.icon as keyof typeof IconMap] || LayoutDashboard;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                title={isCollapsed ? t(item.titleKey) : ""}
                className={cn(
                  "flex items-center rounded-md transition-all duration-200 group relative whitespace-nowrap",
                  isActive 
                    ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium" 
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-200",
                  isCollapsed ? "justify-center py-3 px-0" : "gap-3 px-3 py-2"
                )}
              >
                {/* <item.icon className={cn("shrink-0", isCollapsed ? "w-5 h-5" : "w-4 h-4")} /> */}
                {/* 🔴 4. 渲染获取到的组件 */}
                <IconComponent className={cn("shrink-0", isCollapsed ? "w-5 h-5" : "w-4 h-4")} />
                
                <span className={cn(
                  "text-sm transition-all duration-300", 
                  isCollapsed ? "w-0 opacity-0 overflow-hidden translate-x-[-10px]" : "w-auto opacity-100 translate-x-0"
                )}>
                  {t(item.titleKey)}
                </span>
              </Link>
            );
          })}
        </nav>


        {/* Footer Toggle (Desktop Only) */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 shrink-0 hidden md:block">
           <Button 
            variant="ghost" 
            size="sm"
            onClick={toggleCollapse} 
            className={cn("w-full text-slate-500", isCollapsed ? "px-0" : "justify-start gap-3")}
          >
             {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
             {!isCollapsed && <span>{t('collapse_sidebar', {defaultMessage: 'Collapse'})}</span>}
           </Button>
        </div>
      </aside>
    </>
  );
}