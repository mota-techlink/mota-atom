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
import { login, signup } from './actions'; // 引入刚才写的 Server Actions

export const runtime = 'edge';
export default function LoginPage() {
  const t = useTranslations('Auth'); // 假设我们在 en.json 中定义了 Auth 字段

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <Card className="w-full max-w-sm border-slate-200 dark:border-slate-800 shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold tracking-tight">
            {t('loginTitle', { defaultMessage: 'Welcome back' })}
          </CardTitle>
          <CardDescription>
            {t('loginDesc', { defaultMessage: 'Enter your email to sign in to your account' })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4">
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
            
            {/* 使用 formAction 属性来区分登录和注册 */}
            <Button formAction={login} className="w-full bg-black text-white hover:bg-slate-800 dark:bg-white dark:text-black">
              Sign In
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-50 px-2 text-slate-500 dark:bg-slate-950">
                  Or
                </span>
              </div>
            </div>

            <Button formAction={signup} variant="outline" className="w-full">
              Create an account
            </Button>
          </form>
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