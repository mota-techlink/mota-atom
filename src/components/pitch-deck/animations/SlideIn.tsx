"use client";

import React, { ReactNode } from "react";
import { motion } from "framer-motion";

type SlideDirection = "left" | "right" | "up" | "down";

interface SlideInProps {
  children: ReactNode;
  direction?: SlideDirection;
  delay?: number;
  duration?: number;
  className?: string;
}

const offsetMap: Record<SlideDirection, { x: number | string; y: number | string }> = {
  left: { x: -80, y: 0 },
  right: { x: 80, y: 0 },
  up: { x: 0, y: 80 },
  down: { x: 0, y: -80 },
};

export function SlideIn({
  children,
  direction = "left",
  delay = 0,
  duration = 600,
  className,
}: SlideInProps) {
  const offset = offsetMap[direction];

  return (
    <motion.div
      initial={{ opacity: 0, x: offset.x, y: offset.y }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{
        duration: duration / 1000,
        delay: delay / 1000,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
