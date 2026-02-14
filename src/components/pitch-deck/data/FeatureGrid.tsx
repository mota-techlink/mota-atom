"use client";

import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface Feature {
  icon: string; // emoji
  title: string;
  description: string;
}

interface FeatureGridProps {
  features: Feature[];
  columns?: 2 | 3 | 4;
  className?: string;
}

export function FeatureGrid({ features, columns = 3, className }: FeatureGridProps) {
  const colsMap = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={cn("grid gap-4", colsMap[columns], className)}>
      {features.map((feat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.4 }}
          className="p-5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
        >
          <span className="text-2xl">{feat.icon}</span>
          <h4 className="font-semibold mt-3 text-sm">{feat.title}</h4>
          <p className="text-xs text-white/60 mt-1.5 leading-relaxed">
            {feat.description}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
