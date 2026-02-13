// src/app/[locale]/reset-password/page.tsx
import { getTranslations } from 'next-intl/server';
import { ResetPasswordForm } from "./reset-password-form"

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export default async function ResetPasswordPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const t = await getTranslations('Auth');

  const dict = {
    resetPasswordTitle: t('resetPasswordTitle', { defaultMessage: 'Set New Password' }),
    resetPasswordDesc: t('resetPasswordDesc', { defaultMessage: 'Enter your new password below.' }),
    password: t('password', { defaultMessage: 'Password' }),
    confirmPassword: t('confirmPassword', { defaultMessage: 'Confirm Password' }),
    resetPassword: t('resetPassword', { defaultMessage: 'Reset Password' }),
    passwordMismatch: t('passwordMismatch', { defaultMessage: 'Passwords do not match' }),
    invalidPassword: t('invalidPassword', { defaultMessage: 'Password must be at least 8 characters' }),
    backToLogin: t('backToLogin', { defaultMessage: 'Back to Login' }),
  };

  return (
    <div className="flex w-full flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-2xl p-8">
        
        <div className="flex flex-col space-y-2 mb-8">
          <h1 className="text-2xl font-bold tracking-tight">
            {dict.resetPasswordTitle}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {dict.resetPasswordDesc}
          </p>
        </div>

        <ResetPasswordForm dict={dict} />
      </div>
    </div>
  );
}
