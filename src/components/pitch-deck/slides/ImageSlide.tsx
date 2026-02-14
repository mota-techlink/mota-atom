"use client";

import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Slide } from "./Slide";

interface ImageSlideProps {
  src: string;
  alt?: string;
  children?: ReactNode; // overlay content
  overlay?: "none" | "dark" | "gradient";
  background?: string;
  className?: string;
}

export function ImageSlide({
  src,
  alt = "",
  children,
  overlay = "gradient",
  background = "dark",
  className,
}: ImageSlideProps) {
  return (
    <Slide background={background} padding="none" className={cn("relative", className)}>
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover"
      />
      {overlay !== "none" && (
        <div
          className={cn(
            "absolute inset-0",
            overlay === "dark" && "bg-black/50",
            overlay === "gradient" &&
              "bg-linear-to-t from-black/80 via-black/30 to-transparent"
          )}
        />
      )}
      {children && (
        <div className="relative z-10 p-12 lg:p-16 w-full h-full flex flex-col justify-end">
          {children}
        </div>
      )}
    </Slide>
  );
}
