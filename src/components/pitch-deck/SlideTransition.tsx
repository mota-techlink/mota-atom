"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDeck, TransitionType } from "./DeckProvider";

import type { TargetAndTransition, Transition } from "framer-motion";

const transitionVariants: Record<
  TransitionType,
  {
    initial: TargetAndTransition;
    animate: TargetAndTransition;
    exit: TargetAndTransition;
    transition?: Transition;
  }
> = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.5 },
  },
  slide: {
    initial: { x: "100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 },
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
  zoom: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 1.2, opacity: 0 },
    transition: { duration: 0.5 },
  },
  flip: {
    initial: { rotateY: 90, opacity: 0 },
    animate: { rotateY: 0, opacity: 1 },
    exit: { rotateY: -90, opacity: 0 },
    transition: { duration: 0.6 },
  },
};

interface SlideTransitionProps {
  children: React.ReactNode;
  slideKey: number;
}

export function SlideTransition({ children, slideKey }: SlideTransitionProps) {
  const { transition } = useDeck();
  const variants = transitionVariants[transition];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={slideKey}
        initial={variants.initial}
        animate={variants.animate}
        exit={variants.exit}
        transition={variants.transition as Transition}
        className="w-full h-full"
        style={{ perspective: transition === "flip" ? 1200 : undefined }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
