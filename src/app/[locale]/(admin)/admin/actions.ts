'use server';

import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/admin";
import { revalidatePath } from "next/cache";

export async function deleteUser(userId: string) {
  // 1. 双重保险：在执行操作前，再次强制检查管理员身份
  // 虽然 Layout 拦截了页面访问，但 Server Action 是 API 端点，必须独立保护
  // 删除用户是敏感操作，仅允许 admin
  await requireAdmin('admin');

  const supabase = await createClient();

  // 2. 执行删除 (先删 profile, 触发器通常不会反向删 auth，这里演示业务数据删除)
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', userId);

  if (error) {
    console.error("Delete error:", error);
    return { success: false, message: error.message };
  }

  // 3. 刷新页面数据
  revalidatePath('/admin');
  return { success: true };
}