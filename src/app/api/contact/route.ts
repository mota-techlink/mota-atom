// src/app/api/contact/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { siteConfig } from "@/config/site"

export const runtime = 'edge';

// 2. 定义校验规则 (适配前端字段)
const schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().optional(),
  email: z.string().email('Invalid email address'),
  message: z.string().min(5, 'Message is too short'), // 放宽一点限制，方便测试
  // 👇 新增字段
  type: z.enum(['general', 'sales']).default('general'),
  productName: z.string().optional(),
  tier: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 3. 校验数据
    const validation = schema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid inputs', errors: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { firstName, lastName, email, message, type, productName, tier } = validation.data;
    const fullName = `${firstName} ${lastName || ''}`.trim();
    const toMail = siteConfig.contact.toMail;
    let emailSubject = `New Contact: ${fullName}`;
    let productInfoHtml = '';

    if (type === 'sales') {
      emailSubject = `[Sales Inquiry] ${productName || 'Product'} - ${tier || 'Plan'}`;
      productInfoHtml = `
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <h4 style="margin-top: 0; color: #333;">Interested In:</h4>
          <p style="margin: 5px 0;"><strong>Product:</strong> ${productName}</p>
          <p style="margin: 5px 0;"><strong>Tier:</strong> ${tier}</p>
        </div>
      `;
    }

    // 4. 发送邮件 (使用 fetch)
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'MOTA TECHLINK <contact@motaiot.com>', // 记得换成你验证过的域名        
        to: toMail,
        subject: `New Contact: ${fullName}`,
        reply_to: email,
        text: `Name: ${fullName}\nEmail: ${email}\nMessage: ${message}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px;">
            <h3 style="color: #2563eb;">${type === 'sales' ? 'Sales Inquiry' : 'New Contact Message'}</h3>
            <p><strong>Name:</strong> ${fullName}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            
            ${productInfoHtml}
            
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
            
            <p><strong>Message:</strong></p>
            <p style="background-color: #fff; padding: 10px; border-left: 4px solid #ddd;">
              ${message.replace(/\n/g, '<br>')}
            </p>
          </div>
        `
      }),
    });

    if (!resendRes.ok) {
      const errorData = await resendRes.json();
      console.error('Resend Error:', errorData);
      
      // 🟢 修改这里：把 errorData 返回给前端
      return NextResponse.json({ 
        success: false, 
        message: `Resend Error: ${errorData.message || errorData.name || 'Unknown'}`,
        details: errorData // 把详细信息带回去
      }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Message sent successfully' });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}