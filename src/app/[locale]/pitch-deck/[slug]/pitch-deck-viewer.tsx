"use client";

import React from "react";
import dynamic from "next/dynamic";
import type { TransitionType } from "@/components/pitch-deck";
import type { PitchDeckMeta } from "@/config/pitch-decks";

// 动态导入 Deck 组件，禁用 SSR 以避免水合不匹配，并实现代码分割
const ElmsLogisticsDeck = dynamic(
  () => import("@content/pitch-decks/elms-logistics/deck").then(mod => mod.ElmsLogisticsDeck),
  { loading: () => <LoadingSpinner /> }
);

const AIWeb3LogisticsDeck = dynamic(
  () => import("@content/pitch-decks/ai-web3-logistics/deck").then(mod => mod.AIWeb3LogisticsDeck),
  { loading: () => <LoadingSpinner /> }
);

const AIFamilyBizDeck = dynamic(
  () => import("@content/pitch-decks/ai-family-biz/deck").then(mod => mod.AIFamilyBizDeck),
  { loading: () => <LoadingSpinner /> }
);

function LoadingSpinner() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-black">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );
}

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
          isAuthenticated={true}
          transition={transition}
        />
      );
    case "ai-web3-logistics":
      return (
        <AIWeb3LogisticsDeck
          isAuthenticated={isAuthenticated}
          transition={transition}
        />
      );
    case "ai-family-biz":
      return (
        <AIFamilyBizDeck
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
