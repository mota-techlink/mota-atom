import { createClient } from "@/lib/supabase/client";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";

export async function requireAdmin() {
  const supabase = await createClient();
  const locale = await getLocale();

  // 1. 获取当前 Session
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect(`/${locale}/login`);
  }

  // 2. 查询 profiles 表获取角色
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  // 3. 权限判断
  if (profile?.role !== 'admin') {
    // 如果不是管理员，踢回用户后台
    console.warn(`Unauthorized access attempt by ${user.email}`);
    redirect(`/${locale}/dashboard`); 
  }

  return user;
}