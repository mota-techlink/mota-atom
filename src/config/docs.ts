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

/**
 * 根据翻译函数生成文档侧边栏配置
 * @param t - 翻译函数，对应 "DocsNav" 命名空间
 */
export function getDocsConfig(t: (key: string) => string): { sidebarNav: SidebarNavItem[] } {
  return {
    sidebarNav: [
      {
        title: t("gettingStarted"),
        items: [
          {
            title: t("introduction"),
            href: "/docs", // 对应 content/docs/index.mdx
          },
          {
            title: t("installation"),
            href: "/docs/getting-started/installation",
          },
          {
            title: t("configuration"),
            href: "/docs/getting-started/configuration",
          },
        ],
      },
      {
        title: t("deployment"),
        items: [
          {
            title: t("database"),
            href: "/docs/deployment/database",
          },
          {
            title: t("oauth"),
            href: "/docs/deployment/oauth",
          },
          {
            title: t("docker"),
            href: "/docs/deployment/docker",
          },
          {
            title: t("hosting"),
            href: "/docs/deployment/hosting",
          },
        ],
      },
      {
        title: t("features"),
        items: [
          {
            title: t("i18n"),
            href: "/docs/features/i18n",
          },
          {
            title: t("mdx"),
            href: "/docs/features/mdx",
          },
        ],
      },
    ],
  };
}