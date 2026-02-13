'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AuthFormModal from '@/components/auth/auth-form-modal';
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isSignup ? dict.signupTitle : dict.loginTitle}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {isSignup ? dict.signupDesc : dict.loginDesc}
          </p>
        </DialogHeader>
        <AuthFormModal
          specificProviders={specificProviders}
          commonProviders={commonProviders}
          isSignup={isSignup}
          dict={dict}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
