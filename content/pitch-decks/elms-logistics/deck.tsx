"use client";

import React from "react";
import {
  DeckProvider,
  SlideRenderer,
  ContentSlide,
  SplitLayout,
  Slide,
  FadeIn,
  SlideIn,
  ZoomIn,
  StaggerList,
  TypeWriter,
  StatCard,
  Timeline,
  ComparisonTable,
  FeatureGrid,
  Highlight,
  CountUp,
} from "@/components/pitch-deck";
import type { TransitionType } from "@/components/pitch-deck";
import { FragmentedLogisticsSlide } from "./FragmentedLogisticsSlide";
import { AILogisticsLabSlide } from "./AILogisticsLabSlide";
import { ShipmentTrackingSlide } from "./ShipmentTrackingSlide";
import { FinancialTransparencySlide } from "./FinancialTransparencySlide";
import { ELMSTitleSlide } from "./ELMSTitleSlide";
import { SolutionHubSlide } from "./SolutionHubSlide";

interface ElmsLogisticsDeckProps {
  isAuthenticated?: boolean;
  transition?: TransitionType;
}

export function ElmsLogisticsDeck({
  isAuthenticated = false,
  transition = "slide",
}: ElmsLogisticsDeckProps) {
  const slides = [
    // ═══════════════════════════════════════════════════════════
    // SLIDE 1: Title / Cover
    // ═══════════════════════════════════════════════════════════
    <Slide key="cover" background="dark">
      <ELMSTitleSlide />
    </Slide>,

    // ═══════════════════════════════════════════════════════════
    // SLIDE 2: The Problem — Fragmented Silos
    // ═══════════════════════════════════════════════════════════
    <FragmentedLogisticsSlide key="problem" />,

    // ═══════════════════════════════════════════════════════════
    // SLIDE 3: Our Solution — Interactive Solution Hub
    // ═══════════════════════════════════════════════════════════
    <Slide key="solution" background="dark">
      <SolutionHubSlide />
    </Slide>,

    // ═══════════════════════════════════════════════════════════
    // SLIDE 4: Key Differentiators
    // ═══════════════════════════════════════════════════════════
    <ContentSlide key="features" title="Key Differentiators" background="gradient-dark">
      <FeatureGrid
        columns={3}
        features={[
          {
            icon: "🔗",
            title: "Seamless Data Sync",
            description: "Eliminate barriers between systems. One source of truth for all logistics data across the entire chain.",
          },
          {
            icon: "🏷️",
            title: "Auto Label Generation",
            description: "Generate accurate last-mile delivery labels automatically from synced shipping data.",
          },
          {
            icon: "🛃",
            title: "Customs Compliance",
            description: "Trustworthy, validated data ensures smooth customs clearance with zero manual errors.",
          },
          {
            icon: "🌱",
            title: "Carbon Management",
            description: "Integrated carbon emission tracking meeting EU environmental standards and regulations.",
          },
          {
            icon: "📡",
            title: "IoT Integration",
            description: "Real-time data from IoT devices for temperature, location, and condition monitoring.",
          },
          {
            icon: "🤖",
            title: "AI-Powered (Hugging AI)",
            description: "AI engine for predictive analytics, route optimization, and automated decision-making.",
          },
        ]}
      />
    </ContentSlide>,

    // ═══════════════════════════════════════════════════════════
    // SLIDE 5: AI Logistics Lab × MCP
    // ═══════════════════════════════════════════════════════════
    <AILogisticsLabSlide key="ai-mcp" />,

    // ═══════════════════════════════════════════════════════════
    // SLIDE 6: Shipment Route Tracking Dashboard
    // ═══════════════════════════════════════════════════════════
    <ShipmentTrackingSlide key="tracking" />,

    // ═══════════════════════════════════════════════════════════
    // SLIDE 7: Competitive Advantage
    // ═══════════════════════════════════════════════════════════
    <ContentSlide key="comparison" title="Why ELMS?" subtitle="Compared to traditional logistics software" background="gradient-dark">
      <ComparisonTable
        rows={[
          "System Integration",
          "Customs Automation",
          "Carbon Tracking",
          "IoT Support",
          "AI / MCP Integration",
          "Cost Model",
        ]}
        columns={[
          {
            header: "Traditional",
            items: [
              "❌ Manual sync",
              "❌ Paper-based",
              "❌ Not available",
              "❌ Separate system",
              "❌ None",
              "💰 High license fee",
            ],
          },
          {
            header: "ELMS",
            highlight: true,
            items: [
              "✅ Seamless API sync",
              "✅ Automated & validated",
              "✅ Built-in EU standard",
              "✅ Native integration",
              "✅ MCP-native",
              "✅ Pay-as-you-go",
            ],
          },
        ]}
      />
    </ContentSlide>,

    // ═══════════════════════════════════════════════════════════
    // SLIDE 8: Financial Transparency
    // ═══════════════════════════════════════════════════════════
    <FinancialTransparencySlide key="financials" />,

    // ═══════════════════════════════════════════════════════════
    // SLIDE 9: Roadmap
    // ═══════════════════════════════════════════════════════════
    <SplitLayout key="roadmap" background="gradient-blue" ratio="40/60">
      <SplitLayout.Left>
        <FadeIn>
          <h2 className="text-4xl font-bold mb-4">Roadmap</h2>
          <p className="text-white/60 text-sm">
            Phased approach separating the core Shipping Platform from Strategic Modules for long-term scalability.
          </p>
        </FadeIn>
      </SplitLayout.Left>
      <SplitLayout.Right>
        <Timeline
          items={[
            {
              date: "Q1 2026",
              title: "Core Shipping Platform",
              description: "Label generation, system integration, data sync",
              status: "current",
            },
            {
              date: "Q2 2026",
              title: "Customs & Compliance Module",
              description: "Automated customs declarations, GDPR compliance",
              status: "upcoming",
            },
            {
              date: "Q3 2026",
              title: "WMS & Carbon Tracking",
              description: "Warehouse management, EU carbon emission standards",
              status: "upcoming",
            },
            {
              date: "Q4 2026",
              title: "AI & MCP Integration",
              description: "Conversational shipping, predictive analytics",
              status: "upcoming",
            },
            {
              date: "2027",
              title: "IoT & Enterprise Scale",
              description: "IoT device network, enterprise API, multi-tenant",
              status: "upcoming",
            },
          ]}
        />
      </SplitLayout.Right>
    </SplitLayout>,

    // ═══════════════════════════════════════════════════════════
    // SLIDE 10: Security & Compliance
    // ═══════════════════════════════════════════════════════════
    <ContentSlide key="compliance" title="Security & Compliance" background="gradient-dark">
      <FeatureGrid
        columns={2}
        features={[
          {
            icon: "🔐",
            title: "GDPR Compliant",
            description: "Full compliance with EU data protection regulations. Data residency within EU boundaries.",
          },
          {
            icon: "📜",
            title: "Legal Framework",
            description: "Formal contractual agreements for all shareholders with clear IP and liability terms.",
          },
          {
            icon: "🛡️",
            title: "Enterprise Security",
            description: "End-to-end encryption, role-based access control, audit logging for all operations.",
          },
          {
            icon: "🌱",
            title: "EU Environmental Standards",
            description: "Carbon emission tracking aligned with European environmental organization requirements.",
          },
        ]}
      />
    </ContentSlide>,

    // ═══════════════════════════════════════════════════════════
    // SLIDE 11: Call to Action
    // ═══════════════════════════════════════════════════════════
    <Slide key="cta" background="gradient-blue" padding="lg">
      <div className="text-center max-w-3xl mx-auto">
        <FadeIn>
          <h2 className="text-5xl lg:text-6xl font-bold mb-6">
            Let&apos;s Build the Future of
            <br />
            <span className="text-blue-300">European Logistics</span>
          </h2>
        </FadeIn>
        <FadeIn delay={300}>
          <p className="text-xl text-white/70 mb-8 leading-relaxed">
            Not just software — the <strong>infrastructure layer</strong> for
            AI-driven global trade. Plug &amp; Play Logistics for the AI Era.
          </p>
        </FadeIn>
        <FadeIn delay={600}>
          <div className="flex items-center justify-center gap-6 text-sm text-white/50">
            <span>📧 Contact: info@motaiot.com</span>
            <span>|</span>
            <span>🌐 motaiot.com</span>
          </div>
        </FadeIn>
      </div>
    </Slide>,
  ];

  return (
    <DeckProvider
      totalSlides={slides.length}
      initialTransition={transition}
      maxPreviewSlides={3}
      isAuthenticated={isAuthenticated}
    >
      <SlideRenderer slides={slides} />
    </DeckProvider>
  );
}
