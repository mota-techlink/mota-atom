"use client";

import React, { ReactNode } from "react";
import { motion } from "framer-motion";

interface FadeInProps {
  children: ReactNode;
  delay?: number; // ms
  duration?: number; // ms
  direction?: "up" | "down" | "none";
  className?: string;
}

export function FadeIn({
  children,
  delay = 0,
  duration = 600,
  direction = "up",
  className,
}: FadeInProps) {
  const yOffset = direction === "up" ? 20 : direction === "down" ? -20 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: duration / 1000,
        delay: delay / 1000,
        ease: "easeOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
