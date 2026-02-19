"use client"

import { Link, usePathname } from "@/navigation"
import { ChevronRight, Home } from "lucide-react"

interface BreadcrumbItem {
  label: string
  href?: string
}

export function AdminBreadcrumb() {
  const pathname = usePathname()

  // 解析路径并生成面包屑
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const segments = pathname.split("/").filter(Boolean)

    // usePathname from @/navigation 已去除 locale 前缀，无需再 slice
    const filteredSegments = segments

    const breadcrumbs: BreadcrumbItem[] = [
      { label: "Admin Console", href: "/admin/console" }
    ]

    let currentPath = ""
    filteredSegments.forEach((segment, index) => {
      currentPath += `/${segment}`

      // 将 kebab-case 转换为标题格式
      const label = segment
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")

      // 跳过 "admin" 段，因为已经作为根面包屑
      if (segment === "admin") return

      // 最后一个段不需要链接（当前页面）
      if (index === filteredSegments.length - 1) {
        breadcrumbs.push({ label })
      } else {
        breadcrumbs.push({ label, href: currentPath })
      }
    })

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">
      <Link
        href="/"
        className="relative flex items-center gap-1 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors group"
        aria-label="back to homepage"
        title="Homepage"
      >
        <Home className="w-6 h-6" />
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Back Homepage
        </span>
      </Link>

      {breadcrumbs.map((item, index) => (
        <div key={`breadcrumb-${index}`} className="flex items-center gap-2">
          <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-600" />
          {item.href ? (
            <Link
              href={item.href}
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors hover:underline"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 dark:text-gray-100 font-medium">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  )
}
