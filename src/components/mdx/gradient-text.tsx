"use client"
import { cn } from "@/lib/utils";

interface GradientTextProps {
  children: React.ReactNode;
  from?: string; // e.g., "red", "#ff0000"
  to?: string;
  className?: string;
}

export function GradientText({ children, from = "blue-500", to = "purple-500", className }: GradientTextProps) {
  // 如果传入的是 hex 颜色，需要 style 处理，这里简化为 Tailwind 类名处理
  // 假设用户传入的是 Tailwind 颜色名，如 "orange-400"
  
  return (
    <span       
      className={cn(
        "bg-clip-text text-transparent bg-gradient-to-r font-bold",
        `from-${from} to-${to}`, // 注意：这需要 Tailwind Safelist 或者完整类名，简单起见建议直接传完整 className
        className
      )}
      // 为了支持任意颜色（如你的 markdown 里的 linear-gradient），我们允许 style 覆盖
      style={!className?.includes('from-') ? {
         backgroundImage: `linear-gradient(to right, ${from}, ${to})`
      } : undefined}
    >
      {children}
    </span>
  );
}