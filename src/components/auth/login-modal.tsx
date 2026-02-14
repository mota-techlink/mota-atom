'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { LoginPanel } from '@/components/auth/login-panel';
import { OAuthProviderConfig } from '@/config/site';

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  specificProviders: OAuthProviderConfig[];
  commonProviders: OAuthProviderConfig[];
  isSignup?: boolean;
  dict: any;
}

export function LoginModal({
  open,
  onOpenChange,
  specificProviders,
  commonProviders,
  isSignup = false,
  dict,
}: LoginModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[calc(100%-2rem)] sm:max-w-3xl p-0 border-0 bg-transparent shadow-none overflow-hidden [&>button]:hidden"
        showCloseButton={false}
      >
        <LoginPanel
          specificProviders={specificProviders}
          commonProviders={commonProviders}
          dict={dict}
          mode="modal"
          isSignup={isSignup}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
