"use client";

import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SlideBackground =
  | "gradient-dark"
  | "gradient-blue"
  | "gradient-green"
  | "gradient-purple"
  | "dark"
  | "light"
  | "white"
  | string; // custom CSS class or gradient

const bgMap: Record<string, string> = {
  "gradient-dark": "bg-linear-to-br from-slate-900 via-slate-800 to-slate-900",
  "gradient-blue": "bg-linear-to-br from-blue-900 via-blue-800 to-indigo-900",
  "gradient-green": "bg-linear-to-br from-emerald-900 via-green-800 to-teal-900",
  "gradient-purple": "bg-linear-to-br from-purple-900 via-violet-800 to-indigo-900",
  dark: "bg-slate-900",
  light: "bg-slate-100",
  white: "bg-white",
};

interface SlideProps {
  children: ReactNode;
  background?: SlideBackground;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingMap = {
  none: "",
  sm: "p-8",
  md: "p-12 lg:p-16",
  lg: "p-16 lg:p-24",
};

export function Slide({
  children,
  background = "gradient-dark",
  className,
  padding = "md",
}: SlideProps) {
  const bgClass = bgMap[background] || background;

  return (
    <div
      className={cn(
        "w-full h-full flex flex-col justify-center items-center",
        "aspect-video relative overflow-hidden",
        bgClass,
        paddingMap[padding],
        // Default text color based on bg
        background === "white" || background === "light"
          ? "text-slate-900"
          : "text-white",
        className
      )}
    >
      {children}
    </div>
  );
}
