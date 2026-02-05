// src/app/layout.tsx
import { BionicProvider } from "@/components/providers/bionic-provider";
// 引入字体和工具函数 (这是 Shadcn 的标准配置)
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css"; // 别忘了引入全局样式


// 定义字体 (根据你的实际情况，可能是 Inter 或其他)
const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

// export const runtime = 'edge';
// export const runtime = 'nodejs';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        // 🟢 1. 显式添加 Class，确保服务端和客户端都渲染这些样式
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
        // 🟢 2. 在 body 上也添加这个属性，防止浏览器插件导致的 Hydration 报错
        suppressHydrationWarning={true}
      >
        <BionicProvider>
          {children}
        </BionicProvider>
      </body>
    </html>
  );
}