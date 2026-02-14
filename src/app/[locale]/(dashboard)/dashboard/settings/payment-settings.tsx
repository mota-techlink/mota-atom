"use client"

import { useState,useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Bitcoin, Plus, Trash2, ExternalLink, ShieldCheck, Loader2,Settings2 } from "lucide-react"
import { toast } from "sonner"
import { useSearchParams, useRouter, usePathname } from "next/navigation"

// 定义类型
interface CardData {
  id: string;
  brand: string;
  last4: string;
  exp_month: number;
  exp_year: number;
  is_default: boolean;
}

interface WalletData {
  address: string;
  network: string;
}

interface PaymentSettingsProps {
  user: any;
  initialCards: CardData[];
  initialWallets: WalletData[];
}

export function PaymentSettings({ user, initialCards, initialWallets }: PaymentSettingsProps) {
  const [loadingPortal, setLoadingPortal] = useState(false);
  const [loadingSetup, setLoadingSetup] = useState(false);
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    
    if (sessionId) {
      // 弹出成功提示
      toast.success("Payment Method Added", {
        description: "Your card has been successfully linked.",
      });

      // 清理 URL (去掉 ?session_id=... 防止刷新重复触发)
      // 使用 replace 而不是 refresh，避免流式渲染问题
      const timer = setTimeout(() => {
        router.replace(pathname); 
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [searchParams, router, pathname]);
  // 如果需要支持客户端删除，可以将 props 转为 state
  // const [cards, setCards] = useState(initialCards);
  const handleAddCard = async () => {
    setLoadingSetup(true);
    try {
      const res = await fetch("/api/stripe/setup", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; // 跳转到 Stripe 绑卡页面
      }
    } catch (err) {
      toast.error("Failed to start card setup");
    } finally {
      setLoadingSetup(false);
    }
  };

  const handleManageBilling = async () => {
    setLoadingPortal(true);
    try {
      const res = await fetch("/api/checkout/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("Billing Portal Unavailable", { description: "No billing history found." });
      }
    } catch (err) {
      toast.error("Error", { description: "Failed to connect to Stripe." });
    } finally {
      setLoadingPortal(false);
    }
  };

  const handleRemoveWallet = (address: string) => {
    // 这里因为是读取的历史订单，实际上不能物理删除订单记录
    // 只能在 UI 上隐藏，或者如果有专门的 wallet 绑定表则调用 API 删除
    toast.info("Cannot remove history", {
       description: "This wallet is associated with a past order."
    });
  }
  const hasCards = initialCards && initialCards.length > 0;

  return (
    <div className="space-y-6">
      
      {/* 1. Stripe Cards Section */}
      <Card className="bg-[#0b101a] border-slate-800 text-slate-50">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-blue-500" /> Credit & Debit Cards
            </CardTitle>
            <CardDescription className="text-slate-400 text-sm">
              Securely managed by Stripe.
            </CardDescription>
          </div>
          
          <div className="flex gap-2">
            {/* 策略 A: 如果用户已有卡片，显示 "Manage" 按钮 (功能更全) */}
            {hasCards && (
              <Button 
                variant="outline" 
                size="sm" 
                className="border-slate-700 hover:bg-slate-800 text-slate-300"
                onClick={handleManageBilling}
                disabled={loadingPortal}
              >
                {loadingPortal ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Settings2 className="mr-2 h-4 w-4" />}
                Manage
              </Button>
            )}

            {/* 策略 B: 总是显示 "Add" 按钮，或者只在没卡时显示高亮按钮 */}
            <Button 
              variant={hasCards ? "secondary" : "default"} // 有卡时用次级样式，没卡时用主样式
              size="sm" 
              onClick={handleAddCard} 
              disabled={loadingSetup}
              className={!hasCards ? "bg-blue-600 hover:bg-blue-700" : ""}
            >
              {loadingSetup ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
              {hasCards ? "Add Another" : "Add Payment Method"}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {!hasCards ? (
            // Empty State
            <div className="text-center py-8 text-slate-500 bg-[#161b26] rounded-xl border border-slate-800 border-dashed flex flex-col items-center gap-2">
               <CreditCard className="h-8 w-8 opacity-20" />
               <p>No cards saved yet.</p>
               <p className="text-xs text-slate-600">Add a card to enable one-click checkout.</p>
            </div>
          ) : (
            // Card List
            initialCards.map((card: any) => (
              <div key={card.id} className="flex items-center justify-between p-4 bg-[#161b26] rounded-xl border border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="bg-slate-900 p-2 rounded border border-slate-700 uppercase font-bold text-xs text-blue-400 w-12 text-center">
                     {card.brand}
                  </div>
                  <div>
                    <p className="font-medium font-mono">•••• •••• •••• {card.last4}</p>
                    <p className="text-xs text-slate-500 uppercase">Expires {card.exp_month}/{card.exp_year}</p>
                  </div>
                  {card.is_default && (
                    <Badge className="bg-blue-600/10 text-blue-500 border-blue-900 text-[10px]">Default</Badge>
                  )}
                </div>
                {/* 这里不需要删除按钮，因为 Stripe 建议去 Portal 删除 */}
              </div>
            ))
          )}
        </CardContent>
      </Card>

          
      {/* 3. Crypto Wallets Section (History) */}
      <Card className="bg-[#0b101a] border-slate-800 text-slate-50">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Bitcoin className="h-5 w-5 text-orange-500" /> Crypto Wallets
            </CardTitle>
            <CardDescription className="text-slate-400 text-sm">
              Wallets used in previous transactions.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {initialWallets.length === 0 ? (
             <div className="text-center py-6 text-slate-500 bg-[#161b26] rounded-xl border border-slate-800 border-dashed">
               No wallet history found.
             </div>
          ) : (
            initialWallets.map((wallet, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-[#161b26] rounded-xl border border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="bg-orange-500/10 p-2 rounded-full">
                     <Bitcoin className="h-5 w-5 text-orange-500" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-mono text-sm truncate w-37.5 sm:w-auto" title={wallet.address}>
                      {wallet.address}
                    </p>
                    <p className="text-xs text-slate-500 uppercase">{wallet.network || 'Blockchain'}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="text-slate-500 hover:text-red-500" onClick={() => handleRemoveWallet(wallet.address)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Security Note */}
      <div className="p-4 bg-blue-950/20 border border-blue-900/30 rounded-xl flex gap-3 items-start">
        <ShieldCheck className="h-5 w-5 text-blue-500 mt-0.5" />
        <div className="text-sm">
           <p className="font-semibold text-blue-400">Security Guaranteed</p>
           <p className="text-blue-200/60 leading-relaxed">
             Cards are managed securely by Stripe. Crypto payments are processed through Coinbase Commerce. We never store your full card details.
           </p>
        </div>
      </div>
    </div>
  )
}