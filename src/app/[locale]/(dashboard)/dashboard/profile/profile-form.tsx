"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, User, Phone, MapPin } from "lucide-react"
import { toast } from "sonner" // 🟢 引入 Toast 提示

export function ProfileForm({ user, initialData }: any) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    full_name: initialData.full_name || user.user_metadata?.full_name || "",
    phone: initialData.phone || "",
    address_line1: initialData.address_line1 || "",
    city: initialData.city || "",
    state: initialData.state || "",
    postal_code: initialData.postal_code || "",
    country: initialData.country || "US",
  })

  // 🟢 电话号码格式化逻辑
  const formatPhoneOnBlur = () => {
    const raw = formData.phone.trim();
    // 检查是否只包含数字 (如果是数字则进行格式化)
    const isOnlyDigits = /^\d+$/.test(raw);

    if (isOnlyDigits && raw.length >= 10) {
      let formatted = raw;
      // 示例: 11位数字 (如中国 +86) -> +86 (138) 1234-5678
      if (raw.length >= 13 || raw.startsWith('86')) {
         formatted = `+86 (${raw.slice(2, 5)}) ${raw.slice(5, 9)}-${raw.slice(9)}`;
      } 
      // 示例: 11位数字 (如美国 +1) -> +1 (212) 555-1234
      else if (raw.length === 12 || raw.startsWith('1')) {
         formatted = `+1 (${raw.slice(1, 4)}) ${raw.slice(4, 7)}-${raw.slice(7)}`;
      }
      // 示例: 标准10位 -> 自动补 +1 (假设默认美国)
      else if (raw.length === 10) {
         formatted = `+1 (${raw.slice(0, 3)}) ${raw.slice(3, 6)}-${raw.slice(6)}`;
      }
      
      setFormData({ ...formData, phone: formatted });
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    startTransition(async () => {
      try {
        // 更新 Auth Metadata
        await supabase.auth.updateUser({
          data: { full_name: formData.full_name }
        })

        // 更新 profiles 表
        const { error } = await supabase
          .from("profiles")
          .upsert({
            id: user.id,
            ...formData,
            updated_at: new Date().toISOString(),
          })

        if (error) throw error;

        // 🟢 成功提示
        toast.success("Profile Updated", {
          description: "Your personal information has been saved successfully.",
        })
        router.refresh()
      } catch (error: any) {
        // 🟢 失败提示
        toast.error("Update Failed", {
          description: error.message || "An error occurred while saving your data.",
        })
      }
    })
  }

  return (
    // 🟢 调整：使用 max-w 和 mx-auto 实现大屏幕居中
    <div className="w-full max-w-4xl mx-auto"> 
      <form onSubmit={handleUpdate} className="space-y-6">
        <div className="grid gap-6">
          
          {/* Section 1: Basic Information */}
          <Card className="bg-[#0b101a] border-slate-800 text-slate-50 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5 text-blue-500" /> Basic Info
              </CardTitle>
              <CardDescription className="text-slate-400">Public profile and login information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-xs uppercase text-slate-500 font-semibold">Email Address</Label>
                <div className="flex gap-2">
                  <Input id="email" value={user.email} disabled className="bg-[#161b26] border-slate-800 text-slate-500" />
                  <Badge variant="outline" className="border-green-900 text-green-500 bg-green-900/10 h-10 px-3">Verified</Badge>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="full_name" className="text-xs uppercase text-slate-500 font-semibold">Full Name</Label>
                <Input 
                  id="full_name" 
                  value={formData.full_name} 
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  className="bg-[#161b26] border-slate-800 focus:ring-blue-500" 
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phone" className="text-xs uppercase text-slate-500 font-semibold">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <Input 
                    id="phone" 
                    value={formData.phone} 
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    onBlur={formatPhoneOnBlur} // 🟢 失去焦点时自动格式化
                    className="pl-10 bg-[#161b26] border-slate-800 focus:ring-blue-500" 
                    placeholder="+1 (555) 000-0000" 
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Shipping Address */}
          <Card className="bg-[#0b101a] border-slate-800 text-slate-50 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="h-5 w-5 text-blue-500" /> Shipping Address
              </CardTitle>
              <CardDescription className="text-slate-400">Where you want your documents or products delivered.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="address" className="text-xs uppercase text-slate-500 font-semibold">Address Line</Label>
                <Input 
                  id="address" 
                  value={formData.address_line1} 
                  onChange={(e) => setFormData({...formData, address_line1: e.target.value})}
                  className="bg-[#161b26] border-slate-800 focus:ring-blue-500" 
                  placeholder="1329 Willoughby Ave" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="city" className="text-xs uppercase text-slate-500 font-semibold">City</Label>
                  <Input 
                    id="city" 
                    value={formData.city} 
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="bg-[#161b26] border-slate-800" 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="state" className="text-xs uppercase text-slate-500 font-semibold">State / Province</Label>
                  <Input 
                    id="state" 
                    value={formData.state} 
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                    className="bg-[#161b26] border-slate-800" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="zip" className="text-xs uppercase text-slate-500 font-semibold">Postal Code</Label>
                  <Input 
                    id="zip" 
                    value={formData.postal_code} 
                    onChange={(e) => setFormData({...formData, postal_code: e.target.value})}
                    className="bg-[#161b26] border-slate-800" 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="country" className="text-xs uppercase text-slate-500 font-semibold">Country</Label>
                  <Input 
                    id="country" 
                    value={formData.country} 
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                    className="bg-[#161b26] border-slate-800" 
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-slate-900/20 border-t border-slate-800 p-6 flex justify-end">
              <Button type="submit" disabled={isPending} className="bg-blue-600 hover:bg-blue-700 px-8 transition-all">
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save Changes
              </Button>
            </CardFooter>
          </Card>

        </div>
      </form>
    </div>
  )
}