// src/app/api/auth/forgot-password/route.ts
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/auth/forgot-password
 * 
 * 处理忘记密码请求
 * 
 * Request body:
 * {
 *   email: string
 *   redirectUrl: string (可选，默认为 /reset-password)
 * }
 * 
 * Response:
 * {
 *   success: boolean
 *   message?: string
 *   error?: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, redirectUrl } = body;

    // 验证邮箱
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // 获取服务器端 Supabase 客户端
    const supabase = await createClient();

    // 确定重定向 URL
    const origin = request.headers.get('origin') || 'http://localhost:3000';
    const finalRedirectUrl = redirectUrl || `${origin}/reset-password`;

    // 发送密码重置邮件
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: finalRedirectUrl,
    });

    if (error) {
      console.error('Password reset error:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: error.message || 'Failed to send reset email' 
        },
        { status: 400 }
      );
    }

    // 成功
    return NextResponse.json(
      { 
        success: true, 
        message: 'Password reset email sent successfully' 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Forgot password API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
