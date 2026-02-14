// src/components/auth/login-panel.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { siteConfig } from '@/config/site';
import { TypewriterText } from '@/components/ui/typewriter-text';
import UnifiedAuthForm from './unified-auth-form';
import { OAuthProviderConfig } from '@/config/site';
import { Suspense } from 'react';

interface LoginPanelProps {
  specificProviders: OAuthProviderConfig[];
  commonProviders: OAuthProviderConfig[];
  dict: any;
  /** 'page' for standalone login page, 'modal' for dialog usage */
  mode?: 'page' | 'modal';
  /** Whether to start in signup mode */
  isSignup?: boolean;
  /** Called when the modal should close (modal mode only) */
  onClose?: () => void;
  /** Error from server/URL — page mode only */
  error?: string;
  /** Message from server/URL — page mode only */
  message?: string;
}

export function LoginPanel({
  specificProviders,
  commonProviders,
  dict,
  mode = 'page',
  isSignup = false,
  onClose,
  error,
  message,
}: LoginPanelProps) {
  return (
    <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden rounded-2xl md:rounded-3xl min-h-125">
      {/* Left brand panel */}
      <div className="hidden md:flex md:col-span-2 relative bg-slate-900 items-center justify-center p-8 text-white overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-slate-800 to-black opacity-80 z-0" />

        <div className="relative z-10 flex flex-col items-center gap-4 text-center">
          <Link href="/">
            {siteConfig.logoDark && (
              <Image
                src={siteConfig.logoDark}
                alt="Logo"
                width={150}
                height={100}
                className="object-contain opacity-90 drop-shadow-2xl"
                priority
              />
            )}
          </Link>
          <h2 className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-green-400">
            Member Console
          </h2>
          <p className="text-slate-300 text-[16px] max-w-72 leading-relaxed">
            {'Launch Your Dream Startup with '}
            <span className="text-[16px] inline-block whitespace-nowrap">
              <TypewriterText
                words={['AI Support', ' Zero Cost', 'Infinite Scale']}
                className="text-transparent bg-clip-text bg-linear-to-r from-green-500 to-blue-600"
                cursorClassName="bg-blue-500 h-[0.8em]"
              />
            </span>
          </p>
        </div>
      </div>

      {/* Right form area */}
      <Suspense
        fallback={
          <div className="col-span-1 md:col-span-3 flex items-center justify-center">
            Loading...
          </div>
        }
      >
        <UnifiedAuthForm
          specificProviders={specificProviders}
          commonProviders={commonProviders}
          error={error}
          message={message}
          dict={dict}
          mode={mode}
          isSignup={isSignup}
          onClose={onClose}
        />
      </Suspense>
    </div>
  );
}
