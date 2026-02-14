"use client";

import React, { ReactNode } from "react";
import { motion } from "framer-motion";

interface StaggerListProps {
  children: ReactNode;
  staggerDelay?: number; // delay between each item (ms)
  initialDelay?: number; // delay before the first item (ms)
  className?: string;
}

export function StaggerList({
  children,
  staggerDelay = 150,
  initialDelay = 0,
  className,
}: StaggerListProps) {
  const items = React.Children.toArray(children);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay / 1000,
            delayChildren: initialDelay / 1000,
          },
        },
      }}
      className={className}
    >
      {items.map((child, i) => (
        <motion.div
          key={i}
          variants={{
            hidden: { opacity: 0, x: -20 },
            visible: {
              opacity: 1,
              x: 0,
              transition: { duration: 0.4, ease: "easeOut" },
            },
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
