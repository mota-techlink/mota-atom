import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Package, DollarSign, TrendingUp } from "lucide-react";
import { ConsoleContent } from "@/components/admin/console-content";

export const metadata = {
  title: "Admin Console",
};

export default async function AdminConsolePage() {
  // 权限检查已在 layout 中进行
  const supabase = await createClient();

  // 获取统计数据
  const [
    { data: allOrders },
    { data: allProfiles },
    { count: totalOrdersCount },
    { count: totalUsersCount },
  ] = await Promise.all([
    supabase.from("orders").select("*").order("created_at", { ascending: false }),
    supabase.from("profiles").select("*"),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
  ]);

  // 计算统计信息
  const stats = {
    totalRevenue: (allOrders || [])
      .filter((o) => o.status === "paid" || o.status === "delivered")
      .reduce((sum, o) => sum + Number(o.amount_total || 0), 0),
    totalOrders: totalOrdersCount || 0,
    totalUsers: totalUsersCount || 0,
    activeOrders: (allOrders || []).filter(
      (o) => o.status === "pending" || o.status === "paid"
    ).length,
    staffCount: (allProfiles || []).filter((p) => p.role === "staff").length,
    adminCount: (allProfiles || []).filter((p) => p.role === "admin").length,
  };

  const recentOrders = (allOrders || []).slice(0, 10);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Console</h1>
          <p className="text-muted-foreground mt-1">
            Manage your platform, users, and orders
          </p>
        </div>
        <Badge className="bg-red-600">Administrator</Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString("en-US", {
            maximumFractionDigits: 0,
          })}`}
          icon={<DollarSign className="h-4 w-4 text-green-500" />}
          description="From all completed orders"
        />
        <StatsCard
          title="Total Orders"
          value={stats.totalOrders.toString()}
          icon={<Package className="h-4 w-4 text-blue-500" />}
          description={`${stats.activeOrders} active`}
        />
        <StatsCard
          title="Total Users"
          value={stats.totalUsers.toString()}
          icon={<Users className="h-4 w-4 text-purple-500" />}
          description={`${stats.staffCount} staff, ${stats.adminCount} admin`}
        />
        <StatsCard
          title="Active Orders"
          value={stats.activeOrders.toString()}
          icon={<TrendingUp className="h-4 w-4 text-orange-500" />}
          description="Pending or paid"
        />
      </div>

      {/* Main Content - Charts and Tables */}
      <ConsoleContent orders={recentOrders} stats={stats} />
    </div>
  );
}

function StatsCard({
  title,
  value,
  icon,
  description,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
