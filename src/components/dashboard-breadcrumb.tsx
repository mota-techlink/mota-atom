"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Home } from "lucide-react"

interface BreadcrumbItem {
  label: string
  href?: string
}

export function DashboardBreadcrumb() {
  const pathname = usePathname()

  // 解析路径并生成面包屑
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const segments = pathname.split("/").filter(Boolean)
    
    // 移除 locale 段 (第一个段通常是 locale)
    const filteredSegments = segments.slice(1)

    const breadcrumbs: BreadcrumbItem[] = [
      { label: "Dashboard", href: "/dashboard" }
    ]

    let currentPath = ""
    filteredSegments.forEach((segment, index) => {
      currentPath += `/${segment}`
      
      // 将 kebab-case 转换为标题格式
      const label = segment
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")

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
        href="/dashboard"
        className="flex items-center gap-1 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
        aria-label="Dashboard home"
      >
        <Home className="w-4 h-4" />
      </Link>

      {breadcrumbs.slice(1).map((item, index) => (
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
