"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getCarrierLabel } from "@/config/shipping-carriers";

interface Order {
  id: string;
  order_number: string;
  created_at: string;
  status: string;
  amount_total: number;
  currency: string;
  product_name: string;
  customer_email: string;
  customer_phone?: string;
  payment_provider: string;
  user_id: string;
  shipping_address?: any;
  tracking_number?: string;
  shipping_carrier?: string;
  shipped_at?: string;
  delivered_at?: string;
  [key: string]: any;
}

export function OrderDetailsDialog({
  order,
  open,
  onOpenChange,
}: {
  order: Order;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-emerald-100 text-emerald-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: order.currency?.toUpperCase() || "USD",
    }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-96 overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
          <DialogDescription>Order #{order.order_number}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Order Number</p>
              <p className="text-sm font-medium">{order.order_number}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Status</p>
              <Badge className={`text-xs mt-1 ${getStatusColor(order.status)}`}>
                {order.status}
              </Badge>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Created At</p>
              <p className="text-sm">
                {new Date(order.created_at).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Total Amount</p>
              <p className="text-sm font-medium">{formatCurrency(order.amount_total)}</p>
            </div>
          </div>

          <Separator />

          {/* Customer Info */}
          <div>
            <h4 className="font-medium mb-3">Customer Information</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Email</p>
                <p>{order.customer_email}</p>
              </div>
              {order.customer_phone && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Phone</p>
                  <p>{order.customer_phone}</p>
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h4 className="font-medium mb-3">Product Information</h4>
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Product Name</p>
                <p>{order.product_name}</p>
              </div>
              {order.tier_name && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Tier</p>
                  <p>{order.tier_name}</p>
                </div>
              )}
              <div>
                <p className="text-xs font-medium text-muted-foreground">Payment Provider</p>
                <p className="capitalize">{order.payment_provider}</p>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          <>
            <Separator />
            <div>
              <h4 className="font-medium mb-3">Shipping Information</h4>
              <div className="space-y-3 text-sm">
                {/* Carrier */}
                <div className="flex items-center gap-2">
                  <p className="text-xs font-medium text-muted-foreground w-32">Carrier</p>
                  <Badge variant="outline" className="capitalize">
                    {getCarrierLabel(order.shipping_carrier)}
                  </Badge>
                </div>

                {/* Tracking Number */}
                {order.tracking_number && order.shipping_carrier !== "no_shipping" && (
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-medium text-muted-foreground w-32">Tracking Number</p>
                    <p className="font-mono">{order.tracking_number}</p>
                  </div>
                )}

                {/* Shipped At */}
                {order.shipped_at && (
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-medium text-muted-foreground w-32">Shipped At</p>
                    <p>{new Date(order.shipped_at).toLocaleDateString()}</p>
                  </div>
                )}

                {/* Delivered At */}
                {order.delivered_at && (
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-medium text-muted-foreground w-32">Delivered At</p>
                    <p>{new Date(order.delivered_at).toLocaleDateString()}</p>
                  </div>
                )}

                {/* Address */}
                {order.shipping_address && (
                  <div className="pt-2 border-t">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Shipping Address</p>
                    {order.shipping_address.street && (
                      <p>{order.shipping_address.street}</p>
                    )}
                    {order.shipping_address.city && (
                      <p>
                        {order.shipping_address.city}, {order.shipping_address.state}{" "}
                        {order.shipping_address.zip}
                      </p>
                    )}
                    {order.shipping_address.country && (
                      <p>{order.shipping_address.country}</p>
                    )}
                  </div>
                )}

                {/* No-shipping hint */}
                {(!order.shipping_carrier || order.shipping_carrier === "no_shipping") && !order.shipping_address && (
                  <p className="text-muted-foreground italic">Digital delivery — no physical shipment.</p>
                )}
              </div>
            </div>
          </>
        </div>
      </DialogContent>
    </Dialog>
  );
}
