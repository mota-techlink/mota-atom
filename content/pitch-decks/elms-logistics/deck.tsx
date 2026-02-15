"use client";

import React from "react";
import {
  DeckProvider,
  SlideRenderer,
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

interface ElmsLogisticsDeckProps {
  isAuthenticated?: boolean;
  transition?: TransitionType;
}

export function ElmsLogisticsDeck({
  isAuthenticated = true,
  transition = "slide",
}: ElmsLogisticsDeckProps) {
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
    // SLIDE 7: Financial Transparency
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

  const slideTitles = [
    "ELMS",                          // 1  Title / Cover
    "The Problem",                   // 2  Fragmented Silos
    "Architecture",                  // 3  Solution + Tech Edge
    "Competitive Advantage",         // 4  Versus
    "AI × MCP",                      // 5  AI Lab
    "Shipment Tracking",             // 6  Dashboard
    "Financial Efficiency",          // 7  Financial
    "Roadmap",                       // 8  Evolution Map
    "Security & Compliance",         // 9  Trust
    "Call to Action",                // 10 CTA
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
