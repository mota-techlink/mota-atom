"use client";

import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Slide } from "./Slide";

interface SplitLayoutProps {
  children: ReactNode;
  background?: string;
  ratio?: "50/50" | "60/40" | "40/60";
  className?: string;
}

function SplitLayoutRoot({
  children,
  background = "gradient-dark",
  ratio = "50/50",
  className,
}: SplitLayoutProps) {
  const ratioMap = {
    "50/50": "grid-cols-2",
    "60/40": "grid-cols-[3fr_2fr]",
    "40/60": "grid-cols-[2fr_3fr]",
  };

  return (
    <Slide background={background} padding="none" className={className}>
      <div
        className={cn(
          "w-full h-full grid gap-0",
          ratioMap[ratio]
        )}
      >
        {children}
      </div>
    </Slide>
  );
}

interface SplitPaneProps {
  children: ReactNode;
  className?: string;
}

function Left({ children, className }: SplitPaneProps) {
  return (
    <div
      className={cn(
        "flex flex-col justify-center items-start p-12 lg:p-16",
        className
      )}
    >
      {children}
    </div>
  );
}

function Right({ children, className }: SplitPaneProps) {
  return (
    <div
      className={cn(
        "flex flex-col justify-center items-center p-12 lg:p-16",
        className
      )}
    >
      {children}
    </div>
  );
}

export const SplitLayout = Object.assign(SplitLayoutRoot, { Left, Right });
