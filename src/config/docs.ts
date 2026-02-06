// src/config/docs.ts

export type SidebarNavItem = {
  title: string;
  disabled?: boolean;
  external?: boolean;
} & (
  | {
      href: string;
      items?: never;
    }
  | {
      href?: string;
      items: SidebarNavItem[];
    }
);

export const docsConfig: { sidebarNav: SidebarNavItem[] } = {
  sidebarNav: [
    {
      title: "Getting Started",
      items: [
        {
          title: "Introduction",
          href: "/docs", // 对应 content/docs/index.mdx
        },
        {
          title: "Installation",
          href: "/docs/getting-started/installation",
        },
        {
          title: "Configuration",
          href: "/docs/getting-started/configuration",
        },
      ],
    },
    {
      title: "Deployment",
      items: [
        {
          title: "Database",
          href: "/docs/deployment/database",
        },
        {
          title: "OAuth",
          href: "/docs/deployment/oauth",
        },
        {
          title: "Docker",
          href: "/docs/deployment/docker",
        },
        {
          title: "Vercel / Cloudflare",
          href: "/docs/deployment/hosting",
        },
      ],
    },
    {
      title: "Features",
      items: [
        {
          title: "I18n Support",
          href: "/docs/features/i18n",
        },
        {
          title: "MDX Components",
          href: "/docs/features/mdx",
        },
      ],
    },
  ],
};