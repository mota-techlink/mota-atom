"use client"
import { useContactForm } from "@/hooks/use-contact-form"
import React, { useState } from "react"
import Image from "next/image"
import { Link } from "@/navigation"
import dynamic from "next/dynamic"
import { useTranslations } from "next-intl"
import { Check, Clock, RefreshCcw, ShieldCheck, ArrowRight, LayoutGrid, Bitcoin, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, CheckCircle2 } from "lucide-react"
import { usePathname } from 'next/navigation'
import { toast } from "sonner";

/** Returns true if the URL appears to be a browseable website rather than a direct image file */
function isWebsiteUrl(url: string): boolean {
  try {
    const { pathname } = new URL(url);
    // If the path has no extension, or the extension is not a common image type → treat as website
    const ext = pathname.split('.').pop()?.toLowerCase() ?? '';
    const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'avif', 'bmp', 'ico'];
    return !imageExts.includes(ext);
  } catch {
    return false;
  }
}

// 🔧 动态导入重型组件 - 减少首屏 JS 约 200kB+
const CryptoPaymentModal = dynamic(
  () => import("@/components/payments/crypto-payment-modal").then(mod => mod.CryptoPaymentModal),
  { ssr: false }
)
const X402ConsultButton = dynamic(
  () => import("@/components/payments/x402-consult-button").then(mod => mod.X402ConsultButton),
  { ssr: false }
)

function ContactSalesDialog({ 
  productName, 
  tierName 
}: { 
  productName: string, 
  tierName: string 
}) {
  const { isPending, success, error, submitForm } = useContactForm()
  const t = useTranslations("ProductPage")

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const fullName = formData.get('name') as string || '';
    
    // 简单拆分姓名，适配 API 的 firstName/lastName 需求
    const nameParts = fullName.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || '';

    submitForm({
      firstName,
      lastName,
      email: formData.get('email') as string,
      message: formData.get('message') as string,
      type: 'sales',     
      productName,       
      tier: tierName     
    });
  }

  if (success) {
    return (
      <DialogContent className="sm:max-w-[425px]">
        <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
          <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold">{t("requestSent")}</h3>
            <p className="text-sm text-muted-foreground mt-2">
              {t("inquiryReceived", { tierName })}
            </p>
          </div>
          <DialogClose asChild>
             <Button variant="outline" className="mt-4">{t("close")}</Button>
          </DialogClose>
        </div>
      </DialogContent>
    )
  }

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{t("contactSalesTeam")}</DialogTitle>
        <DialogDescription>
          {t("inquiringAbout")} <span className="font-semibold text-primary">{productName} - {tierName}</span>
        </DialogDescription>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="grid gap-4 py-4">
        {/* 错误提示 */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 text-xs p-3 rounded-md break-all">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">{t("name")}</Label>
          <Input id="name" name="name" className="col-span-3" placeholder={t("yourName")} required disabled={isPending} />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="email" className="text-right">{t("email")}</Label>
          <Input id="email" name="email" type="email" className="col-span-3" placeholder={t("emailPlaceholder")} required disabled={isPending} />
        </div>
         <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="message" className="text-right">{t("needs")}</Label>
          <Textarea 
            id="message" 
            name="message" 
            className="col-span-3" 
            placeholder={t("needsPlaceholder")}
            required 
            minLength={5}
            disabled={isPending} 
          />
        </div>

        <DialogFooter>
          <Button type="submit" disabled={isPending}>
            {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {isPending ? t("sending") : t("sendRequest")}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}

// 支付方式选择对话框
function PaymentMethodDialog({
  productName,
  tierName,
  price,
  onStripeClick,
  onCryptoClick,
}: {
  productName: string;
  tierName: string;
  price: string;
  onStripeClick: () => void;
  onCryptoClick: () => void;
}) {
  const t = useTranslations("ProductPage");
  return (
    <DialogContent className="sm:max-w-106.25">
      <DialogHeader>
        <DialogTitle>{t("choosePaymentMethod")}</DialogTitle>
        <DialogDescription>
          {t("selectPayment")} <span className="font-semibold text-primary">{productName} - {tierName}</span>
        </DialogDescription>
      </DialogHeader>

      <div className="grid grid-cols-2 gap-4 py-4">
        {/* Stripe Payment Option */}
        <button
          onClick={onStripeClick}
          className="flex flex-col items-center justify-center gap-3 p-6 rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all"
        >
          <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
            <CreditCard className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-foreground">{t("creditCard")}</p>
            <p className="text-xs text-muted-foreground mt-1">{t("creditCardDesc")}</p>
          </div>
        </button>

        {/* Crypto Payment Option */}
        <button
          onClick={onCryptoClick}
          className="flex flex-col items-center justify-center gap-3 p-6 rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:border-orange-500 dark:hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-all"
        >
          <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900/30">
            <Bitcoin className="h-6 w-6 text-orange-600 dark:text-orange-400" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-foreground">{t("cryptocurrency")}</p>
            <p className="text-xs text-muted-foreground mt-1">{t("cryptoDesc")}</p>
          </div>
        </button>
      </div>

      <div className="bg-slate-50 dark:bg-slate-900/30 p-4 rounded-lg">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          💡 <strong>{t("noWalletNeeded")}</strong> {t("noWalletDesc")}
        </p>
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">{t("cancel")}</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}

function TierActionButton({ 
  productName, 
  tierData,
  isLastTier,
}: { 
  productName: string, 
  tierData: any,
  isLastTier?: boolean,
}) {
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [showCryptoModal, setShowCryptoModal] = useState(false);
  const t = useTranslations("ProductPage");
  
  const tierName = tierData.name; // e.g. "Basic", "Standard", "Premium"
  const price = tierData.price;
  const pathname = usePathname();

  // 🟢 逻辑判断：如果是最后一个 tier（Premium/高级版），则是 "Contact Sales"
  const isHighTier = isLastTier || tierName.toLowerCase().includes('premium') || tierName.toLowerCase().includes('enterprise');

  const handleStripePayment = () => {
    setPaymentDialogOpen(false);
    const checkoutUrl = `/api/checkout?tier=${encodeURIComponent(tierName)}&price=${encodeURIComponent(price)}&product=${encodeURIComponent(productName)}&return_path=${encodeURIComponent(pathname)}`;
    window.location.href = checkoutUrl;
  };

  const handleCryptoPayment = () => {
    setPaymentDialogOpen(false);
    setShowCryptoModal(true);
  };

  // 情况 A: 高级套餐 -> 弹窗 (Dialog)
  if (isHighTier) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full h-12 text-base bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-black" size="lg">
            {t("contactSales")}
          </Button>
        </DialogTrigger>
        {/* 传入参数 */}
        <ContactSalesDialog productName={productName} tierName={tierName} />
      </Dialog>
    )
  }

  // 情况 B: 普通套餐 -> 显示支付方式选择对话框
  return (
    <>
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogTrigger asChild>
          <Button className="w-full h-12 text-base" size="lg">
            {t("orderNow")}
          </Button>
        </DialogTrigger>
        <PaymentMethodDialog
          productName={productName}
          tierName={tierName}
          price={price}
          onStripeClick={handleStripePayment}
          onCryptoClick={handleCryptoPayment}
        />
      </Dialog>

      {/* Crypto Payment Modal */}
      <CryptoPaymentModal
        isOpen={showCryptoModal}
        onOpenChange={setShowCryptoModal}
        productName={productName}
        tierName={tierName}
        productSlug={pathname.split('/').pop() || productName}
        amount={price.replace(/[^0-9.]/g, "")}
        onPaymentSuccess={() => {
          toast.success(t("paymentReceived"), {
            description: t("orderConfirmed", { productName, tierName }),
          });
          setShowCryptoModal(false);
        }}
      />
    </>
  );
}

// 模拟 props，实际使用时替换为你的 MDX 数据
interface ProductLayoutProps {
  data: any; // 你的 MDX frontmatter 数据
  content: React.ReactNode; // MDX 正文内容
}

function ComparisonTable({ pricing }: { pricing: any[] }) {
  const t = useTranslations("ProductPage")

  if (!pricing || pricing.length === 0) return null

  // Tier names used to detect inheritance-marker lines (works across all languages)
  const tierNamesLower = new Set(pricing.map((t: any) => t.name.toLowerCase()))

  const isInheritanceMarker = (feat: string) =>
    Array.from(tierNamesLower).some(name => feat.toLowerCase().includes(name))

  // Raw features per tier — skip any inheritance-marker lines
  const rawFeatures: string[][] = pricing.map((tier: any) =>
    (tier.features ?? []).filter((f: string) => !isInheritanceMarker(f))
  )

  // Propagate upward: tier N's effective set = features of tiers 0..N combined
  const effectiveFeatures: string[][] = rawFeatures.map((_, idx) => {
    const seen = new Set<string>()
    const result: string[] = []
    for (let i = 0; i <= idx; i++) {
      for (const feat of rawFeatures[i]) {
        if (!seen.has(feat)) {
          seen.add(feat)
          result.push(feat)
        }
      }
    }
    return result
  })

  // Collect all unique features in order of first appearance
  const allFeatures: string[] = []
  const featureSet = new Set<string>()
  for (const features of effectiveFeatures) {
    for (const feat of features) {
      if (!featureSet.has(feat)) {
        featureSet.add(feat)
        allFeatures.push(feat)
      }
    }
  }

  if (allFeatures.length === 0) return null

  // Build inclusion map from effective (resolved) feature sets
  const includedIn: Map<string, Set<number>> = new Map()
  for (const feat of allFeatures) {
    const tiers = new Set<number>()
    effectiveFeatures.forEach((features, idx) => {
      if (features.includes(feat)) tiers.add(idx)
    })
    includedIn.set(feat, tiers)
  }

  return (
    <div className="hidden md:block">
      <h3 className="text-xl font-bold mb-6">{t("comparePackages")}</h3>
      <div className="border rounded-xl overflow-hidden">
        <table className="w-full text-sm table-fixed">
          <thead>
            <tr className="bg-muted/50 border-b">
              <th className="text-left px-5 py-4 font-semibold text-muted-foreground w-[40%]">
                {t("feature")}
              </th>
              {pricing.map((tier, idx) => (
                <th key={idx} className="text-center px-2 py-4 font-semibold w-[20%]">
                  <div className="flex flex-col items-center gap-1">
                    <span className="whitespace-nowrap">{tier.name}</span>
                    <span className="text-xs font-normal text-muted-foreground whitespace-nowrap">{tier.price}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Delivery time row */}
            <tr className="border-b bg-muted/20">
              <td className="px-5 py-3 text-muted-foreground">{t("delivery")}</td>
              {pricing.map((tier, idx) => (
                <td key={idx} className="text-center px-2 py-3 text-muted-foreground whitespace-nowrap">
                  {tier.deliveryTime}
                </td>
              ))}
            </tr>
            {/* Feature rows */}
            {allFeatures.map((feat, rowIdx) => (
              <tr
                key={rowIdx}
                className={`border-b last:border-0 ${rowIdx % 2 === 0 ? "" : "bg-muted/10"}`}
              >
                <td className="px-5 py-3 text-foreground/80">{feat}</td>
                {pricing.map((_, tierIdx) => (
                  <td key={tierIdx} className="text-center px-2 py-3">
                    {includedIn.get(feat)?.has(tierIdx) ? (
                      <Check className="w-4 h-4 text-green-500 mx-auto" />
                    ) : (
                      <span className="text-muted-foreground/40 text-lg leading-none">—</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

{/* === RIGHT COLUMN: Sticky Pricing Card === */}
function PricingWidget({ data }: { data: any }) {
  const pathname = usePathname();
  const t = useTranslations("ProductPage");
  // Derive product slug from URL: /en/products/mvp → mvp, /en/products/mota-ai/chatbot → chatbot
  const productSlug = pathname.split('/').filter(Boolean).pop() || '';

  return (
        <div className="relative">
          <div className="sticky top-24 space-y-6 ">
            
            {/* 1. Pricing Tabs (The Fiverr Core) */}
            <Card className="border-2 border-primary/10 shadow-lg">
              <Tabs defaultValue="tier-1" className="w-full">
                <TabsList className="grid w-full grid-cols-3 rounded-none border-b h-20 bg-transparent p-0">
                  {data.pricing.map((tierData: any, idx: number) => (
                    <TabsTrigger key={idx} value={`tier-${idx}`} className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary h-full">{tierData.name}</TabsTrigger>
                  ))}
                </TabsList>
                
                {data.pricing.map((tierData: any, idx: number) => {
                   if (!tierData) return null;

                   return (
                    <TabsContent key={idx} value={`tier-${idx}`} className="p-6 space-y-6 mt-0">
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-2xl">{tierData.price}</span>
                        <span className="text-muted-foreground uppercase text-xs font-semibold">{tierData.name}</span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground min-h-[60px]">
                        {tierData.description}
                      </p>

                      <div className="flex items-center gap-4 text-sm font-medium text-foreground/80">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {tierData.deliveryTime} {t("delivery")}
                        </div>
                        <div className="flex items-center gap-1">
                          <RefreshCcw className="w-4 h-4" />
                          {t("unlimitedRevisions")}
                        </div>
                      </div>

                      <ul className="space-y-2 text-sm">
                        {tierData.features.map((feat: string, i: number) => (
                           <li key={i} className="flex gap-2 text-muted-foreground">
                             <Check className="w-4 h-4 text-green-500 shrink-0" />
                             {feat}
                           </li>
                        ))}
                      </ul>

                      <TierActionButton 
                        productName={data.title} 
                        tierData={tierData}
                        isLastTier={idx === data.pricing.length - 1}
                      />
                                            
                    </TabsContent>
                   )
                })}
              </Tabs>
            </Card>

            {/* 2. X402 Quick Consultation */}
            <X402ConsultButton productSlug={productSlug} productName={data.title} />

            {/* 3. Company Trust (B2C Adjustment) */}
            <Card className="bg-muted/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                   <ShieldCheck className="w-5 h-5 text-primary" />
                   {t("whyMotaAtom")}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-3">
                 <p>🏆 <strong>{t("provenExpertise")}</strong> {t("provenExpertiseDesc")}</p>
                 <p>🔒 <strong>{t("dataPrivacy")}</strong> {t("dataPrivacyDesc")}</p>
                 <p>🤝 <strong>{t("fullSupport")}</strong> {t("fullSupportDesc")}</p>
              </CardContent>
            </Card>

          </div>
        </div>
  )
}
export function ProductLayout({ data, content }: ProductLayoutProps) {
  const [selectedImage, setSelectedImage] = useState(data.gallery[0]);
  const relatedCases = data.relatedShowcasesData || [];
  const t = useTranslations("ProductPage");
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* 1. Breadcrumb & Title Area */}
      <div className="mb-8">        
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">{data.title}</h1>
      </div>

      <div className="grid lg:grid-cols-[1fr_400px] gap-10">
        
        {/* === LEFT COLUMN: Content & Gallery === */}
        <div className="space-y-10">
          
          {/* A. Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-video w-full overflow-hidden rounded-xl border bg-muted">
              {isWebsiteUrl(selectedImage) ? (
                <iframe
                  src={selectedImage}
                  title={data.title}
                  className="absolute inset-0 h-full w-full"
                  sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                  loading="lazy"
                />
              ) : (
                <Image 
                  src={selectedImage} 
                  alt={data.title} 
                  fill 
                  className="object-cover"
                />
              )}
            </div>
            {/* Thumbnails */}
            <div className="flex gap-4 overflow-x-auto pb-2">
              {data.gallery.map((img: string, idx: number) => (
                <button 
                  key={idx} 
                  onClick={() => setSelectedImage(img)}
                  className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${selectedImage === img ? 'border-primary' : 'border-transparent opacity-70 hover:opacity-100'}`}
                >
                  {isWebsiteUrl(img) ? (
                    <div className="flex h-full w-full items-center justify-center bg-muted text-[8px] text-muted-foreground p-1 text-center break-all">
                      {new URL(img).hostname}
                    </div>
                  ) : (
                    <Image src={img} alt="thumbnail" fill className="object-cover" />
                  )}
                </button>
              ))}
            </div>
          </div>
          {/* 🟢 2. Mobile Only Pricing Section */}
          <div className="block lg:hidden">
            <h3 className="text-xl font-bold mb-4">{t("pricing")}</h3>
            <PricingWidget data={data} />
          </div>

          {/* B. About This Service (MDX Content) */}
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h3 className="text-xl font-bold mb-4">{t("aboutThisService")}</h3>
            {content}
          </div>

          {/* C. Tech Stack (Icons) */}
          <div className="border rounded-xl p-6 bg-muted/30">
            <h3 className="text-lg font-semibold mb-4">{t("technologiesWeUse")}</h3>
            <div className="flex flex-wrap gap-3">
              {data.techStack.map((tech: string) => (
                <Badge key={tech} variant="secondary" className="px-3 py-1 text-sm">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          {/* D. Comparison Table (Fiverr Style) */}
          <ComparisonTable pricing={data.pricing} />

          {/* E. FAQ Section */}
          <div>
            <h3 className="text-xl font-bold mb-6">{t("faq")}</h3>
            <Accordion type="single" collapsible className="w-full">
              {data.faq.map((item: any, idx: number) => (
                <AccordionItem key={idx} value={`item-${idx}`}>
                  <AccordionTrigger>{item.question}</AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* F. Success Cases (Replacing Reviews) */}
          <div id="showcase">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">{t("successStories")}</h3>
              {/* 只有存在站内案例时才显示「查看全部」 */}
              {relatedCases.some((item: any) => item.type !== 'external') && (
                <Link href="/showcase" className="text-primary text-sm hover:underline flex items-center">
                  {t("viewAll")} <ArrowRight className="w-4 h-4 ml-1"/>
                </Link>
              )}
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
               {/* 🟢 直接循环渲染预生成的数据 */}
               {relatedCases.length > 0 ? (
                 relatedCases.map((item: any) =>
                   item.type === 'external' ? (
                     // 外部网站卡片：iframe 预览 + 新标签打开
                     <a key={item.url} href={item.url} target="_blank" rel="noopener noreferrer" className="block h-full">
                       <Card className="hover:shadow-md transition-all cursor-pointer group h-full flex flex-col overflow-hidden border-0 shadow-sm bg-card">
                         <div className="aspect-video bg-muted relative overflow-hidden rounded-t-xl">
                           <iframe
                             src={item.url}
                             title={item.title}
                             className="absolute inset-0 h-full w-full pointer-events-none"
                             sandbox="allow-scripts allow-same-origin"
                             loading="lazy"
                           />
                           <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"/>
                           <div className="absolute bottom-3 left-3 z-20 text-white font-medium pr-2 leading-tight">
                             {item.title}
                           </div>
                         </div>
                         <CardFooter className="p-4 pt-3 text-sm text-muted-foreground group-hover:text-primary transition-colors border-x border-b rounded-b-xl flex-grow">
                           <span className="line-clamp-2 break-all">{item.url}</span>
                         </CardFooter>
                       </Card>
                     </a>
                   ) : (
                     // 站内案例卡片
                     <Link key={item.slug} href={`/showcase/${item.slug}`} className="block h-full">
                       <Card className="hover:shadow-md transition-all cursor-pointer group h-full flex flex-col overflow-hidden border-0 shadow-sm bg-card">
                          <div className="aspect-video bg-muted relative overflow-hidden rounded-t-xl">
                            {/* 封面图 */}
                            <Image 
                              src={item.cover || '/images/placeholder.webp'} 
                              alt={item.title}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"/>
                            <div className="absolute bottom-3 left-3 z-20 text-white font-medium pr-2 leading-tight">
                              {item.title}
                            </div>
                          </div>
                          <CardFooter className="p-4 pt-3 text-sm text-muted-foreground group-hover:text-primary transition-colors border-x border-b rounded-b-xl flex-grow">
                             <span className="line-clamp-2">
                               {item.description || t("defaultShowcaseDesc")}
                             </span>
                          </CardFooter>
                       </Card>
                     </Link>
                   )
                 )
               ) : (
                 <div className="col-span-2 text-muted-foreground text-sm italic p-4 border rounded-lg bg-muted/20">
                   {t("noSuccessStories")}
                 </div>
               )}
            </div>
          </div>

        </div>

        {/* === RIGHT COLUMN: Sticky Pricing Card (Desktop Only) === */}        
        <div className="relative hidden lg:block">
          <div className="sticky top-24">
            <PricingWidget data={data} />
          </div>
        </div>

        

      </div>
    </div>
  )
}