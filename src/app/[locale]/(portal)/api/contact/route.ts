// src/app/api/contact/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';

// 🟢 1. 强制使用 Edge Runtime (Cloudflare 友好)
export const runtime = 'edge';

// 2. 定义校验规则 (适配前端字段)
const schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().optional(),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
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

    const { firstName, lastName, email, message } = validation.data;
    const fullName = `${firstName} ${lastName || ''}`.trim();

    // 4. 发送邮件 (使用 fetch)
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Mota Portal <onboarding@resend.dev>', // 记得换成你验证过的域名
        to: 'contact@motaiot.com', // 🔴 改成你的接收邮箱
        subject: `New Contact: ${fullName}`,
        reply_to: email,
        text: `Name: ${fullName}\nEmail: ${email}\nMessage: ${message}`,
        html: `
          <h3>New Contact Message</h3>
          <p><strong>Name:</strong> ${fullName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <hr />
          <p>${message.replace(/\n/g, '<br>')}</p>
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