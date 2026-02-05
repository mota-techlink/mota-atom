"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, X } from "lucide-react"
import { useState, useEffect } from "react"
import { useDebounce } from "use-debounce"
import { cn } from "@/lib/utils"

interface ListSearchProps {
  tags: string[]
  sectionTitle?: string      // ✅ 新增：例如 "Topics" 或 "Categories"
  searchPlaceholder?: string // ✅ 新增：搜索框占位符
  searchKey?: string         // ✅ 新增：URL query key (默认 "q")
  tagKey?: string           // ✅ 新增：URL tag key (默认 "tag")
  className?: string
}

export function ListSearch({ 
  tags, 
  sectionTitle = "Topics", 
  searchPlaceholder = "Search...",
  searchKey = "q",
  tagKey = "tag",
  className
}: ListSearchProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname() // ✅ 新增：路径感知

  const initialQuery = searchParams.get(searchKey) || ""
  const activeTag = searchParams.get(tagKey)

  const [text, setText] = useState(initialQuery)
  const [query] = useDebounce(text, 500)
    
  // 监听 query 变化并推送到 URL
  useEffect(() => {
    if (query !== (searchParams.get(searchKey) || "")) {
      const params = new URLSearchParams(searchParams.toString())
      if (query) {
        params.set(searchKey, query)
      } else {
        params.delete(searchKey)
      }
      params.set("page", "1") // 搜索时重置页码
      router.push(`${pathname}?${params.toString()}`)
    }
  }, [query, router, searchParams, pathname, searchKey])

  // 处理标签点击
  const handleTagClick = (tag: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (activeTag === tag) {
      params.delete(tagKey)
    } else {
      params.set(tagKey, tag)
    }
    params.set("page", "1") // 筛选时重置页码
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className={cn("space-y-4 lg:space-y-6", className)}>
      {/* 搜索框 */}
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder={searchPlaceholder}
          className="pl-8 h-9 text-sm bg-background/50 border-slate-200 dark:border-slate-800"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      {/* 标签云区域 */}
      <div className="space-y-2">
        {sectionTitle && (
          <h3 className="font-semibold text-[10px] lg:text-xs text-muted-foreground uppercase tracking-wider">
            {sectionTitle}
          </h3>
        )}
        
        <div className={cn(
          "flex gap-2 text-sm",
          // 移动端：横向滚动
          "flex-nowrap overflow-x-auto pb-2 w-full no-scrollbar", 
          // 桌面端：换行显示，有最大高度
          "lg:flex-wrap lg:overflow-visible lg:w-auto lg:max-h-[300px] lg:overflow-y-auto lg:pr-1"
        )}>
          {tags.map((tag) => {
            const isActive = activeTag === tag
            return (
              <Badge
                key={tag}
                variant={isActive ? "default" : "secondary"}
                className={cn(
                  "cursor-pointer px-2.5 py-1 h-7 text-xs font-normal transition-all hover:opacity-80 shrink-0",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-transparent hover:border-slate-300 dark:hover:border-slate-700"
                )}
                onClick={() => handleTagClick(tag)}
              >
                {tag}
                {isActive && <X className="ml-1 h-3 w-3" />}
              </Badge>
            )
          })}
        </div>
      </div>
    </div>
  )
}