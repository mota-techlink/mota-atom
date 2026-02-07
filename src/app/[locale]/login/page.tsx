// app/[locale]/login/page.tsx
'use client'; // 需要改为 client component 来使用 useSearchParams 和 onClick
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { oAuthLogin, signup, signInWithGoogle } from '@/app/auth/actions';
import { OAuthButton } from '@/components/oauth-button';
import { useSearchParams } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Image from "next/image"
import { siteConfig } from "@/config/site"
import Link from 'next/link';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export default function LoginPage() {
  const t = useTranslations('Auth');
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const message = searchParams.get('message');

  return (
    
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">     
      <Card className="w-full max-w-sm border-slate-200 dark:border-slate-800 shadow-sm">
        <CardHeader className="space-y-1">
          {/* 🟢 修改开始：使用 Flex 布局使 Logo 和文字水平排列 */}
          <CardTitle className="text-2xl font-semibold tracking-tight flex mx-auto items-center  gap-3">
            {/* Logo 容器：限制大小，仅在暗色模式显示 */}
            <span>{t('loginTitle', { defaultMessage: 'Login to ' })}</span>
            
            <div className="relative w-30 h-20 hidden dark:block shrink-0">
              <Image 
                src={siteConfig.logoDark}
                alt="Mota Techlink" 
                fill 
                className="object-contain"
                priority
              />
            </div>
            {/* 标题文字 */}            
          </CardTitle>
          {/* 🔴 修改结束 */}
          <CardDescription className="flex mx-auto items-center">
            {t('loginDesc', { defaultMessage: 'Enter your email to sign in to your account' })}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form className="grid gap-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {message && (
              <Alert>
                <AlertDescription>{message === 'check_email' ? 'Please check your email to confirm your account.' : message}</AlertDescription>
              </Alert>
            )}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                required
                className="bg-white dark:bg-slate-950"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                className="bg-white dark:bg-slate-950"
              />
            </div>
            
            <Button formAction={oAuthLogin} className="w-full bg-black text-white hover:bg-slate-800 dark:bg-white dark:text-black">
              Sign In
            </Button>
             </form>
             
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-50 px-2 text-slate-500 dark:bg-slate-950">
                  Or continue with
                </span>
              </div>
            </div>

            <OAuthButton
              provider="google"
              label="Google"
              iconUrl="/logos/google-icon.svg"
              onClick={async (e) => { // 🟢 Make async
                e.preventDefault(); 
                // 🟢 Call the action and wait for result
                const result = await signInWithGoogle();
                
                if (result?.url) {
                  // 🟢 Navigate manually on the client side
                  // This is safer for external redirects than server-side redirect()
                  window.location.href = result.url;
                } else if (result?.error) {
                  console.error("OAuth Error:", result.error);
                  // Optional: You could use a toast or set an error state here
                }
              }}
            />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-50 px-2 text-slate-500 dark:bg-slate-950">
                  Don't have an account?
                </span>
              </div>
            </div>

            <Button type="button" formAction={signup} variant="outline" className="w-full">
              Create an account
            </Button>
         
          
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-xs text-slate-500 text-center px-4">
            By clicking continue, you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}