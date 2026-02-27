//// src/app/[locale]/layout.tsx
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { GoogleAnalytics } from "@/components/seo/google-analytics"
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/json-ld"
import { AnalyticsPageview } from "@/components/seo/analytics-pageview"
import { siteConfig } from "@/config/site"
import type { Metadata } from 'next'
import { Suspense } from 'react'

// ── SEO: 全局 Metadata 配置 ────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    'MOTA TECHLINK',
    'AI Startup',
    'SaaS',
    'Next.js',
    'Supabase',
    'Full Stack',
    'Open Source',
  ],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'zh_CN',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: '@motatechlink',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  alternates: {
    canonical: siteConfig.url,
    languages: {
      'en': `${siteConfig.url}/en`,
      'zh': `${siteConfig.url}/zh`,
    },
  },
};

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
    <>
      {/* ── SEO: JSON-LD 结构化数据 ── */}
      <OrganizationJsonLd />
      <WebSiteJsonLd />

      {/* ── SEO: Google Analytics ── */}
      <GoogleAnalytics />
      <Suspense fallback={null}>
        <AnalyticsPageview />
      </Suspense>

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
        position="top-center"
        theme="dark"
        richColors
        closeButton
      />
    </>
  );
}