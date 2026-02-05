"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TypewriterTextProps {
  words: string[];           // 需要轮播的单词数组
  staticText?: string;       // 前面固定的文字 (可选)
  className?: string;        // 动态文字的样式
  cursorClassName?: string;  // 光标的样式
  typingSpeed?: number;      // 打字速度 (ms)
  deletingSpeed?: number;    // 删除速度 (ms)
  pauseTime?: number;        // 写完一个词后的停留时间 (ms)
}

export function TypewriterText({
  words,
  staticText,
  className,
  cursorClassName,
  typingSpeed = 150,
  deletingSpeed = 100,
  pauseTime = 2000,
}: TypewriterTextProps) {
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [delta, setDelta] = useState(typingSpeed);

  useEffect(() => {
    let ticker = setTimeout(() => {
      tick();
    }, delta);

    return () => clearTimeout(ticker);
  }, [text, delta]);

  const tick = () => {
    // 获取当前要显示的完整单词
    const i = loopNum % words.length;
    const fullText = words[i];

    // 根据状态更新显示的文本
    const updatedText = isDeleting
      ? fullText.substring(0, text.length - 1)
      : fullText.substring(0, text.length + 1);

    setText(updatedText);

    // 默认打字速度
    let newDelta = typingSpeed; 

    // 如果是删除状态，速度加快
    if (isDeleting) {
      newDelta = deletingSpeed; 
    }

    // 状态切换逻辑
    if (!isDeleting && updatedText === fullText) {
      // 单词打完了，暂停一下，然后开始删除
      newDelta = pauseTime;
      setIsDeleting(true);
    } else if (isDeleting && updatedText === "") {
      // 删除完了，切换到下一个单词，开始打字
      setIsDeleting(false);
      setLoopNum(loopNum + 1);
      newDelta = 500; // 删除完后稍微停顿一下再开始打字
    }

    setDelta(newDelta);
  };

  return (
    <span className="inline-block">
      {staticText && <span>{staticText} </span>}
      <span className={cn("font-bold", className)}>
        {text}
      </span>
      <span 
        className={cn(
          "ml-1 inline-block w-[3px] h-[1em] align-middle bg-primary animate-pulse", 
          cursorClassName
        )} 
      />
    </span>
  );
}