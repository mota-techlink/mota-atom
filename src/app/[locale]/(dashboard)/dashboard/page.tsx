import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import DashboardContent from "./dashboard-content"

export default async function DashboardPage() {
  const supabase = await createClient()

  // 1. 获取用户信息
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  // 2. 并行获取各项统计数据
  const [
    { data: payments }, 
    { count: totalOrders },
    { count: activeOrders },
    { data: recentOrders }
  ] = await Promise.all([
    // 计算已支付总额
    supabase.from("orders").select("amount_total").eq("user_id", user.id).eq("status", "paid"),
    // 总订单数
    supabase.from("orders").select("*", { count: 'exact', head: true }).eq("user_id", user.id),
    // 活跃订单数 (未交付的)
    supabase.from("orders").select("*", { count: 'exact', head: true }).eq("user_id", user.id).in("status", ["paid", "processing", "shipped"]),
    // 最近 5 条订单记录
    supabase.from("orders").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(5)
  ])

  // 计算总金额
  const totalPayment = payments?.reduce((acc, curr) => acc + Number(curr.amount_total), 0) || 0

  return (
    <DashboardContent 
      user={user}
      stats={{
        totalPayment,
        totalOrders: totalOrders || 0,
        activeOrders: activeOrders || 0,
        supportTickets: 0 // 假设目前为0
      }}
      recentOrders={recentOrders || []}
    />
  )
}