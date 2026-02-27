"use client";

import React from "react";
import {
  DeckProvider,
  SlideRenderer,
  DeckLocaleProvider,
} from "@/components/pitch-deck";
import type { TransitionType } from "@/components/pitch-deck";
import { FragmentedLogisticsSlide } from "./FragmentedLogisticsSlide";
import { AILogisticsLabSlide } from "./AILogisticsLabSlide";
import { ShipmentTrackingSlide } from "./ShipmentTrackingSlide";
import { FinancialTransparencySlide } from "./FinancialTransparencySlide";
import { ELMSTitleSlide } from "./ELMSTitleSlide";
import { SolutionHubSlide } from "./SolutionHubSlide";
import { VersusComparisonSlide } from "./VersusComparisonSlide";
import { SecurityComplianceSlide } from "./SecurityComplianceSlide";
import { RoadmapEvolutionSlide } from "./RoadmapEvolutionSlide";
import { CTASlide } from "./CTASlide";
import { useContent } from "./useContent";

/** Locales supported by this deck */
const DECK_LOCALES = ["en", "zh", "ja", "ar"];
const DECK_LOCALE_LABELS: Record<string, string> = { en: "EN", zh: "中文", ja: "日本語", ar: "عربي" };

interface ElmsLogisticsDeckProps {
  isAuthenticated?: boolean;
  transition?: TransitionType;
}

function ElmsLogisticsDeckInner({
  isAuthenticated = true,
  transition = "slide",
}: ElmsLogisticsDeckProps) {
  const content = useContent();
  const slideTitles = content.slideTitles;

  const slides = [
    // ═══════════════════════════════════════════════════════════
    // SLIDE 1: Title / Cover
    // ═══════════════════════════════════════════════════════════
    <ELMSTitleSlide key="cover" />,

    // ═══════════════════════════════════════════════════════════
    // SLIDE 2: The Problem — Fragmented Silos
    // ═══════════════════════════════════════════════════════════
    <FragmentedLogisticsSlide key="problem" />,

    // ═══════════════════════════════════════════════════════════
    // SLIDE 3: Our Solution + Technical Edge — Dual-Ring Architecture
    // ═══════════════════════════════════════════════════════════
    <SolutionHubSlide key="solution" />,

    // ═══════════════════════════════════════════════════════════
    // SLIDE 4: Competitive Advantage — Versus Layout
    // ═══════════════════════════════════════════════════════════
    <VersusComparisonSlide key="comparison" />,

    // ═══════════════════════════════════════════════════════════
    // SLIDE 5: AI Logistics Lab × MCP
    // ═══════════════════════════════════════════════════════════
    <AILogisticsLabSlide key="ai-mcp" />,

    // ═══════════════════════════════════════════════════════════
    // SLIDE 6: Shipment Route Tracking Dashboard
    // ═══════════════════════════════════════════════════════════
    <ShipmentTrackingSlide key="tracking" />,

    // ═══════════════════════════════════════════════════════════
    // SLIDE 7: Investment Opportunity & Capital Efficiency
    // ═══════════════════════════════════════════════════════════
    <FinancialTransparencySlide key="financials" />,

    // ═══════════════════════════════════════════════════════════
    // SLIDE 8: Roadmap — Multi-Layer Evolution Map
    // ═══════════════════════════════════════════════════════════
    <RoadmapEvolutionSlide key="roadmap" />,

    // ═══════════════════════════════════════════════════════════
    // SLIDE 9: Security & Compliance — High-Trust Dashboard
    // ═══════════════════════════════════════════════════════════
    <SecurityComplianceSlide key="compliance" />,

    // ═══════════════════════════════════════════════════════════
    // SLIDE 10: Call to Action — Cinematic Paradigm Shift
    // ═══════════════════════════════════════════════════════════
    <CTASlide key="cta" />,
  ];

  return (
    <DeckProvider
      totalSlides={slides.length}
      initialTransition={transition}
      maxPreviewSlides={6}
      isAuthenticated={isAuthenticated}
    >
      <SlideRenderer slides={slides} slideTitles={slideTitles} />
    </DeckProvider>
  );
}

export function ElmsLogisticsDeck(props: ElmsLogisticsDeckProps) {
  return (
    <DeckLocaleProvider availableLocales={DECK_LOCALES} localeLabels={DECK_LOCALE_LABELS}>
      <ElmsLogisticsDeckInner {...props} />
    </DeckLocaleProvider>
  );
}
