"use client"

import { useState } from "react"
import Image from "next/image"
import { Play } from "lucide-react"
import { cn } from "@/lib/utils"

interface YouTubeProps {
  id: string
  title?: string
  // 核心控制参数
  autoPlay?: boolean // 是否自动播放
  loop?: boolean     // 是否循环
  muted?: boolean    // 是否静音
  controls?: boolean // 是否显示控制条
  // 封面图相关
  coverImage?: string // 封面图 URL
}

export function YouTube({ 
  id, 
  title = "YouTube video player", 
  autoPlay = false, 
  loop = true, 
  muted = true,
  controls = true,
  coverImage,
}: YouTubeProps) {
  // 状态：是否开始播放
  const [isPlaying, setIsPlaying] = useState(autoPlay)

  // 构建 YouTube URL 参数
  // playlist={id} 是实现单视频循环播放的必要 hack
  const params = new URLSearchParams({
    autoplay: "1", // 点击后自动播放
    mute: muted ? "1" : "0",
    loop: loop ? "1" : "0",
    playlist: loop ? id : "", 
    controls: controls ? "1" : "0",
    rel: "0", // 不显示相关视频
  })

  // 处理点击播放
  const handlePlay = () => {
    setIsPlaying(true)
  }

  // 如果没有封面图，或者已经开始播放，直接渲染 iframe
  if (!coverImage || isPlaying) {
    return (
      <div className="relative w-full aspect-video my-8 rounded-xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 bg-black">
        <iframe
          src={`https://www.youtube.com/embed/${id}?${params.toString()}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full"
        />
      </div>
    )
  }

  // 否则：渲染带播放按钮的静态封面图
  return (
    <div 
      className="relative w-full aspect-video my-8 rounded-xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 bg-muted group cursor-pointer"
      onClick={handlePlay}
    >
      {/* 封面图 */}
      <Image
        src={coverImage}
        alt={title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      
      {/* 遮罩层 (可选) */}
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />

      {/* 居中播放按钮 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-16 w-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110">
          <Play className="h-8 w-8 text-black fill-black ml-1" />
        </div>
      </div>
    </div>
  )
}