"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { SHIPPING_CARRIERS } from "@/config/shipping-carriers";

interface Order {
  id: string;
  order_number: string;
  status: string;
  tracking_number?: string;
  shipping_carrier?: string;
  [key: string]: any;
}

export function OrderStatusEditor({
  order,
  open,
  onOpenChange,
  onSave,
}: {
  order: Order;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
}) {
  const [newStatus, setNewStatus] = useState(order.status);
  const [trackingNumber, setTrackingNumber] = useState(order.tracking_number || "");
  const [shippingCarrier, setShippingCarrier] = useState(
    order.shipping_carrier || "no_shipping"
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!newStatus) {
      setError("Please select a status");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/orders/update-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: order.id,
          status: newStatus,
          trackingNumber: trackingNumber || undefined,
          shippingCarrier,
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      onOpenChange(false);
      onSave();
    } catch (err: any) {
      setError(err.message || "Failed to update order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Order Status</DialogTitle>
          <DialogDescription>Order #{order.order_number}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {newStatus === "shipped" && (
            <div>
              <Label htmlFor="tracking">Tracking Number (Optional)</Label>
              <Input
                id="tracking"
                placeholder="Enter tracking number"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
              />
            </div>
          )}

          {/* Shipping carrier picker (searchable) */}
          <div className="space-y-2">
            <Label>Shipping Carrier</Label>
            <div className="rounded-md border bg-background">
              <Command>
                <CommandInput placeholder="Type to filter carrier..." />
                <CommandList>
                  <CommandEmpty>No carrier found.</CommandEmpty>
                  <CommandGroup heading="Carriers">
                    {SHIPPING_CARRIERS.map((carrier) => (
                      <CommandItem
                        key={carrier.value}
                        value={carrier.label}
                        onSelect={() => setShippingCarrier(carrier.value)}
                        className={shippingCarrier === carrier.value ? "bg-accent" : ""}
                      >
                        <span className="capitalize">{carrier.label}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </div>
            <p className="text-xs text-muted-foreground">
              Current: <span className="font-medium text-foreground capitalize">{SHIPPING_CARRIERS.find(c => c.value === shippingCarrier)?.label || "No shipping required"}</span>
            </p>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
