"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarNavItem } from "@/config/docs";
import { cn } from "@/lib/utils";

interface DocsSidebarProps {
  items: SidebarNavItem[];
}

export function DocsSidebar({ items }: DocsSidebarProps) {
  const pathname = usePathname();

  return (
    <div className="w-full">
      {items.map((item, index) => (
        <div key={index} className="pb-4">
          <h4 className="mb-1 rounded-md px-2 py-1 text-sm font-semibold">
            {item.title}
          </h4>
          {item.items?.length && (
            <div className="grid grid-flow-row auto-rows-max text-sm">
              {item.items.map((child) => (
                <Link
                  key={child.href}
                  href={child.href || "#"}
                  className={cn(
                    "group flex w-full items-center rounded-md border border-transparent px-2 py-1.5 hover:underline text-muted-foreground",
                    // 激活状态样式：Resend 风格通常是文字变深色，或者左侧有细条
                    pathname === child.href
                      ? "font-medium text-foreground"
                      : ""
                  )}
                >
                  {child.title}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}