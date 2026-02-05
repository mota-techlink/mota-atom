import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Inter } from 'next/font/google'; // 1. 引入 Google 字体
import { cn } from "@/lib/utils"; // 2. 引入 cn (注意路径)
import "@/app/globals.css"; // 3. 引入全局样式
import { ThemeProvider } from "@/components/theme-provider"


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
      </body>
    </html>
  );
}