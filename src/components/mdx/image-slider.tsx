// 这是一个 React Server Component (RSC)
import { getImagesFromDir } from "@/lib/image-loader"
import { ImageSliderClient } from "./image-slider-client"

interface ImageSliderProps {
  dir: string
  class?: string // 兼容 Hugo 写法
  className?: string // 兼容 React 写法
  width?: string
  height?: string
  webp?: string // string "true" | "false"
  option?: string
  zoomable?: string
  interval?: string // 切换间隔，单位毫秒
}

export async function ImageSlider(props: ImageSliderProps) {
  // 1. 获取图片列表 (Server Side)
  const images = await getImagesFromDir(props.dir)

  if (images.length === 0) {
    return (
        <div className="p-4 border border-dashed border-red-300 bg-red-50 text-red-500 rounded-lg text-sm">
            Slider Error: No images found in public/{props.dir}
        </div>
    )
  }

  // 2. 处理 Props 兼容性 (Hugo -> React)
  // Hugo 的参数通常是字符串，我们需要转换一下
  const combinedClassName = props.className || props.class || ""
  
  // 处理宽高比：如果传了 height="200"，我们将其转换为 CSS 样式
  // 但更好的方式是使用 tailwind 的 max-w 类名 (如 md 文件中写的 max-w-[800px])
  // aspectRatio 用于占位防抖动
  const aspectRatio = props.height && props.width 
    ? `${props.width}/${props.height}` 
    : "16/9"
  // 2. 解析 interval 参数，默认为 3000
  const delay = props.interval ? parseInt(props.interval) : 3000
  // 3. 渲染 Client Component
  return (
    <ImageSliderClient 
      images={images}
      className={combinedClassName}
      aspectRatio={aspectRatio}
      delay={delay}
    />
  )
}