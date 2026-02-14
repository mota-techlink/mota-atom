"use client";

import React, { ReactNode } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";

interface CountUpProps {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number; // ms
  delay?: number;
  decimals?: number;
  className?: string;
}

export function CountUp({
  value,
  prefix = "",
  suffix = "",
  duration = 2000,
  delay = 0,
  decimals = 0,
  className,
}: CountUpProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => {
    if (decimals > 0) return v.toFixed(decimals);
    return Math.round(v).toLocaleString();
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      const controls = animate(count, value, {
        duration: duration / 1000,
        ease: "easeOut",
      });
      return () => controls.stop();
    }, delay);

    return () => clearTimeout(timeout);
  }, [count, value, duration, delay]);

  return (
    <span className={className}>
      {prefix}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}
