"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Mail, MapPin, Phone, Loader2, CheckCircle2, Send, AlertCircle } from "lucide-react"
import { siteConfig } from "@/config/site"
import { GoogleMapView } from "@/components/ui/google-map-view"

// 🟢 引入我们刚刚封装的 Hook
import { useContactForm } from "@/hooks/use-contact-form"

export default function ContactPage() {
  // 🟢 使用 Hook 接管状态和逻辑
  const { isPending, success, error, submitForm, resetForm } = useContactForm()

  function handlePageSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    
    // 🟢 调用 Hook 的 submitForm
    submitForm({
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      message: formData.get('message') as string,
      type: 'general' // 🟢 明确标记这是普通联系表单
    })
  }

  return (
    <div className="container mx-auto lg:py-6 h-full flex flex-col justify-center">
      
      <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-stretch">
        
        {/* --- Left Column: Info & Map (保持不变) --- */}
        <div className="flex flex-col h-full gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl">
              Contact Us
            </h1>
            <p className="text-muted-foreground">
              Have questions? We'd love to hear from you.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="flex items-center gap-3 p-3 rounded-lg border bg-background/50 hover:bg-muted/50 transition-colors">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full shrink-0">
                <Phone className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">Phone</p>
                <a href={`tel:${siteConfig.contact.phone}`} className="text-sm font-semibold hover:text-blue-600">
                  {siteConfig.contact.phone}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg border bg-background/50 hover:bg-muted/50 transition-colors sm:col-span-2 lg:col-span-1">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full shrink-0">
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">Office</p>
                <p className="text-sm font-semibold">{siteConfig.contact.address}</p>
              </div>
            </div>
          </div>

          <div className="flex-grow w-full bg-muted rounded-xl border overflow-hidden min-h-[200px] lg:min-h-[250px] relative shadow-sm">
            <GoogleMapView />
          </div>
        </div>

        {/* --- Right Column: Form --- */}
        <div className="bg-card border rounded-2xl p-6 lg:p-8 shadow-sm h-full flex flex-col justify-center">
            {/* Email Info */}
            <div className="flex items-center gap-3 pb-4 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full shrink-0">
                <Mail className="h-5 w-5 text-blue-600" />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-medium text-muted-foreground">Email to us:</p>
                <a href={`mailto:${siteConfig.contact.email}`} className="text-sm font-semibold truncate block hover:text-blue-600">
                  {siteConfig.contact.email}
                </a>
              </div>
            </div>

          {/* 🟢 成功状态视图 */}
          {success ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 animate-in fade-in zoom-in py-10">
              <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-full">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold">Message Sent!</h3>
              <p className="text-muted-foreground max-w-xs mx-auto">
                Thank you. We'll get back to you shortly.
              </p>
              {/* 🟢 使用 resetForm 重置状态 */}
              <Button onClick={resetForm} variant="outline" className="mt-4">
                Send another
              </Button>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handlePageSubmit}>
              
              {/* 🟢 新增：错误提示 UI */}
              {error && (
                <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 rounded-md dark:bg-red-900/20 animate-in slide-in-from-top-2">
                   <AlertCircle className="w-4 h-4 shrink-0" />
                   <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-xs font-medium uppercase text-muted-foreground">First name</Label>
                  <Input id="firstName" name="firstName" placeholder="John" className="bg-muted/30" required disabled={isPending} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-xs font-medium uppercase text-muted-foreground">Last name</Label>
                  <Input id="lastName" name="lastName" placeholder="Doe" className="bg-muted/30" required disabled={isPending} />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-medium uppercase text-muted-foreground">Email</Label>
                <Input id="email" name="email" type="email" placeholder="john@example.com" className="bg-muted/30" required disabled={isPending} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-xs font-medium uppercase text-muted-foreground">Message</Label>
                <Textarea 
                  id="message" 
                  name="message"
                  placeholder="How can we help you?" 
                  className="min-h-[120px] bg-muted/30 resize-none" 
                  required
                  disabled={isPending}
                />
              </div>

              <Button type="submit" className="w-full mt-2" size="lg" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message <Send className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          )}
        </div>

      </div>
    </div>
  )
}