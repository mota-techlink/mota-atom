import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(req.url);

  const period = searchParams.get("period") || "month";
  const year = parseInt(searchParams.get("year") || new Date().getFullYear().toString());

  // 验证用户是否为 admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: userProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (userProfile?.role !== "admin" && userProfile?.role !== "staff") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const startDate = `${year}-01-01T00:00:00Z`;
    const endDate = `${year}-12-31T23:59:59Z`;

    // 获取所有订单（staff 和 admin 可以看全部）
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select("amount_total, created_at, status")
      .gte("created_at", startDate)
      .lte("created_at", endDate);

    if (ordersError) throw ordersError;

    // 获取所有用户 - 注意: 用户创建时间在 auth.users 中，但我们这里只能从 profiles 获取
    // 为了简化，我们统计 profiles 记录更新的时间
    const { data: users, error: usersError } = await supabase
      .from("profiles")
      .select("id, updated_at");

    if (usersError) throw usersError;

    let chartData: {
      name: string;
      revenue: number;
      orders: number;
      users: number;
    }[] = [];

    if (period === "month") {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      chartData = months.map((m) => ({ name: m, revenue: 0, orders: 0, users: 0 }));

      orders?.forEach((order) => {
        const monthIndex = new Date(order.created_at).getMonth();
        if (order.status === "paid" || order.status === "delivered") {
          chartData[monthIndex].revenue += Number(order.amount_total || 0);
        }
        chartData[monthIndex].orders += 1;
      });

      users?.forEach((user) => {
        const monthIndex = new Date(user.updated_at).getMonth();
        chartData[monthIndex].users += 1;
      });
    } else if (period === "week") {
      chartData = Array.from({ length: 52 }, (_, i) => ({
        name: `W${i + 1}`,
        revenue: 0,
        orders: 0,
        users: 0,
      }));

      orders?.forEach((order) => {
        const date = new Date(order.created_at);
        const oneJan = new Date(date.getFullYear(), 0, 1);
        const numberOfDays = Math.floor((date.getTime() - oneJan.getTime()) / (24 * 60 * 60 * 1000));
        const weekIndex = Math.ceil((date.getDay() + 1 + numberOfDays) / 7) - 1;
        if (chartData[weekIndex]) {
          if (order.status === "paid" || order.status === "delivered") {
            chartData[weekIndex].revenue += Number(order.amount_total || 0);
          }
          chartData[weekIndex].orders += 1;
        }
      });

      users?.forEach((user) => {
        const date = new Date(user.updated_at);
        const oneJan = new Date(date.getFullYear(), 0, 1);
        const numberOfDays = Math.floor((date.getTime() - oneJan.getTime()) / (24 * 60 * 60 * 1000));
        const weekIndex = Math.ceil((date.getDay() + 1 + numberOfDays) / 7) - 1;
        if (chartData[weekIndex]) {
          chartData[weekIndex].users += 1;
        }
      });
    } else if (period === "quarter") {
      const quarters = ["Q1", "Q2", "Q3", "Q4"];
      chartData = quarters.map((q) => ({ name: q, revenue: 0, orders: 0, users: 0 }));

      orders?.forEach((order) => {
        const quarterIndex = Math.floor(new Date(order.created_at).getMonth() / 3);
        if (order.status === "paid" || order.status === "delivered") {
          chartData[quarterIndex].revenue += Number(order.amount_total || 0);
        }
        chartData[quarterIndex].orders += 1;
      });

      users?.forEach((user) => {
        const quarterIndex = Math.floor(new Date(user.updated_at).getMonth() / 3);
        chartData[quarterIndex].users += 1;
      });
    }

    return NextResponse.json(chartData);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
