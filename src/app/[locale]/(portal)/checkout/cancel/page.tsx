import { Link } from "@/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { XCircle, ArrowLeft, MessageCircle, HelpCircle } from "lucide-react"

type Props = {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default function CancelPage({ searchParams }: Props) {
  const returnUrl = (searchParams.return_to as string) || '/products';
  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-12">
      <Card className="w-full max-w-md shadow-lg border-red-100 dark:border-red-900/30">
        
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-3 animate-in zoom-in duration-300">
              <XCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            Payment Cancelled
          </CardTitle>
        </CardHeader>

        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            You have not been charged. The checkout process was incomplete.
          </p>
          
          <div className="bg-muted/40 p-4 rounded-lg text-sm text-left space-y-2">
            <p className="font-semibold flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              Common reasons:
            </p>
            <ul className="list-disc list-inside text-muted-foreground pl-1 space-y-1">
              <li>Changed your mind</li>
              <li>Payment method issues</li>
              <li>Connection timed out</li>
            </ul>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 pt-2">
          {/* 引导用户重新去购买 */}
          <Button asChild size="lg" className="w-full">
            <Link href={returnUrl}>
              <ArrowLeft className="mr-2 w-4 h-4" />
              Return to Product
            </Link>
          </Button>

          {/* 提供客服入口，防止是因为不懂怎么买而放弃 */}
          <Button asChild variant="ghost" size="sm" className="w-full">
            <Link href="/contact">
              <MessageCircle className="mr-2 w-4 h-4" />
              Contact Support
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}