import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { OrdersTable } from "./orders-table"

export const metadata = {
  title: "My Orders",
}

// 🟢 1. 修改 props 类型定义：searchParams 必须是 Promise
export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>
}) {
  const supabase = await createClient()

  // 1. 验证用户登录
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect("/login")
  }

  // 🟢 2. 关键修改：先 await 解析参数，再使用
  const params = await searchParams;
  const queryTerm = params.q || ""
  
  let query = supabase
    .from("order_details_view")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  // 3. 如果有搜索关键词
  if (queryTerm) {
    // 简单的模糊搜索
    query = query.or(`order_number.ilike.%${queryTerm}%,product_name.ilike.%${queryTerm}%`)
  }

  const { data: orders, error } = await query

  if (error) {
    console.error("Error fetching orders:", error)
    return <div>Failed to load orders.</div>
  }

  return (
    <div className="container py-8 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Order History</h1>
        <p className="text-muted-foreground">
          View and manage your recent transactions and invoices.
        </p>
      </div>

      {/* 将数据传递给客户端组件 */}
      <OrdersTable initialOrders={orders || []} />
    </div>
  )
}