//// src/app/[locale]/layout.tsx
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Inter } from 'next/font/google'; // 1. 引入 Google 字体
import { cn } from "@/lib/utils"; // 2. 引入 cn (注意路径)
import "@/app/globals.css"; // 3. 引入全局样式
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"


// 4. 实例化字体，并定义 CSS 变量名为 --font-sans
const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-sans",
});

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // 获取翻译内容
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>      
      <body 
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable // 5. 注入字体变量
        )}
      >
        <NextIntlClientProvider messages={messages}>
          {/* 👇 包裹 ThemeProvider */}
          
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            
          </ThemeProvider>
          
        </NextIntlClientProvider>        
        <Toaster 
          position="top-center" // 建议居中，符合你对个人信息页面的要求
          theme="dark"          // 强制深色模式，匹配 Dashboard
          richColors            // 开启彩色图标（成功绿/错误红）
          closeButton           // 显示关闭按钮
        />
      </body>      
    </html>
  );
}