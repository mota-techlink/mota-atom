"use client";

import React, { ReactNode } from "react";
import { useDeck } from "./DeckProvider";
import { SlideTransition } from "./SlideTransition";
import { SlideNavigation } from "./SlideNavigation";
import { ProgressBar } from "./ProgressBar";
import { Lock } from "lucide-react";

interface SlideRendererProps {
  slides: ReactNode[];
}

export function SlideRenderer({ slides }: SlideRendererProps) {
  const { currentSlide, isAuthenticated, maxPreviewSlides, totalSlides } = useDeck();
  const isLocked = !isAuthenticated && currentSlide >= maxPreviewSlides - 1 && totalSlides > maxPreviewSlides;

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
              <p className="text-white/60 text-sm max-w-sm">
                Sign in with admin or staff credentials to view the complete presentation.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom bar */}
      <div className="bg-slate-900/90 backdrop-blur-sm px-6 py-3 border-t border-white/5">
        <ProgressBar />
      </div>
    </div>
  );
}
