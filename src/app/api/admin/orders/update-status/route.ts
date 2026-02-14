import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  // 验证用户权限
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: userProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (userProfile?.role !== "admin" && userProfile?.role !== "staff") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { orderId, status, trackingNumber, shippingCarrier } = await req.json();

    if (!orderId || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 1. Update the orders table (status + legacy tracking_number)
    const updateData: any = { status };
    if (trackingNumber) {
      updateData.tracking_number = trackingNumber;
    }

    const { error } = await supabase
      .from("orders")
      .update(updateData)
      .eq("id", orderId);

    if (error) throw error;

    // 2. Upsert order_shipping row with carrier, tracking, and timestamps
    const shippingData: any = {
      order_id: orderId,
      carrier: shippingCarrier || "no_shipping",
      tracking_number: trackingNumber || null,
      updated_at: new Date().toISOString(),
    };

    // Set shipped_at when status transitions to shipped
    if (status === "shipped") {
      shippingData.shipped_at = new Date().toISOString();
    }
    // Set delivered_at when status transitions to delivered
    if (status === "delivered") {
      shippingData.delivered_at = new Date().toISOString();
    }

    const { error: shippingError } = await supabase
      .from("order_shipping")
      .upsert(shippingData, { onConflict: "order_id" });

    if (shippingError) throw shippingError;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
