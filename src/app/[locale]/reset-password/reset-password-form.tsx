// src/app/[locale]/reset-password/reset-password-form.tsx
'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';
import { toast } from 'sonner';

interface ResetPasswordFormProps {
  dict: any;
}

export function ResetPasswordForm({
  dict,
}: ResetPasswordFormProps) {
  const router = useRouter();
  const supabase = createClient();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    setError(null);

    // 客户端校验
    if (password.length < 8) {
      setError(dict.invalidPassword || "Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError(dict.passwordMismatch || "Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        setError(updateError.message);
      } else {
        setSuccess(true);
        toast.success("Password Reset Successful", {
          description: "Your password has been updated. Redirecting to login...",
        });
        
        // 3秒后跳转到登录页
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
    } catch (err) {
      console.error("Password Update Error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="space-y-4">
        <Alert className="border-green-500 text-green-600 bg-green-50 dark:bg-green-900/20">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Password reset successfully! Redirecting to login page...
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {dict.password}
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            className="bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800"
          />
          <p className="text-xs text-slate-500">Minimum 8 characters</p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {dict.confirmPassword}
          </Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={isLoading}
            className="bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800"
          />
        </div>

        <Button 
          type="submit"
          disabled={isLoading}
          className="w-full bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-slate-200 transition-colors"
        >
          {isLoading ? "Updating..." : dict.resetPassword}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm">
        <Link href="/login" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white underline underline-offset-4">
          ← {dict.backToLogin}
        </Link>
      </div>
    </>
  );
}
