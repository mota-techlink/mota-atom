"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Eye, Edit2 } from "lucide-react";
import { useDebounce } from "use-debounce";
import { OrderDetailsDialog } from "./order-details-dialog";
import { OrderStatusEditor } from "./order-status-editor";

interface Order {
  id: string;
  order_number: string;
  created_at: string;
  status: string;
  amount_total: number;
  currency: string;
  product_name: string;
  customer_email: string;
  payment_provider: string;
  user_id: string;
  [key: string]: any;
}

export function AdminOrdersTable({
  initialOrders,
  userRole,
}: {
  initialOrders: Order[];
  userRole: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [text, setText] = useState(searchParams.get("q") || "");
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "");
  const [query] = useDebounce(text, 500);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (query !== searchParams.get("q") || statusFilter !== searchParams.get("status")) {
      setIsSearching(true);
      const params = new URLSearchParams(searchParams);
      if (query) {
        params.set("q", query);
      } else {
        params.delete("q");
      }
      if (statusFilter) {
        params.set("status", statusFilter);
      } else {
        params.delete("status");
      }
      router.push(`?${params.toString()}`);
    } else {
      setIsSearching(false);
    }
  }, [query, statusFilter, router, searchParams]);

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

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "2-digit",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search order number, email, or product..."
            className="pl-8"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <Select value={statusFilter || "all"} onValueChange={(value) => setStatusFilter(value === "all" ? "" : value)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order Number</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialOrders && initialOrders.length > 0 ? (
              initialOrders.map((order) => (
                <TableRow key={order.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{order.order_number}</TableCell>
                  <TableCell className="text-sm">
                    <div>{order.customer_email}</div>
                  </TableCell>
                  <TableCell className="text-sm">{order.product_name}</TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(order.amount_total, order.currency || "USD")}
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-xs ${getStatusColor(order.status)}`}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(order.created_at)}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedOrder(order)}
                      title="View details"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {(userRole === "admin" || userRole === "staff") && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingOrder(order)}
                        title="Edit status"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  No orders found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Order Details Dialog */}
      {selectedOrder && (
        <OrderDetailsDialog
          order={selectedOrder}
          open={!!selectedOrder}
          onOpenChange={(open) => {
            if (!open) setSelectedOrder(null);
          }}
        />
      )}

      {/* Order Status Editor Dialog */}
      {editingOrder && (
        <OrderStatusEditor
          order={editingOrder}
          open={!!editingOrder}
          onOpenChange={(open) => {
            if (!open) setEditingOrder(null);
          }}
          onSave={() => {
            setEditingOrder(null);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
