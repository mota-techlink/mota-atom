"use client"

import { useTheme } from "next-themes"
import Image from "next/image"
import { Link } from "@/navigation"
import { useEffect, useState } from "react"
import { siteConfig } from "@/config/site"

export function GlobalLogo() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // 防止 hydration 不匹配
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  // 根据主题选择 Logo
  const logoSrc =
    theme === "dark" ? siteConfig.logoDark : siteConfig.logoLight;

  return (
    <Link
      href="/"
      className="flex items-center gap-2 hover:opacity-80 transition-opacity"
      title="HOME"
    >
      <Image
        src={logoSrc}
        alt="Mota Techlink"
        width={120}
        height={40}
        priority
        className="h-10 w-auto"
      />
    </Link>
  )
}
