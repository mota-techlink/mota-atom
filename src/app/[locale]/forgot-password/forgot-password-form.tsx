// src/app/[locale]/forgot-password/forgot-password-form.tsx
'use client';

import { useState, FormEvent } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ForgotPasswordFormProps {
  dict: any;
  initialMessage?: string;
  initialError?: string;
}

export function ForgotPasswordForm({
  dict,
  initialMessage,
  initialError,
}: ForgotPasswordFormProps) {
  const supabase = createClient();
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError || null);
  const [message, setMessage] = useState<string | null>(initialMessage || null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    setError(null);
    setMessage(null);

    // 客户端校验
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setError(dict.invalidEmail || "Invalid email address");
      return;
    }

    setIsLoading(true);
    try {
      // 获取当前域名用于重定向
      const origin = window.location.origin;
      const currentLocale = window.location.pathname.split('/')[1] || 'en';
      
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/${currentLocale}/reset-password`,
      });

      if (resetError) {
        setError(resetError.message);
      } else {
        setMessage(dict.emailSent || "Check your email for a password reset link.");
        setEmail('');
      }
    } catch (err) {
      console.error("Password Reset Error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {message && !error && (
        <Alert className="mb-4 border-green-500 text-green-600 bg-green-50 dark:bg-green-900/20">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {dict.email}
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading || !!message}
            className="bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800"
          />
        </div>

        <Button 
          type="submit"
          disabled={isLoading || !!message}
          className="w-full bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-slate-200 transition-colors"
        >
          {isLoading ? "Sending..." : dict.sendReset}
        </Button>
      </form>
    </>
  );
}
