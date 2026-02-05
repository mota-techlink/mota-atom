"use client"

import React, { useState, useEffect, useRef } from "react"
import { ListSearch } from "@/components/ui/list-search"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

// 定义通用 Props
interface ContentLayoutProps {
  items: React.ReactNode[]                  
  tags: string[]
  sectionTitle?: string
  searchPlaceholder?: string
  itemsPerPage?: number
  emptyState?: React.ReactNode
}

export function ContentLayout({ 
  items, 
  // renderItem, 🔴 删除这个 prop
  tags, 
  sectionTitle = "Categories", 
  searchPlaceholder = "Search...",
  itemsPerPage = 9,
  emptyState
}: ContentLayoutProps){
  
  // --- 无限滚动逻辑 ---
  const [visibleCount, setVisibleCount] = useState(itemsPerPage)
  const observerRef = useRef<HTMLDivElement>(null)

  // 当 items 变化（比如搜索条件变了），重置显示数量
  useEffect(() => {
    setVisibleCount(itemsPerPage)
  }, [items, itemsPerPage])

  // Intersection Observer 监听底部
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < items.length) {
          // 模拟加载延迟，让体验更像“载入中”
          setTimeout(() => {
            setVisibleCount((prev) => Math.min(prev + itemsPerPage, items.length))
          }, 300)
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    )

    if (observerRef.current) {
      observer.observe(observerRef.current)
    }

    return () => observer.disconnect()
  }, [visibleCount, items.length, itemsPerPage])

  
  const visibleItems = items.slice(0, visibleCount)
  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start max-w-5xl mx-auto pl-[5%] w-full">
      <div className="w-full lg:w-3/4 min-w-0">
        {visibleItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 animate-in fade-in duration-500">
            {/* 🟢 修改 3: 直接渲染 item，因为它已经是 Component 了 */}
            {visibleItems.map((item, index) => (
              <React.Fragment key={index}>
                {item}
              </React.Fragment>
            ))}
          </div>
        ) : (
          emptyState || (
            <div className="text-center py-20 text-muted-foreground bg-muted/30 rounded-xl border border-dashed">
              <p>No items found matching your criteria.</p>
            </div>
          )
        )}

        {visibleItems.length < items.length && (
          <div ref={observerRef} className="flex justify-center items-center py-12 w-full">
            <div className="flex items-center gap-2 text-muted-foreground text-sm bg-muted/50 px-4 py-2 rounded-full">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading more content...
            </div>
          </div>
        )}
        
        {visibleItems.length >= items.length && items.length > 0 && (
          <div className="text-center py-12 text-sm text-muted-foreground/50">
            You&apos;ve reached the end of the list.
          </div>
        )}
      </div>

      <aside className="w-full lg:w-1/4 lg:sticky lg:top-24 h-fit space-y-8">
        <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-background/50 backdrop-blur-sm shadow-sm">
          <ListSearch 
            tags={tags} 
            sectionTitle={sectionTitle}
            searchPlaceholder={searchPlaceholder}
          />
        </div>
      </aside>
    </div>
  )
}