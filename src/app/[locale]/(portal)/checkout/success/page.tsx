import { Link } from '@/navigation';
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import Stripe from 'stripe';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

// 为了安全，不在客户端直接 fetch session，而是在 Server Component 获取一些基本信息
export default async function SuccessPage({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams;  
  const sessionId = resolvedSearchParams.session_id as string;

  // (可选) 如果你想在页面显示金额，可以在这里用 Stripe SDK 查一下
  // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  // const session = await stripe.checkout.sessions.retrieve(sessionId);

  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-12">
      <Card className="w-full max-w-md p-8 text-center space-y-6 shadow-xl border-green-100 dark:border-green-900/30">
        
        <div className="flex justify-center">
          <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-4 animate-in zoom-in duration-500">
            <CheckCircle2 className="w-16 h-16 text-green-600 dark:text-green-400" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Payment Successful!</h1>
          <p className="text-muted-foreground">
            Thank you for your purchase. A confirmation email has been sent to you.
          </p>
        </div>

        {/* 订单号 (脱敏显示) */}
        <div className="bg-muted/50 p-3 rounded-lg text-xs text-muted-foreground font-mono break-all">
          Order ID: {sessionId}
        </div>

        <div className="pt-4 flex flex-col gap-3">
          <Button asChild size="lg" className="w-full bg-green-600 hover:bg-green-700 text-white">
            <Link href="/dashboard">
              Go to Dashboard <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
          
          <Button asChild variant="ghost" size="sm">
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}