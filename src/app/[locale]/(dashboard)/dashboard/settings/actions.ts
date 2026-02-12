// src/app/[locale]/dashboard/settings/actions.ts
'use server'

import { createClient } from "@/lib/supabase/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

export async function getPaymentMethods() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { cards: [], wallets: [] };

  // 1. 获取 Stripe Customer ID
  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single();

  const cards = [];
  
  // 2. 从 Stripe 获取绑定的信用卡
  if (profile?.stripe_customer_id) {
    try {
      const paymentMethods = await stripe.paymentMethods.list({
        customer: profile.stripe_customer_id,
        type: 'card',
      });
      
      // 获取默认支付方式 (为了标记 "Default")
      const customer = await stripe.customers.retrieve(profile.stripe_customer_id) as Stripe.Customer;
      const defaultPaymentMethodId = customer.invoice_settings.default_payment_method;

      cards.push(...paymentMethods.data.map(pm => ({
        id: pm.id,
        brand: pm.card?.brand || 'card', 
        last4: pm.card?.last4 || '????', // 如果 undefined，显示 ????
        exp_month: pm.card?.exp_month || 0, // 如果 undefined，显示 0
        exp_year: pm.card?.exp_year || 0,   // 如果 undefined，显示 0
        is_default: pm.id === defaultPaymentMethodId
      })));
    } catch (error) {
      console.error("Stripe Fetch Error:", error);
    }
  }

  // 3. 从历史订单中获取加密钱包 (去重)
  // 假设 payment_method_details 结构为: { network: 'ethereum', wallet: '0x123...' }
  // 注意：你需要根据实际存入的 JSON 结构调整这里的提取逻辑
  const { data: cryptoOrders } = await supabase
    .from("orders")
    .select("payment_method_details, payment_provider")
    .eq("user_id", user.id)
    .eq("payment_provider", "crypto");

  const walletsMap = new Map();
  
  cryptoOrders?.forEach(order => {
    const details = order.payment_method_details as any;
    // 假设存入时有 wallet_address 字段，如果没有，可能在 transaction_id 里
    // 这里我们做一个防御性检查
    const address = details?.wallet_address || details?.address; 
    const network = details?.network || 'Unknown Network';

    if (address && !walletsMap.has(address)) {
      walletsMap.set(address, {
        address: address,
        network: network
      });
    }
  });

  return {
    cards: cards,
    wallets: Array.from(walletsMap.values()) as { address: string; network: string }[]   
  };
}