"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface BionicTextProps {
  content: string;
  className?: string;
  fixation?: number; // 控制加粗的比例，默认 0.5 (即前50%)
}

export function BionicText({ content, className, fixation = 0.5 }: BionicTextProps) {
  // 简单的处理逻辑：按空格分词 -> 处理每个词 -> 重新组合
  // 注意：生产环境可能需要更复杂的 NLP 分词，防止标点符号被错误加粗
  const processText = (text: string) => {
    return text.split(" ").map((word, index) => {
      // 计算需要加粗的字符数
      const boldLength = Math.max(1, Math.floor(word.length * fixation));
      
      const boldPart = word.slice(0, boldLength);
      const normalPart = word.slice(boldLength);

      return (
        <React.Fragment key={index}>
          <span className="inline-block">
            {/* 这里的 text-foreground 是深色/高亮色 */}
            <b className="font-bold text-foreground opacity-100">{boldPart}</b>
            {/* 这里的 opacity-60 是你提到的“逐渐淡化”效果 */}
            <span className="font-normal opacity-60">{normalPart}</span>
          </span>
          {/* 单词间加空格 */}
          {" "}
        </React.Fragment>
      );
    });
  };

  return (
    <div className={cn("leading-relaxed text-lg", className)}>
      {processText(content)}
    </div>
  );
}