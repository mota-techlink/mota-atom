"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { 
  CreditCard, MapPin, Package, Calendar, Bitcoin, 
  ExternalLink, Truck, Headphones, Copy, FileText 
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getCarrierLabel } from "@/config/shipping-carriers"

interface OrderDetailsProps {
  order: any | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function OrderDetailsDialog({ order, open, onOpenChange }: OrderDetailsProps) {
  if (!order) return null

  // 简单的 slugify 函数，用于生成产品链接
  // 实际项目中建议在 orders 表里多存一个 product_slug 字段
  const productSlug = order.product_slug

  // 支付链接生成 (示例逻辑)
  const getPaymentLink = () => {
    if (order.payment_provider === 'stripe') return 'https://stripe.com'
    if (order.payment_provider === 'crypto') return 'https://commerce.coinbase.com' // 或区块链浏览器链接
    return '#'
  }

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

  const address = order.shipping_address
  const addressStr = address 
    ? `${address.line1}, ${address.city}, ${address.state} ${address.postal_code}, ${address.country}`
    : "No physical address provided (Digital Delivery)"

  const shippingCarrier = order.shipping_carrier || "no_shipping"
  const trackingNumber = order.tracking_number || "-"
  const shippedAt = order.shipped_at ? formatDate(order.shipped_at) : null
  const deliveredAt = order.delivered_at ? formatDate(order.delivered_at) : null
  const expectedDelivery = order.expected_delivery_date ? formatDate(order.expected_delivery_date) : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className=" w-[90vw] h-[80vh] max-w-full max-h-full flex flex-col p-0 gap-0 bg-slate-950 border-slate-800 text-slate-50">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <DialogTitle className="flex items-center gap-3 text-xl">
                  Order {order.order_number}
                  <Badge variant={order.status === 'paid' ? 'default' : 'secondary'} className="capitalize bg-blue-600 hover:bg-blue-700 text-white">
                    {order.status}
                  </Badge>
                </DialogTitle>
                <DialogDescription className="text-slate-400">
                  Created on {formatDate(order.created_at)}
                </DialogDescription>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-400">{formatCurrency(order.amount_total, order.currency)}</p>
                <p className="text-xs text-slate-500 uppercase font-mono">Total Amount</p>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Tabs Content Area */}
        <Tabs defaultValue="info" className="flex-1 flex flex-col overflow-hidden">
          <div className="px-6 pt-4 border-b border-slate-800 bg-slate-900/50">
            <TabsList className="bg-transparent p-0 gap-6">
              <TabsTrigger value="info" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-400 data-[state=active]:shadow-none rounded-none pb-3 px-0 border-b-2 border-transparent text-slate-400">
                Order Information
              </TabsTrigger>
              <TabsTrigger value="shipping" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-400 data-[state=active]:shadow-none rounded-none pb-3 px-0 border-b-2 border-transparent text-slate-400">
                Shipping & Delivery
              </TabsTrigger>
              <TabsTrigger value="support" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-400 data-[state=active]:shadow-none rounded-none pb-3 px-0 border-b-2 border-transparent text-slate-400">
                After-sales Support
              </TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="flex-1 p-6 bg-slate-950">
            
            {/* TAB 1: Order Info */}
            <TabsContent value="info" className="space-y-8 mt-0">
              {/* Product Section */}
              <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-slate-400 flex items-center gap-2">
                      <Package className="w-4 h-4" /> Product Details
                    </h3>
                    <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 flex gap-5 items-center">
                        {/* 2. 产品增加跳转链接 */}
                        <div className="h-16 w-16 bg-slate-800 rounded-lg flex items-center justify-center shrink-0">
                           <Package className="text-slate-600" />
                        </div>
                        <div className="flex-1">
                           <h4 className="font-semibold text-lg">{order.product_name}</h4>
                           <p className="text-sm text-slate-400">{order.tier_name} Plan</p>
                        </div>
                        <Button asChild variant="outline" size="sm" className="border-slate-700 hover:bg-slate-800 hover:text-white">                           
                           <Link href={`${productSlug}`} target="_blank" rel="noopener noreferrer">
                             View Product <ExternalLink className="ml-2 w-3 h-3" />
                           </Link>
                        </Button>
                    </div>
                 
              </div>

              <Separator className="bg-slate-800" />

              {/* Payment Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-400 flex items-center gap-2">
                  {order.payment_provider === 'crypto' ? <Bitcoin className="w-4 h-4" /> : <CreditCard className="w-4 h-4" />}
                  Payment Information
                </h3>
                <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
                    <div className="grid grid-cols-2 divide-x divide-slate-800">
                        <div className="p-4">
                            <p className="text-xs text-slate-500 mb-1">Payment Provider</p>
                            <div className="flex items-center gap-2 font-medium capitalize">
                               {order.payment_provider}
                               {/* 1. 支付信息增加跳转链接 */}
                               <a href={getPaymentLink()} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline ml-1">
                                 (Visit Site)
                               </a>
                            </div>
                        </div>
                        <div className="p-4">
                            <p className="text-xs text-slate-500 mb-1">Transaction ID</p>
                            <div className="flex items-center gap-2 font-mono text-sm">
                               <span className="truncate max-w-50">{order.payment_transaction_id}</span>
                               <Button variant="ghost" size="icon" className="h-4 w-4 text-slate-500 hover:text-white">
                                  <Copy className="w-3 h-3" />
                               </Button>
                            </div>
                        </div>
                    </div>
                </div>
              </div>
            </TabsContent>

            {/* TAB 2: Shipping */}
            <TabsContent value="shipping" className="space-y-6 mt-0">
               <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
                  <div className="flex items-start gap-4">
                     <div className="bg-blue-500/10 p-3 rounded-full">
                        <MapPin className="w-6 h-6 text-blue-500" />
                     </div>
                     <div>
                        <h4 className="font-semibold text-lg mb-1">Shipping Address</h4>
                        <p className="text-slate-400 leading-relaxed max-w-md">
                           {addressStr}
                        </p>
                     </div>
                  </div>
               </div>

               <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-slate-400 flex items-center gap-2">
                     <Truck className="w-4 h-4" /> Delivery Status
                  </h3>
                   <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="capitalize">
                          {getCarrierLabel(shippingCarrier)}
                        </Badge>
                        {trackingNumber !== "-" && shippingCarrier !== "no_shipping" && (
                          <div className="flex items-center gap-2 text-sm text-slate-300">
                            <span className="text-slate-500">Tracking:</span>
                            <span className="font-mono">{trackingNumber}</span>
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-white" onClick={() => navigator.clipboard?.writeText(trackingNumber)}>
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                      {expectedDelivery && (
                        <p className="text-sm text-slate-400">Expected delivery: <span className="text-white">{expectedDelivery}</span></p>
                      )}
                      {shippingCarrier === "no_shipping" && (
                        <p className="text-sm text-slate-400">Digital delivery / no physical shipment.</p>
                      )}
                   </div>
                  <div className="relative border-l border-slate-800 ml-3 pl-8 space-y-8 py-2">
                     <div className="relative">
                        <span className="absolute -left-9 bg-green-500 h-4 w-4 rounded-full border-4 border-slate-950"></span>
                        <p className="text-sm text-slate-400 mb-1">{formatDate(order.created_at)}</p>
                        <p className="font-medium text-white">Order Placed</p>
                     </div>
                     <div className="relative">
                        <span className="absolute -left-9 bg-blue-500 h-4 w-4 rounded-full border-4 border-slate-950 animate-pulse"></span>
                        <p className="text-sm text-slate-400 mb-1">Processing</p>
                        <p className="font-medium text-white">We are preparing your service</p>
                     </div>
                     <div className="relative opacity-50">
                        <span className="absolute -left-9 bg-slate-700 h-4 w-4 rounded-full border-4 border-slate-950"></span>
                            <p className="text-sm text-slate-400 mb-1">
                                {expectedDelivery ? expectedDelivery : 'Pending'}
                            </p>
                            <p className="font-medium text-white">Estimated Delivery</p>
                     </div>
                        {shippedAt && (
                          <div className="relative">
                            <span className="absolute -left-9 bg-amber-400 h-4 w-4 rounded-full border-4 border-slate-950"></span>
                            <p className="text-sm text-slate-400 mb-1">{shippedAt}</p>
                            <p className="font-medium text-white">Shipped</p>
                          </div>
                        )}
                        {deliveredAt && (
                          <div className="relative">
                            <span className="absolute -left-9 bg-green-400 h-4 w-4 rounded-full border-4 border-slate-950"></span>
                            <p className="text-sm text-slate-400 mb-1">{deliveredAt}</p>
                            <p className="font-medium text-white">Delivered</p>
                          </div>
                        )}
                  </div>
               </div>
            </TabsContent>

            {/* TAB 3: Support */}
            <TabsContent value="support" className="mt-0">
               <div className="grid gap-6">
                  <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 flex flex-col items-center text-center space-y-4">
                     <div className="bg-slate-800 p-4 rounded-full">
                        <Headphones className="w-8 h-8 text-blue-400" />
                     </div>
                     <div>
                        <h3 className="text-lg font-semibold">Need Help with this Order?</h3>
                        <p className="text-slate-400 text-sm mt-2 max-w-sm mx-auto">
                           Our support team is ready to assist you with any issues regarding "{order.product_name}".
                        </p>
                     </div>
                     <div className="flex gap-4 pt-2">
                        <Button className="bg-blue-600 hover:bg-blue-700">Contact Support</Button>
                        <Button variant="outline" className="border-slate-700 hover:bg-slate-800">View FAQ</Button>
                     </div>
                  </div>

                  <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
                     <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-400" /> Invoice & Documents
                     </h4>
                     <div className="flex items-center justify-between p-4 bg-slate-950 rounded-lg border border-slate-800">
                        <div className="flex items-center gap-3">
                           <div className="h-10 w-10 bg-red-500/10 rounded flex items-center justify-center">
                              <span className="text-red-500 text-xs font-bold">PDF</span>
                           </div>
                           <div>
                              <p className="text-sm font-medium">Invoice #{order.order_number}</p>
                              <p className="text-xs text-slate-500">1.2 MB</p>
                           </div>
                        </div>
                        <Button variant="ghost" size="sm" className="hover:text-blue-400">Download</Button>
                     </div>
                  </div>
               </div>
            </TabsContent>

          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}