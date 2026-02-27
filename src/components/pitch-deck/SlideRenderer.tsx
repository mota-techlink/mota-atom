"use client";

import React, { ReactNode, useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/navigation";
import { useDeck } from "./DeckProvider";
import { SlideTransition } from "./SlideTransition";
import { SlideNavigation } from "./SlideNavigation";
import { ProgressBar } from "./ProgressBar";
import { Lock, LogIn, Home, Globe, ChevronDown, Check } from "lucide-react";
import { LoginModal } from "@/components/auth/login-modal";
import { siteConfig } from "@/config/site";
import { locales } from "@/routing";
import { useDeckLocale } from "./DeckLocaleContext";

/** RTL locale codes */
const RTL_LOCALES = new Set(["ar", "he", "fa", "ur"]);

interface SlideRendererProps {
  slides: ReactNode[];
  /** Optional per-slide titles shown in top-left overlay */
  slideTitles?: string[];
}

export function SlideRenderer({ slides, slideTitles }: SlideRendererProps) {
  const { currentSlide, isAuthenticated, maxPreviewSlides, totalSlides, goToFirst } = useDeck();
  const isLocked = !isAuthenticated && currentSlide >= maxPreviewSlides - 1 && totalSlides > maxPreviewSlides;

  // next-intl locale (URL-based)
  const globalLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  // Deck-level locale context (may include extra locales like "ar")
  const deckCtx = useDeckLocale();
  const hasDeckLocale = deckCtx.availableLocales.length > 1;

  // Effective locale & labels — prefer deck context when available
  const effectiveLocale = hasDeckLocale ? deckCtx.deckLocale : globalLocale;
  const effectiveLocales = hasDeckLocale ? deckCtx.availableLocales : (locales as unknown as string[]);
  const effectiveLabels: Record<string, string> = hasDeckLocale
    ? deckCtx.localeLabels
    : Object.fromEntries((locales as unknown as string[]).map(l => [l, l.toUpperCase()]));

  const isRTL = RTL_LOCALES.has(effectiveLocale);

  // ── Language dropdown state ──
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  // Close on click-outside
  useEffect(() => {
    if (!langOpen) return;
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [langOpen]);

  /** Select a specific locale from the dropdown */
  const selectLocale = (next: string) => {
    setLangOpen(false);
    if (next === effectiveLocale) return;

    if (hasDeckLocale) {
      if ((locales as unknown as string[]).includes(next)) {
        router.replace(pathname, { locale: next as "en" | "zh" });
      }
      deckCtx.setDeckLocale(next);
    } else {
      router.replace(pathname, { locale: next as "en" | "zh" });
    }
  };

  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const specificProviders = siteConfig.oauth.regionSpecific[globalLocale] || [];
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
        {/* RTL dir is applied ONLY to slide content, not shell chrome */}
        <div dir={isRTL ? "rtl" : "ltr"} className="h-full">
          <SlideTransition slideKey={currentSlide}>
            {slides[currentSlide]}
          </SlideTransition>
        </div>

        {/* ── Top overlay bar: Title (left) + Logo (right) — always LTR ── */}
        <div className="absolute top-0 left-0 right-0 z-30 pointer-events-none" dir="ltr">
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

            {/* Right: Language dropdown + MOTA TECHLINK logo */}
            <div className="flex items-center gap-1 sm:gap-2 pointer-events-auto">
              {/* ── Language dropdown ── */}
              <div ref={langRef} className="relative">
                <button
                  onClick={() => setLangOpen((v) => !v)}
                  className="flex items-center gap-1 px-1.5 py-1 sm:px-2 sm:py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/8 backdrop-blur-sm transition-colors cursor-pointer"
                  aria-label="Switch language"
                  aria-expanded={langOpen}
                >
                  <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-white/60" />
                  <span className="text-[9px] sm:text-[10px] md:text-xs font-mono text-white/50 tracking-wider">
                    {effectiveLabels[effectiveLocale] ?? effectiveLocale.toUpperCase()}
                  </span>
                  <ChevronDown className={`w-2.5 h-2.5 sm:w-3 sm:h-3 text-white/40 transition-transform duration-200 ${langOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown panel */}
                {langOpen && (
                  <div className="absolute right-0 top-full mt-1 min-w-28 rounded-lg bg-slate-900/95 border border-white/10 backdrop-blur-md shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    {effectiveLocales.map((code) => {
                      const active = code === effectiveLocale;
                      return (
                        <button
                          key={code}
                          onClick={() => selectLocale(code)}
                          className={`w-full flex items-center justify-between gap-3 px-3 py-2 text-left text-xs sm:text-sm font-mono tracking-wider transition-colors cursor-pointer ${
                            active
                              ? "bg-blue-600/20 text-blue-300"
                              : "text-white/60 hover:bg-white/8 hover:text-white/90"
                          }`}
                        >
                          <span>{effectiveLabels[code] ?? code.toUpperCase()}</span>
                          {active && <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* MOTA TECHLINK logo */}
              <a
                href="https://atom.motaiot.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 sm:gap-2 md:gap-2.5 px-1.5 py-1 sm:px-2.5 sm:py-1.5 rounded-lg hover:bg-white/5 transition-colors"
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
