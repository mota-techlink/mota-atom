// src/hooks/useCryptoPayment.ts
import { useState, useCallback, useEffect } from "react"

export interface CryptoPaymentState {
  status: "idle" | "loading" | "success" | "error" | "expired"
  chargeId?: string
  cryptoDetails?: {
    address: string
    amount: string
    currency: string
    expiresAt: string
  }
  error?: string
}

/**
 * 管理加密货币支付的状态和逻辑
 */
export function useCryptoPayment(orderId: string, amount: string) {
  const [state, setState] = useState<CryptoPaymentState>({
    status: "idle",
  })

  const [timeLeft, setTimeLeft] = useState<number | null>(null)

  /**
   * 创建支付 Charge
   */
  const createPayment = useCallback(
    async (cryptoCurrency?: string) => {
      setState({ status: "loading" })

      try {
        const response = await fetch("/api/payments/coinbase/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId,
            amount,
            currency: "USD",
            cryptoCurrency: cryptoCurrency || undefined,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to create payment")
        }

        setState({
          status: "loading", // 等待支付
          chargeId: data.chargeId,
          cryptoDetails: data.cryptoDetails,
        })

        // 启动倒计时
        const expiresAt = new Date(data.cryptoDetails.expiresAt).getTime()
        const now = Date.now()
        const diff = Math.floor((expiresAt - now) / 1000)
        setTimeLeft(diff)

        return data
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error"
        setState({ status: "error", error: message })
        throw error
      }
    },
    [orderId, amount]
  )

  /**
   * 查询支付状态
   */
  const checkPaymentStatus = useCallback(async (chargeId: string) => {
    try {
      const response = await fetch(`/api/payments/coinbase/status?chargeId=${chargeId}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to check status")
      }

      return data
    } catch (error) {
      console.error("Status check error:", error)
      throw error
    }
  }, [])

  /**
   * 启动支付状态轮询
   */
  const startPolling = useCallback(
    (chargeId: string, interval = 5000) => {
      let pollInterval: NodeJS.Timeout

      const poll = async () => {
        try {
          const status = await checkPaymentStatus(chargeId)

          if (status.charge?.status === "confirmed") {
            setState({
              status: "success",
              chargeId,
              cryptoDetails: state.cryptoDetails,
            })
            clearInterval(pollInterval)
          } else if (
            status.charge?.status === "failed" ||
            status.charge?.status === "expired"
          ) {
            setState({
              status: "error",
              error: `Payment ${status.charge.status}`,
            })
            clearInterval(pollInterval)
          }
        } catch (error) {
          console.error("Poll error:", error)
          // 继续轮询，但记录错误
        }
      }

      // 立即检查一次
      poll()

      // 然后定期检查
      pollInterval = setInterval(poll, interval)

      return () => clearInterval(pollInterval)
    },
    [checkPaymentStatus, state.cryptoDetails]
  )

  /**
   * 复制地址到剪贴板
   */
  const copyAddress = useCallback(async () => {
    if (!state.cryptoDetails?.address) return false

    try {
      await navigator.clipboard.writeText(state.cryptoDetails.address)
      return true
    } catch {
      return false
    }
  }, [state.cryptoDetails])

  /**
   * 重置状态
   */
  const reset = useCallback(() => {
    setState({ status: "idle" })
    setTimeLeft(null)
  }, [])

  // 倒计时效果
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (!prev || prev <= 1) {
          setState((s) => ({ ...s, status: "expired" }))
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [timeLeft])

  /**
   * 格式化剩余时间
   */
  const formatTimeLeft = (seconds: number | null) => {
    if (seconds === null || seconds <= 0) return "--:--"

    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return {
    // 状态
    state,
    timeLeft,
    formattedTimeLeft: formatTimeLeft(timeLeft),

    // 方法
    createPayment,
    checkPaymentStatus,
    startPolling,
    copyAddress,
    reset,
  }
}

/**
 * 使用示例：
 * 
 * function CheckoutPage() {
 *   const { state, createPayment, startPolling, copyAddress, formattedTimeLeft } = 
 *     useCryptoPayment(orderId, amount)
 * 
 *   const handlePayWithCrypto = async () => {
 *     const result = await createPayment("BTC")
 *     if (result.chargeId) {
 *       startPolling(result.chargeId)
 *     }
 *   }
 * 
 *   return (
 *     <>
 *       {state.status === "idle" && (
 *         <button onClick={handlePayWithCrypto}>Pay with Crypto</button>
 *       )}
 * 
 *       {state.status === "loading" && (
 *         <div>
 *           <p>Payment expires in: {formattedTimeLeft}</p>
 *           <p>Send to: {state.cryptoDetails?.address}</p>
 *           <button onClick={copyAddress}>Copy Address</button>
 *         </div>
 *       )}
 * 
 *       {state.status === "success" && <p>Payment confirmed!</p>}
 *       {state.status === "error" && <p>Error: {state.error}</p>}
 *       {state.status === "expired" && <p>Payment expired</p>}
 *     </>
 *   )
 * }
 */
