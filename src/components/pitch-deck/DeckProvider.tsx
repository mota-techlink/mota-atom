"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";

export type TransitionType = "fade" | "slide" | "zoom" | "flip";

interface DeckContextType {
  currentSlide: number;
  totalSlides: number;
  transition: TransitionType;
  isFullscreen: boolean;
  // Navigation
  goToSlide: (index: number) => void;
  nextSlide: () => void;
  prevSlide: () => void;
  goToFirst: () => void;
  goToLast: () => void;
  // Fullscreen
  toggleFullscreen: () => void;
  // Config
  setTransition: (t: TransitionType) => void;
  // Access control
  maxPreviewSlides: number;
  isAuthenticated: boolean;
}

const DeckContext = createContext<DeckContextType | null>(null);

export function useDeck() {
  const ctx = useContext(DeckContext);
  if (!ctx) throw new Error("useDeck must be used within DeckProvider");
  return ctx;
}

interface DeckProviderProps {
  children: ReactNode;
  totalSlides: number;
  initialTransition?: TransitionType;
  maxPreviewSlides?: number; // How many slides are visible without auth
  isAuthenticated?: boolean;
}

export function DeckProvider({
  children,
  totalSlides,
  initialTransition = "fade",
  maxPreviewSlides = 3,
  isAuthenticated = false,
}: DeckProviderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [transition, setTransition] = useState<TransitionType>(initialTransition);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const effectiveMax = isAuthenticated ? totalSlides : Math.min(maxPreviewSlides, totalSlides);

  const goToSlide = useCallback(
    (index: number) => {
      if (index >= 0 && index < effectiveMax) {
        setCurrentSlide(index);
      }
    },
    [effectiveMax]
  );

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => Math.min(prev + 1, effectiveMax - 1));
  }, [effectiveMax]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  }, []);

  const goToFirst = useCallback(() => setCurrentSlide(0), []);
  const goToLast = useCallback(() => setCurrentSlide(effectiveMax - 1), [effectiveMax]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  }, []);

  // Listen for fullscreen changes (e.g., user presses Escape)
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't capture if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key) {
        case "ArrowRight":
        case " ":
        case "Enter":
          e.preventDefault();
          nextSlide();
          break;
        case "ArrowLeft":
        case "Backspace":
          e.preventDefault();
          prevSlide();
          break;
        case "Home":
          e.preventDefault();
          goToFirst();
          break;
        case "End":
          e.preventDefault();
          goToLast();
          break;
        case "f":
        case "F":
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            toggleFullscreen();
          }
          break;
        case "F11":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "Escape":
          if (isFullscreen) {
            // fullscreen exit handled by browser
          }
          break;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [nextSlide, prevSlide, goToFirst, goToLast, toggleFullscreen, isFullscreen]);

  return (
    <DeckContext.Provider
      value={{
        currentSlide,
        totalSlides,
        transition,
        isFullscreen,
        goToSlide,
        nextSlide,
        prevSlide,
        goToFirst,
        goToLast,
        toggleFullscreen,
        setTransition,
        maxPreviewSlides: effectiveMax,
        isAuthenticated,
      }}
    >
      {children}
    </DeckContext.Provider>
  );
}
