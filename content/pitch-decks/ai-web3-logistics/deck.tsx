"use client";

import React from "react";
import {
  DeckProvider,
  SlideRenderer,
  DeckLocaleProvider,
} from "@/components/pitch-deck";
import type { TransitionType } from "@/components/pitch-deck";
import { VisionHookSlide } from "./VisionHookSlide";
import { PainPointSlide } from "./PainPointSlide";
import { SolutionSlide } from "./SolutionSlide";
import { MCPIntegrationSlide } from "./MCPIntegrationSlide";
import { X402PaymentSlide } from "./X402PaymentSlide";
import { GlobalRoutesSlide } from "./GlobalRoutesSlide";
import { OperationalFlowSlide } from "./OperationalFlowSlide";
import { GrowthStrategySlide } from "./GrowthStrategySlide";
import { CompetitiveEdgeSlide } from "./CompetitiveEdgeSlide";
import { CTASlide } from "./CTASlide";
import { useContent } from "./useContent";

/** Locales supported by this deck (includes Arabic, which is NOT in global config) */
const DECK_LOCALES = ["en", "zh", "ja", "ar"];
const DECK_LOCALE_LABELS: Record<string, string> = { en: "EN", zh: "中文", ja: "日本語", ar: "عربي" };

interface AIWeb3LogisticsDeckProps {
  isAuthenticated?: boolean;
  transition?: TransitionType;
}

export function AIWeb3LogisticsDeck({
  isAuthenticated = false,
  transition = "slide",
}: AIWeb3LogisticsDeckProps) {
  const content = useContent();
  const slideTitles = content.slideTitles;

  const slides = [
    // ═══════════════════════════════════════════════════════════
    // SLIDE 1: Vision & Hook — Agentic Commerce
    // ═══════════════════════════════════════════════════════════
    <VisionHookSlide key="vision" />,

    // ═══════════════════════════════════════════════════════════
    // SLIDE 2: Pain Points — Fragmented & Expensive
    // ═══════════════════════════════════════════════════════════
    <PainPointSlide key="pain" />,

    // ═══════════════════════════════════════════════════════════
    // SLIDE 3: Core Infrastructure — MCP + X402 + Multi-Nation
    // ═══════════════════════════════════════════════════════════
    <SolutionSlide key="solution" />,

    // ═══════════════════════════════════════════════════════════
    // SLIDE 4: Tech Engine I — MCP AI Integration
    // ═══════════════════════════════════════════════════════════
    <MCPIntegrationSlide key="mcp" />,

    // ═══════════════════════════════════════════════════════════
    // SLIDE 5: Tech Engine II — X402 Payment Protocol
    // ═══════════════════════════════════════════════════════════
    <X402PaymentSlide key="x402" />,

    // ═══════════════════════════════════════════════════════════
    // SLIDE 6: Global Routes & Regional Compliance
    // ═══════════════════════════════════════════════════════════
    <GlobalRoutesSlide key="routes" />,

    // ═══════════════════════════════════════════════════════════
    // SLIDE 7: Operational Flow — Order to Last Mile
    // ═══════════════════════════════════════════════════════════
    <OperationalFlowSlide key="flow" />,

    // ═══════════════════════════════════════════════════════════
    // SLIDE 8: Business Blueprint — Self-Operated → Platform
    // ═══════════════════════════════════════════════════════════
    <GrowthStrategySlide key="growth" />,

    // ═══════════════════════════════════════════════════════════
    // SLIDE 9: Competitive Edge — Bento Grid
    // ═══════════════════════════════════════════════════════════
    <CompetitiveEdgeSlide key="edge" />,

    // ═══════════════════════════════════════════════════════════
    // SLIDE 10: Call to Action — Launch the Agent
    // ═══════════════════════════════════════════════════════════
    <CTASlide key="cta" />,
  ];

  return (
    <DeckLocaleProvider availableLocales={DECK_LOCALES} localeLabels={DECK_LOCALE_LABELS}>
      <DeckProvider
        totalSlides={slides.length}
        initialTransition={transition}
        maxPreviewSlides={3}
        isAuthenticated={true}
      >
        <SlideRenderer slides={slides} slideTitles={slideTitles} />
      </DeckProvider>
    </DeckLocaleProvider>
  );
}
