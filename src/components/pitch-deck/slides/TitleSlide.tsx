"use client";

import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Slide } from "./Slide";
import { FadeIn } from "../animations/FadeIn";
import { ZoomIn } from "../animations/ZoomIn";

interface TitleSlideProps {
  title: string;
  subtitle?: string;
  background?: string;
  logo?: string;
  date?: string;
  author?: string;
  children?: ReactNode;
  className?: string;
}

export function TitleSlide({
  title,
  subtitle,
  background = "gradient-dark",
  logo,
  date,
  author,
  children,
  className,
}: TitleSlideProps) {
  return (
    <Slide background={background} className={cn("text-center", className)}>
      {logo && (
        <ZoomIn delay={0}>
          <img
            src={logo}
            alt="Logo"
            className="h-16 lg:h-20 mb-8 object-contain mx-auto"
          />
        </ZoomIn>
      )}

      <FadeIn delay={200}>
        <h1 className="text-4xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-4 leading-tight">
          {title}
        </h1>
      </FadeIn>

      {subtitle && (
        <FadeIn delay={400}>
          <p className="text-xl lg:text-2xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </FadeIn>
      )}

      {children && (
        <FadeIn delay={600}>
          <div className="mt-8">{children}</div>
        </FadeIn>
      )}

      {(date || author) && (
        <FadeIn delay={800}>
          <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4 text-sm text-white/50">
            {author && <span>{author}</span>}
            {date && <span>{date}</span>}
          </div>
        </FadeIn>
      )}
    </Slide>
  );
}
