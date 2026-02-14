"use client";

import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Slide } from "./Slide";
import { FadeIn } from "../animations/FadeIn";

interface ContentSlideProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  background?: string;
  className?: string;
  titleAlign?: "left" | "center";
}

export function ContentSlide({
  title,
  subtitle,
  children,
  background = "gradient-dark",
  className,
  titleAlign = "left",
}: ContentSlideProps) {
  return (
    <Slide background={background} className={cn("items-start justify-start", className)}>
      <div className="w-full max-w-5xl mx-auto flex flex-col h-full justify-center">
        {title && (
          <FadeIn delay={0}>
            <h2
              className={cn(
                "text-3xl lg:text-5xl font-bold mb-2 tracking-tight",
                titleAlign === "center" && "text-center"
              )}
            >
              {title}
            </h2>
          </FadeIn>
        )}
        {subtitle && (
          <FadeIn delay={100}>
            <p
              className={cn(
                "text-lg text-white/60 mb-8",
                titleAlign === "center" && "text-center"
              )}
            >
              {subtitle}
            </p>
          </FadeIn>
        )}
        <FadeIn delay={200}>
          <div className="flex-1 flex flex-col justify-center">{children}</div>
        </FadeIn>
      </div>
    </Slide>
  );
}
