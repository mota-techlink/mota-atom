"use client";

import { useState, useEffect, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import { type Message } from "ai";
import { Send, Bot, User, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// 🔧 动态导入代码高亮组件 - react-syntax-highlighter 约 40kB
const CodeHighlighter = dynamic(
  () => import("@/components/code-highlighter").then(mod => mod.CodeHighlighter),
  { ssr: false, loading: () => <div className="bg-[#1e1e1e] p-4 rounded animate-pulse h-20" /> }
);

type Session = { id: string; title: string; date: string };

export default function HelpCenterPage() {
  const t = useTranslations("HelpCenter");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [sessions, setSessions] = useState<Session[]>([]);

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
    body: { sessionId: "current-session-id" },
    onError: (err) => console.error("Chat Error:", err),
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    // 🟢 修复核心：
    // 1. z-40: 提高层级，确保覆盖全局 Footer，让输入框显示出来
    // 2. top-[60px]: 如果你的 Header 高度不是 4rem，请在这里调整数值（例如 top-14, top-[60px]）
    // 3. left-0 right-0: 强制占满宽度
    <div className="fixed top-16 left-0 right-0 bottom-0 bg-background z-40 flex font-sans overflow-hidden">

      {/* === 左侧 Sidebar === */}
      <aside className="w-64 border-r border-border/40 bg-muted/10 hidden md:flex flex-col shrink-0 h-full">
        <div className="p-4">
          <Button variant="outline" className="w-full justify-start gap-2 rounded-xl h-10 bg-background hover:bg-muted shadow-sm border-border/50">
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">{t("newChat")}</span>
          </Button>
        </div>
        
        {/* Recent List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          <div className="text-xs font-semibold text-muted-foreground/60 px-2 py-2">{t("recent")}</div>
          <div className="group flex items-center gap-2 px-2 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg cursor-pointer transition-colors">
             <div className="w-1 h-4 rounded-full bg-indigo-500/0 group-hover:bg-indigo-500 transition-colors"></div>
             {t("historyComing")}
          </div>
        </div>
      </aside>

      {/* === 右侧主区域 === */}
      <main className="flex-1 relative flex flex-col min-w-0 h-full bg-background/50">

        {/* 🟢 消息列表 */}
        <ScrollArea className="flex-1 w-full h-full" ref={scrollAreaRef}>
          {/* pb-36: 底部留白，防止被输入框遮挡 */}
          <div className="px-4 md:px-0 max-w-4xl mx-auto pt-6 pb-40 space-y-8">

            {/* 欢迎语 */}
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
                <div className="h-20 w-20 rounded-3xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-500/20">
                  <Bot className="text-white w-10 h-10" />
                </div>
                <div className="space-y-2 max-w-lg">
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-green-500 to-blue-500">
                      {t("greeting")}
                    </span>
                  </h1>
                  <p className="text-muted-foreground text-lg">
                    {t("subtitle")}
                  </p>
                </div>
              </div>
            )}

            {/* 消息体 */}
            {messages.map((m: Message) => (
              <div key={m.id} className={cn("flex gap-4 px-2", m.role === 'user' ? "justify-end" : "justify-start")}>

                {/* AI 头像 */}
                {m.role !== 'user' && (
                  <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                )}

                <div className={cn("relative max-w-[90%] md:max-w-[85%]", m.role === 'user' ? "text-right" : "text-left")}>
                 <div className="prose dark:prose-invert max-w-none break-words text-inherit leading-normal">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        // 注意：这里移除了 className，因为它不能传给 ReactMarkdown
                        components={{
                        p: ({ node, ...props }) => <p {...props} className="mb-2 last:mb-0 text-[20px] leading-7" />,
                        ul: ({ node, ...props }) => <ul {...props} className="list-disc pl-5 my-2 space-y-1" />,
                        ol: ({ node, ...props }) => <ol {...props} className="list-decimal pl-5 my-2 space-y-1" />,
                        h1: ({ node, ...props }) => <h1 {...props} className="text-xl font-bold mt-4 mb-2" />,
                        h2: ({ node, ...props }) => <h2 {...props} className="text-lg font-bold mt-3 mb-2" />,
                        h3: ({ node, ...props }) => <h3 {...props} className="text-base font-bold mt-2 mb-1" />,
                        code({ node, inline, className, children, ...props }: any) {
                            const match = /language-(\w+)/.exec(className || '')
                            return !inline && match ? (
                                // 1. 使用 grid grid-cols-1: 这是 CSS 布局中的"黑魔法"，能强制让子元素不撑开父元素
                                // 2. max-w-[calc(100vw-5rem)]: 最后的物理防线，强制不超过屏幕宽度减去两侧边距
                                // 3. min-w-0: 允许 grid item 压缩
                                <div className="grid grid-cols-1 min-w-0 w-full max-w-[calc(100vw-5rem)] md:max-w-full my-3">
                                    <div className="overflow-hidden rounded-lg border border-border/50 bg-[#1e1e1e] shadow-sm">
                                    <div className="flex items-center justify-between px-3 py-1.5 bg-white/5 border-b border-white/10">
                                        <span className="text-xs font-mono text-gray-400/80">{match[1]}</span>
                                    </div>
                                    
                                    {/* 滚动层单独放这里 */}
                                    <div className="overflow-x-auto w-full">
                                        <CodeHighlighter
                                        language={match[1]}
                                        {...props}
                                        >
                                        {String(children).replace(/\n$/, '')}
                                        </CodeHighlighter>
                                    </div>
                                    </div>
                                </div>
                            ) : (
                                <code className={cn("bg-muted/80 px-1.5 py-0.5 rounded text-[0.9em] font-mono text-indigo-600 dark:text-indigo-400 break-all whitespace-pre-wrap", className)} {...props}>
                                {children}
                                </code>
                            )
                            },
                        a: ({ node, ...props }) => <a {...props} target="_blank" className="text-indigo-500 hover:underline font-medium" />,
                        table: ({ node, ...props }) => (
                            <div className="w-full overflow-x-auto my-3 border rounded-lg scrollbar-thin">
                            <table {...props} className="w-full text-sm min-w-[300px]" /> {/* min-w 保证表格不会被压太扁 */}
                            </div>
                        ),
                        th: ({ node, ...props }) => <th {...props} className="bg-muted/50 px-3 py-2 font-semibold border-b text-left" />,
                        td: ({ node, ...props }) => <td {...props} className="px-3 py-2 border-b last:border-0" />,
                      }}
                    >
                      {m.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-4 px-2 justify-start">
                 <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <Bot className="w-4 h-4 text-muted-foreground animate-pulse" />
                 </div>
                 <div className="flex gap-1 items-center py-2">
                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-75"></span>
                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-150"></span>
                 </div>
              </div>
            )}
            
            <div ref={messagesEndRef} className="h-1" />
          </div>
        </ScrollArea>

        {/* 🟢 输入框区域 (Z-50 确保最上层) */}
        <div className="absolute bottom-0 left-0 w-full z-50">
          {/* 渐变遮罩 */}
          <div className="h-32 bg-gradient-to-t from-background via-background/90 to-transparent pointer-events-none absolute bottom-0 left-0 right-0 z-0" />

          <div className="relative z-10 max-w-4xl mx-auto px-4 pb-6">
            <div className="flex flex-col gap-2">
              
              <form
                onSubmit={handleSubmit}
                className="relative bg-secondary/30 focus-within:bg-background transition-colors border border-border/40 hover:border-border/60 focus-within:border-indigo-500/50 rounded-[24px] shadow-lg backdrop-blur-md"
              >
                <Input
                    value={input}
                    onChange={handleInputChange}
                    placeholder={t("placeholder")}
                    className="
                        w-full 
                        border-0 
                        shadow-none 
                        bg-transparent 
                        focus-visible:ring-0 
                        px-6 
                        py-4 
                        h-14 
                        md:h-20 
                        !text-lg       /* 手机端强制 20px */
                        md:!text-lg   
                        placeholder:text-muted-foreground/50
                    "
                    />
                <Button
                  type="submit"
                  size="icon"
                  disabled={isLoading || !input.trim()}
                  className={cn(
                    "absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full transition-all",
                    input.trim()
                      ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </form>

              <div className="text-[15px] text-center text-muted-foreground/90 font-medium">
                {t("disclaimer")}
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}