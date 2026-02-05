'use server'

import { z } from 'zod'

// 定义验证 Schema (保持不变)
const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

export async function sendContactEmail(prevState: any, formData: FormData) {
  // 1. 验证数据
  const validatedFields = schema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
  })

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { name, email, message } = validatedFields.data

  try {
    // 🟢 2. 使用原生 fetch 调用 Resend API (替代 Resend SDK)
    // 这样彻底避免了 stream, buffer 等 Node.js 依赖问题
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Mota Portal <onboarding@resend.dev>', // 或者你配置的域名
        to: 'your-email@example.com', // 🔴 记得改成你接收邮件的真实邮箱
        subject: `New Contact Form Submission from ${name}`,
        reply_to: email,
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
        html: `
          <h3>New Contact Message</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Resend API Error:', errorData)
      throw new Error(errorData.message || 'Failed to send email')
    }

    return { success: true }
    
  } catch (error) {
    console.error('Contact form error:', error)
    return {
      success: false,
      message: 'Failed to send message. Please try again later.',
    }
  }
}