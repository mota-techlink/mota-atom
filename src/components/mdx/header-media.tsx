"use client"

import Image from "next/image"
import { YouTube } from "@/components/mdx/youtube"

interface HeaderMediaProps {
  image?: string
  youtube_id?: string
  title: string
}

export function HeaderMedia({ image, youtube_id, title }: HeaderMediaProps) {
  // 规则 1: 如有 youtube_id，优先渲染 YouTube
  if (youtube_id) {
    return (
      <YouTube 
        id={youtube_id}
        // 规则 2 & 3: 传入 image 作为封面，实现"默认不播放，显示静态图"
        coverImage={image}
        // 规则 4: 默认静音、循环、不自动播放(等待交互)
        muted={true}
        loop={true}
        autoPlay={false} 
      />
    )
  }

  // 规则 2: 如果没有 youtube_id，渲染主图 (Fallback)
  if (image) {
    return (
      <div className="relative w-full aspect-[21/9] overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-muted mb-12 shadow-md">
         <Image 
           src={image} 
           alt={title} 
           fill 
           className="object-cover"
           priority
         />
      </div>
    )
  }

  // 如果都没有，什么都不渲染
  return null
}