"use client";

import React from "react";
import { motion } from "framer-motion";

interface TypeWriterProps {
  text: string;
  delay?: number;
  speed?: number; // ms per character
  className?: string;
  cursor?: boolean;
}

export function TypeWriter({
  text,
  delay = 0,
  speed = 50,
  className,
  cursor = true,
}: TypeWriterProps) {
  const totalDuration = (text.length * speed) / 1000;

  return (
    <span className={className}>
      <motion.span
        initial={{ width: 0 }}
        animate={{ width: "auto" }}
        transition={{
          duration: totalDuration,
          delay: delay / 1000,
          ease: "linear",
        }}
        className="inline-block overflow-hidden whitespace-nowrap"
      >
        {text}
      </motion.span>
      {cursor && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: delay / 1000,
          }}
          className="inline-block w-0.5 h-[1em] bg-current ml-0.5 align-middle"
        />
      )}
    </span>
  );
}
