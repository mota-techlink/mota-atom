"use client"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CreditCard, MapPin, Package, Calendar, Bitcoin } from "lucide-react"

interface OrderDetailsProps {
  order: any | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function OrderDetailsSheet({ order, open, onOpenChange }: OrderDetailsProps) {
  if (!order) return null

  // 格式化辅助函数
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency?.toUpperCase() || 'USD',
    }).format(amount)
  }

  // 解析地址 (处理可能是 JSON 或 null 的情况)
  const address = order.shipping_address
  const addressStr = address 
    ? `${address.line1}, ${address.city}, ${address.state} ${address.postal_code}, ${address.country}`
    : "No physical address provided (Digital Delivery)"

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader className="mb-6">
          <SheetTitle className="flex items-center gap-2">
            Order {order.order_number}
            <Badge variant="outline" className="ml-2 capitalize">
              {order.status}
            </Badge>
          </SheetTitle>
          <SheetDescription>
            Created on {formatDate(order.created_at)}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-120px)] pr-4">
          <div className="space-y-6">
            
            {/* 产品详情 */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold flex items-center gap-2 text-primary">
                <Package className="w-4 h-4" /> Product Details
              </h4>
              <div className="rounded-lg border p-4 bg-muted/40">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold">{order.product_name}</p>
                    <p className="text-sm text-muted-foreground">{order.tier_name} Plan</p>
                  </div>
                  <p className="font-mono font-medium">
                    {formatCurrency(order.amount_total, order.currency)}
                  </p>
                </div>
                {order.expected_delivery_date && (
                  <div className="text-xs text-muted-foreground flex items-center gap-1 mt-2">
                    <Calendar className="w-3 h-3" />
                    Expected Delivery: {new Date(order.expected_delivery_date).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* 支付信息 */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold flex items-center gap-2 text-primary">
                {order.payment_provider === 'crypto' ? <Bitcoin className="w-4 h-4" /> : <CreditCard className="w-4 h-4" />}
                Payment Information
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Provider</p>
                  <p className="font-medium capitalize">{order.payment_provider}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Transaction ID</p>
                  <p className="font-mono text-xs truncate" title={order.payment_transaction_id}>
                    {order.payment_transaction_id || '-'}
                  </p>
                </div>
                {/* 如果有详细的支付方法信息 */}
                {order.payment_method_details?.card && (
                  <div className="col-span-2">
                     <p className="text-muted-foreground">Card</p>
                     <p className="font-medium">
                       {order.payment_method_details.card.brand?.toUpperCase()} ending in •••• {order.payment_method_details.card.last4}
                     </p>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* 客户与物流 */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold flex items-center gap-2 text-primary">
                <MapPin className="w-4 h-4" /> Shipping & Contact
              </h4>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium">{order.customer_email}</p>
                </div>
                {order.customer_phone && (
                  <div>
                    <p className="text-muted-foreground">Phone</p>
                    <p className="font-medium">{order.customer_phone}</p>
                  </div>
                )}
                <div>
                  <p className="text-muted-foreground">Address</p>
                  <p className="font-medium leading-relaxed">{addressStr}</p>
                </div>
              </div>
            </div>

          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}