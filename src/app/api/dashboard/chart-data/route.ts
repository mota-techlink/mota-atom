// src/app/api/dashboard/chart-data/route.ts
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(req.url);
  
  const period = searchParams.get('period') || 'month';
  const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    // 根据不同周期构建不同的聚合逻辑
    // 注意：这里使用 Supabase 的 rpc 或者直接查询后在内存聚合。
    // 为了 Cloudflare 环境的稳定性，我们直接查询该年份的所有已支付订单并在服务端处理
    const startDate = `${year}-01-01T00:00:00Z`;
    const endDate = `${year}-12-31T23:59:59Z`;

    const { data: orders, error } = await supabase
      .from("orders")
      .select("amount_total, created_at")
      .eq("user_id", user.id)
      .eq("status", "paid")
      .gte("created_at", startDate)
      .lte("created_at", endDate);

    if (error) throw error;

    let chartData: { name: string; total: number }[] = [];

    if (period === 'month') {
      // 初始化 12 个月
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      chartData = months.map(m => ({ name: m, total: 0 }));
      
      orders?.forEach(order => {
        const monthIndex = new Date(order.created_at).getMonth();
        chartData[monthIndex].total += Number(order.amount_total);
      });
    } 
    else if (period === 'week') {
      // 简单处理：按周数聚合 (1-52周)
      chartData = Array.from({ length: 52 }, (_, i) => ({ name: `W${i + 1}`, total: 0 }));
      orders?.forEach(order => {
        const date = new Date(order.created_at);
        const oneJan = new Date(date.getFullYear(), 0, 1);
        const numberOfDays = Math.floor((date.getTime() - oneJan.getTime()) / (24 * 60 * 60 * 1000));
        const weekIndex = Math.ceil((date.getDay() + 1 + numberOfDays) / 7) - 1;
        if (chartData[weekIndex]) chartData[weekIndex].total += Number(order.amount_total);
      });
    }
    else if (period === 'quater') {
      // 如果是天，我们展示该年份每个月的平均值或抽取样本，或者返回 365 天数据
      // 建议：如果是 'day'，通常指查看特定月份。这里简化为按季度汇总展示
      const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
      chartData = quarters.map(q => ({ name: q, total: 0 }));
      orders?.forEach(order => {
        const quarterIndex = Math.floor(new Date(order.created_at).getMonth() / 3);
        chartData[quarterIndex].total += Number(order.amount_total);
      });
    }

    return NextResponse.json(chartData);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}