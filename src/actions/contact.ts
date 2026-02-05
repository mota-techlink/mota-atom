"use server"

import { Resend } from "resend"
import { z } from "zod"
import { siteConfig } from "@/config/site"

// 1. 定义表单验证 Schema
const contactFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendContactEmail(prevState: any, formData: FormData) {
  // 2. 解析 FormData
  const rawData = {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    message: formData.get("message"),
  }

  // 3. 验证数据
  const validatedFields = contactFormSchema.safeParse(rawData)

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Please define all required fields."
    }
  }

  const { firstName, lastName, email, message } = validatedFields.data

  // 4. 发送邮件
  try {
    const data = await resend.emails.send({
      from: 'MOTA ATOM Contact <onboarding@resend.dev>', // Resend 默认发件人，绑定域名后可改
      to: process.env.CONTACT_NOTIFICATION_EMAIL || siteConfig.contact.email,
      replyTo: email,
      subject: `New Contact Form Submission from ${firstName} ${lastName}`,
      text: `Name: ${firstName} ${lastName}\nEmail: ${email}\n\nMessage:\n${message}`,
      // 也可以使用 react 组件作为邮件模板: react: <EmailTemplate ... />
    })
    console.log("Resend API Response:", data);

    if (data.error) {
      console.error("Resend Error Detail:", data.error);
      return { success: false, message: "Failed to send email. Please try again. \n\n [Root Cause:" + data.error.message + "]" }
    }

    return { success: true, message: "Message sent successfully!" }
  } catch (error) {
    console.error("Server Action Exception:", error);
    return { success: false, message: "Something went wrong. \n\n [Root Cause:" + error + "]" }
  }
}