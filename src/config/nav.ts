// import { Icons } from "@/components/icons" // 假设你有图标组件，或者使用 Lucide

export interface NavItem {
  title: string       // 翻译键 (Key)
  href?: string
  disabled?: boolean
  external?: boolean
  icon?: string       // 可选：图标名称
  description?: string // 翻译键 (Key)
  featured?: boolean   // 标记：是否为“推荐”项 (用于桌面端显示大卡片)
}

export interface NavItemWithChildren extends NavItem {
  items: NavItem[]
}

export type MainNavItem = NavItem | NavItemWithChildren

export const mainNavConfig: MainNavItem[] = [
  {
    title: "products", // 对应 messages/en.json 中的 Nav.products
    items: [
      {
        title: "motaAI",
        href: "/products/mota-ai/",
        description: "motaAI", // 对应 Nav.items.motaAI.desc
        featured: true, // 🟢 标记为特色项，将在桌面端大卡片显示
      },
      {
        title: "sitebuild",
        href: "/products/sitebuild",
        description: "sitebuild",
      },
      {
        title: "mvp",
        href: "/products/mvp",
        description: "mvp",
        featured: true,
      },
      {
        title: "scalup",
        href: "/products/scalup",
        description: "scalup",
      },
    ],
  },
  {
    title: "resources",
    items: [
      {
        title: "blog",
        href: "/blog",
        description: "blog",
      },
      {
        title: "case",
        href: "/showcase",
        description: "case",
        featured: true,
      },
      {
        title: "help",
        href: "/help",
        description: "help",
      },
      { 
        title: "docs",
        href: "/docs",
        description: "Find in-depth information about our services.",
      },
    ],
  },
{
    title: "company",
    items: [
      {
        title: "contact",
        href: "/contact",
        description: "Get in touch with our team with professional self-service support.",        
      },
      {
        title: "about",
        href: "/about",
        description: "Learn more about our company.",
      },
      {
        title: "privacy",
        href: "/privacy",
        description: "Learn about our privacy policy.",        
      },
      {
        title: "terms",
        href: "/terms",
        description: "Read our terms of service.",
      },
      {
        title: "cookie",
        href: "/cookie",
        description: "Learn how we use cookies to improve your experience.",
      },
    ],
  }
]