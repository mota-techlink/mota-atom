"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface ListPaginationProps {
  currentPage: number
  totalPages: number
  pageSize: number
  pageSizeOptions?: number[] // 允许自定义每页显示数量选项
}

export function ListPagination({ 
  currentPage, 
  totalPages, 
  pageSize,
  pageSizeOptions = [6, 12, 24, 48] // 默认值
}: ListPaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname() // ✅ 新增：获取当前路径 (/blog 或 /showcase)
  const [jumpPage, setJumpPage] = useState("")

  // 通用 URL 生成函数
  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", pageNumber.toString())
    return `${pathname}?${params.toString()}` // ✅ 使用 pathname 保持在当前页面
  }

  const handlePageSizeChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("limit", value)
    params.set("page", "1") // 重置回第一页
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleJump = () => {
    const page = parseInt(jumpPage)
    if (page >= 1 && page <= totalPages) {
      router.push(createPageURL(page))
    }
  }

  // 如果只有1页且没有上一页下一页的需求，有时可以选择不渲染，
  // 但为了保持布局稳定（特别是pageSize选择器），通常建议保留或根据需求返回 null
  // if (totalPages <= 1) return null 

  return (
    <div className="flex items-center justify-between w-full py-4">
      
      {/* 1. 每页数量 */}
      <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
        <span className="hidden md:inline">Show</span>
        <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
          <SelectTrigger className="h-8 w-[80px]">
            <SelectValue placeholder={pageSize} />
          </SelectTrigger>
          <SelectContent>
            {pageSizeOptions.map((size) => (
              <SelectItem key={size} value={size.toString()}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="hidden md:inline">per page</span>
      </div>

      {/* 2. 核心分页条 */}
      <div className="flex-1 flex justify-center">
        <Pagination className="mx-0 w-auto">
            <PaginationContent>
            <PaginationItem>
                <PaginationPrevious 
                href={currentPage > 1 ? createPageURL(currentPage - 1) : "#"} 
                className={currentPage <= 1 ? "pointer-events-none opacity-50 h-8 px-2 sm:px-4" : "h-8 px-2 sm:px-4"}
                aria-disabled={currentPage <= 1}
                />
            </PaginationItem>
            
            <PaginationItem>
                <span className="flex h-8 min-w-[2rem] sm:min-w-[2.5rem] items-center justify-center text-xs sm:text-sm font-medium text-muted-foreground">
                    {currentPage} / {totalPages}
                </span>
            </PaginationItem>

            <PaginationItem>
                <PaginationNext 
                href={currentPage < totalPages ? createPageURL(currentPage + 1) : "#"}
                className={currentPage >= totalPages ? "pointer-events-none opacity-50 h-8 px-2 sm:px-4" : "h-8 px-2 sm:px-4"}
                aria-disabled={currentPage >= totalPages}
                />
            </PaginationItem>
            </PaginationContent>
        </Pagination>
      </div>

      {/* 3. 跳转到 */}
      <div className="hidden sm:flex items-center gap-2 justify-end">
         <span className="hidden md:inline text-sm text-muted-foreground">Go to</span>
         <Input 
           className="h-8 w-12 sm:w-16" 
           value={jumpPage} 
           onChange={(e) => setJumpPage(e.target.value)}
           onKeyDown={(e) => e.key === "Enter" && handleJump()}
         />
         <Button variant="ghost" size="sm" className="h-8 px-2" onClick={handleJump}>Go</Button>
      </div>
    </div>
  )
}