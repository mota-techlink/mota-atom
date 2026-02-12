// src/app/api/stripe/setup/route.ts
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_BASE_URL;

  // 1. 检查数据库是否已有 Customer ID
  let { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id, full_name") // 假设你有 full_name
    .eq("id", user.id)
    .single();

  let customerId = profile?.stripe_customer_id;

  // 2. 如果没有 ID，现在立刻创建一个！
  if (!customerId) {
    console.log("Creating new Stripe Customer for user:", user.email);
    
    const newCustomer = await stripe.customers.create({
      email: user.email,
      name: profile?.full_name || 'Mota User',
      metadata: {
        userId: user.id, // 这一点很重要，方便在 Stripe 后台反查
      }
    });

    customerId = newCustomer.id;

    // 保存到数据库
    await supabase
      .from("profiles")
      .update({ stripe_customer_id: customerId })
      .eq("id", user.id);
  }

  try {
    const successUrl = `${origin}/en/dashboard/settings?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${origin}/en/dashboard/settings`;
    // 3. 创建 Setup Session (关键点：mode = setup)
    const session = await stripe.checkout.sessions.create({
      customer: customerId, // 必须传 ID，否则 Stripe 不知道把卡绑给谁
      payment_method_types: ['card'],
      mode: 'setup', // 🟢 关键：这表示“只绑卡，不扣款”
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}