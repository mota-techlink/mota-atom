"use client";

import React from "react";
import { useDeck } from "./DeckProvider";
import { cn } from "@/lib/utils";

export function ProgressBar() {
  const { currentSlide, totalSlides, maxPreviewSlides, isAuthenticated, goToSlide } = useDeck();
  const displayTotal = isAuthenticated ? totalSlides : maxPreviewSlides;

  return (
    <div className="flex items-center gap-1.5 sm:gap-2 w-full">
      <div className="flex items-center gap-1 sm:gap-1.5 flex-1 justify-center">
        {Array.from({ length: displayTotal }).map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className={cn(
              "w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 cursor-pointer",
              i === currentSlide
                ? "bg-white scale-125"
                : i < currentSlide
                ? "bg-white/60"
                : "bg-white/30"
            )}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
        {!isAuthenticated && totalSlides > maxPreviewSlides && (
          <span className="text-white/40 text-[10px] sm:text-xs ml-1">
            +{totalSlides - maxPreviewSlides} locked
          </span>
        )}
      </div>
      <span className="text-white/70 text-xs sm:text-sm font-mono tabular-nums min-w-10 sm:min-w-16 text-right">
        {currentSlide + 1} / {totalSlides}
      </span>
    </div>
  );
}
