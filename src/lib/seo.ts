// src/lib/seo.ts
import { siteConfig } from '@/config/site';
import { locales } from '@/routing';
import type { Metadata } from 'next';

/**
 * 生成页面的 SEO metadata
 * 用于各个页面中快速生成标准化的 metadata
 */
export function generatePageMetadata({
  title,
  description,
  path,
  locale = 'en',
  image,
  type = 'website',
  noIndex = false,
}: {
  title: string;
  description?: string;
  path: string;
  locale?: string;
  image?: string;
  type?: 'website' | 'article';
  noIndex?: boolean;
}): Metadata {
  const url = `${siteConfig.url}/${locale}${path}`;
  const ogImage = image || siteConfig.ogImage;

  return {
    title,
    description: description || siteConfig.description,
    openGraph: {
      title,
      description: description || siteConfig.description,
      url,
      siteName: siteConfig.name,
      type,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: description || siteConfig.description,
      images: [ogImage],
    },
    alternates: {
      canonical: url,
      languages: Object.fromEntries(
        locales.map(l => [l, `${siteConfig.url}/${l}${path}`])
      ),
    },
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}

/**
 * 为博客文章生成专用 metadata
 */
export function generateBlogMetadata({
  title,
  description,
  slug,
  locale = 'en',
  date,
  author,
  image,
  tags,
}: {
  title: string;
  description?: string;
  slug: string;
  locale?: string;
  date?: string;
  author?: string;
  image?: string;
  tags?: string[];
}): Metadata {
  const url = `${siteConfig.url}/${locale}/blog/${slug}`;
  const ogImage = image || siteConfig.ogImage;

  return {
    title,
    description: description || siteConfig.description,
    keywords: tags,
    openGraph: {
      title,
      description: description || siteConfig.description,
      url,
      siteName: siteConfig.name,
      type: 'article',
      ...(date && { publishedTime: date }),
      authors: author ? [author] : [siteConfig.name],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: description || siteConfig.description,
      images: [ogImage],
    },
    alternates: {
      canonical: url,
      languages: Object.fromEntries(
        locales.map(l => [l, `${siteConfig.url}/${l}/blog/${slug}`])
      ),
    },
  };
}
