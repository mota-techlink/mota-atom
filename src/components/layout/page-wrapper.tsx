"use client";

import { cn } from "@/lib/utils"; // 使用 shadcn 的 cn

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <main
      className={cn(
        "flex-1 flex flex-col h-screen overflow-hidden transition-all duration-300",
        "bg-slate-50 dark:bg-slate-950" // Resend 风格背景
      )}
    >
      {/* 滚动区域：手机端顶部留出 header 高度 */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 pt-20 md:pt-8 w-full">
         {children}
      </div>
    </main>
  );
}