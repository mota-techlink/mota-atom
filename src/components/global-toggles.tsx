'use client';

import { LanguageToggle } from '@/components/language-toggle';
import { ModeToggle } from "@/components/mode-toggle"

interface GlobalTogglesProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'inline' | 'relative';
  zIndex?: number;
  className?: string;
}

export function GlobalToggles({ 
  position = 'top-right', 
  zIndex = 50,
  className = ''
}: GlobalTogglesProps = {}) {
  const positionClasses = {
    'top-left': 'fixed top-4 left-4',
    'top-right': 'fixed top-4 right-4',
    'bottom-left': 'fixed bottom-4 left-4',
    'bottom-right': 'fixed bottom-4 right-4',
    'inline': 'inline-flex',
    'relative': 'relative'
  };

  const baseClasses = `${positionClasses[position]} flex items-center space-x-2`;

  return (
    <div className={`${baseClasses} ${className}`} style={{ zIndex }}>
      <LanguageToggle />
      <ModeToggle />
    </div>
  );
}
