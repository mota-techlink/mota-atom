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
      {/* Left / Right hover zones */}
      <button
        onClick={prevSlide}
        disabled={isFirst}
        className={cn(
          "absolute left-0 top-0 bottom-0 w-16 flex items-center justify-center",
          "opacity-0 hover:opacity-100 transition-opacity duration-300",
          "bg-linear-to-r from-black/20 to-transparent",
          "z-20 cursor-pointer",
          isFirst && "pointer-events-none"
        )}
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-8 h-8 text-white/80" />
      </button>

      <button
        onClick={nextSlide}
        disabled={isLast}
        className={cn(
          "absolute right-0 top-0 bottom-0 w-16 flex items-center justify-center",
          "opacity-0 hover:opacity-100 transition-opacity duration-300",
          "bg-linear-to-l from-black/20 to-transparent",
          "z-20 cursor-pointer",
          isLast && "pointer-events-none"
        )}
        aria-label="Next slide"
      >
        <ChevronRight className="w-8 h-8 text-white/80" />
      </button>

      {/* Fullscreen toggle */}
      <button
        onClick={toggleFullscreen}
        className={cn(
          "absolute bottom-4 right-4 z-30",
          "p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors",
          "text-white/70 hover:text-white cursor-pointer"
        )}
        aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      >
        {isFullscreen ? (
          <Minimize className="w-5 h-5" />
        ) : (
          <Maximize className="w-5 h-5" />
        )}
      </button>
    </>
  );
}
