// src/components/payments/crypto-payment-modal.tsx
"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bitcoin, Loader2, Copy, CheckCircle2, AlertCircle, Clock, QrCode, ExternalLink } from "lucide-react"
import { toast } from "sonner"

interface CryptoPaymentModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  orderId: string
  amount: string // USD 金额
  onPaymentSuccess?: () => void
}

interface PaymentState {
  status: "idle" | "creating" | "awaiting_payment" | "confirmed" | "failed"
  chargeId?: string
  hostedUrl?: string
  cryptoDetails?: {
    address: string
    amount: string
    currency: string
    description: string
    expiresAt: string
  }
  error?: string
  expiresIn?: number
}

export function CryptoPaymentModal({
  isOpen,
  onOpenChange,
  orderId,
  amount,
  onPaymentSuccess,
}: CryptoPaymentModalProps) {
  const [state, setState] = useState<PaymentState>({ status: "idle" })
  const [selectedCrypto, setSelectedCrypto] = useState<string>("") // 空 = 用户自选

  // 倒计时时间
  const [timeLeft, setTimeLeft] = useState<number | null>(null)

  // 处理支付创建
  const handleCreatePayment = async () => {
    setState({ status: "creating" })

    try {
      const response = await fetch("/api/payments/coinbase/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          amount,
          currency: "USD",
          cryptoCurrency: selectedCrypto || undefined,
          description: `Payment for Order #${orderId}`,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create payment")
      }

      setState({
        status: "awaiting_payment",
        chargeId: data.chargeId,
        hostedUrl: data.hostedUrl,
        cryptoDetails: data.cryptoDetails,
      })

      // 计算剩余时间
      const expiresAt = new Date(data.cryptoDetails.expiresAt).getTime()
      const now = Date.now()
      const diff = Math.floor((expiresAt - now) / 1000)
      setTimeLeft(diff)

      // 启动倒计时
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (!prev || prev <= 0) {
            clearInterval(interval)
            setState({ status: "failed", error: "Payment expired. Please try again." })
            return null
          }
          return prev - 1
        })
      }, 1000)

      toast.success("Payment charge created", {
        description: "Ready to receive your crypto payment",
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error"
      setState({ status: "failed", error: message })
      toast.error("Failed to create payment", { description: message })
    }
  }

  // 复制地址到剪贴板
  const handleCopyAddress = async () => {
    if (!state.cryptoDetails?.address) return

    try {
      await navigator.clipboard.writeText(state.cryptoDetails.address)
      toast.success("Address copied to clipboard")
    } catch {
      toast.error("Failed to copy address")
    }
  }

  // 重定向到 Coinbase 托管页面（推荐）
  const handleRedirectToHosted = () => {
    if (state.hostedUrl) {
      window.open(state.hostedUrl, "_blank")
    }
  }

  // 格式化时间
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const cryptoOptions = [
    { id: "bitcoin", name: "Bitcoin", symbol: "BTC", icon: "₿" },
    { id: "ethereum", name: "Ethereum", symbol: "ETH", icon: "Ξ" },
    { id: "litecoin", name: "Litecoin", symbol: "LTC", icon: "Ł" },
    { id: "usdc", name: "USDC", symbol: "USDC", icon: "U" },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-[#0b101a] border-slate-800">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-slate-50">
            <Bitcoin className="h-5 w-5 text-orange-500" />
            Pay with Cryptocurrency
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Accept BTC, ETH, USDC and more. No wallet needed!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* 步骤 1: 选择加密货币 (仅在初始状态) */}
          {state.status === "idle" && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Select Cryptocurrency (Optional - You can let user choose)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedCrypto("")}
                    className={`p-3 rounded-lg border-2 transition ${
                      selectedCrypto === ""
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-slate-700 hover:border-slate-600 bg-slate-900"
                    }`}
                  >
                    <div className="text-sm font-semibold text-slate-300">Let User Choose</div>
                    <div className="text-xs text-slate-500">Flexible</div>
                  </button>

                  {cryptoOptions.map((crypto) => (
                    <button
                      key={crypto.id}
                      onClick={() => setSelectedCrypto(crypto.id)}
                      className={`p-3 rounded-lg border-2 transition ${
                        selectedCrypto === crypto.id
                          ? "border-orange-500 bg-orange-500/10"
                          : "border-slate-700 hover:border-slate-600 bg-slate-900"
                      }`}
                    >
                      <div className="text-sm font-semibold text-slate-300">
                        {crypto.symbol}
                      </div>
                      <div className="text-xs text-slate-500">{crypto.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-blue-950/20 border border-blue-900/30 rounded-lg p-4">
                <p className="text-sm text-blue-200">
                  ℹ️ <strong>No wallet needed!</strong> Coinbase will generate a temporary payment address for you.
                </p>
              </div>

              <Button
                onClick={handleCreatePayment}
                className="w-full bg-orange-600 hover:bg-orange-700 h-12"
                size="lg"
              >
                <Bitcoin className="mr-2 h-4 w-4" />
                Create Payment
              </Button>
            </>
          )}

          {/* 步骤 2: 创建中 */}
          {state.status === "creating" && (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-orange-500 mb-3" />
              <p className="text-slate-300">Creating payment charge...</p>
              <p className="text-xs text-slate-500">This will take a moment</p>
            </div>
          )}

          {/* 步骤 3: 等待支付 */}
          {state.status === "awaiting_payment" && state.cryptoDetails && (
            <>
              {/* 倒计时 */}
              <div className="bg-amber-950/30 border border-amber-900/50 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-500" />
                  <span className="text-sm text-amber-200">
                    Payment expires in: <strong>{timeLeft ? formatTime(timeLeft) : "--:--"}</strong>
                  </span>
                </div>
              </div>

              {/* 金额信息 */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Amount (USD)</span>
                  <span className="text-slate-200 font-semibold">${amount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Amount ({state.cryptoDetails.currency})</span>
                  <span className="text-slate-200 font-semibold">{state.cryptoDetails.amount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Network</span>
                  <span className="text-slate-200 font-semibold uppercase">{state.cryptoDetails.currency}</span>
                </div>
              </div>

              {/* 支付地址 */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">
                  Payment Address
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={state.cryptoDetails.address}
                    readOnly
                    className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 font-mono overflow-hidden"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyAddress}
                    className="border-slate-700 hover:bg-slate-800"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* 两种支付方式 */}
              <div className="space-y-3">
                <Button
                  onClick={handleRedirectToHosted}
                  className="w-full bg-blue-600 hover:bg-blue-700 h-12"
                  size="lg"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Go to Coinbase Payment Page
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-700"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-[#0b101a] text-slate-500">Or</span>
                  </div>
                </div>

                <div className="text-xs text-slate-400 text-center py-2">
                  <p>Scan QR code or manually send funds to the address above</p>
                </div>

                {/* QR Code 占位符 */}
                <div className="bg-slate-900 border border-dashed border-slate-700 rounded-lg p-8 flex flex-col items-center gap-3">
                  <QrCode className="h-8 w-8 text-slate-600" />
                  <p className="text-xs text-slate-500">QR Code would appear here</p>
                  <p className="text-xs text-slate-600">(Use qrcode library to generate)</p>
                </div>
              </div>

              {/* 安全提示 */}
              <div className="bg-green-950/20 border border-green-900/30 rounded-lg p-3 text-xs text-green-200">
                ✓ Only send {state.cryptoDetails.currency} to the address above
              </div>
            </>
          )}

          {/* 步骤 4: 支付成功 */}
          {state.status === "confirmed" && (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
              <h3 className="text-lg font-semibold text-slate-50">Payment Confirmed!</h3>
              <p className="text-sm text-slate-400 text-center">
                Your payment has been received and confirmed on the blockchain.
              </p>
              <Button
                onClick={() => {
                  onOpenChange(false)
                  onPaymentSuccess?.()
                }}
                className="w-full bg-green-600 hover:bg-green-700 h-12"
                size="lg"
              >
                Continue
              </Button>
            </div>
          )}

          {/* 步骤 5: 支付失败 */}
          {state.status === "failed" && (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <AlertCircle className="h-12 w-12 text-red-500" />
              <h3 className="text-lg font-semibold text-slate-50">Payment Failed</h3>
              <p className="text-sm text-slate-400 text-center">{state.error}</p>
              <div className="flex gap-2 w-full">
                <Button
                  variant="outline"
                  onClick={() => setState({ status: "idle" })}
                  className="flex-1 border-slate-700 hover:bg-slate-800"
                >
                  Try Again
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="flex-1 border-slate-700 hover:bg-slate-800"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
