"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Package, ExternalLink, Loader2 } from "lucide-react"
// import { OrderDetailsSheet } from "./order-details-sheet"
import { useDebounce } from "use-debounce" // 建议安装: npm i use-debounce
import { useEffect } from "react"
import { OrderDetailsDialog } from "./order-details-dialog"

interface Order {
  id: string
  order_number: string
  created_at: string
  status: string
  amount_total: number
  currency: string
  product_name: string
  tier_name: string
  payment_provider: string
  shipping_address: any
  // ... 其他字段
}

export function OrdersTable({ initialOrders }: { initialOrders: Order[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [text, setText] = useState(searchParams.get("q") || "")
  const [query] = useDebounce(text, 500) // 防抖，避免频繁请求
  const [isSearching, setIsSearching] = useState(false)
  useEffect(() => {
    const orderToOpen = searchParams.get("open")
    if (orderToOpen) {
      const foundOrder = initialOrders.find(o => o.order_number === orderToOpen)
      if (foundOrder) {
        setSelectedOrder(foundOrder)
      }
    }
  }, [searchParams, initialOrders])

  // 搜索逻辑：更新 URL 参数
  useEffect(() => {
    if (query !== searchParams.get("q")) {
      setIsSearching(true)
      const params = new URLSearchParams(searchParams)
      if (query) {
        params.set("q", query)
      } else {
        params.delete("q")
      }
      router.push(`?${params.toString()}`)
    } else {
      setIsSearching(false)
    }
  }, [query, router, searchParams])

  // 状态颜色辅助函数
  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "default" // 黑色/白色
      case "pending": return "secondary" // 灰色
      case "shipped": return "outline" // 描边
      case "delivered": return "default" // 绿色 (可以通过 className 覆盖)
      case "cancelled": return "destructive" // 红色
      default: return "secondary"
    }
  }

  // 格式化货币
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount)
  }

  return (
    <div className="space-y-4">
      {/* 搜索栏 */}
      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search order number or product..."
            className="pl-8"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        {isSearching && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
      </div>

      {/* 表格 */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order #</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              initialOrders.map((order) => (
                <TableRow 
                  key={order.id} 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelectedOrder(order)} // 点击行打开详情
                >
                  <TableCell className="font-medium font-mono">
                    {order.order_number}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{order.product_name}</span>
                      <span className="text-xs text-muted-foreground">{order.tier_name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(order.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(order.status) as any} className="uppercase text-xs">
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(order.amount_total, order.currency)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* 详情抽屉 (Sheet) */}
      {/* <OrderDetailsSheet 
        order={selectedOrder} 
        open={!!selectedOrder} 
        onOpenChange={(open) => !open && setSelectedOrder(null)} 
      /> */}
      <OrderDetailsDialog 
        order={selectedOrder} 
        open={!!selectedOrder} 
        onOpenChange={(open) => !open && setSelectedOrder(null)} 
      />
    </div>
  )
}