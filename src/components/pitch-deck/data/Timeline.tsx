"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface TimelineItem {
  date: string;
  title: string;
  description?: string;
  status?: "completed" | "current" | "upcoming";
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

const statusColors = {
  completed: "bg-green-500",
  current: "bg-blue-500 animate-pulse",
  upcoming: "bg-white/30",
};

const statusTextColors = {
  completed: "text-green-400",
  current: "text-blue-400",
  upcoming: "text-white/50",
};

export function Timeline({ items, className }: TimelineProps) {
  return (
    <div className={cn("relative pl-8", className)}>
      {/* Vertical line */}
      <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-white/20" />

      {items.map((item, i) => {
        const status = item.status || "upcoming";
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.2, duration: 0.5 }}
            className="relative mb-8 last:mb-0"
          >
            {/* Dot */}
            <div
              className={cn(
                "absolute -left-5 top-1.5 w-4 h-4 rounded-full border-2 border-slate-900",
                statusColors[status]
              )}
            />

            {/* Content */}
            <div className="ml-4">
              <span
                className={cn(
                  "text-xs font-mono uppercase tracking-wider",
                  statusTextColors[status]
                )}
              >
                {item.date}
              </span>
              <h4 className="text-lg font-semibold mt-1">{item.title}</h4>
              {item.description && (
                <p className="text-sm text-white/60 mt-1">{item.description}</p>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
