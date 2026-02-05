"use client"

import * as React from "react"
import Link, { LinkProps } from "next/link"
import { useRouter } from "next/navigation"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Menu } from "lucide-react"
import { useTranslations } from "next-intl"
import { mainNavConfig } from "@/config/nav" // 🟢 引入同一个配置

export function MobileNav() {
  const [open, setOpen] = React.useState(false)
  const t = useTranslations('Nav') // 🟢 引入翻译

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <MobileLink
          href="/"
          className="flex items-center"
          onOpenChange={setOpen}
        >
          <span className="font-bold">{siteConfig.name}</span>
        </MobileLink>
        <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
          <div className="flex flex-col space-y-3">
            <Accordion type="single" collapsible className="w-full">
              {mainNavConfig.map((item, index) => {
                // 情况 1: 有子菜单
                if ("items" in item && item.items) {
                  return (
                    <AccordionItem value={item.title} key={index} className="border-b-0">
                      <AccordionTrigger className="text-base font-medium py-4 hover:no-underline">
                        {t(item.title)}
                      </AccordionTrigger>
                      <AccordionContent className="flex flex-col space-y-2 pb-4 pl-4">
                        {item.items.map((subItem) => (
                          <MobileLink
                            key={subItem.href}
                            href={subItem.href || "#"}
                            onOpenChange={setOpen}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            {/* 移动端通常不需要描述，只显示标题 */}
                            {t(`items.${subItem.title}.title`)}
                          </MobileLink>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  )
                }

                // 情况 2: 普通链接
                return (
                  <div key={index} className="py-4 border-b border-muted/20 last:border-0">
                     <MobileLink
                      href={item.href || "#"}
                      onOpenChange={setOpen}
                      className="text-base font-medium"
                    >
                      {t(item.title)}
                    </MobileLink>
                  </div>
                )
              })}
            </Accordion>
          </div>
          
          <div className="flex flex-col gap-4 mt-8 pr-6">
             <Link href="/login" onClick={() => setOpen(false)}>
                <Button variant="outline" className="w-full">Log In</Button>
             </Link>
             <Link href="/get-started" onClick={() => setOpen(false)}>
                <Button className="w-full">Get Started</Button>
             </Link>
          </div>

        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

// MobileLink 辅助组件保持不变...
interface MobileLinkProps extends LinkProps {
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
  className?: string
}

function MobileLink({
  href,
  onOpenChange,
  className,
  children,
  ...props
}: MobileLinkProps) {
  const router = useRouter()
  return (
    <Link
      href={href}
      onClick={() => {
        router.push(href.toString())
        onOpenChange?.(false)
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </Link>
  )
}