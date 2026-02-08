"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { useTranslations } from "next-intl"
import { mainNavConfig, MainNavItem } from "@/config/nav" // 🟢 引入配置

export function MainNav() {
  const t = useTranslations('Nav')

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {mainNavConfig.map((item, index) => {
          // 情况 1: 包含子菜单的项 (Dropdown)
          if ("items" in item && item.items) {
            return (
              <NavigationMenuItem key={index}>
                <NavigationMenuTrigger>{t(item.title)}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  {/* 根据是否有 featured 项动态调整 Grid 布局 */}
                  <ul className={cn(
                    "grid gap-3 p-6 md:w-[400px] lg:w-[500px]",
                    item.items.some(sub => sub.featured) 
                      ? "lg:grid-cols-[.75fr_1fr] lg:w-[600px]" // 如果有特色项，显示双列
                      : "lg:grid-cols-2" // 否则显示普通双列
                  )}>
                    {item.items.map((subItem) => {
                      // 特色大卡片渲染 (例如 MOTA ATOM)
                      if (subItem.featured) {
                        return (
                          <li key={subItem.title} className="row-span-3">
                            <NavigationMenuLink asChild>
                              <a
                                className="flex h-full w-full select-none flex-col justify-start rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                href={subItem.href}
                              >
                                <div className="mb-2 mt-2 text-lg font-medium">
                                  {t(`items.${subItem.title}.title`)}
                                </div>
                                <p className="text-sm leading-tight text-muted-foreground">
                                  {t(`items.${subItem.title}.desc`)}
                                </p>
                              </a>
                            </NavigationMenuLink>
                          </li>
                        )
                      }
                      // 普通列表项渲染
                      return (
                        <ListItem 
                          key={subItem.title} 
                          href={subItem.href} 
                          title={t(`items.${subItem.title}.title`)}
                        >
                          {t(`items.${subItem.title}.desc`)}
                        </ListItem>
                      )
                    })}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            )
          }

          // 情况 2: 普通链接 (如 Pricing)
          return (
            <NavigationMenuItem key={index}>
              <Link href={item.href || "#"} legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  {t(item.title)}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          )
        })}
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"