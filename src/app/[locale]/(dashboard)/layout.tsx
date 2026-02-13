import { SidebarProvider } from "@/components/layout/sidebar-context";
import { Sidebar } from "@/components/layout/sidebar";
import PageWrapper from "@/components/layout/page-wrapper";
import { userNavItems } from "@/config/menu";
import { UserNav } from "@/components/sections/user-nav"; // 假设你已有这个组件
import { GlobalToggles } from '@/components/global-toggles';
import { DashboardLogo } from "@/components/dashboard-logo";
import { DashboardBreadcrumb } from "@/components/dashboard-breadcrumb";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
        {/* 1. 侧边栏：传入 User 菜单 */}
        <Sidebar items={userNavItems} title="User Console" />

        {/* 2. 页面主体容器 (处理了 flex-1, overflow 等) */}
        <PageWrapper>
          {/* 可选：顶部 Header (面包屑 + 用户头像) */}
          <header className="mb-6 flex items-center justify-between gap-6">
            <div className="flex items-center gap-6 flex-1">
              {/* 跳转主页 Logo */}
              <DashboardLogo />
              {/* Breadcrumb 导航 */}
              <DashboardBreadcrumb />
            </div>
            <div className="flex items-center space-x-4">
              <GlobalToggles position="inline" />
              <UserNav />
            </div>
          </header>
          {/* 页面具体内容 */}
          {children}
        </PageWrapper>
      </div>
    </SidebarProvider>
  );
}