"use client"

import * as React from "react"
import { Check, Copy, Terminal } from "lucide-react"
import { cn } from "@/lib/utils"

interface CodeBlockProps extends React.HTMLAttributes<HTMLPreElement> {
  "data-language"?: string
  raw?: string
}

export function CodeBlock({ children, className, ...props }: CodeBlockProps) {
  const [isCopied, setIsCopied] = React.useState(false)
  
  const language = props["data-language"] || "text"
  const preRef = React.useRef<HTMLPreElement>(null)

  const copyToClipboard = async () => {
    if (!preRef.current) return
    const text = preRef.current.innerText
    try {
      await navigator.clipboard.writeText(text)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const Icon = language === "bash" || language === "sh" ? Terminal : null

  return (
    // 🔴 容器边框：Light模式下使用 border-blue-100 (淡蓝边框)
    <div className="my-6 overflow-hidden rounded-xl border border-blue-100 bg-slate-950 dark:border-slate-800 shadow-sm">
      
      {/* --- Header: 语言标签 + 复制按钮 --- */}
      {/* 🔴 背景色：bg-blue-50 (淡蓝色背景) */}
      {/* 🔴 边框色：border-blue-100 (淡蓝分隔线) */}
      <div className="flex items-center justify-between border-b border-blue-100 bg-blue-50 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-600">
        
        {/* 左侧：语言显示 */}
        {/* 🔴 文字颜色：text-blue-600 (深蓝色文字，与背景形成对比) */}
        <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-slate-100">
          {Icon && <Icon className="h-3.5 w-3.5" />}
          <span className="uppercase">{language}</span>
        </div>

        {/* 右侧：复制按钮 */}
        <button
          onClick={copyToClipboard}
          className={cn(
            "flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium transition-colors focus:outline-none",
            // 🔴 按钮样式：Light模式下深蓝文字 + 悬停淡蓝背景
            isCopied 
              ? "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20" 
              : "text-blue-600 hover:bg-blue-100 dark:text-slate-100 dark:hover:text-slate-100 dark:hover:bg-slate-800"
          )}
        >
          {isCopied ? (
            <>
              <Check className="h-3.5 w-3.5" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* --- Body: 实际代码区域 --- */}      
      <div className="relative overflow-x-auto px-4 pt-4 pb-6 font-mono text-sm leading-relaxed">
        <pre 
            ref={preRef} 
            {...props} 
            className={cn("bg-transparent p-0 m-0 outline-none", className)}
        >
          {children}
        </pre>
      </div>
    </div>
  )
}