// src/app/api/webhooks/coinbase/route.ts
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const runtime = 'edge';

const WEBHOOK_SECRET = process.env.COINBASE_COMMERCE_WEBHOOK_SECRET!;

/**
 * 使用 Web Crypto API 计算 HMAC-SHA256（Edge Runtime 兼容）
 */
async function hmacSha256(secret: string, message: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Coinbase Commerce Webhook Handler
 * 
 * 处理以下事件：
 * - charge:created: Charge 创建时触发
 * - charge:confirmed: 支付已确认（最重要！）
 * - charge:failed: 支付失败
 * - charge:delayed: 支付延迟（需要更多确认）
 * - charge:resolved: 支付解决
 */
export async function POST(req: Request) {
  try {
    // 1. 获取请求体和签名
    const body = await req.text();
    const signature = req.headers.get("x-cc-webhook-signature");

    if (!signature) {
      console.warn("Missing webhook signature");
      return NextResponse.json(
        { error: "Missing signature" },
        { status: 400 }
      );
    }

    // 2. 验证 Webhook 签名
    // Coinbase 使用 HMAC-SHA256 签名：
    // signature = HMAC-SHA256(body, secret)
    const expectedSignature = await hmacSha256(WEBHOOK_SECRET, body);

    if (signature !== expectedSignature) {
      console.warn("Invalid webhook signature", {
        received: signature,
        expected: expectedSignature,
      });
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    // 3. 解析 webhook 数据
    const payload = JSON.parse(body);
    const { type, data } = payload;
    const charge = data;

    console.log(`Webhook received: ${type}`, {
      chargeId: charge.id,
      status: charge.status,
      amount: charge.crypto?.amount,
    });

    const supabase = await createClient();

    // 4. 根据事件类型处理
    switch (type) {
      case "charge:confirmed":
        return await handleChargeConfirmed(charge, supabase);

      case "charge:failed":
        return await handleChargeFailed(charge, supabase);

      case "charge:delayed":
        return await handleChargeDelayed(charge, supabase);

      case "charge:created":
        // 可选：记录 Charge 创建日志
        console.log("Charge created:", charge.id);
        return NextResponse.json({ received: true });

      default:
        console.log("Unknown event type:", type);
        return NextResponse.json({ received: true });
    }
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

/**
 * 处理支付确认事件
 * 这是最重要的事件 - 当用户成功发送加密货币时触发
 */
async function handleChargeConfirmed(charge: any, supabase: any) {
  try {
    // 1. 根据 Charge ID 查找订单
    const { data: order } = await supabase
      .from("orders")
      .select("id, user_id, status, total_amount")
      .eq("coinbase_charge_id", charge.id)
      .single();

    if (!order) {
      console.warn("Order not found for charge:", charge.id);
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // 2. 防止重复处理（幂等性）
    if (order.status === "completed" || order.status === "paid") {
      console.log("Order already paid:", order.id);
      return NextResponse.json({ received: true });
    }

    // 3. 更新订单状态
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        status: "paid", // 或 "completed"，取决于你的业务流程
        payment_provider: "crypto",
        payment_confirmed_at: new Date().toISOString(),
        payment_metadata: {
          coinbase_charge_id: charge.id,
          confirmed_amount: charge.crypto?.amount,
          confirmed_currency: charge.crypto?.code,
          timeline: charge.timeline,
          // 如果有交易哈希，也可以保存
          transaction_ids: charge.transaction?.hash,
        },
      })
      .eq("id", order.id);

    if (updateError) {
      console.error("Update order error:", updateError);
      return NextResponse.json(
        { error: "Failed to update order" },
        { status: 500 }
      );
    }

    // 3b. Upsert payment details into split table
    await supabase.from("order_payment_details").upsert({
      order_id: order.id,
      provider: "crypto",
      transaction_id: charge.transaction?.hash || charge.id,
      status: "paid",
      amount_paid: charge.crypto?.amount ? Number(charge.crypto.amount) : null,
      currency: charge.crypto?.code || null,
      payment_method: "crypto",
      metadata: {
        coinbase_charge_id: charge.id,
        confirmed_currency: charge.crypto?.code,
        timeline: charge.timeline,
      },
      paid_at: new Date().toISOString(),
    }, { onConflict: "order_id" });

    // 4. 触发后续流程（可选）
    // 例如：发送确认邮件、更新库存、触发配送流程等
    await notifyOrderConfirmed(order.id, order.user_id, supabase);

    console.log("Order confirmed:", order.id, {
      chargeId: charge.id,
      amount: charge.crypto?.amount,
    });

    return NextResponse.json({ received: true, orderId: order.id });
  } catch (error) {
    console.error("Handle charge confirmed error:", error);
    return NextResponse.json(
      { error: "Failed to handle confirmation" },
      { status: 500 }
    );
  }
}

/**
 * 处理支付失败事件
 */
async function handleChargeFailed(charge: any, supabase: any) {
  try {
    const { data: order } = await supabase
      .from("orders")
      .select("id, user_id")
      .eq("coinbase_charge_id", charge.id)
      .single();

    if (!order) return NextResponse.json({ received: true });

    // 更新订单状态为失败
    await supabase
      .from("orders")
      .update({
        status: "payment_failed",
        payment_metadata: {
          error: charge.timeline?.[0]?.description || "Payment failed",
          failedAt: new Date().toISOString(),
        },
      })
      .eq("id", order.id);

    // 通知用户
    await notifyPaymentFailed(order.id, order.user_id, supabase);

    console.log("Payment failed for order:", order.id);
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Handle charge failed error:", error);
    return NextResponse.json(
      { error: "Failed to handle failure" },
      { status: 500 }
    );
  }
}

/**
 * 处理支付延迟事件
 * 通常是需要更多区块确认
 */
async function handleChargeDelayed(charge: any, supabase: any) {
  try {
    const { data: order } = await supabase
      .from("orders")
      .select("id, user_id")
      .eq("coinbase_charge_id", charge.id)
      .single();

    if (!order) return NextResponse.json({ received: true });

    // 更新状态为延迟
    await supabase
      .from("orders")
      .update({
        status: "payment_pending",
        payment_metadata: {
          delayedAt: new Date().toISOString(),
          reason: "Awaiting more confirmations",
        },
      })
      .eq("id", order.id);

    console.log("Payment delayed for order:", order.id);
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Handle charge delayed error:", error);
    return NextResponse.json(
      { error: "Failed to handle delay" },
      { status: 500 }
    );
  }
}

/**
 * 辅助函数：通知用户订单已确认
 * 可以发送邮件、推送通知等
 */
async function notifyOrderConfirmed(
  orderId: string,
  userId: string,
  supabase: any
) {
  try {
    // TODO: 实现具体的通知逻辑
    // 例如：
    // 1. 发送邮件
    // 2. 发送推送通知
    // 3. 更新用户仪表板
    // 4. 触发订单履行流程

    console.log("Notifying user of order confirmation:", orderId, userId);

    // 示例：发送邮件（如果有 email 服务）
    // await sendEmail({
    //   to: user.email,
    //   template: 'order-confirmed',
    //   data: { orderId }
    // });
  } catch (error) {
    console.error("Notification error:", error);
  }
}

/**
 * 辅助函数：通知用户支付失败
 */
async function notifyPaymentFailed(
  orderId: string,
  userId: string,
  supabase: any
) {
  try {
    console.log("Notifying user of payment failure:", orderId, userId);
    // TODO: 实现通知逻辑
  } catch (error) {
    console.error("Notification error:", error);
  }
}
