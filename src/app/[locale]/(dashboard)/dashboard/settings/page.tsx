import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { PaymentSettings } from "./payment-settings"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getPaymentMethods } from "./actions"

export default async function SettingsPage() {
  const supabase =await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { cards, wallets } = await getPaymentMethods();

  return (
    <div className="container max-w-4xl py-10 space-y-8 mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-50">Settings</h1>
        <p className="text-slate-400">Manage your billing preferences and payment methods.</p>
      </div>

      <Tabs defaultValue="payment" className="w-full">
        <TabsList className="bg-slate-900 border border-slate-800 mb-6">
          <TabsTrigger value="payment">Payment Methods</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="payment">
          {/* 🟢 将数据作为 Props 传递 */}
          <PaymentSettings user={user} initialCards={cards} initialWallets={wallets} />
        </TabsContent>
        
        {/* 其他 Tab 内容可以后续扩展 */}
      </Tabs>
    </div>
  )
}