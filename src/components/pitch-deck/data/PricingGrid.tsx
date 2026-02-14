"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface PricingTier {
  name: string;
  price: string;
  period?: string;
  description?: string;
  features: string[];
  highlight?: boolean;
  cta?: string;
}

interface PricingGridProps {
  tiers: PricingTier[];
  className?: string;
}

export function PricingGrid({ tiers, className }: PricingGridProps) {
  return (
    <div
      className={cn(
        "grid gap-6",
        tiers.length === 2 && "grid-cols-2",
        tiers.length === 3 && "grid-cols-3",
        tiers.length >= 4 && "grid-cols-4",
        className
      )}
    >
      {tiers.map((tier, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.15, duration: 0.5 }}
          className={cn(
            "rounded-2xl p-6 flex flex-col",
            tier.highlight
              ? "bg-blue-600/20 border-2 border-blue-500/50 scale-105"
              : "bg-white/5 border border-white/10"
          )}
        >
          <h3 className="text-lg font-bold">{tier.name}</h3>
          <div className="mt-4">
            <span className="text-3xl font-bold">{tier.price}</span>
            {tier.period && (
              <span className="text-sm text-white/50 ml-1">/{tier.period}</span>
            )}
          </div>
          {tier.description && (
            <p className="text-sm text-white/60 mt-2">{tier.description}</p>
          )}
          <ul className="mt-6 space-y-2 flex-1">
            {tier.features.map((feat, j) => (
              <li key={j} className="text-sm flex items-start gap-2">
                <span className="text-green-400 mt-0.5">✓</span>
                <span className="text-white/80">{feat}</span>
              </li>
            ))}
          </ul>
          {tier.cta && (
            <div className="mt-6">
              <span
                className={cn(
                  "block text-center py-2 px-4 rounded-lg text-sm font-semibold",
                  tier.highlight
                    ? "bg-blue-600 text-white"
                    : "bg-white/10 text-white/80"
                )}
              >
                {tier.cta}
              </span>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
