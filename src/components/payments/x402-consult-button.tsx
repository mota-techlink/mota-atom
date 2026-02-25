"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Zap,
  Loader2,
  CheckCircle2,
  Copy,
  ExternalLink,
  MessageSquare,
  Wallet,
  AlertTriangle,
  ArrowRight,
  Shield,
} from "lucide-react";
import { toast } from "sonner";
import {
  x402Fetch,
  isWalletAvailable,
  type X402PaymentResult,
  type X402ErrorCode,
} from "@/lib/x402/client";

interface X402ConsultButtonProps {
  /** Product slug — e.g. "mvp", "scalup", "sitebuild", "chatbot" */
  productSlug: string;
  /** Product display name */
  productName: string;
}

type ConsultState =
  | { step: "idle" }
  | { step: "input" }
  | { step: "paying"; phase: string }
  | { step: "success"; data: ConsultResult }
  | { step: "error"; message: string; errorCode?: X402ErrorCode };

interface ConsultResult {
  product: string;
  question: string;
  response: string;
  consultedAt: string;
  followUp: string;
  paymentId?: string;
  payer?: string;
}

export function X402ConsultButton({
  productSlug,
  productName,
}: X402ConsultButtonProps) {
  const t = useTranslations("X402Consult");
  const [state, setState] = useState<ConsultState>({ step: "idle" });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [hasWallet, setHasWallet] = useState(false);

  const PHASE_LABELS: Record<string, string> = {
    requesting: t("phaseRequesting"),
    parsing: t("phaseParsing"),
    connecting: t("phaseConnecting"),
    checking_balance: t("phaseCheckingBalance"),
    signing: t("phaseSigning"),
    paying: t("phasePaying"),
  };

  useEffect(() => {
    setHasWallet(isWalletAvailable());
  }, []);

  const handleOpen = () => {
    setState({ step: "input" });
    setDialogOpen(true);
    setQuestion("");
  };

  const handleClose = () => {
    setDialogOpen(false);
    setTimeout(() => setState({ step: "idle" }), 200);
  };

  const handleSubmit = async () => {
    if (!question.trim()) {
      toast.error(t("enterQuestion"));
      return;
    }

    if (!hasWallet) {
      setState({
        step: "error",
        message:
          t("noWalletError"),
        errorCode: "NO_WALLET",
      });
      return;
    }

    setState({ step: "paying", phase: "requesting" });

    const result: X402PaymentResult = await x402Fetch(
      "/api/x402/consult",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: productSlug,
          question: question.trim(),
        }),
      },
      (phase) => {
        setState({ step: "paying", phase });
      }
    );

    if (result.success && result.data) {
      const d = result.data as {
        data: {
          product: string;
          question: string;
          response: string;
          consultedAt: string;
          followUp: string;
        };
        payment?: { transactionId?: string };
      };
      setState({
        step: "success",
        data: {
          product: d.data.product,
          question: d.data.question,
          response: d.data.response,
          consultedAt: d.data.consultedAt,
          followUp: d.data.followUp,
          paymentId: d.payment?.transactionId,
          payer: result.payer,
        },
      });
      toast.success(t("consultComplete"));
    } else {
      setState({
        step: "error",
        message: result.error || "Payment failed",
        errorCode: result.errorCode,
      });
    }
  };

  return (
    <>
      {/* Entry Card in the sidebar */}
      <Card className="border-violet-200 dark:border-violet-800/50 bg-linear-to-br from-violet-50 to-indigo-50 dark:from-violet-950/30 dark:to-indigo-950/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Zap className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            {t("quickConsultation")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {t("consultDesc", { productName })}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold text-violet-600 dark:text-violet-400">
                $0.10
              </span>
              <span className="text-xs text-muted-foreground">
                {t("usdcPerQuestion")}
              </span>
            </div>
            {hasWallet && (
              <Badge variant="secondary" className="text-xs gap-1">
                <Wallet className="w-3 h-3" />
                {t("walletReady")}
              </Badge>
            )}
          </div>
          <Button
            onClick={handleOpen}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white"
            size="lg"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            {t("askQuestion")}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            {hasWallet
              ? t("paidViaMetamask")
              : t("requiresMetamask")}
          </p>
        </CardContent>
      </Card>

      {/* Dialog */}
      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => !open && handleClose()}
      >
        <DialogContent className="sm:max-w-lg">
          {/* ─── Input Step ─── */}
          {state.step === "input" && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-violet-100 dark:bg-violet-900/40 rounded-lg">
                    <Zap className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div>
                    <DialogTitle>{t("consultationTitle", { productName })}</DialogTitle>
                    <DialogDescription>
                      {t("consultationDesc")}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4 mt-2">
                <Textarea
                  placeholder={t("questionPlaceholder", { productName })}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  rows={4}
                  className="resize-none"
                />

                {/* Payment flow info */}
                <div className="bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800/50 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-violet-500 mt-0.5 shrink-0" />
                    <div className="text-xs text-muted-foreground space-y-1.5">
                      <p>
                        <strong className="text-foreground">
                          {t("howPaymentWorks")}
                        </strong>
                      </p>
                      <ol className="list-decimal ml-3 space-y-0.5">
                        <li>{t("step1")}</li>
                        <li>{t("step2")}</li>
                        <li>{t("step3")}</li>
                        <li>{t("step4")}</li>
                      </ol>
                      <p className="text-muted-foreground/70">
                        {t("paymentNote")}
                      </p>
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">{t("cancel")}</Button>
                  </DialogClose>
                  <Button
                    onClick={handleSubmit}
                    disabled={!question.trim()}
                    className="bg-violet-600 hover:bg-violet-700 text-white"
                  >
                    <Wallet className="w-4 h-4 mr-2" />
                    {t("paySubmit")}
                  </Button>
                </DialogFooter>
              </div>
            </>
          )}

          {/* ─── Paying Step (Progress) ─── */}
          {state.step === "paying" && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-violet-100 dark:bg-violet-900/40 rounded-lg animate-pulse">
                    <Zap className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div>
                    <DialogTitle>{t("processingPayment")}</DialogTitle>
                    <DialogDescription>
                      {t("walletPrompts")}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="py-8 flex flex-col items-center gap-4">
                <Loader2 className="w-10 h-10 text-violet-600 animate-spin" />
                <p className="text-sm font-medium text-center">
                  {PHASE_LABELS[state.phase] || t("processing")}
                </p>
                {state.phase === "signing" && (
                  <p className="text-xs text-muted-foreground text-center max-w-xs">
                    {t("signingHint")}
                  </p>
                )}
                {state.phase === "connecting" && (
                  <p className="text-xs text-muted-foreground text-center max-w-xs">
                    {t("connectingHint")}
                  </p>
                )}

                {/* Stepper */}
                <div className="w-full max-w-xs space-y-2 mt-2">
                  {[
                    "requesting",
                    "connecting",
                    "checking_balance",
                    "signing",
                    "paying",
                  ].map((phase, i) => {
                    const phases = [
                      "requesting",
                      "connecting",
                      "checking_balance",
                      "signing",
                      "paying",
                    ];
                    const currentIdx = phases.indexOf(state.phase);
                    const isCompleted = i < currentIdx;
                    const isCurrent = phase === state.phase;
                    return (
                      <div
                        key={phase}
                        className={`flex items-center gap-2 text-xs ${
                          isCompleted
                            ? "text-emerald-600"
                            : isCurrent
                              ? "text-violet-600 font-medium"
                              : "text-muted-foreground/40"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : isCurrent ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border" />
                        )}
                        {PHASE_LABELS[phase]}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* ─── Success Step ─── */}
          {state.step === "success" && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <DialogTitle>{t("consultationComplete")}</DialogTitle>
                    <DialogDescription>
                      {state.data.product} ·{" "}
                      {new Date(state.data.consultedAt).toLocaleString()}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4 mt-2 max-h-96 overflow-y-auto">
                {/* Payer info */}
                {state.data.payer && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Wallet className="w-3.5 h-3.5" />
                    {t("paidBy")}{" "}
                    <code className="bg-muted px-1.5 rounded">
                      {state.data.payer.slice(0, 6)}…
                      {state.data.payer.slice(-4)}
                    </code>
                  </div>
                )}

                {/* Question */}
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    {t("yourQuestion")}
                  </p>
                  <p className="text-sm">{state.data.question}</p>
                </div>

                {/* Response */}
                <div className="bg-violet-50 dark:bg-violet-950/20 rounded-lg p-4">
                  <p className="text-xs font-medium text-violet-600 dark:text-violet-400 mb-2">
                    {t("expertResponse")}
                  </p>
                  <div className="text-sm whitespace-pre-line leading-relaxed">
                    {state.data.response}
                  </div>
                </div>

                {/* Follow-up */}
                <p className="text-xs text-muted-foreground italic">
                  {state.data.followUp}
                </p>
              </div>

              <DialogFooter className="gap-2">
                {state.data.paymentId && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        state.data.paymentId || ""
                      );
                      toast.success(t("paymentIdCopied"));
                    }}
                  >
                    <Copy className="w-3.5 h-3.5 mr-1.5" />
                    {t("copyReceipt")}
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(state.data.response);
                    toast.success(t("responseCopied"));
                  }}
                >
                  <Copy className="w-3.5 h-3.5 mr-1.5" />
                  {t("copyResponse")}
                </Button>
                <DialogClose asChild>
                  <Button variant="default" size="sm">
                    {t("done")}
                  </Button>
                </DialogClose>
              </DialogFooter>
            </>
          )}

          {/* ─── Error Step ─── */}
          {state.step === "error" && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <DialogTitle>
                      {state.errorCode === "NO_WALLET"
                        ? t("walletRequired")
                        : state.errorCode === "INSUFFICIENT_BALANCE"
                          ? t("insufficientBalance")
                          : state.errorCode === "USER_REJECTED"
                            ? t("transactionCancelled")
                            : t("paymentIssue")}
                    </DialogTitle>
                    <DialogDescription>X402 Protocol</DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4 mt-2">
                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 rounded-lg p-4">
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    {state.message}
                  </p>
                </div>

                {/* Install MetaMask CTA */}
                {state.errorCode === "NO_WALLET" && (
                  <a
                    href="https://metamask.io/download/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-violet-600 hover:underline"
                  >
                    <ArrowRight className="w-4 h-4" />
                    {t("installMetamask")}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}

                {/* Insufficient balance help */}
                {state.errorCode === "INSUFFICIENT_BALANCE" && (
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>{t("getTestUsdc")}</p>
                    <ol className="list-decimal ml-4 space-y-0.5">
                      <li>
                        {t("faucetStep1")}{" "}
                        <a
                          href="https://faucet.circle.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-violet-600 hover:underline"
                        >
                          Circle Faucet
                        </a>
                      </li>
                      <li>{t("faucetStep2")}</li>
                      <li>{t("faucetStep3")}</li>
                      <li>{t("faucetStep4")}</li>
                    </ol>
                  </div>
                )}

                {/* Developer info */}
                <div className="space-y-2 text-xs text-muted-foreground">
                  <p className="font-medium text-foreground">
                    {t("forDevelopers")}
                  </p>
                  <code className="block bg-muted p-3 rounded text-xs overflow-x-auto">
                    {`curl -X POST ${typeof window !== "undefined" ? window.location.origin : ""}/api/x402/consult \\
  -H "Content-Type: application/json" \\
  -H "PAYMENT-SIGNATURE: <x402_payload>" \\
  -d '{"product": "${productSlug}", "question": "..."}'`}
                  </code>
                  <p>
                    {t("learnMore")}{" "}
                    <a
                      href="https://x402.org"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-violet-600 hover:underline inline-flex items-center gap-1"
                    >
                      x402.org <ExternalLink className="w-3 h-3" />
                    </a>
                  </p>
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setState({ step: "input" })}
                  >
                    {t("tryAgain")}
                  </Button>
                  <DialogClose asChild>
                    <Button variant="default">{t("close")}</Button>
                  </DialogClose>
                </DialogFooter>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
