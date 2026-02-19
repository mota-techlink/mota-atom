import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";

export type PermissionLevel = 'staff' | 'admin';

/**
 * 检查用户是否有权限访问 admin 页面
 * @param minLevel - 最小权限等级 ('staff' 或 'admin')
 * @throws 如果用户未登录或权限不足，会自动重定向
 * @returns 用户的 profile 数据
 */
export async function checkAdminAccess(minLevel: PermissionLevel = 'staff') {
  const supabase = await createClient();
  const locale = await getLocale();
  const { data: { user } } = await supabase.auth.getUser();
  
  // 检查用户是否登录
  if (!user) {
    console.log('User not authenticated');
    redirect(`/${locale}/login`);
  }
  
  // 获取用户的角色信息
  const { data: userProfile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  
  if (error) {
    console.error('Failed to fetch user profile:', error);
    redirect(`/${locale}/dashboard`);
  }
  
  if (!userProfile) {
    console.error('User profile not found for user:', user.id);
    redirect(`/${locale}/dashboard`);
  }
  
  const userRole = userProfile.role;
  console.log(`[checkAdminAccess] User: ${user.email}, Role: ${userRole}, Required: ${minLevel}`);
  
  // 检查权限级别
  if (minLevel === 'admin' && userRole !== 'admin') {
    // 需要 admin 权限但用户不是 admin
    console.log(`[checkAdminAccess] Access denied: user role '${userRole}' is not 'admin'`);
    redirect(`/${locale}/dashboard`);
  } else if (minLevel === 'staff' && userRole !== 'admin' && userRole !== 'staff') {
    // 需要 staff 或 admin 权限但用户都不是
    console.log(`[checkAdminAccess] Access denied: user role '${userRole}' is not 'admin' or 'staff'`);
    redirect(`/${locale}/dashboard`);
  }
  
  console.log(`[checkAdminAccess] Access granted for user: ${user.email}`);
  return userProfile;
}

/**
 * 检查用户是否是管理员（admin 或 staff）
 */
export async function isAdminOrStaff(): Promise<boolean> {
  try {
    await checkAdminAccess('staff');
    return true;
  } catch {
    return false;
  }
}

/**
 * 检查用户是否是超级管理员（仅 admin）
 */
export async function isSuperAdmin(): Promise<boolean> {
  try {
    await checkAdminAccess('admin');
    return true;
  } catch {
    return false;
  }
}
