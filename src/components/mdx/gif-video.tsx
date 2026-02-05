"use client";

import { cn } from "@/lib/utils";

interface GifVideoProps {
  src: string;
  align?: "left" | "center" | "right";
  width?: string | number; // 支持 "300px", "30%", 或数字 300
  height?: string | number;
  className?: string;
}

export function GifVideo({ 
  src, 
  align = "center", 
  width, 
  height, 
  className 
}: GifVideoProps) {
  
  // 1. 智能处理尺寸
  const finalWidth = width ? (typeof width === 'number' ? `${width}px` : width) : undefined;
  const finalHeight = height ? (typeof height === 'number' ? `${height}px` : height) : undefined;

  // 2. 动态构建 style 对象 (强制生效，解决 float 偶尔失效的问题),
  const dynamicStyle: React.CSSProperties = {
    width: finalWidth,
    height: finalHeight,
    float: align === 'left' ? 'left' : (align === 'right' ? 'right' : 'none'),
    //上下居中
    display: 'inline-block',
    verticalAlign: 'middle', 
  };

  return (
    <div 
      style={dynamicStyle}
      className={cn(
        // 基础样式
        "relative overflow-hidden mb-2", // mb-2 保持底部微小间距

        // --- 对齐与边距逻辑 ---
        
        // Left: 左浮动，文字在右。给右边距(mr)推开文字
        align === 'left' && "mr-6 clear-left",
        
        // Right: 右浮动，文字在左。给左边距(ml)推开文字
        align === 'right' && "ml-6 clear-right",

        // Center: 居中，清除两侧浮动，独占一行
        align === 'center' && "mx-auto block mb-8 clear-both",

        // --- 默认宽度兜底 ---
        // 只有在没传 width 时才应用默认限制
        (!width && align === 'center') && "w-full md:max-w-[80%]",
        (!width && align !== 'center') && "max-w-[50%]", // 浮动时默认最大一半，防止挤没文字

        className
      )}
    >
      <video
        src={src}
        autoPlay
        loop
        muted
        playsInline
        controls={false}
        className={cn(
          "rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm w-full h-auto object-cover",
          "bg-slate-100 dark:bg-slate-900"
        )}
      />
    </div>
  );
}