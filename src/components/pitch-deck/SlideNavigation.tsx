"use client";

import React from "react";
import { useDeck } from "./DeckProvider";
import { ChevronLeft, ChevronRight, Maximize, Minimize } from "lucide-react";
import { cn } from "@/lib/utils";

export function SlideNavigation() {
  const {
    currentSlide,
    nextSlide,
    prevSlide,
    toggleFullscreen,
    isFullscreen,
    maxPreviewSlides,
    isAuthenticated,
    totalSlides,
  } = useDeck();

  const effectiveMax = isAuthenticated ? totalSlides : maxPreviewSlides;
  const isFirst = currentSlide === 0;
  const isLast = currentSlide >= effectiveMax - 1;

  return (
    <>
      {/* Left arrow with pulsing fade effect + PgUp hint */}
      <button
        onClick={prevSlide}
        disabled={isFirst}
        className={cn(
          "absolute left-0 top-0 bottom-0 w-10 sm:w-16 flex flex-col items-center justify-center gap-0.5",
          "bg-linear-to-r from-black/20 to-transparent",
          "z-20 cursor-pointer",
          isFirst
            ? "pointer-events-none opacity-0"
            : "animate-nav-pulse hover:animate-none hover:opacity-100 active:animate-none active:opacity-100"
        )}
        aria-label="Previous slide (Page Up)"
      >
        <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8 text-white/80" />
        <span className="text-[7px] sm:text-[9px] text-white/60 font-mono tracking-wider">PgUp</span>
      </button>

      {/* Right arrow with pulsing fade effect + PgDn hint */}
      <button
        onClick={nextSlide}
        disabled={isLast}
        className={cn(
          "absolute right-0 top-0 bottom-0 w-10 sm:w-16 flex flex-col items-center justify-center gap-0.5",
          "bg-linear-to-l from-black/20 to-transparent",
          "z-20 cursor-pointer",
          isLast
            ? "pointer-events-none opacity-0"
            : "animate-nav-pulse hover:animate-none hover:opacity-100 active:animate-none active:opacity-100"
        )}
        aria-label="Next slide (Page Down)"
      >
        <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 text-white/80" />
        <span className="text-[7px] sm:text-[9px] text-white/60 font-mono tracking-wider">PgDn</span>
      </button>

      {/* Fullscreen toggle */}
      <button
        onClick={toggleFullscreen}
        className={cn(
          "absolute bottom-2 right-2 sm:bottom-4 sm:right-4 z-30",
          "p-1.5 sm:p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors",
          "text-white/70 hover:text-white cursor-pointer"
        )}
        aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      >
        {isFullscreen ? (
          <Minimize className="w-4 h-4 sm:w-5 sm:h-5" />
        ) : (
          <Maximize className="w-4 h-4 sm:w-5 sm:h-5" />
        )}
      </button>
    </>
  );
}
