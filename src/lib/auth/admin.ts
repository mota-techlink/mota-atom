import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";

export type AdminPermissionLevel = 'admin' | 'staff';

/**
 * 检查用户是否有权限访问 admin 区域
 * @param minLevel - 最小权限级别: 'admin' (仅超级管理员) 或 'staff' (允许员工和管理员)
 */
export async function requireAdmin(minLevel: AdminPermissionLevel = 'staff') {
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
  // 注意：如果 profile 不存在，创建默认的 member 角色
  if (!profile) {
    const { data: createdProfile } = await supabase
      .from('profiles')
      .insert({ id: user.id, role: 'member' })
      .select()
      .single();
    
    if (minLevel === 'admin') {
      console.warn(`Unauthorized access attempt by ${user.email} (role: member, required: admin)`);
      redirect(`/${locale}/dashboard`);
    }
    console.log(`[requireAdmin] New profile created for ${user.email} (role: member)`);
    return user;
  }

  if (minLevel === 'admin' && profile.role !== 'admin') {
    // 需要 admin 权限但用户不是 admin
    console.warn(`Unauthorized access attempt by ${user.email} (role: ${profile.role}, required: admin)`);
    redirect(`/${locale}/dashboard`); 
  } else if (minLevel === 'staff' && profile.role !== 'admin' && profile.role !== 'staff') {
    // 需要 staff 或 admin 权限但用户都不是
    console.warn(`Unauthorized access attempt by ${user.email} (role: ${profile.role}, required: staff or admin)`);
    redirect(`/${locale}/dashboard`); 
  }

  console.log(`[requireAdmin] Access granted to ${user.email} (role: ${profile.role})`);
  return user;
}