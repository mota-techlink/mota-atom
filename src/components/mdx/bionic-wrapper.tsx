"use client";

import React from "react";
import { useBionic } from "@/components/providers/bionic-provider";
import { cn } from "@/lib/utils";

// 🛑 定义禁止处理的标签黑名单
// 这些标签内部通常不需要 Bionic 阅读优化，或者已经是粗体了
const SKIP_TAGS = [
  "b", "strong",        // 已经是粗体，再处理会破坏样式
  "h1", "h2", "h3", "h4", "h5", "h6", // 标题本身就是视觉重点
  "code", "pre",        // 代码块必须保持原样
  "img", "video",       // 媒体元素
  "svg", "path"         // 矢量图标
];

// 处理单个单词的逻辑
const processWord = (word: string) => {
  if (word.length <= 1) return <b className="font-bold">{word}</b>;
  
  let boldLength;
  if (word.length <= 3) {
    boldLength = 1; 
  } else if (word.length <= 5) {
    boldLength = 2; 
  } else if (word.length <= 9) {
    boldLength = 3; 
  } else {
    boldLength = Math.ceil(word.length * 0.4); 
  }

  const boldPart = word.slice(0, boldLength);
  const normalPart = word.slice(boldLength);

  return (
    <span key={word}>
      <b className="font-bold">{boldPart}</b>
      
      {/* 🛠️ 修复核心 2：移除了 "font-normal" 类
         现在的逻辑：只控制 opacity。
         如果父级是普通 p，它是 normal。
         如果父级是 strong (虽然我们跳过了 strong，但以防万一)，它依然保持 bold 只是变淡。
      */}
      <span className="opacity-90">
        {normalPart}
      </span>
    </span>
  );
};

const processText = (text: string) => {
  return text.split(/(\s+)/).map((part, index) => {
    if (part.trim() === "") return part;
    return <React.Fragment key={index}>{processWord(part)}</React.Fragment>;
  });
};

// 递归遍历逻辑
const recursiveMap = (children: React.ReactNode): React.ReactNode => {
  return React.Children.map(children, (child) => {
    // 1. 纯文本 -> 处理
    if (typeof child === "string") {
      return processText(child);
    }

    // 2. React 元素 -> 检查是否需要跳过
    if (React.isValidElement(child)) {
      const element = child as React.ReactElement<{ 
        children?: React.ReactNode; 
        "data-no-bionic"?: string | boolean;
        className?: string;
      }>;

      // 🛑 检查 1: 是否有 data-no-bionic 标记 (针对 Gradient 等组件)
      if (
        element.props["data-no-bionic"] === "true" || 
        element.props["data-no-bionic"] === true
      ) {
        return child;
      }

      // 🛑 检查 2: 标签黑名单 (针对 <strong>, <b>, <h1> 等)
      // element.type 对于原生标签来说是字符串 (如 "strong")
      if (typeof element.type === "string" && SKIP_TAGS.includes(element.type)) {
        return child; // 直接返回原元素，不进入递归
      }

      // 继续递归处理子元素
      if (element.props.children) {
        return React.cloneElement(element, {
          ...element.props,
          children: recursiveMap(element.props.children),
        } as any);
      }
      return child;
    }

    return child;
  });
};

export function BionicWrapper({ 
  children, 
  as: Component = "p", 
  className,
  ...props 
}: { 
  children: React.ReactNode, 
  as?: any,
  className?: string
  [key: string]: any 
}) {
  const { isBionic } = useBionic();

  // 🛠️ 这里的逻辑是正确的：如果 isBionic 为 false，直接渲染原始 children
  // 如果你在 Off 状态下看到问题，请尝试刷新页面清除缓存
  if (!isBionic) {
    return <Component className={cn("leading-7", className)} {...props}>{children}</Component>;
  }

  return (
    <Component className={cn("leading-7", className)} {...props}>
      {recursiveMap(children)}
    </Component>
  );
}