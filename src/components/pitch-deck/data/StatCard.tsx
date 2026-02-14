"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { CountUp } from "../animations/CountUp";
import { FadeIn } from "../animations/FadeIn";

interface StatCardProps {
  value: string;
  label: string;
  icon?: string; // emoji or text
  prefix?: string;
  suffix?: string;
  numericValue?: number; // for CountUp animation
  delay?: number;
  className?: string;
}

export function StatCard({
  value,
  label,
  icon,
  prefix,
  suffix,
  numericValue,
  delay = 0,
  className,
}: StatCardProps) {
  return (
    <FadeIn delay={delay} direction="up">
      <div
        className={cn(
          "flex flex-col items-center justify-center p-6 rounded-2xl",
          "bg-white/5 backdrop-blur-sm border border-white/10",
          "hover:bg-white/10 transition-colors",
          className
        )}
      >
        {icon && <span className="text-3xl mb-3">{icon}</span>}
        <div className="text-3xl lg:text-4xl font-bold tracking-tight">
          {numericValue !== undefined ? (
            <CountUp
              value={numericValue}
              prefix={prefix}
              suffix={suffix}
              delay={delay + 300}
            />
          ) : (
            <>
              {prefix}
              {value}
              {suffix}
            </>
          )}
        </div>
        <div className="text-sm text-white/60 mt-2 font-medium">{label}</div>
      </div>
    </FadeIn>
  );
}
