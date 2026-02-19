// src/app/[locale]/forgot-password/page.tsx
import { Link } from "@/navigation"
import { getTranslations } from 'next-intl/server';
import { ForgotPasswordForm } from "./forgot-password-form"

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export default async function ForgotPasswordPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { locale } = await params;
  const { message, error } = await searchParams;
  const t = await getTranslations('Auth');

  const msgString = Array.isArray(message) ? message[0] : message;
  const errorString = Array.isArray(error) ? error[0] : error;

  const dict = {
    forgotPasswordTitle: t('forgotPasswordTitle', { defaultMessage: 'Reset Your Password' }),
    forgotPasswordDesc: t('forgotPasswordDesc', { defaultMessage: 'Enter your email address and we will send you a link to reset your password.' }),
    email: t('email', { defaultMessage: 'Email' }),
    sendReset: t('sendReset', { defaultMessage: 'Send Reset Link' }),
    backToLogin: t('backToLogin', { defaultMessage: 'Back to Login' }),
    emailSent: t('emailSent', { defaultMessage: 'Check your email for a password reset link.' }),
    invalidEmail: t('invalidEmail', { defaultMessage: 'Invalid email address' }),
  };

  return (
    <div className="flex w-full flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-2xl p-8">
        
        <div className="flex flex-col space-y-2 mb-8">
          <h1 className="text-2xl font-bold tracking-tight">
            {dict.forgotPasswordTitle}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {dict.forgotPasswordDesc}
          </p>
        </div>

        <ForgotPasswordForm dict={dict} initialMessage={msgString} initialError={errorString} />

        <div className="mt-6 text-center text-sm">
          <Link href="/login" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white underline underline-offset-4">
            ← {dict.backToLogin}
          </Link>
        </div>
      </div>
    </div>
  );
}
