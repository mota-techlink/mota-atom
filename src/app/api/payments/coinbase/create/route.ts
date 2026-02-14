// src/app/api/payments/coinbase/create/route.ts
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const runtime = 'edge';

const COINBASE_API_URL = 'https://api.commerce.coinbase.com/charges';
const API_KEY = process.env.COINBASE_COMMERCE_API_KEY!;

interface CreateChargeRequest {
  orderId: string;
  amount: string; // 美元金额，如 "99.99"
  currency: string; // "USD"
  cryptoCurrency?: string; // 可选：指定特定加密货币 "BTC", "ETH", "USDC"
  description?: string;
}

/**
 * 创建 Coinbase Charge（支付单据）
 * 
 * 这个 API 会：
 * 1. 验证用户身份
 * 2. 获取订单信息
 * 3. 调用 Coinbase API 创建 Charge
 * 4. 保存 Charge ID 到数据库
 * 5. 返回支付 URL 给前端
 */
export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body: CreateChargeRequest = await req.json();
    const { orderId, amount, currency = "USD", cryptoCurrency, description } = body;

    if (!orderId || !amount) {
      return NextResponse.json(
        { error: "Missing orderId or amount" },
        { status: 400 }
      );
    }

    // 1. 验证订单属于当前用户
    const { data: order } = await supabase
      .from("orders")
      .select("id, total_amount, status")
      .eq("id", orderId)
      .eq("user_id", user.id)
      .single();

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    if (order.status !== "pending_payment") {
      return NextResponse.json(
        { error: "Order already paid or invalid status" },
        { status: 400 }
      );
    }

    // 2. 准备 Coinbase Charge 数据
    const chargeData = {
      name: `Order #${orderId}`,
      description: description || `Payment for order #${orderId}`,
      local_price: {
        amount: amount,
        currency: currency,
      },
      // 重要：pricing_type 决定了汇率是否锁定
      // "fixed_price" = 用户支付的加密金额固定，美元金额可能变化
      // "no_price_data" = 实时转换，可能稍高一些
      pricing_type: "fixed_price",
      // 可选：仅接受特定加密货币
      ...(cryptoCurrency && {
        requested_info: ["email"],
        metadata: {
          crypto_currency: cryptoCurrency,
        },
      }),
    };

    // 3. 调用 Coinbase API
    const response = await fetch(COINBASE_API_URL, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "X-CC-Api-Key": API_KEY,
        "X-CC-Version": "2018-03-22",
      },
      body: JSON.stringify(chargeData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw {
        status: response.status,
        data: errorData,
      };
    }

    const responseData = await response.json();
    const charge = responseData.data;

    // 4. 保存 Charge 信息到数据库
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        coinbase_charge_id: charge.id,
        crypto_address: charge.address,
        crypto_type: cryptoCurrency || "multi", // "multi" 表示用户可选
        crypto_amount: charge.crypto?.amount || null,
        payment_provider: "crypto",
        payment_expires_at: new Date(charge.expires_at).toISOString(),
        payment_metadata: {
          coinbase_hosted_url: charge.hosted_url,
          coinbase_code: charge.code,
          created_at: charge.created_at,
        },
      })
      .eq("id", orderId);

    if (updateError) {
      console.error("Update order error:", updateError);
      return NextResponse.json(
        { error: "Failed to save charge info" },
        { status: 500 }
      );
    }

    // 5. 返回支付链接给前端
    return NextResponse.json({
      success: true,
      chargeId: charge.id,
      // 可以用以下任一方式展示支付给用户：
      // 1. 重定向到 hosted_url (最简单，由 Coinbase 处理 UI)
      // 2. 显示 address 和 amount，让用户手动转账
      hostedUrl: charge.hosted_url,
      // 如果需要自定义 UI，可以使用这些信息：
      cryptoDetails: {
        address: charge.address,
        amount: charge.crypto?.amount,
        currency: charge.crypto?.code,
        description: charge.description,
        expiresAt: charge.expires_at,
      },
      // 重定向选项
      redirectUrl: charge.hosted_url,
    });
  } catch (error: any) {
    console.error("Coinbase API Error:", error.data || error.message);
    
    // Coinbase 错误处理
    if (error.status === 401) {
      return NextResponse.json(
        { error: "Invalid Coinbase API Key" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error: error.data?.error?.message || "Failed to create charge",
      },
      { status: error.status || 500 }
    );
  }
}

/**
 * GET 路由：查询现有 Charge 状态
 * 用于前端轮询或获取支付状态
 */
export async function GET(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const chargeId = searchParams.get("chargeId");

    if (!chargeId) {
      return NextResponse.json(
        { error: "Missing chargeId parameter" },
        { status: 400 }
      );
    }

    // 调用 Coinbase API 获取 Charge 详情
    const response = await fetch(
      `${COINBASE_API_URL}/${chargeId}`,
      {
        method: 'GET',
        headers: {
          "X-CC-Api-Key": API_KEY,
          "X-CC-Version": "2018-03-22",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw {
        status: response.status,
        data: errorData,
      };
    }

    const responseData = await response.json();
    const charge = responseData.data;

    return NextResponse.json({
      success: true,
      status: charge.timeline[0]?.status || charge.status,
      timeline: charge.timeline,
      charge: {
        id: charge.id,
        status: charge.status,
        address: charge.address,
        amount: charge.crypto?.amount,
        currency: charge.crypto?.code,
        expiresAt: charge.expires_at,
        paidAt: charge.paid_at,
      },
    });
  } catch (error: any) {
    console.error("Get charge status error:", error.data || error.message);

    return NextResponse.json(
      { error: "Failed to get charge status" },
      { status: 500 }
    );
  }
}
