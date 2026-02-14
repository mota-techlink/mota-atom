import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/admin";
import { redirect } from "next/navigation";
import { AdminUsersTable } from "@/components/admin/users-table";

export const metadata = {
  title: "Users Management",
};

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; role?: string }>;
}) {
  await requireAdmin("staff"); // staff 和 admin 都可以访问

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 获取当前用户的角色
  const { data: currentUserProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const params = await searchParams;
  const queryTerm = params.q || "";
  const roleFilter = params.role || "";

  let query = supabase
    .from("profiles")
    .select("*")
    .order("updated_at", { ascending: false });

  // 如果有搜索关键词
  if (queryTerm) {
    query = query.or(`full_name.ilike.%${queryTerm}%,email.ilike.%${queryTerm}%`);
  }

  // 如果有角色筛选
  if (roleFilter) {
    query = query.eq("role", roleFilter);
  }

  const { data: users, error } = await query;

  if (error) {
    console.error("Error fetching users:", error);
    return <div>Failed to load users.</div>;
  }

  return (
    <div className="container py-8 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Users Management</h1>
        <p className="text-muted-foreground">
          View and manage all users on the platform
        </p>
      </div>

      <AdminUsersTable 
        initialUsers={users || []} 
        currentUserId={user.id}
        currentUserRole={currentUserProfile?.role || "member"}
      />
    </div>
  );
}
