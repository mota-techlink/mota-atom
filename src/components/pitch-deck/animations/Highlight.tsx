"use client";

import React, { ReactNode } from "react";
import { motion } from "framer-motion";

interface HighlightProps {
  children: ReactNode;
  color?: string; // Tailwind color class e.g. "yellow-300"
  delay?: number;
  duration?: number;
  className?: string;
}

export function Highlight({
  children,
  color = "yellow-300",
  delay = 0,
  duration = 800,
  className,
}: HighlightProps) {
  return (
    <span className={`relative inline-block ${className || ""}`}>
      <motion.span
        initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        transition={{
          duration: duration / 1000,
          delay: delay / 1000,
          ease: "easeInOut",
        }}
        className={`absolute bottom-0 left-0 h-[40%] bg-${color}/40 -z-10 rounded`}
      />
      {children}
    </span>
  );
}
