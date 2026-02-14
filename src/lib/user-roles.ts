import { createBrowserClient } from "@supabase/ssr";

export type UserRole = 'member' | 'staff' | 'admin';

/**
 * 获取用户的角色
 * @param userId - 用户 ID
 * @returns 用户角色 (member | staff | admin)
 */
export async function getUserRole(userId: string): Promise<UserRole> {
  try {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (error) {
      console.warn("Failed to fetch user role:", error);
      return 'member';
    }

    return (profile?.role || 'member') as UserRole;
  } catch (error) {
    console.error("Error in getUserRole:", error);
    return 'member';
  }
}

/**
 * 检查用户是否拥有管理员权限
 * @param userId - 用户 ID
 * @returns 是否为 admin 或 staff
 */
export async function isAdmin(userId: string): Promise<boolean> {
  const role = await getUserRole(userId);
  return role === 'admin' || role === 'staff';
}

/**
 * 检查用户是否拥有超级管理员权限
 * @param userId - 用户 ID
 * @returns 是否为 admin
 */
export async function isSuperAdmin(userId: string): Promise<boolean> {
  const role = await getUserRole(userId);
  return role === 'admin';
}
