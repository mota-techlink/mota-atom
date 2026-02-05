"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Languages } from "lucide-react"

export function LanguageToggle() {
  const pathname = usePathname()
  const router = useRouter()

  // 切换语言的逻辑
  const switchLocale = (newLocale: string) => {
    // pathname 可能是 "/en/blog/post-1"
    const segments = pathname.split('/')
    // segments[1] 通常是 locale
    
    // 如果存在 locale 前缀 (en, zh)，替换它
    if (['en', 'zh'].includes(segments[1])) {
      segments[1] = newLocale
    } else {
      // 如果没有前缀 (可能是默认语言隐藏前缀的情况)，插入它
      segments.splice(1, 0, newLocale)
    }
    
    const newPath = segments.join('/')
    router.push(newPath)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 px-0">
          <Languages className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => switchLocale('en')}>
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => switchLocale('zh')}>
          中文
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}