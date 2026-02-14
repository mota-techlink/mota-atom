"use client";

import React, { ReactNode, useRef } from "react";
import { motion, useInView } from "framer-motion";

interface AnimateOnRevealProps {
  children: ReactNode;
  animation?: "fadeIn" | "slideUp" | "slideLeft" | "zoomIn";
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}

const animationMap = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  slideUp: {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  },
  slideLeft: {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0 },
  },
  zoomIn: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  },
};

export function AnimateOnReveal({
  children,
  animation = "fadeIn",
  delay = 0,
  duration = 600,
  className,
  once = true,
}: AnimateOnRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-50px" });
  const variants = animationMap[animation];

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
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
