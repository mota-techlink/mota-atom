"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Package,
  Server,
  Globe,
  Cpu,
  BrainCircuit,
  Radio,
  Wifi,
  ShieldCheck,
  FileCheck,
  Leaf,
  Truck,
  Zap,
  BarChart3,
  RefreshCw,
  Activity,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Layers,
  Sparkles,
  CheckCircle2,
  Clock,
  CircleDot,
} from "lucide-react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useSpring,
  animate,
} from "framer-motion";
import {
  MobileDetailModal,
  MobileExpandButton,
} from "./MobileDetailModal";

// ═══════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════

interface Milestone {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  icon: React.ElementType;
  status: "complete" | "current" | "upcoming" | "future";
}

interface TimeColumn {
  id: string;
  label: string;
  sublabel: string;
  isCurrent: boolean;
}

interface TrackDef {
  id: string;
  label: string;
  shortLabel: string;
  color: string;
  accentRgb: string;
  icon: React.ElementType;
  milestones: Record<string, Milestone>; // keyed by column id
}

interface CrossLink {
  from: { track: number; col: string };
  to: { track: number; col: string };
  label?: string;
}

// ═══════════════════════════════════════════════════════════════
// Data — Time Columns
// ═══════════════════════════════════════════════════════════════

const timeColumns: TimeColumn[] = [
  { id: "q1q2-2026", label: "Q1–Q2 2026", sublabel: "Foundation", isCurrent: true },
  { id: "q3q4-2026", label: "Q3–Q4 2026", sublabel: "Scale", isCurrent: false },
  { id: "2027-early", label: "Early 2027", sublabel: "Integrate", isCurrent: false },
  { id: "2027-plus", label: "2027+ & Beyond", sublabel: "Dominate", isCurrent: false },
];

// ═══════════════════════════════════════════════════════════════
// Data — 3 Tracks
// ═══════════════════════════════════════════════════════════════

const tracks: TrackDef[] = [
  {
    id: "ops",
    label: "Infrastructure & Operations",
    shortLabel: "Ops & Infra",
    color: "text-cyan-400",
    accentRgb: "34,211,238",
    icon: Server,
    milestones: {
      "q1q2-2026": {
        id: "ops-q1q2",
        title: "Core Shipping Engine",
        description: "Seamless label generation & Multi-carrier API. Single data-source for all logistics partners.",
        techStack: ["Next.js 15", "Supabase", "Multi-carrier API", "Edge Functions"],
        icon: Package,
        status: "current",
      },
      "q3q4-2026": {
        id: "ops-q3q4",
        title: "Edge-Native Scaling",
        description: "Sub-100ms response for peak seasons. Cloudflare Workers at 300+ global PoPs.",
        techStack: ["Cloudflare Workers", "Edge Cache", "WebSocket Streams", "Redis Cluster"],
        icon: Zap,
        status: "upcoming",
      },
      "2027-early": {
        id: "ops-2027",
        title: "WMS Deep Sync",
        description: "Real-time inventory-to-shipping mesh. Warehouse operations fused with delivery intelligence.",
        techStack: ["GraphQL Federation", "Event Sourcing", "CQRS", "gRPC"],
        icon: Layers,
        status: "upcoming",
      },
      "2027-plus": {
        id: "ops-future",
        title: "Global Expansion",
        description: "Multi-tenant infrastructure for global partners. White-label ready for enterprise clients.",
        techStack: ["Multi-tenant Arch", "Kubernetes", "Global CDN", "ISO 27001"],
        icon: Globe,
        status: "future",
      },
    },
  },
  {
    id: "ai",
    label: "Intelligence & Innovation",
    shortLabel: "AI & Intelligence",
    color: "text-violet-400",
    accentRgb: "167,139,250",
    icon: BrainCircuit,
    milestones: {
      "q1q2-2026": {
        id: "ai-q1q2",
        title: "AI Address Parsing",
        description: "Automated multi-lingual address correction. 99.7% accuracy across EU address formats.",
        techStack: ["Hugging Face", "NLP Pipeline", "Vector DB", "LangChain"],
        icon: Cpu,
        status: "current",
      },
      "q3q4-2026": {
        id: "ai-q3q4",
        title: "MCP Protocol V1",
        description: "First AI-Agentic shipping interface. Conversational logistics operations via Claude/GPT.",
        techStack: ["MCP Server", "Tool Registry", "Claude 4", "Streaming SSE"],
        icon: BrainCircuit,
        status: "upcoming",
      },
      "2027-early": {
        id: "ai-2027",
        title: "IoT Node Network",
        description: "Live sensor data for cold-chain & high-value freight. Real-time condition monitoring.",
        techStack: ["MQTT Bridge", "Time-series DB", "Sensor Fusion", "Digital Twin"],
        icon: Radio,
        status: "upcoming",
      },
      "2027-plus": {
        id: "ai-future",
        title: "Autonomous Logistics",
        description: "Self-optimizing route & cost AI. Predictive demand planning with zero human intervention.",
        techStack: ["Reinforcement Learning", "Neural Route Opt", "Demand Forecasting", "Auto-scaling"],
        icon: Sparkles,
        status: "future",
      },
    },
  },
  {
    id: "compliance",
    label: "Compliance & Green Tech",
    shortLabel: "Compliance & ESG",
    color: "text-emerald-400",
    accentRgb: "52,211,153",
    icon: ShieldCheck,
    milestones: {
      "q1q2-2026": {
        id: "comp-q1q2",
        title: "GDPR & Privacy",
        description: "Ireland-based data residency lockdown. Full Irish DPA 2018 & EU GDPR compliance.",
        techStack: ["Supabase Auth", "RLS Policies", "eu-west-1", "DPA Framework"],
        icon: ShieldCheck,
        status: "current",
      },
      "q3q4-2026": {
        id: "comp-q3q4",
        title: "Carbon ISO 14067",
        description: "Real-time scope-3 emission tracking. Per-shipment carbon footprint calculation.",
        techStack: ["ISO 14067 Engine", "Scope-3 Calc", "ESG Dashboard", "EU Taxonomy"],
        icon: Leaf,
        status: "upcoming",
      },
      "2027-early": {
        id: "comp-2027",
        title: "Customs Autopilot",
        description: "100% paperless AI-validated declarations. Zero manual customs friction across EU borders.",
        techStack: ["AI Document Gen", "HS Code ML", "AEO Integration", "ATLAS Connect"],
        icon: FileCheck,
        status: "upcoming",
      },
      "2027-plus": {
        id: "comp-future",
        title: "Green Standards Leader",
        description: "Setting the benchmark for EU logistics sustainability. Carbon-neutral operations certified.",
        techStack: ["Carbon Neutral Cert", "EU Green Deal", "Circular Economy", "Net-Zero Ops"],
        icon: Leaf,
        status: "future",
      },
    },
  },
];

// ═══════════════════════════════════════════════════════════════
// Data — Cross-track connections (curved glow lines)
// ═══════════════════════════════════════════════════════════════

const crossLinks: CrossLink[] = [
  { from: { track: 1, col: "q3q4-2026" }, to: { track: 2, col: "q3q4-2026" }, label: "AI → Carbon" },
  { from: { track: 1, col: "2027-early" }, to: { track: 0, col: "2027-early" }, label: "IoT → WMS" },
  { from: { track: 0, col: "q3q4-2026" }, to: { track: 2, col: "2027-early" }, label: "Edge → Customs" },
  { from: { track: 1, col: "2027-plus" }, to: { track: 2, col: "2027-plus" }, label: "Auto → Green" },
];

// ═══════════════════════════════════════════════════════════════
// Sub-components
// ═══════════════════════════════════════════════════════════════

// ── 3D Grid Floor Background ─────────────────────────────────
function GridFloorBackground() {
  return (
    <>
      {/* Deep navy base */}
      <div className="absolute inset-0 bg-linear-to-b from-[#030712] via-[#050d1a] to-[#0a1628]" />

      {/* 3D perspective grid floor */}
      <div className="absolute inset-0 overflow-hidden" style={{ perspective: "600px" }}>
        <div
          className="absolute left-0 right-0 bottom-0 h-[60%] opacity-15"
          style={{
            transformStyle: "preserve-3d",
            transform: "rotateX(55deg) translateZ(0)",
            transformOrigin: "center bottom",
          }}
        >
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="roadmapGrid"
                width="60"
                height="60"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 60 0 L 0 0 0 60"
                  fill="none"
                  stroke="rgba(56,189,248,0.3)"
                  strokeWidth="0.5"
                />
              </pattern>
              <linearGradient id="gridFade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="white" stopOpacity="0" />
                <stop offset="30%" stopColor="white" stopOpacity="1" />
                <stop offset="100%" stopColor="white" stopOpacity="1" />
              </linearGradient>
              <mask id="gridMask">
                <rect width="100%" height="100%" fill="url(#gridFade)" />
              </mask>
            </defs>
            <rect width="100%" height="100%" fill="url(#roadmapGrid)" mask="url(#gridMask)" />
          </svg>
        </div>
      </div>

      {/* Ambient glow */}
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-cyan-500/4 rounded-full blur-[120px]" />
      <div className="absolute top-1/3 right-1/5 w-72 h-72 bg-violet-500/4 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-emerald-500/3 rounded-full blur-[100px]" />

      {/* Fiber optic line (horizontal glow) */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(56,189,248,0.08) 20%, rgba(167,139,250,0.06) 50%, rgba(52,211,153,0.04) 80%, transparent)",
        }}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Data pulse traveling along the fiber */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 w-24 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(56,189,248,0.4), transparent)",
        }}
        animate={{ left: ["-96px", "calc(100% + 96px)"] }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      />
    </>
  );
}

// ── Tech Health Badge ────────────────────────────────────────
function TechHealthBadge() {
  return (
    <motion.div
      className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.8 }}
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
      </span>
      <span className="text-[9px] lg:text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest">
        Tech Health: Optimum
      </span>
    </motion.div>
  );
}

// ── Progress Line (animated along X axis) ────────────────────
function ProgressLine({ progress }: { progress: number }) {
  return (
    <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/5 z-20 rounded-full overflow-hidden">
      <motion.div
        className="h-full rounded-full bg-linear-to-r from-cyan-500 via-violet-500 to-emerald-500"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 2, delay: 0.3, ease: "easeOut" }}
      />
      <motion.div
        className="absolute top-0 h-full w-8 rounded-full"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
          left: `${progress}%`,
          transform: "translateX(-50%)",
        }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </div>
  );
}

// ── Status Indicator ─────────────────────────────────────────
function StatusDot({ status }: { status: Milestone["status"] }) {
  const colors: Record<Milestone["status"], string> = {
    complete: "bg-emerald-400",
    current: "bg-cyan-400",
    upcoming: "bg-violet-400",
    future: "bg-slate-500",
  };
  const labels: Record<Milestone["status"], string> = {
    complete: "Done",
    current: "Active",
    upcoming: "Planned",
    future: "Vision",
  };

  return (
    <div className="flex items-center gap-1.5">
      <span className="relative flex h-2 w-2">
        {(status === "current" || status === "complete") && (
          <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-50 ${colors[status]}`} />
        )}
        <span className={`relative inline-flex h-2 w-2 rounded-full ${colors[status]}`} />
      </span>
      <span className="text-[9px] lg:text-[10px] font-mono text-slate-500 uppercase tracking-wider">
        {labels[status]}
      </span>
    </div>
  );
}

// ── Milestone Node (Pulse Point) ─────────────────────────────
function MilestoneNode({
  milestone,
  track,
  colIndex,
  onHover,
  isHovered,
  onClick,
}: {
  milestone: Milestone;
  track: TrackDef;
  colIndex: number;
  onHover: (id: string | null) => void;
  isHovered: boolean;
  onClick: () => void;
}) {
  const IconComp = milestone.icon;
  const delay = 0.4 + colIndex * 0.2;

  return (
    <motion.div
      className="relative rounded-xl overflow-hidden cursor-pointer group h-full"
      style={{
        background: `linear-gradient(135deg, rgba(${track.accentRgb},0.05) 0%, rgba(15,23,42,0.7) 50%, rgba(${track.accentRgb},0.02) 100%)`,
        backdropFilter: "blur(12px)",
      }}
      initial={{ opacity: 0, y: 16, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay,
        duration: 0.5,
        type: "spring",
        stiffness: 200,
        damping: 20,
      }}
      onMouseEnter={() => onHover(milestone.id)}
      onMouseLeave={() => onHover(null)}
      onClick={onClick}
      whileHover={{
        y: -3,
        transition: { type: "spring", stiffness: 300, damping: 20 },
      }}
    >
      {/* Border */}
      <div
        className="absolute inset-0 rounded-xl pointer-events-none border"
        style={{ borderColor: `rgba(${track.accentRgb},${isHovered ? 0.35 : 0.1})` }}
      />

      {/* Hover glow */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        animate={{
          boxShadow: isHovered
            ? `0 0 20px rgba(${track.accentRgb},0.15), inset 0 0 20px rgba(${track.accentRgb},0.03)`
            : `0 0 0px rgba(${track.accentRgb},0)`,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Scanning line on hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute left-0 right-0 h-8"
              style={{
                background: `linear-gradient(to bottom, transparent, rgba(${track.accentRgb},0.06), transparent)`,
              }}
              animate={{ top: ["-32px", "calc(100% + 32px)"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-20 p-3 lg:p-4 flex flex-col h-full">
        {/* Icon + Status */}
        <div className="flex items-start justify-between mb-2">
          <motion.div
            className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg flex items-center justify-center border"
            style={{
              backgroundColor: `rgba(${track.accentRgb},0.1)`,
              borderColor: `rgba(${track.accentRgb},0.2)`,
            }}
            animate={{
              boxShadow: isHovered
                ? `0 0 12px rgba(${track.accentRgb},0.3)`
                : `0 0 0px rgba(${track.accentRgb},0)`,
            }}
          >
            <IconComp className={`w-4 h-4 lg:w-5 lg:h-5 ${track.color}`} />
          </motion.div>
          <StatusDot status={milestone.status} />
        </div>

        {/* Title */}
        <h4 className={`text-xs lg:text-sm font-bold ${track.color} mb-1 leading-tight`}>
          {milestone.title}
        </h4>

        {/* Description */}
        <p className="text-[10px] lg:text-[11px] text-slate-400 leading-relaxed flex-1 mb-2">
          {milestone.description}
        </p>

        {/* Tech Stack Popup */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="flex flex-wrap gap-1"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.2 }}
            >
              {milestone.techStack.map((tech) => (
                <span
                  key={tech}
                  className="text-[8px] lg:text-[9px] font-mono px-1.5 py-0.5 rounded border"
                  style={{
                    backgroundColor: `rgba(${track.accentRgb},0.06)`,
                    borderColor: `rgba(${track.accentRgb},0.15)`,
                    color: `rgba(${track.accentRgb},0.7)`,
                  }}
                >
                  {tech}
                </span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Non-hovered: abbreviated stack */}
        {!isHovered && (
          <div className="flex flex-wrap gap-1">
            {milestone.techStack.slice(0, 2).map((tech) => (
              <span
                key={tech}
                className="text-[8px] lg:text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/3 text-slate-500"
              >
                {tech}
              </span>
            ))}
            {milestone.techStack.length > 2 && (
              <span className="text-[8px] font-mono text-slate-600">
                +{milestone.techStack.length - 2}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ── Recursive Growth Icon (end of timeline) ──────────────────
function RecursiveGrowthIcon() {
  return (
    <motion.div
      className="hidden md:flex flex-col items-center justify-center gap-2 px-3"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.5 }}
    >
      <motion.div
        className="w-12 h-12 lg:w-14 lg:h-14 rounded-full border border-dashed border-white/20 flex items-center justify-center bg-white/3"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      >
        <RefreshCw className="w-5 h-5 lg:w-6 lg:h-6 text-emerald-400/60" />
      </motion.div>
      <div className="text-center">
        <div className="text-[9px] lg:text-[10px] font-mono font-bold text-white/40 tracking-wider">
          CONTINUOUS
        </div>
        <div className="text-[9px] lg:text-[10px] font-mono font-bold text-emerald-400/60 tracking-wider">
          TECH REFRESH
        </div>
      </div>
      <motion.div
        className="text-[8px] lg:text-[9px] font-mono text-slate-500 text-center max-w-24 leading-tight mt-0.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        &ldquo;By the time our stack ages, competitors are still years behind.&rdquo;
      </motion.div>
    </motion.div>
  );
}

// ── Track Label (left side) ──────────────────────────────────
function TrackLabel({ track, index }: { track: TrackDef; index: number }) {
  const IconComp = track.icon;
  return (
    <motion.div
      className="flex items-center gap-2 lg:gap-2.5 pr-3 lg:pr-4 min-w-28 lg:min-w-36 shrink-0"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 + index * 0.1 }}
    >
      <div
        className="w-7 h-7 lg:w-8 lg:h-8 rounded-lg flex items-center justify-center border shrink-0"
        style={{
          backgroundColor: `rgba(${track.accentRgb},0.1)`,
          borderColor: `rgba(${track.accentRgb},0.2)`,
        }}
      >
        <IconComp className={`w-3.5 h-3.5 lg:w-4 lg:h-4 ${track.color}`} />
      </div>
      <div className="min-w-0">
        <div className={`text-[10px] lg:text-xs font-bold ${track.color} leading-tight truncate`}>
          {track.shortLabel}
        </div>
        <div className="text-[8px] lg:text-[9px] font-mono text-slate-600 truncate hidden lg:block">
          Track {index + 1}
        </div>
      </div>
    </motion.div>
  );
}

// ── SVG Glow Connectors (cross-track) ────────────────────────
function GlowConnectors({
  hoveredMilestone,
}: {
  hoveredMilestone: string | null;
}) {
  // We render curved SVG lines between related nodes
  // Using relative positioning within the grid area
  // These are purely decorative visual connectors

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none z-30 hidden lg:block"
      style={{ overflow: "visible" }}
    >
      <defs>
        <linearGradient id="glowGrad-cv" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(167,139,250,0.3)" />
          <stop offset="100%" stopColor="rgba(52,211,153,0.3)" />
        </linearGradient>
        <linearGradient id="glowGrad-ci" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(167,139,250,0.25)" />
          <stop offset="100%" stopColor="rgba(34,211,238,0.25)" />
        </linearGradient>
        <linearGradient id="glowGrad-oe" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(34,211,238,0.25)" />
          <stop offset="100%" stopColor="rgba(52,211,153,0.25)" />
        </linearGradient>
        <filter id="glowFilter">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Decorative flowing dots along the timeline header area */}
      {[0, 1, 2].map((i) => (
        <motion.circle
          key={i}
          r="1.5"
          fill={i === 0 ? "rgba(34,211,238,0.4)" : i === 1 ? "rgba(167,139,250,0.4)" : "rgba(52,211,153,0.4)"}
          animate={{
            cx: ["10%", "90%"],
            cy: [8 + i * 4, 12 + i * 4],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 5 + i * 2,
            repeat: Infinity,
            delay: i * 1.5,
            ease: "linear",
          }}
        />
      ))}
    </svg>
  );
}

// ── Time Header ──────────────────────────────────────────────
function TimeHeader({ columns }: { columns: TimeColumn[] }) {
  return (
    <div className="flex gap-3 lg:gap-4 mb-3 lg:mb-4">
      {/* Spacer for track labels */}
      <div className="min-w-28 lg:min-w-36 shrink-0" />
      {columns.map((col, i) => (
        <motion.div
          key={col.id}
          className="flex-1 min-w-0"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + i * 0.1 }}
        >
          <div className="flex items-center gap-1.5 mb-0.5">
            {col.isCurrent && (
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
              </span>
            )}
            <span
              className={`text-[11px] lg:text-sm font-bold font-mono tracking-wider ${
                col.isCurrent ? "text-cyan-400" : "text-slate-500"
              }`}
            >
              {col.label}
            </span>
          </div>
          <span className="text-[9px] lg:text-[10px] font-mono text-slate-600 uppercase tracking-widest">
            {col.sublabel}
          </span>
          {/* Column line */}
          <div
            className="h-px mt-1.5"
            style={{
              background: col.isCurrent
                ? "linear-gradient(90deg, rgba(34,211,238,0.3), transparent)"
                : "linear-gradient(90deg, rgba(255,255,255,0.05), transparent)",
            }}
          />
        </motion.div>
      ))}
      {/* Spacer for Recursive Growth icon */}
      <div className="hidden md:block w-18 lg:w-22 shrink-0" />
    </div>
  );
}

// ── Horizontal Scroll Container ──────────────────────────────
function useHorizontalScroll() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    const ro = new ResizeObserver(checkScroll);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      ro.disconnect();
    };
  }, [checkScroll]);

  const scrollBy = useCallback((dir: -1 | 1) => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.6, behavior: "smooth" });
  }, []);

  return { containerRef, canScrollLeft, canScrollRight, scrollBy };
}

// ═══════════════════════════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════════════════════════

export function RoadmapEvolutionSlide() {
  const [hoveredMilestone, setHoveredMilestone] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<{ milestone: Milestone; track: TrackDef; col: TimeColumn } | null>(null);
  const { containerRef, canScrollLeft, canScrollRight, scrollBy } = useHorizontalScroll();

  // Progress: Q1-Q2 2026 is current → 25% through timeline
  const progressPercent = 18;

  return (
    <div className="w-full h-full flex flex-col bg-[#030712] text-white relative overflow-hidden">
      {/* Background */}
      <GridFloorBackground />

      {/* ── Header Area ── */}
      <div className="relative z-10 px-4 md:px-6 lg:px-8 pt-3 md:pt-4 lg:pt-5 shrink-0">
        {/* Top bar - subtitle centered */}
        <motion.div
          className="flex items-center justify-center gap-2 mb-1.5 lg:mb-2"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Activity className="w-3.5 h-3.5 md:w-4 md:h-4 text-cyan-400/60" />
          <span className="text-[9px] md:text-[10px] lg:text-xs font-mono text-cyan-400/70 tracking-[0.2em] uppercase">
            Multi-Layer Evolution Map
          </span>
        </motion.div>

        {/* Title - centered */}
        <motion.h2
          className="text-base md:text-xl lg:text-3xl font-black tracking-tight mb-1 text-center"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <span className="text-white">Product </span>
          <span className="text-cyan-400">Roadmap</span>
        </motion.h2>

        <motion.p
          className="text-[9px] md:text-[10px] lg:text-xs text-slate-500 font-mono mb-3 lg:mb-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          3 parallel tracks · Q1 2026 → 2027+ · Infrastructure × Intelligence × Compliance
        </motion.p>
      </div>

      {/* ── Desktop: Horizontal Scrollable Canvas ── */}
      <div className="relative z-10 hidden md:flex flex-col flex-1 min-h-0 px-4 md:px-6 lg:px-8 pb-3 md:pb-4 lg:pb-5">
        {/* Progress Line */}
        <div className="relative mb-3">
          <ProgressLine progress={progressPercent} />
        </div>

        {/* Time Header */}
        <TimeHeader columns={timeColumns} />

        {/* Scrollable grid area */}
        <div className="relative flex-1 min-h-0">
          {/* Scroll arrows */}
          <AnimatePresence>
            {canScrollLeft && (
              <motion.button
                className="absolute left-0 top-1/2 -translate-y-1/2 z-40 w-6 h-12 flex items-center justify-center rounded-r-lg bg-black/60 border border-white/10 text-white/60 hover:text-white hover:bg-black/80 transition-colors"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => scrollBy(-1)}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </motion.button>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {canScrollRight && (
              <motion.button
                className="absolute right-0 top-1/2 -translate-y-1/2 z-40 w-6 h-12 flex items-center justify-center rounded-l-lg bg-black/60 border border-white/10 text-white/60 hover:text-white hover:bg-black/80 transition-colors"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => scrollBy(1)}
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Cross-track glow connectors */}
          <GlowConnectors hoveredMilestone={hoveredMilestone} />

          {/* Scrollable container */}
          <div
            ref={containerRef}
            className="h-full overflow-x-auto overflow-y-hidden scrollbar-hide"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <div className="min-w-full h-full flex flex-col gap-2.5 lg:gap-3">
              {tracks.map((track, trackIdx) => (
                <div key={track.id} className="flex items-stretch gap-3 lg:gap-4 flex-1 min-h-0">
                  {/* Track Label */}
                  <TrackLabel track={track} index={trackIdx} />

                  {/* Milestones row */}
                  <div className="flex gap-3 lg:gap-4 flex-1 min-w-0">
                    {timeColumns.map((col, colIdx) => {
                      const milestone = track.milestones[col.id];
                      if (!milestone) return <div key={col.id} className="flex-1" />;
                      return (
                        <div key={col.id} className="flex-1 min-w-40 lg:min-w-44">
                          <MilestoneNode
                            milestone={milestone}
                            track={track}
                            colIndex={colIdx}
                            onHover={setHoveredMilestone}
                            isHovered={hoveredMilestone === milestone.id}
                            onClick={() => setSelectedMilestone({ milestone, track, col })}
                          />
                        </div>
                      );
                    })}
                  </div>

                  {/* Recursive growth (only on last track) */}
                  {trackIdx === tracks.length - 1 ? (
                    <RecursiveGrowthIcon />
                  ) : (
                    <div className="hidden md:block w-18 lg:w-22 shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom legend */}
        <motion.div
          className="flex items-center justify-between mt-2 lg:mt-3 shrink-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <div className="flex items-center gap-4 lg:gap-5">
            {(["current", "upcoming", "future"] as const).map((status) => (
              <div key={status} className="flex items-center gap-1">
                <StatusDot status={status} />
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <div className="text-[9px] lg:text-[10px] font-mono text-slate-600 flex items-center gap-1.5">
              <ArrowRight className="w-3 h-3 text-slate-500" />
              <span>Click milestones to see details</span>
            </div>
            <TechHealthBadge />
          </div>
        </motion.div>
      </div>

      {/* ── Mobile: Condensed View ── */}
      <div className="relative z-10 flex md:hidden flex-col flex-1 min-h-0 px-3 pb-2 items-center justify-center gap-2">
        {/* Mini timeline preview */}
        <div className="w-full max-w-xs space-y-1.5">
          {tracks.map((track, i) => {
            const IconComp = track.icon;
            return (
              <motion.div
                key={track.id}
                className="flex items-center gap-2 p-2 rounded-lg border"
                style={{
                  background: `linear-gradient(135deg, rgba(${track.accentRgb},0.05) 0%, rgba(15,23,42,0.5) 100%)`,
                  borderColor: `rgba(${track.accentRgb},0.15)`,
                }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
              >
                <div
                  className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `rgba(${track.accentRgb},0.1)` }}
                >
                  <IconComp className={`w-3 h-3 ${track.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-[9px] font-bold ${track.color} truncate`}>
                    {track.shortLabel}
                  </div>
                  <div className="text-[7px] text-slate-600 font-mono">
                    4 milestones · Q1 2026 → 2027+
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {timeColumns.map((col) => {
                    const m = track.milestones[col.id];
                    const dotColor = m?.status === "current" ? "bg-cyan-400" : m?.status === "upcoming" ? "bg-violet-400/40" : "bg-slate-700";
                    return <div key={col.id} className={`w-1 h-1 rounded-full ${dotColor}`} />;
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Progress bar mini */}
        <div className="w-full max-w-xs">
          <div className="flex items-center gap-2">
            <span className="text-[7px] font-mono text-slate-600 shrink-0">Progress</span>
            <div className="flex-1 h-1 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-linear-to-r from-cyan-500 via-violet-500 to-emerald-500"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ delay: 0.5, duration: 1.5 }}
              />
            </div>
            <span className="text-[7px] font-mono text-cyan-400">{progressPercent}%</span>
          </div>
        </div>

        <MobileExpandButton
          label="Tap to explore roadmap"
          onClick={() => setMobileOpen(true)}
        />
      </div>

      {/* ── Milestone Detail Modal (click to expand) ── */}
      <AnimatePresence>
        {selectedMilestone && (
          <motion.div
            className="fixed inset-0 z-100 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setSelectedMilestone(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Modal content */}
            <motion.div
              className="relative w-full max-w-lg rounded-2xl overflow-hidden border"
              style={{
                background: `linear-gradient(135deg, rgba(${selectedMilestone.track.accentRgb},0.08) 0%, rgba(15,23,42,0.95) 40%, rgba(${selectedMilestone.track.accentRgb},0.04) 100%)`,
                borderColor: `rgba(${selectedMilestone.track.accentRgb},0.25)`,
                boxShadow: `0 0 40px rgba(${selectedMilestone.track.accentRgb},0.15)`,
              }}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              {/* Close button */}
              <button
                className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                onClick={() => setSelectedMilestone(null)}
              >
                ✕
              </button>

              {/* Header */}
              <div className="p-5 pb-0">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-mono text-slate-500 tracking-wider">{selectedMilestone.col.label}</span>
                  <span className="text-[10px] font-mono text-slate-700">·</span>
                  <span className="text-[10px] font-mono text-slate-600 uppercase">{selectedMilestone.col.sublabel}</span>
                </div>
                <div className="flex items-start gap-3 mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center border shrink-0"
                    style={{
                      backgroundColor: `rgba(${selectedMilestone.track.accentRgb},0.12)`,
                      borderColor: `rgba(${selectedMilestone.track.accentRgb},0.25)`,
                    }}
                  >
                    {React.createElement(selectedMilestone.milestone.icon, {
                      className: `w-6 h-6 ${selectedMilestone.track.color}`,
                    })}
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-lg font-bold ${selectedMilestone.track.color} mb-1`}>
                      {selectedMilestone.milestone.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <StatusDot status={selectedMilestone.milestone.status} />
                      <span className="text-[10px] font-mono text-slate-600">
                        {selectedMilestone.track.label}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="px-5 pb-5">
                <p className="text-sm text-slate-300 leading-relaxed mb-4">
                  {selectedMilestone.milestone.description}
                </p>

                {/* Tech stack */}
                <div className="mb-4">
                  <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2">
                    Technology Stack
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedMilestone.milestone.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs font-mono px-2.5 py-1 rounded-lg border"
                        style={{
                          backgroundColor: `rgba(${selectedMilestone.track.accentRgb},0.08)`,
                          borderColor: `rgba(${selectedMilestone.track.accentRgb},0.2)`,
                          color: `rgba(${selectedMilestone.track.accentRgb},0.8)`,
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Status bar */}
                <div
                  className="flex items-center gap-3 p-3 rounded-lg border"
                  style={{
                    backgroundColor: `rgba(${selectedMilestone.track.accentRgb},0.04)`,
                    borderColor: `rgba(${selectedMilestone.track.accentRgb},0.1)`,
                  }}
                >
                  <div className="flex items-center gap-2">
                    {React.createElement(selectedMilestone.track.icon, {
                      className: `w-4 h-4 ${selectedMilestone.track.color}`,
                    })}
                    <span className={`text-xs font-bold ${selectedMilestone.track.color}`}>
                      {selectedMilestone.track.shortLabel}
                    </span>
                  </div>
                  <div className="flex-1" />
                  <span className="text-[10px] font-mono text-slate-500">
                    {selectedMilestone.col.label}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Mobile Detail Modal ── */}
      <MobileDetailModal
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        title="Product Roadmap"
        subtitle="3 tracks · Q1 2026 → 2027+"
      >
        <div className="space-y-5">
          {tracks.map((track) => {
            const TrackIcon = track.icon;
            return (
              <div key={track.id}>
                {/* Track header */}
                <div className="flex items-center gap-2 mb-2.5">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center border"
                    style={{
                      backgroundColor: `rgba(${track.accentRgb},0.1)`,
                      borderColor: `rgba(${track.accentRgb},0.2)`,
                    }}
                  >
                    <TrackIcon className={`w-3.5 h-3.5 ${track.color}`} />
                  </div>
                  <div>
                    <div className={`text-xs font-bold ${track.color}`}>{track.label}</div>
                    <div className="text-[8px] font-mono text-slate-600">Track</div>
                  </div>
                </div>

                {/* Milestones */}
                <div className="space-y-2 pl-2 border-l-2" style={{ borderColor: `rgba(${track.accentRgb},0.15)` }}>
                  {timeColumns.map((col) => {
                    const milestone = track.milestones[col.id];
                    if (!milestone) return null;
                    const MIcon = milestone.icon;
                    return (
                      <div key={col.id} className="pl-3">
                        {/* Time label */}
                        <div className="flex items-center gap-1.5 mb-1">
                          <Clock className="w-2.5 h-2.5 text-slate-600" />
                          <span className="text-[8px] font-mono text-slate-500">{col.label}</span>
                          <StatusDot status={milestone.status} />
                        </div>

                        {/* Milestone content */}
                        <div className="flex items-start gap-2 mb-1">
                          <div
                            className="w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5"
                            style={{ backgroundColor: `rgba(${track.accentRgb},0.08)` }}
                          >
                            <MIcon className={`w-3 h-3 ${track.color}`} />
                          </div>
                          <div>
                            <div className={`text-[10px] font-bold ${track.color}`}>{milestone.title}</div>
                            <p className="text-[9px] text-slate-500 leading-relaxed mt-0.5">{milestone.description}</p>
                          </div>
                        </div>

                        {/* Tech stack */}
                        <div className="flex flex-wrap gap-1 ml-7">
                          {milestone.techStack.map((tech) => (
                            <span
                              key={tech}
                              className="text-[7px] font-mono px-1.5 py-0.5 rounded border"
                              style={{
                                backgroundColor: `rgba(${track.accentRgb},0.05)`,
                                borderColor: `rgba(${track.accentRgb},0.12)`,
                                color: `rgba(${track.accentRgb},0.6)`,
                              }}
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Recursive Growth section in modal */}
          <div className="pt-3 border-t border-white/5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-full border border-dashed border-white/20 flex items-center justify-center bg-white/3">
                <RefreshCw className="w-3.5 h-3.5 text-emerald-400/60" />
              </div>
              <div>
                <div className="text-xs font-bold text-emerald-400">Continuous Tech Refresh</div>
                <div className="text-[8px] font-mono text-slate-600">Recursive Growth Strategy</div>
              </div>
            </div>
            <p className="text-[9px] text-slate-500 leading-relaxed">
              &ldquo;By the time our stack ages, competitors are still years behind.&rdquo;
              Our architecture is designed for perpetual evolution — modular, swappable, future-proof.
            </p>
            <div className="flex items-center gap-2 mt-2">
              <TechHealthBadge />
            </div>
          </div>
        </div>
      </MobileDetailModal>
    </div>
  );
}
