// src/components/seo/json-ld.tsx
import { siteConfig } from '@/config/site';

// ── Organization Schema ─────────────────────────────────
export function OrganizationJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}${siteConfig.logo}`,
    description: siteConfig.description,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: siteConfig.contact.phone,
      email: siteConfig.contact.email,
      contactType: 'customer service',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.contact.address,
    },
    sameAs: [
      siteConfig.links.twitter,
      siteConfig.links.github,
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// ── WebSite Schema (for sitelinks search) ───────────────
export function WebSiteJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteConfig.url}/en/docs?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// ── Blog Posting Schema ─────────────────────────────────
interface BlogPostJsonLdProps {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  author?: string;
}

export function BlogPostJsonLd({
  title,
  description,
  url,
  datePublished,
  dateModified,
  image,
  author,
}: BlogPostJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    url,
    datePublished,
    dateModified: dateModified || datePublished,
    image: image || siteConfig.ogImage,
    author: {
      '@type': 'Person',
      name: author || siteConfig.name,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}${siteConfig.logo}`,
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// ── Product Schema ──────────────────────────────────────
interface ProductJsonLdProps {
  name: string;
  description: string;
  url: string;
  image?: string;
}

export function ProductJsonLd({
  name,
  description,
  url,
  image,
}: ProductJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    url,
    image: image || siteConfig.ogImage,
    brand: {
      '@type': 'Brand',
      name: siteConfig.name,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
