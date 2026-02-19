"use client";

import React, { ReactNode, useState } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { useDeck } from "./DeckProvider";
import { SlideTransition } from "./SlideTransition";
import { SlideNavigation } from "./SlideNavigation";
import { ProgressBar } from "./ProgressBar";
import { Lock, LogIn, Home } from "lucide-react";
import { LoginModal } from "@/components/auth/login-modal";
import { siteConfig } from "@/config/site";

interface SlideRendererProps {
  slides: ReactNode[];
  /** Optional per-slide titles shown in top-left overlay */
  slideTitles?: string[];
}

export function SlideRenderer({ slides, slideTitles }: SlideRendererProps) {
  const { currentSlide, isAuthenticated, maxPreviewSlides, totalSlides, goToFirst } = useDeck();
  const isLocked = !isAuthenticated && currentSlide >= maxPreviewSlides - 1 && totalSlides > maxPreviewSlides;

  // 使用 next-intl 获取当前 locale
  const locale = useLocale();

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

  const currentTitle = slideTitles?.[currentSlide] ?? "";

  return (
    <div className="relative w-full h-full flex flex-col bg-slate-950">
      {/* Slide viewport */}
      <div className="flex-1 relative overflow-hidden min-h-0">
        <SlideTransition slideKey={currentSlide}>
          {slides[currentSlide]}
        </SlideTransition>

        {/* ── Top overlay bar: Title (left) + Logo (right) ── */}
        <div className="absolute top-0 left-0 right-0 z-30 pointer-events-none">
          <div className="flex items-center justify-between px-2 py-1.5 sm:px-4 sm:py-2.5 md:px-6 md:py-3.5">
            {/* Left: Home button + Slide title */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 md:gap-4 pointer-events-auto">
              {/* Home / first-slide button */}
              {currentSlide > 0 && (
                <button
                  onClick={goToFirst}
                  className="flex items-center gap-1 sm:gap-1.5 px-1.5 py-1 sm:px-2.5 sm:py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/8 backdrop-blur-sm transition-colors cursor-pointer"
                  aria-label="Back to first slide"
                >
                  <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white/60" />
                </button>
              )}
              {/* Slide title */}
              {currentTitle && (
                <span className="text-[10px] sm:text-xs md:text-base font-mono text-white/40 tracking-wider uppercase truncate max-w-32 sm:max-w-48 md:max-w-80">
                  {currentTitle}
                </span>
              )}
            </div>

            {/* Right: MOTA TECHLINK logo */}
            <a
              href="https://atom.motaiot.com"
              target="_blank"
              rel="noopener noreferrer"
              className="pointer-events-auto flex items-center gap-1.5 sm:gap-2 md:gap-2.5 px-1.5 py-1 sm:px-2.5 sm:py-1.5 rounded-lg hover:bg-white/5 transition-colors"
              aria-label="MOTA TechLink — Open homepage"
            >
              <Image
                src="/logos/mota-icon-v2.webp"
                alt="MOTA TechLink"
                width={28}
                height={28}
                className="w-4 h-4 sm:w-5 sm:h-5 md:w-7 md:h-7 rounded-sm"
              />
              <span className="hidden sm:flex flex-col items-start leading-none font-mono tracking-wider uppercase">
                <span className="text-xs md:text-sm text-blue-400 font-semibold">MOTA</span>
                <span className="text-[8px] md:text-[10px] text-blue-400">TECHLINK</span>
              </span>
            </a>
          </div>
        </div>

        {/* Navigation overlay */}
        <SlideNavigation />

        {/* Lock overlay for non-authenticated users */}
        {isLocked && (
          <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="text-center p-4 sm:p-8">
              <Lock className="w-8 h-8 sm:w-12 sm:h-12 text-white/50 mx-auto mb-2 sm:mb-4" />
              <h3 className="text-base sm:text-xl font-semibold text-white mb-1 sm:mb-2">
                Content Locked
              </h3>
              <p className="text-white/60 text-xs sm:text-sm max-w-sm mb-4 sm:mb-6">
                Sign in with admin or staff credentials to view the complete presentation.
              </p>
              <button
                onClick={() => setLoginModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-medium transition-colors"
              >
                <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Sign In
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom bar */}
      <div className="bg-slate-900/90 backdrop-blur-sm px-3 py-1.5 sm:px-6 sm:py-3 border-t border-white/5">
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
