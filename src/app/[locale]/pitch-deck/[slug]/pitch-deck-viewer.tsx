"use client";

import React from "react";
import { ElmsLogisticsDeck } from "@content/pitch-decks/elms-logistics/deck";
import type { TransitionType } from "@/components/pitch-deck";
import type { PitchDeckMeta } from "@/config/pitch-decks";

interface PitchDeckViewerProps {
  slug: string;
  meta: PitchDeckMeta;
  isAuthenticated: boolean;
}

// Client component that renders the correct deck based on slug
export function PitchDeckViewer({ slug, meta, isAuthenticated }: PitchDeckViewerProps) {
  const transition = (meta.defaultTransition || "slide") as TransitionType;

  // Deck component registry (client-side)
  switch (slug) {
    case "elms-logistics":
      return (
        <ElmsLogisticsDeck
          isAuthenticated={isAuthenticated}
          transition={transition}
        />
      );
    default:
      return (
        <div className="w-full h-full flex items-center justify-center text-white">
          <p>Deck not found: {slug}</p>
        </div>
      );
  }
}
