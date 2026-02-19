// src/components/auth/unified-auth-form.tsx
'use client';

import { useState, useEffect, FormEvent } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ClientOAuthHandler from '@/app/[locale]/login/client-oauth-handler';
import { OAuthProviderConfig } from '@/config/site';
import { useRouter } from '@/navigation';
import { useSearchParams, usePathname } from 'next/navigation';

interface UnifiedAuthFormProps {
  specificProviders: OAuthProviderConfig[];
  commonProviders: OAuthProviderConfig[];
  /** Initial error from server (URL param) — page mode only */
  error?: string;
  /** Initial message from server (URL param) — page mode only */
  message?: string;
  /** Translation dictionary */
  dict: any;
  /** 
   * 'page' = standalone login page (uses URL params for view toggle, redirects to /dashboard)
   * 'modal' = dialog modal (uses local state, calls onClose, refreshes in-place)
   */
  mode?: 'page' | 'modal';
  /** Whether to start in signup mode (modal mode only) */
  isSignup?: boolean;
  /** Called when the modal should close (modal mode only) */
  onClose?: () => void;
}

export default function UnifiedAuthForm({
  specificProviders,
  commonProviders,
  error,
  message,
  dict,
  mode = 'page',
  isSignup = false,
  onClose,
}: UnifiedAuthFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const supabase = createClient();
  const allProviders = [...commonProviders, ...specificProviders];

  // View toggle: page mode uses URL params, modal mode uses local state
  const [localIsSignup, setLocalIsSignup] = useState(isSignup);
  const isLogin = mode === 'page'
    ? searchParams.get('view') !== 'signup'
    : !localIsSignup;

  // State management
  const [globalError, setGlobalError] = useState<string | null>(error || null);
  const [globalMessage, setGlobalMessage] = useState<string | null>(message || null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Page mode: clean up URL params after reading them
  useEffect(() => {
    if (mode !== 'page') return;
    if (error) setGlobalError(error);
    if (message) setGlobalMessage(message);

    const params = new URLSearchParams(searchParams.toString());
    if (params.has('error') || params.has('message')) {
      params.delete('error');
      params.delete('message');
      const newUrl = `${pathname}${params.toString() ? `?${params.toString()}` : ''}`;
      window.history.replaceState({}, '', newUrl);
    }
  }, [error, message, pathname, searchParams, mode]);

  const toggleMode = () => {
    setGlobalError(null);
    setGlobalMessage(null);
    setPasswordError(null);
    setEmailError(null);

    if (mode === 'page') {
      const params = new URLSearchParams(searchParams.toString());
      if (isLogin) {
        params.set('view', 'signup');
      } else {
        params.delete('view');
      }
      router.replace(`${pathname}?${params.toString()}`);
    } else {
      setLocalIsSignup(!localIsSignup);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Reset errors
    setGlobalError(null);
    setGlobalMessage(null);
    setPasswordError(null);
    setEmailError(null);

    // Client-side validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setEmailError(dict.invalidEmail || 'Invalid email address');
      return;
    }

    if (!password || password.length < 6) {
      setPasswordError(dict.passwordTooShort || 'Password must be at least 6 characters');
      return;
    }

    if (!isLogin) {
      const confirmPassword = formData.get('confirmPassword') as string;
      if (password !== confirmPassword) {
        setPasswordError(dict.passwordMismatch || 'Passwords do not match');
        return;
      }
    }

    setIsLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            setGlobalError(dict.invalidCredentials || 'Invalid email or password');
          } else {
            setGlobalError(error.message);
          }
        } else {
          setGlobalMessage(dict.loginSuccess || 'Logged in successfully!');
          if (mode === 'modal') {
            setTimeout(() => {
              onClose?.();
              router.refresh();
            }, 800);
          } else {
            router.push('/dashboard');
            router.refresh();
          }
        }
      } else {
        const origin = window.location.origin;
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${origin}/auth/callback`,
          },
        });

        if (error) {
          setGlobalError(error.message);
        } else {
          setGlobalMessage('Please check your email to activate account.');
          if (mode === 'page') {
            const params = new URLSearchParams(searchParams.toString());
            params.delete('view');
            router.replace(`${pathname}?${params.toString()}`);
          } else {
            // Stay in modal, show success message
          }
        }
      }
    } catch (err) {
      console.error('Auth Error:', err);
      setGlobalError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="col-span-1 md:col-span-3 p-4 md:p-8 lg:p-8 relative 
                    flex flex-col justify-center 
                    landscape:grid landscape:grid-cols-2 landscape:gap-x-8 landscape:content-center
                    md:landscape:flex md:landscape:flex-col md:landscape:gap-0">
      {/* Section 1: Title & OAuth */}
      <div className="w-full flex flex-col justify-center landscape:justify-start">
        <div className="flex flex-col space-y-1 text-center md:text-left landscape:text-left mb-6 landscape:mb-3">
          <h1 className="text-2xl font-bold tracking-tight landscape:text-xl">
            {isLogin ? dict.loginTitle : dict.signupTitle}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 landscape:text-xs">
            {isLogin ? dict.loginDesc : dict.signupDesc}
          </p>
        </div>

        <div className="flex flex-nowrap justify-center md:justify-start landscape:justify-start gap-2 mb-6 landscape:mb-0">
          {allProviders.map((provider) => (
            <ClientOAuthHandler key={provider.id} provider={provider} />
          ))}
        </div>

        <div className="hidden landscape:block md:landscape:hidden absolute right-0 top-10 bottom-12 w-px bg-slate-100 dark:bg-slate-800" />
      </div>

      {/* Section 2: Email/Password Form */}
      <div className="w-full flex flex-col justify-center pt-2">
        <div className="relative mb-2 landscape:hidden md:landscape:block">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-200 dark:border-slate-800" />
          </div>
        </div>

        {/* Error alert */}
        {globalError && (
          <Alert variant="destructive" className="mb-4 py-2 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">{globalError}</AlertDescription>
          </Alert>
        )}

        {/* Success/info message */}
        {globalMessage && !globalError && (
          <Alert className="mb-4 py-2 border-green-500 text-green-600 bg-green-50 dark:bg-green-900/20 animate-in fade-in slide-in-from-top-2">
            <AlertDescription className="text-xs">{globalMessage}</AlertDescription>
          </Alert>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 landscape:space-y-2">
          <div className="grid gap-1.5">
            <Label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {dict.email}
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              required
              disabled={isLoading}
              className={`h-10 landscape:h-9 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 text-sm ${emailError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
            />
            {emailError && (
              <p className="text-[11px] text-red-500 font-medium ml-1 animate-in slide-in-from-top-1">
                {emailError}
              </p>
            )}
          </div>

          <div className="grid gap-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {dict.password}
              </Label>
              {isLogin && (
                <a
                  href="/forgot-password"
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {dict.forgotPassword || 'Forgot password?'}
                </a>
              )}
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              required
              disabled={isLoading}
              className="h-10 landscape:h-9 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 text-sm"
            />
          </div>

          {!isLogin && (
            <div className="grid gap-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {dict.confirmPassword}
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                disabled={isLoading}
                className={`h-10 landscape:h-9 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 text-sm ${passwordError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              />
              {passwordError && (
                <p className="text-[11px] text-red-500 font-medium ml-1 animate-in slide-in-from-top-1">
                  {passwordError}
                </p>
              )}
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-10 landscape:h-9 text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-slate-200 transition-colors mt-2"
          >
            {isLoading ? 'Wait a moment...' : isLogin ? dict.signIn : dict.signUp}
          </Button>
        </form>

        <div className="mt-6 landscape:mt-3 text-center text-xs">
          <span className="text-slate-500 dark:text-slate-400">
            {isLogin ? dict.noAccount : dict.hasAccount}{' '}
          </span>
          <button
            type="button"
            onClick={toggleMode}
            className="font-semibold underline underline-offset-4 text-slate-900 dark:text-white hover:text-brand"
          >
            {isLogin ? dict.signUpNow : dict.signInNow}
          </button>
        </div>
      </div>
    </div>
  );
}
