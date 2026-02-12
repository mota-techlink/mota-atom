import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ProfileForm } from "./profile-form"

export default async function ProfilePage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  // 获取该用户的 profile 数据
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  return (
    <div className="container max-w-4xl py-10 space-y-8 mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-50">Personal Information</h1>
        <p className="text-slate-400">Update your personal details and shipping address.</p>
      </div>
      
      <ProfileForm user={user} initialData={profile || {}} />
    </div>
  )
}