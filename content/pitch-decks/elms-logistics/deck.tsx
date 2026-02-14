"use client";

import React from "react";
import {
  DeckProvider,
  SlideRenderer,
  TitleSlide,
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
    <TitleSlide
      key="cover"
      title="ELMS"
      subtitle="European Logistics Management System — AI-Powered Infrastructure for Cross-Border Commerce"
      background="gradient-blue"
      date="February 2026"
      author="MOTA TechLink"
    >
      <div className="flex items-center gap-3 justify-center mt-4">
        <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-medium">🇪🇺 EU Compliant</span>
        <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-medium">🤖 AI-Native</span>
        <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-medium">🔗 MCP Ready</span>
      </div>
    </TitleSlide>,

    // ═══════════════════════════════════════════════════════════
    // SLIDE 2: The Problem
    // ═══════════════════════════════════════════════════════════
    <ContentSlide key="problem" title="The Problem" background="gradient-dark">
      <StaggerList staggerDelay={200} className="space-y-4 text-lg">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🔀</span>
          <span>Fragmented systems create <strong>data silos</strong> between shipping, customs, and delivery platforms</span>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-2xl">📋</span>
          <span>Manual data re-entry across systems leads to <strong>errors and delays</strong> in last-mile delivery labels</span>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-2xl">🛃</span>
          <span>Customs clearance requires <strong>trustworthy, accurate data</strong> — but current workflows can&apos;t guarantee it</span>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-2xl">🌍</span>
          <span>EU carbon emission regulations demand <strong>integrated tracking</strong> that legacy systems don&apos;t provide</span>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-2xl">⏳</span>
          <span>Every manual step is a <strong>cost multiplier</strong> — time, labor, and error correction</span>
        </div>
      </StaggerList>
    </ContentSlide>,

    // ═══════════════════════════════════════════════════════════
    // SLIDE 3: Our Solution
    // ═══════════════════════════════════════════════════════════
    <SplitLayout key="solution" background="gradient-blue" ratio="50/50">
      <SplitLayout.Left>
        <FadeIn delay={0}>
          <h2 className="text-4xl font-bold mb-6">Our Solution</h2>
        </FadeIn>
        <FadeIn delay={200}>
          <p className="text-lg text-white/80 leading-relaxed mb-6">
            ELMS eliminates the barriers between fragmented logistics systems.
            One platform that seamlessly syncs information across the entire supply chain.
          </p>
        </FadeIn>
        <StaggerList staggerDelay={150} initialDelay={400} className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-green-400">✓</span>
            <span>Seamless integration with external shipping systems</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-green-400">✓</span>
            <span>Automated last-mile delivery label generation</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-green-400">✓</span>
            <span>Accurate data for customs clearance</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-green-400">✓</span>
            <span>Carbon emission tracking & EU compliance</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-green-400">✓</span>
            <span>IoT device integration for runtime data</span>
          </div>
        </StaggerList>
      </SplitLayout.Left>
      <SplitLayout.Right>
        <ZoomIn delay={300}>
          <div className="w-full max-w-sm aspect-square rounded-3xl bg-white/5 border border-white/10 p-8 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🏗️</div>
              <div className="text-sm text-white/60">System Architecture</div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                <div className="p-2 rounded bg-blue-500/20 text-blue-300">Shipping</div>
                <div className="p-2 rounded bg-green-500/20 text-green-300">Customs</div>
                <div className="p-2 rounded bg-purple-500/20 text-purple-300">Delivery</div>
                <div className="p-2 rounded bg-orange-500/20 text-orange-300">IoT</div>
                <div className="p-2 rounded bg-cyan-500/20 text-cyan-300">AI/MCP</div>
                <div className="p-2 rounded bg-pink-500/20 text-pink-300">Carbon</div>
              </div>
            </div>
          </div>
        </ZoomIn>
      </SplitLayout.Right>
    </SplitLayout>,

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
    // SLIDE 5: AI + MCP Vision
    // ═══════════════════════════════════════════════════════════
    <Slide key="ai-mcp" background="gradient-purple" padding="lg">
      <div className="w-full max-w-5xl mx-auto">
        <FadeIn>
          <h2 className="text-4xl lg:text-5xl font-bold mb-2 text-center">
            The Future: <Highlight color="purple-300">Conversational Shipping</Highlight>
          </h2>
          <p className="text-center text-white/60 text-lg mb-10">
            ELMS + AI via Model Context Protocol (MCP)
          </p>
        </FadeIn>

        {/* Flow diagram */}
        <div className="flex items-center justify-center gap-4 lg:gap-6 flex-wrap">
          <SlideIn direction="left" delay={300}>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center min-w-48">
              <div className="text-3xl mb-2">💬</div>
              <div className="text-sm font-semibold">AI Assistant</div>
              <div className="text-xs text-white/50 mt-1">&quot;Ship 50 units to Dublin&quot;</div>
            </div>
          </SlideIn>

          <FadeIn delay={500}>
            <div className="text-2xl text-white/40">→</div>
          </FadeIn>

          <ZoomIn delay={600}>
            <div className="p-6 rounded-2xl bg-blue-600/20 border-2 border-blue-500/40 text-center min-w-48">
              <div className="text-3xl mb-2">⚡</div>
              <div className="text-sm font-bold text-blue-300">ELMS MCP Server</div>
              <div className="text-xs text-white/50 mt-1">Parse → Validate → Execute</div>
            </div>
          </ZoomIn>

          <FadeIn delay={800}>
            <div className="text-2xl text-white/40">→</div>
          </FadeIn>

          <SlideIn direction="right" delay={900}>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center min-w-48">
              <div className="text-3xl mb-2">📦</div>
              <div className="text-sm font-semibold">Auto Execution</div>
              <div className="text-xs text-white/50 mt-1">Label + Customs + Pickup</div>
            </div>
          </SlideIn>
        </div>

        <FadeIn delay={1100}>
          <div className="mt-10 grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="text-center p-3 rounded-lg bg-white/5">
              <div className="text-xs text-white/50">Compatible</div>
              <div className="text-sm font-semibold mt-1">Claude · GPT · Gemini</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-white/5">
              <div className="text-xs text-white/50">Interaction</div>
              <div className="text-sm font-semibold mt-1">Zero-UI Required</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-white/5">
              <div className="text-xs text-white/50">Revenue</div>
              <div className="text-sm font-semibold mt-1">Pay-per-API-Call</div>
            </div>
          </div>
        </FadeIn>
      </div>
    </Slide>,

    // ═══════════════════════════════════════════════════════════
    // SLIDE 6: Competitive Advantage
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
    // SLIDE 7: Financial Overview
    // ═══════════════════════════════════════════════════════════
    <ContentSlide key="financials" title="Investment Overview" background="gradient-dark">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          value="€26,000"
          label="Architecture Development"
          icon="🏗️"
          delay={0}
        />
        <StatCard
          value="€3,500"
          label="Monthly Support"
          icon="🔧"
          delay={150}
        />
        <StatCard
          value="€3,000"
          label="Module Development"
          icon="🧩"
          delay={300}
        />
        <StatCard
          value="~€100K"
          label="Year 1 Total Investment"
          icon="💶"
          delay={450}
        />
      </div>
      <FadeIn delay={600}>
        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <h3 className="font-semibold mb-3 text-lg">Cost Advantage</h3>
          <div className="space-y-2 text-sm text-white/80">
            <p>• Founder&apos;s technical shareholding <strong>significantly reduces upfront capital risk</strong></p>
            <p>• Decades of engineering expertise ensures <strong>cost-effective delivery</strong></p>
            <p>• Pay-as-you-go strategy — <strong>zero waste, every euro accountable</strong></p>
            <p>• Clear separation of <strong>Maintenance vs Strategic Development</strong> costs</p>
          </div>
        </div>
      </FadeIn>
    </ContentSlide>,

    // ═══════════════════════════════════════════════════════════
    // SLIDE 8: Roadmap
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
    // SLIDE 9: Security & Compliance
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
    // SLIDE 10: Call to Action
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
