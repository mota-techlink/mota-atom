'use client';

import { useState, FormEvent } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ClientOAuthHandler from '@/app/[locale]/login/client-oauth-handler';
import { OAuthProviderConfig } from '@/config/site';
import { useRouter } from 'next/navigation';

interface AuthFormModalProps {
  specificProviders: OAuthProviderConfig[];
  commonProviders: OAuthProviderConfig[];
  isSignup?: boolean;
  dict: any;
  onClose?: () => void;
}

export default function AuthFormModal({
  specificProviders,
  commonProviders,
  isSignup = false,
  dict,
  onClose,
}: AuthFormModalProps) {
  const router = useRouter();

  const supabase = createClient();  
  const allProviders = [ ...commonProviders,...specificProviders];

  // 状态管理
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [globalMessage, setGlobalMessage] = useState<string | null>(null);
  
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 本地视图状态（独立于URL）
  const [localIsSignup, setLocalIsSignup] = useState(isSignup);

  const toggleMode = () => {
    setGlobalError(null);
    setGlobalMessage(null);
    setPasswordError(null);
    setEmailError(null);
    setLocalIsSignup(!localIsSignup);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // 重置错误
    setGlobalError(null);
    setGlobalMessage(null);
    setPasswordError(null);
    setEmailError(null);

    // 客户端校验
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setEmailError(dict.invalidEmail || "Invalid email address");
      return;
    }

    if (!password || password.length < 6) {
      setPasswordError(dict.passwordTooShort || "Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      if (localIsSignup) {
        // 注册逻辑
        const confirmPassword = formData.get('confirmPassword') as string;
        if (password !== confirmPassword) {
          setPasswordError(dict.passwordMismatch || "Passwords do not match");
          setIsLoading(false);
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          setGlobalError(error.message);
        } else if (data.user) {
          setGlobalMessage(dict.signupSuccess || "Account created! Please check your email.");
          setTimeout(() => {
            if (onClose) onClose();
            router.push('/');
          }, 2000);
        }
      } else {
        // 登录逻辑
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error?.message.includes('Invalid login credentials')) {
          setGlobalError(dict.invalidCredentials || "Invalid email or password");
        } else if (error) {
          setGlobalError(error.message);
        } else if (data.user) {
          setGlobalMessage(dict.loginSuccess || "Logged in successfully!");
          setTimeout(() => {
            if (onClose) onClose();
            router.push('/');
          }, 1000);
        }
      }
    } catch (err) {
      setGlobalError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* 错误提示 */}
      {globalError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{globalError}</AlertDescription>
        </Alert>
      )}

      {/* 成功提示 */}
      {globalMessage && (
        <Alert className="mb-4 bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
          <AlertDescription className="text-green-800 dark:text-green-200">{globalMessage}</AlertDescription>
        </Alert>
      )}

      {/* OAuth Buttons */}
      {allProviders.length > 0 && (
        <>
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {allProviders.map((provider) => (
              <ClientOAuthHandler
                key={provider.id}
                provider={provider}
              />
            ))}
          </div>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-300 dark:border-slate-600" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-slate-950 px-2 text-slate-500 dark:text-slate-400">
                Or continue with email
              </span>
            </div>
          </div>
        </>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            {dict.email}
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="name@example.com"
            className={emailError ? 'border-red-500' : ''}
            disabled={isLoading}
          />
          {emailError && (
            <p className="text-sm text-red-500">{emailError}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">
            {dict.password}
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            className={passwordError ? 'border-red-500' : ''}
            disabled={isLoading}
          />
          {passwordError && (
            <p className="text-sm text-red-500">{passwordError}</p>
          )}
        </div>

        {/* Confirm Password (for signup) */}
        {localIsSignup && (
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium">
              {dict.confirmPassword}
            </Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              disabled={isLoading}
            />
          </div>
        )}

        {/* Forgot Password Link (for login) */}
        {!localIsSignup && (
          <div className="text-right">
            <a href="/forgot-password" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              {dict.forgotPassword}
            </a>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "Wait a moment..." : (localIsSignup ? dict.signUp : dict.signIn)}
        </Button>
      </form>

      {/* Toggle Mode */}
      <div className="mt-4 text-center text-sm">
        <span className="text-slate-600 dark:text-slate-400">
          {localIsSignup ? dict.hasAccount : dict.noAccount}{" "}
        </span>
        <button
          onClick={toggleMode}
          className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
        >
          {localIsSignup ? dict.signInNow : dict.signUpNow}
        </button>
      </div>
    </div>
  );
}
