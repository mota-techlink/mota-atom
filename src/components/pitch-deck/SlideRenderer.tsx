"use client";

import React, { ReactNode, useState } from "react";
import { usePathname } from "next/navigation";
import { useDeck } from "./DeckProvider";
import { SlideTransition } from "./SlideTransition";
import { SlideNavigation } from "./SlideNavigation";
import { ProgressBar } from "./ProgressBar";
import { Lock, LogIn } from "lucide-react";
import { LoginModal } from "@/components/auth/login-modal";
import { siteConfig } from "@/config/site";

interface SlideRendererProps {
  slides: ReactNode[];
}

export function SlideRenderer({ slides }: SlideRendererProps) {
  const { currentSlide, isAuthenticated, maxPreviewSlides, totalSlides } = useDeck();
  const isLocked = !isAuthenticated && currentSlide >= maxPreviewSlides - 1 && totalSlides > maxPreviewSlides;

  // Extract locale from pathname (e.g. /en/pitch-deck/xxx → "en")
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";

  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const specificProviders = siteConfig.oauth.regionSpecific[locale] || [];
  const commonProviders = siteConfig.oauth.common;

  const dict = {
    loginTitle: 'Welcome back',
    signupTitle: 'Create an account',
    loginDesc: 'Sign in to your account',
    signupDesc: 'Enter your email below to create your account',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    noAccount: "Don't have an account?",
    hasAccount: 'Already have an account?',
    signUpNow: 'Sign Up Now',
    signInNow: 'Sign In Now',
    forgotPassword: 'Forgot password?',
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-slate-950">
      {/* Slide viewport (16:9) */}
      <div className="flex-1 relative overflow-hidden">
        <SlideTransition slideKey={currentSlide}>
          {slides[currentSlide]}
        </SlideTransition>

        {/* Navigation overlay */}
        <SlideNavigation />

        {/* Lock overlay for non-authenticated users */}
        {isLocked && (
          <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="text-center p-8">
              <Lock className="w-12 h-12 text-white/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Content Locked
              </h3>
              <p className="text-white/60 text-sm max-w-sm mb-6">
                Sign in with admin or staff credentials to view the complete presentation.
              </p>
              <button
                onClick={() => setLoginModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom bar */}
      <div className="bg-slate-900/90 backdrop-blur-sm px-6 py-3 border-t border-white/5">
        <ProgressBar />
      </div>

      {/* Login Modal */}
      <LoginModal
        open={loginModalOpen}
        onOpenChange={setLoginModalOpen}
        specificProviders={specificProviders}
        commonProviders={commonProviders}
        isSignup={false}
        dict={dict}
      />
    </div>
  );
}
