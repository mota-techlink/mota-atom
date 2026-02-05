"use client";

import { cn } from "@/lib/utils";

interface ColorTextProps {
  children: React.ReactNode;
  color?: "green" | "red" | "blue" | "orange" | "purple" | "yellow"; // 预设颜色
  className?: string; // 允许传入自定义 Tailwind 类
}

export function ColorText({ children, color = "blue", className }: ColorTextProps) {
  
  // 🎨 颜色映射表：自动适配 Light/Dark 模式
  const colorMap = {
    // 绿色: 亮模式深绿 / 暗模式鲜绿
    green: "text-green-700 dark:text-green-400",
    
    // 红色: 亮模式深红 / 暗模式鲜红
    red: "text-red-600 dark:text-red-400",
    
    // 蓝色
    blue: "text-blue-600 dark:text-blue-400",
    
    // 橙色
    orange: "text-orange-600 dark:text-orange-400",
    
    // 紫色
    purple: "text-purple-600 dark:text-purple-400",
    
    // 黄色 (注意：黄色在白底很难看清，所以亮模式用深黄/棕)
    yellow: "text-yellow-600 dark:text-yellow-300",
  };

  return (
    <span 
      className={cn(
        "font-medium", // 默认加粗一点点，更好看
        colorMap[color], // 应用预设颜色
        className // 允许外部覆盖
      )}
    >
      {children}
    </span>
  );
}