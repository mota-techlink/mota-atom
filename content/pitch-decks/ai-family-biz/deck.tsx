"use client";

import React from "react";
import {
  DeckProvider,
  SlideRenderer,
  DeckLocaleProvider,
} from "@/components/pitch-deck";
import type { TransitionType } from "@/components/pitch-deck";
import { TitleVisionSlide } from "./TitleVisionSlide";
import { StrategySlide } from "./StrategySlide";
import { Phase1OverviewSlide } from "./Phase1OverviewSlide";
import { TopologySlide } from "./TopologySlide";
import { ExecutiveDashboardSlide } from "./ExecutiveDashboardSlide";
import { AgentMatrixSlide } from "./AgentMatrixSlide";
import { InfraSlide } from "./InfraSlide";
import { Phase2Slide } from "./Phase2Slide";
import { CTASlide } from "./CTASlide";
import { useContent } from "./useContent";

/** Locales: Japanese first → becomes default when URL locale doesn't match */
const DECK_LOCALES = ["ja", "en", "zh"];
const DECK_LOCALE_LABELS: Record<string, string> = {
  ja: "日本語",
  en: "EN",
  zh: "中文",
};

interface AIFamilyBizDeckProps {
  isAuthenticated?: boolean;
  transition?: TransitionType;
}

export function AIFamilyBizDeck({
  isAuthenticated = false,
  transition = "slide",
}: AIFamilyBizDeckProps) {
  const content = useContent();
  const slideTitles = content.slideTitles;

  const slides = [
    // ═══ SLIDE 1: Title / Vision ═══
    <TitleVisionSlide key="title" />,

    // ═══ SLIDE 2: Three Strategic Pillars (Triangle) ═══
    <StrategySlide key="strategy" />,

    // ═══ SLIDE 3: Phase 1 Overview (2×2 Grid) ═══
    <Phase1OverviewSlide key="phase1" />,

    // ═══ SLIDE 4: Business Data Flow Topology (NEW) ═══
    <TopologySlide key="topology" />,

    // ═══ SLIDE 5: Executive Command Dashboard (NEW) ═══
    <ExecutiveDashboardSlide key="dashboard" />,

    // ═══ SLIDE 6: AI Agent Matrix (Dept × Expert) ═══
    <AgentMatrixSlide key="matrix" />,

    // ═══ SLIDE 7: Growth Architecture (3 Stages) ═══
    <InfraSlide key="infra" />,

    // ═══ SLIDE 8: Phase 2 — Word Cloud + Tech Stack + ESB ═══
    <Phase2Slide key="phase2" />,

    // ═══ SLIDE 9: Call to Action ═══
    <CTASlide key="cta" />,
  ];

  return (
    <DeckLocaleProvider
      availableLocales={DECK_LOCALES}
      localeLabels={DECK_LOCALE_LABELS}
    >
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
