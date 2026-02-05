"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { DialogProps } from "@radix-ui/react-dialog"
import { Search, Loader2, FileText, Box } from "lucide-react" // 引入图标
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import Fuse from "fuse.js" // 🟢 引入 Fuse
import { docsConfig } from "@/config/docs"

// 定义索引结构
type SearchDoc = {
  title: string
  description: string
  content: string
  slug: string
  type: string
}

export function DocsSearch({ ...props }: DialogProps) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [data, setData] = React.useState<SearchDoc[]>([])
  const [isLoading, setIsLoading] = React.useState(false)

  // 1. 初始化快捷键监听 (保持不变)
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable) ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          return
        }
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  // 2. 🟢 打开弹窗时，异步加载 search.json
  React.useEffect(() => {
    if (open && data.length === 0) {
      setIsLoading(true)
    fetch("/search.json")
      .then((res) => {
        // 🟢 检查 HTTP 状态
        if (!res.ok) console.error("Search JSON fetch failed:", res.status);
        return res.json();
      })
      .then((json) => {
        // 🟢 打印出来看看，确保 content 字段里真的有长文本
        console.log("Search Index Loaded:", json); 
        console.log("Total docs:", json.length);
        setData(json)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error("Error loading search index:", err);
        setIsLoading(false)
      })
    }
  }, [open, data.length])

  // 3. 🟢 配置 Fuse.js 模糊搜索实例
  const fuse = React.useMemo(() => {
    return new Fuse(data, {
      keys: [
        { name: "title", weight: 1.0 },       // 标题权重最高
        { name: "description", weight: 0.8 }, // 描述次之
        { name: "content", weight: 0.3 },     // 正文权重较低
      ],
      threshold: 0.6, // 模糊匹配阈值 (0.0 完全匹配, 1.0 匹配任何内容)
      ignoreLocation: true, // 忽略匹配位置（全文搜索必需）

      // 其他推荐配置
      includeMatches: true,
      minMatchCharLength: 2, // 允许搜索 "AI" 这样短的词
      useExtendedSearch: true, // 开启高级搜索模式
    })
  }, [data])

  // 4. 计算搜索结果
  // 如果没有输入，显示空数组（或者你可以显示默认导航）
  // 如果有输入，显示 Fuse 结果
  const results = React.useMemo(() => {
    if (!query) return []
    return fuse.search(query).map((result) => result.item).slice(0, 10) // 限制前 10 条
  }, [query, fuse])

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false)
    command()
  }, [])

  return (
    <>
      <Button
        variant="outline"
        className={cn(
          "relative h-9 w-full justify-start rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-full lg:w-full",
        )}
        onClick={() => setOpen(true)}
        {...props}
      >
        <span className="inline-flex items-center">
            <Search className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline-flex">Search docs...</span>
            <span className="inline-flex sm:hidden">Search...</span>
        </span>
        <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      
      <CommandDialog open={open} onOpenChange={setOpen} shouldFilter={false}>
        <CommandInput 
          placeholder="Search documentation..." 
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty className={cn(isLoading ? "hidden" : "py-6 text-center text-sm")}>
             No results found.
          </CommandEmpty>
          
          {isLoading && (
            <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading index...
            </div>
          )}

          {/* 🟢 模式 A: 有搜索关键词时，显示全文搜索结果 */}
          {query.length > 0 && (
            <CommandGroup heading="Search Results">
              {results.map((doc) => (
                <CommandItem
                  key={doc.slug}
                  value={doc.title} // 这里 value 用于内部 key 识别，不影响搜索逻辑
                  onSelect={() => {
                    runCommand(() => router.push(doc.slug))
                  }}
                >
                  {/* 根据类型显示不同图标 */}
                  {doc.type === 'AI Product' ? (
                    <Box className="mr-2 h-4 w-4 text-blue-500" />
                  ) : (
                    <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                  )}
                  
                  <div className="flex flex-col">
                    <span>{doc.title}</span>
                    {/* 显示摘要或类型 */}
                    <span className="text-xs text-muted-foreground">
                      {doc.type} • {doc.description}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {/* 🟢 模式 B: 没有搜索关键词时，显示默认导航菜单 (作为快速跳转) */}
          {query.length === 0 && !isLoading && (
             <>
               <div className="px-2 py-2 text-xs font-medium text-muted-foreground">Suggested</div>
               {docsConfig.sidebarNav.map((group) => (
                <CommandGroup key={group.title} heading={group.title}>
                  {group.items?.map((navItem) => (
                    <CommandItem
                      key={navItem.href}
                      value={navItem.title}
                      onSelect={() => {
                        runCommand(() => router.push(navItem.href as string))
                      }}
                    >
                      <div className="mr-2 flex h-4 w-4 items-center justify-center">
                        <div className="h-2 w-2 rounded-full bg-slate-400" />
                      </div>
                      <span>{navItem.title}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
             </>
          )}

        </CommandList>
      </CommandDialog>
    </>
  )
}