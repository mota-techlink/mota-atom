// src/app/api/webhooks/stripe/route.ts
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { getPaymentMethodAddedEmailHtml, getOrderConfirmationEmailHtml } from '@/lib/email-templates';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover', 
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// 辅助函数：生成友好订单号
function generateOrderNumber() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `ORD-${date}-${random}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const headerList = await headers(); 
    const sig = headerList.get('stripe-signature') as string;

    let event: Stripe.Event;

    try {
      if (!sig || !endpointSecret) throw new Error('Missing Stripe signature');
      event = await stripe.webhooks.constructEventAsync(body, sig, endpointSecret);
    } catch (err: any) {
      console.error(`Webhook Signature Error: ${err.message}`);
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      // 1. 数据提取与准备
      const userId = session.metadata?.userId;
      const customerId = session.customer as string;
      const tier = session.metadata?.tier || 'Standard';
      const productName = session.metadata?.product || 'Mota Service';
      const returnPath = session.metadata?.returnPath || '';
      
      // 客户信息
      const customerEmail = session.customer_details?.email || session.customer_email;
      const customerName = session.customer_details?.name || 'Customer';
      const customerPhone = session.customer_details?.phone;
      // 🟢 场景 A：仅仅是绑卡 (Setup Mode)
      if (session.mode === 'setup') {
        console.log(`💳 New payment method added by ${customerEmail}`);
        
        if (customerEmail) {
          try {
            const emailHtml = getPaymentMethodAddedEmailHtml(customerName, "••••");
            await sendEmail(customerEmail, 'Security Alert: New Payment Method Added', emailHtml);
            console.log(`✅ Payment method notification sent to ${customerEmail}`);
          } catch (emailError: any) {
            console.error(`❌ Error sending payment method email:`, emailError);
          }
        }
        return NextResponse.json({ received: true });
      }      



      // 5. 发送 "Order Confirmation" 邮件 (Resend)
      if (session.mode === 'payment' || session.mode === 'subscription') {
        
        console.log(`💰 Payment received from: ${customerEmail}`);
                // 地址信息 (Stripe 返回的是结构化对象)
        const address = session.customer_details?.address;
        
        // 金额与支付
        const amountTotal = (session.amount_total || 0) / 100; // 转回元
        const paymentMethod = session.payment_method_types?.[0] || 'card';      

        // 2. 业务逻辑计算
        const orderNumber = generateOrderNumber();
        // 假设交付时间是下单后 3 天 (您可以根据 Tier 动态调整，比如 Premium 是 1 天)
        const expectedDelivery = new Date();
        expectedDelivery.setDate(expectedDelivery.getDate() + 3);



        console.log(`📦 Processing Order ${orderNumber} for ${customerEmail}`);

        // 3. 关联用户 (User Mapping)
        let finalUserId = userId || null;
        if (!finalUserId && customerEmail) {
          const { data: existingUser } = await supabaseAdmin
            .from('users') // 确保您有权限访问此表，或使用 auth.users 的 RPC
            .select('id')
            .eq('email', customerEmail) 
            .single();
          if (existingUser) finalUserId = existingUser.id;
        }
        if (userId && customerId) {
          await supabaseAdmin
            .from('profiles')
            .update({ stripe_customer_id: customerId })
            .eq('id', userId);
        }

        // 4. 创建订单 (Insert into Orders)
        const { error: dbError } = await supabaseAdmin.from('orders').insert({
          order_number: orderNumber,
          user_id: finalUserId && finalUserId !== '' ? finalUserId : null,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          product_name: productName,
          tier_name: tier,
          amount_total: amountTotal,
          currency: session.currency,
          status: 'paid', // 初始状态
          payment_provider: 'stripe',
          product_slug: returnPath,
          payment_transaction_id: session.id,
          payment_method_details: { type: paymentMethod }, // 可以存更多 Stripe 细节
          shipping_address: address, // 直接存 JSON
          expected_delivery_date: expectedDelivery.toISOString(),
          shipping_method: 'Digital Delivery' // 或者根据 address 判断
        });

        if (dbError) {
          console.error('❌ Database Order Creation Error:', dbError);
          // 即使存库失败，仍尝试发邮件，或者在此处 return 500 让 Stripe 重试
        } else {
          console.log('✅ Order saved to database.');
        }

        if (customerEmail) {
          try {
            const amount = `$${(session.amount_total! / 100).toFixed(2)}`;
            const date = new Date().toLocaleDateString();            
            const emailHtml = getOrderConfirmationEmailHtml(
              customerName,
              orderNumber,
              productName,
              amount,
              date
            );

            await sendEmail(customerEmail, `Order Confirmation: ${productName}`, emailHtml);
            console.log(`✅ Order confirmation email sent to ${customerEmail}`);
          } catch (emailError: any) {
            console.error(`❌ Error sending order confirmation email:`, emailError);
          }
        }
    }
    }

    return NextResponse.json({ received: true });

  } catch (error: any) {
    console.error(`SERVER ERROR: ${error.message}`);
    console.error('Full error stack:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
async function sendEmail(to: string, subject: string, html: string) {
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'MOTA TECHLINK <contact@motaiot.com>',
        to: to,
        subject: subject,
        html: html,
      }),
    });
    console.log(`✅ Email sent to ${to}`);
  } catch (error) {
    console.error('❌ Failed to send email:', error);
  }
}