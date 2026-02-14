"use client";

import React, { ReactNode } from "react";
import { motion } from "framer-motion";

interface ZoomInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  scale?: number; // starting scale, e.g., 0.5
  className?: string;
}

export function ZoomIn({
  children,
  delay = 0,
  duration = 600,
  scale = 0.8,
  className,
}: ZoomInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale }}
      animate={{ opacity: 1, scale: 1 }}
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
