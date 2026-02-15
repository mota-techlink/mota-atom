"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Link,
  Printer,
  FileCheck,
  Leaf,
  Cpu,
  Radio,
  Ship,
  ShieldCheck,
  Truck,
  BrainCircuit,
  Footprints,
  Hexagon,
  X,
  CheckCircle2,
  Sparkles,
  Zap,
  Globe,
  GitBranch,
  Lock,
  Shield,
  RefreshCw,
  DollarSign,
  Activity,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MobileDetailModal,
  MobileExpandButton,
} from "./MobileDetailModal";

// ═══════════════════════════════════════════════════════════════
// Inline SVG Tech Logos
// ═══════════════════════════════════════════════════════════════

function CloudflareLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M44.5 24.5H16.2l-.5-1.6c-.3-1-.1-2 .6-2.7.6-.6 1.5-1 2.4-1h.4l.8.1.4-.7c1.3-2.7 4-4.4 7.1-4.4 3.3 0 6.2 2.1 7.3 5.1l.3.8.9-.1h1c1.8 0 3.3 1.3 3.6 3l.1.6 1.5.1c1.7.2 3 1.6 3 3.3v.3l-.3.2z" fill="#F6821F"/>
      <path d="M49.1 24.5h-3.7l.1-.8c0-2.1-1.5-3.9-3.6-4.3l-1-.1-.2-.9c-.9-3.4-4-5.8-7.6-5.8-2.7 0-5.2 1.4-6.7 3.5" stroke="#FBAD41" strokeWidth="0.5" fill="none"/>
      <path d="M48 21.3c2 0 3.6 1.4 3.6 3.2h-5.2" fill="#FBAD41"/>
    </svg>
  );
}

function GitHubLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  );
}

function SupabaseLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 109 113" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M63.7 110.3c-2.6 3.3-8 1.6-8.1-2.5l-1.1-53.8h36.6c6.6 0 10.3 7.7 6.1 12.8L63.7 110.3z" fill="url(#sb-a2)"/>
      <path d="M63.7 110.3c-2.6 3.3-8 1.6-8.1-2.5l-1.1-53.8h36.6c6.6 0 10.3 7.7 6.1 12.8L63.7 110.3z" fill="url(#sb-b2)" fillOpacity=".2"/>
      <path d="M45.3 2.7c2.6-3.3 8-1.6 8.1 2.5l.5 53.8H17.7c-6.6 0-10.3-7.7-6.1-12.8L45.3 2.7z" fill="#3ECF8E"/>
      <defs>
        <linearGradient id="sb-a2" x1="54" y1="55" x2="87" y2="87" gradientUnits="userSpaceOnUse">
          <stop stopColor="#249361"/><stop offset="1" stopColor="#3ECF8E"/>
        </linearGradient>
        <linearGradient id="sb-b2" x1="37" y1="30" x2="55" y2="72" gradientUnits="userSpaceOnUse">
          <stop/><stop offset="1" stopOpacity="0"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

function NextjsLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.572 0c-.176.001-.215.002-.344.006C7.32.14 3.77 2.16 1.67 5.33A11.94 11.94 0 000 12c0 6.627 5.373 12 12 12 3.28 0 6.253-1.318 8.416-3.452l.003-.004-9.46-12.986v9.18h-1.39V4.664l10.88 14.932A11.94 11.94 0 0024 12c0-6.627-5.373-12-12-12-.21 0-.345.001-.428.002z"/>
    </svg>
  );
}

function TailwindLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 54 33" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M27 0c-7.2 0-11.7 3.6-13.5 10.8 2.7-3.6 5.85-4.95 9.45-4.05 2.054.514 3.522 2.004 5.147 3.653C30.744 13.09 33.808 16.2 40.5 16.2c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.514-3.522-2.004-5.147-3.653C36.756 3.11 33.692 0 27 0zM13.5 16.2C6.3 16.2 1.8 19.8 0 27c2.7-3.6 5.85-4.95 9.45-4.05 2.054.514 3.522 2.004 5.147 3.653C17.244 29.29 20.308 32.4 27 32.4c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.514-3.522-2.004-5.147-3.653C23.256 19.31 20.192 16.2 13.5 16.2z"/>
    </svg>
  );
}

function ShadcnLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 256 256" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="208" y1="128" x2="128" y2="208" stroke="currentColor" strokeWidth="20" strokeLinecap="round"/>
      <line x1="192" y1="40" x2="40" y2="192" stroke="currentColor" strokeWidth="20" strokeLinecap="round"/>
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════

type ModuleKey = "shipping" | "customs" | "delivery" | "iot" | "ai-mcp" | "carbon";

interface FeatureItem {
  Icon: React.ElementType;
  label: string;
  description: string;
  moduleKey: ModuleKey;
}

interface ModuleConfig {
  key: ModuleKey;
  label: string;
  Icon: React.ElementType;
  color: string;
  bgActive: string;
  borderActive: string;
  glowShadow: string;
  badge?: string;
}

interface TechNode {
  id: string;
  label: string;
  sublabel: string;
  Logo: React.FC<{ className?: string }>;
  logoColor: string;
  accentRgb: string;
  features: string[];
  angle: number;
}

// ═══════════════════════════════════════════════════════════════
// Data — Outer Ring: Functional Modules
// ═══════════════════════════════════════════════════════════════

const features: FeatureItem[] = [
  { Icon: Link, label: "Seamless System Integration", description: "Eliminate barriers between systems. One source of truth for all logistics data across the entire supply chain.", moduleKey: "shipping" },
  { Icon: Printer, label: "Auto Label Generation", description: "Generate accurate last-mile delivery labels automatically from synced shipping data.", moduleKey: "delivery" },
  { Icon: FileCheck, label: "Customs Compliance", description: "Trustworthy, validated data ensures smooth customs clearance with zero manual errors.", moduleKey: "customs" },
  { Icon: Leaf, label: "Carbon Emission Tracking", description: "Integrated carbon emission tracking meeting EU environmental standards and regulations.", moduleKey: "carbon" },
  { Icon: Cpu, label: "AI-Powered Intelligence", description: "Predictive analytics, route optimization, and automated decision-making via MCP.", moduleKey: "ai-mcp" },
  { Icon: Radio, label: "IoT Device Integration", description: "Real-time data from IoT devices for temperature, location, and condition monitoring.", moduleKey: "iot" },
];

const modules: ModuleConfig[] = [
  { key: "shipping", label: "Shipping", Icon: Ship, color: "text-blue-400", bgActive: "bg-blue-500/25", borderActive: "border-blue-400/60", glowShadow: "0 0 20px rgba(59,130,246,0.5), 0 0 40px rgba(59,130,246,0.2)", badge: "API-First" },
  { key: "customs", label: "Customs", Icon: ShieldCheck, color: "text-emerald-400", bgActive: "bg-emerald-500/25", borderActive: "border-emerald-400/60", glowShadow: "0 0 20px rgba(52,211,153,0.5), 0 0 40px rgba(52,211,153,0.2)", badge: "AEO Certified" },
  { key: "delivery", label: "Delivery", Icon: Truck, color: "text-purple-400", bgActive: "bg-purple-500/25", borderActive: "border-purple-400/60", glowShadow: "0 0 20px rgba(168,85,247,0.5), 0 0 40px rgba(168,85,247,0.2)", badge: "Last-Mile" },
  { key: "iot", label: "IoT", Icon: Radio, color: "text-orange-400", bgActive: "bg-orange-500/25", borderActive: "border-orange-400/60", glowShadow: "0 0 20px rgba(251,146,60,0.5), 0 0 40px rgba(251,146,60,0.2)", badge: "Real-Time" },
  { key: "ai-mcp", label: "AI / MCP", Icon: BrainCircuit, color: "text-cyan-400", bgActive: "bg-cyan-500/25", borderActive: "border-cyan-400/60", glowShadow: "0 0 20px rgba(34,211,238,0.5), 0 0 40px rgba(34,211,238,0.2)", badge: "MCP Native" },
  { key: "carbon", label: "Carbon", Icon: Footprints, color: "text-green-400", bgActive: "bg-green-500/25", borderActive: "border-green-400/60", glowShadow: "0 0 20px rgba(34,197,94,0.5), 0 0 40px rgba(34,197,94,0.2)", badge: "ISO 14067" },
];

const featureByKey = Object.fromEntries(features.map((f) => [f.moduleKey, f])) as Record<ModuleKey, FeatureItem>;

// ═══════════════════════════════════════════════════════════════
// Data — Inner Ring: Tech Infrastructure
// ═══════════════════════════════════════════════════════════════

const techNodes: TechNode[] = [
  { id: "cloudflare", label: "Cloudflare", sublabel: "Edge · CDN · WAF", Logo: CloudflareLogo, logoColor: "text-orange-400", accentRgb: "251,146,60", features: ["300+ PoPs global edge network", "Sub-100ms response", "DDoS protection & WAF", "Zero cold-start Workers"], angle: 0 },
  { id: "github", label: "GitHub", sublabel: "CI/CD · GitOps", Logo: GitHubLogo, logoColor: "text-white", accentRgb: "255,255,255", features: ["Push → deploy in <2 min", "Automated CI/CD", "Code scanning & Dependabot", "Branch protection gates"], angle: 60 },
  { id: "supabase", label: "Supabase", sublabel: "DB · Auth · RLS", Logo: SupabaseLogo, logoColor: "text-emerald-400", accentRgb: "52,211,153", features: ["PostgreSQL Row-Level Security", "In-database RPC", "Real-time WebSocket", "Auth + JWT + MFA"], angle: 120 },
  { id: "nextjs", label: "Next.js 15", sublabel: "SSR · RSC · Edge", Logo: NextjsLogo, logoColor: "text-white", accentRgb: "255,255,255", features: ["React Server Components", "ISR + Edge Runtime", "App Router + Middleware", "Streaming SSR"], angle: 180 },
  { id: "tailwind", label: "Tailwind", sublabel: "Utility-First UI", Logo: TailwindLogo, logoColor: "text-sky-400", accentRgb: "56,189,248", features: ["Zero-runtime CSS", "Design system consistency", "Mobile-first responsive", "Dark mode built-in"], angle: 240 },
  { id: "shadcn", label: "shadcn/ui", sublabel: "Components · A11y", Logo: ShadcnLogo, logoColor: "text-white", accentRgb: "226,232,240", features: ["Radix UI primitives (WAI-ARIA)", "Copy-paste ownership", "Enterprise components", "Full accessibility"], angle: 300 },
];

// ═══════════════════════════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════════════════════════

function getPosition(index: number, total: number, radius: number) {
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius, angle };
}

function getLabelAnchor(angle: number): "left" | "right" {
  const deg = ((angle * 180) / Math.PI + 360) % 360;
  return deg > 90 && deg < 270 ? "left" : "right";
}

// ═══════════════════════════════════════════════════════════════
// Sub-components
// ═══════════════════════════════════════════════════════════════

// ── Background ───────────────────────────────────────────────
function SlideBackground() {
  return (
    <>
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 45%, #0f172a 0%, #020617 70%)" }} />
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="mergedGrid" width="44" height="44" patternUnits="userSpaceOnUse">
              <circle cx="22" cy="22" r="0.5" fill="rgba(148,163,184,0.08)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#mergedGrid)" />
        </svg>
      </div>
      <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-cyan-500/3 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-violet-500/3 rounded-full blur-[100px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/2 rounded-full blur-[140px]" />
    </>
  );
}

// ── Orbital Rings SVG ────────────────────────────────────────
function DualOrbitalRings() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 500">
      <defs>
        <linearGradient id="outerRingGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(59,130,246,0.15)" />
          <stop offset="33%" stopColor="rgba(52,211,153,0.12)" />
          <stop offset="66%" stopColor="rgba(168,85,247,0.15)" />
          <stop offset="100%" stopColor="rgba(251,146,60,0.12)" />
        </linearGradient>
        <linearGradient id="innerRingGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(56,189,248,0.15)" />
          <stop offset="33%" stopColor="rgba(167,139,250,0.12)" />
          <stop offset="66%" stopColor="rgba(52,211,153,0.15)" />
          <stop offset="100%" stopColor="rgba(251,146,60,0.12)" />
        </linearGradient>
        <filter id="ringGlow2">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Outer ring — functional modules */}
      <circle cx="250" cy="250" r="215" fill="none" stroke="url(#outerRingGrad)" strokeWidth="1.2" filter="url(#ringGlow2)" />
      <circle cx="250" cy="250" r="215" fill="none" stroke="rgba(59,130,246,0.04)" strokeWidth="1" strokeDasharray="4 10" />

      {/* Inner ring — tech infra */}
      <circle cx="250" cy="250" r="120" fill="none" stroke="url(#innerRingGrad)" strokeWidth="1" filter="url(#ringGlow2)" />
      <circle cx="250" cy="250" r="120" fill="none" stroke="rgba(56,189,248,0.04)" strokeWidth="0.8" strokeDasharray="3 6" />

      {/* Core glow */}
      <circle cx="250" cy="250" r="45" fill="none" stroke="rgba(59,130,246,0.06)" strokeWidth="0.5" />
    </svg>
  );
}

// ── Orbiting Particles ───────────────────────────────────────
function OrbitingParticles() {
  const particles = [
    { r: 215, dur: 25, color: "rgba(59,130,246,0.5)", size: 2 },
    { r: 215, dur: 35, color: "rgba(52,211,153,0.4)", size: 1.5 },
    { r: 120, dur: 18, color: "rgba(56,189,248,0.5)", size: 2 },
    { r: 120, dur: 22, color: "rgba(167,139,250,0.4)", size: 1.5 },
    { r: 120, dur: 28, color: "rgba(251,146,60,0.4)", size: 1.5 },
  ];
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 500">
      {particles.map((p, i) => (
        <motion.circle
          key={i}
          r={p.size}
          fill={p.color}
          animate={{
            cx: [250 + p.r * Math.cos(i * 1.2), 250 + p.r * Math.cos(Math.PI + i * 1.2), 250 + p.r * Math.cos(Math.PI * 2 + i * 1.2)],
            cy: [250 + p.r * Math.sin(i * 1.2), 250 + p.r * Math.sin(Math.PI + i * 1.2), 250 + p.r * Math.sin(Math.PI * 2 + i * 1.2)],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{ duration: p.dur, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </svg>
  );
}

// ── Connection Lines (center → outer modules) ────────────────
function ConnectionLines({ highlightModule }: { highlightModule: ModuleKey | null }) {
  const cx = 250, cy = 250, outerR = 215;
  const colorMap: Record<ModuleKey, string> = {
    shipping: "rgba(59,130,246,0.5)", customs: "rgba(52,211,153,0.5)",
    delivery: "rgba(168,85,247,0.5)", iot: "rgba(251,146,60,0.5)",
    "ai-mcp": "rgba(34,211,238,0.5)", carbon: "rgba(34,197,94,0.5)",
  };

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 500">
      {modules.map((mod, i) => {
        const pos = getPosition(i, modules.length, outerR);
        const endX = cx + pos.x, endY = cy + pos.y;
        const isActive = highlightModule === mod.key;
        return (
          <g key={mod.key}>
            <line x1={cx} y1={cy} x2={endX} y2={endY} stroke="rgba(148,163,184,0.05)" strokeWidth="1" />
            <motion.line
              x1={cx} y1={cy} x2={endX} y2={endY}
              stroke={isActive ? colorMap[mod.key] : "rgba(148,163,184,0.08)"}
              strokeWidth={isActive ? 1.5 : 0.8}
              strokeDasharray={isActive ? "6 4" : "3 8"}
              animate={{ strokeDashoffset: [0, -20], opacity: isActive ? 0.8 : 0.2 }}
              transition={{ strokeDashoffset: { duration: isActive ? 0.8 : 3, repeat: Infinity, ease: "linear" }, opacity: { type: "spring", stiffness: 200, damping: 25 } }}
            />
          </g>
        );
      })}
    </svg>
  );
}

// ── Core Hexagon ─────────────────────────────────────────────
function CoreHexagon({ isAnyActive }: { isAnyActive: boolean }) {
  return (
    <motion.div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center justify-center"
      animate={{ scale: isAnyActive ? [1, 1.04, 1] : [1, 1.02, 1] }}
      transition={{ duration: isAnyActive ? 1.5 : 3, repeat: Infinity, ease: "easeInOut" }}
    >
      <motion.div
        className="absolute w-24 h-24 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative w-16 h-16 md:w-18 md:h-18 flex items-center justify-center">
        <svg viewBox="0 0 80 80" className="absolute inset-0 w-full h-full">
          <motion.polygon
            points="40,4 73,22 73,58 40,76 7,58 7,22"
            fill="rgba(15,23,42,0.85)"
            stroke="rgba(59,130,246,0.3)"
            strokeWidth="1.5"
            animate={{ stroke: isAnyActive ? ["rgba(59,130,246,0.5)", "rgba(52,211,153,0.5)", "rgba(59,130,246,0.5)"] : ["rgba(59,130,246,0.2)", "rgba(59,130,246,0.4)", "rgba(59,130,246,0.2)"] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </svg>
        <div className="relative z-10 text-center">
          <Hexagon className="w-4 h-4 md:w-5 md:h-5 text-blue-400/70 mx-auto mb-0.5" />
          <div className="text-[9px] md:text-[10px] font-bold tracking-widest text-blue-300/90">ELMS</div>
          <div className="text-[6px] md:text-[7px] tracking-wider text-slate-500">CORE</div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Inner Tech Node ──────────────────────────────────────────
function InnerTechNode({
  node, isSelected, onSelect,
}: {
  node: TechNode; isSelected: boolean; onSelect: (id: string | null) => void;
}) {
  const innerR = 120, cx = 250, cy = 250;
  const rad = (node.angle * Math.PI) / 180;
  const x = cx + innerR * Math.cos(rad);
  const y = cy + innerR * Math.sin(rad);
  const leftPct = (x / 500) * 100;
  const topPct = (y / 500) * 100;
  const LogoComp = node.Logo;

  return (
    <motion.div
      className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-30 group"
      style={{ left: `${leftPct}%`, top: `${topPct}%` }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4 + (node.angle / 360) * 0.6, type: "spring", stiffness: 260, damping: 20 }}
      onMouseEnter={() => onSelect(node.id)}
      onMouseLeave={() => onSelect(null)}
    >
      {/* Glow ring */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        animate={{ boxShadow: isSelected ? `0 0 18px rgba(${node.accentRgb},0.3), 0 0 36px rgba(${node.accentRgb},0.1)` : `0 0 0px rgba(${node.accentRgb},0)` }}
        transition={{ duration: 0.3 }}
        style={{ margin: "-4px" }}
      />
      {/* Circle */}
      <div
        className="w-10 h-10 md:w-12 md:h-12 lg:w-13 lg:h-13 rounded-full flex items-center justify-center border relative overflow-hidden"
        style={{
          background: `radial-gradient(circle at 40% 40%, rgba(${node.accentRgb},0.12) 0%, rgba(15,23,42,0.85) 70%)`,
          borderColor: `rgba(${node.accentRgb},${isSelected ? 0.5 : 0.2})`,
          backdropFilter: "blur(8px)",
        }}
      >
        <LogoComp className={`w-4 h-4 md:w-5 md:h-5 ${node.logoColor}`} />
      </div>
      {/* Label */}
      <div className="absolute top-full mt-0.5 left-1/2 -translate-x-1/2 text-center whitespace-nowrap pointer-events-none">
        <div className={`text-[9px] sm:text-[11px] lg:text-xs font-bold ${node.logoColor} leading-tight`}>{node.label}</div>
      </div>
      {/* Hover popup */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            className="absolute z-50 w-56 lg:w-72 rounded-xl border p-3.5 pointer-events-none"
            style={{
              background: `linear-gradient(135deg, rgba(${node.accentRgb},0.08) 0%, rgba(10,20,40,0.95) 100%)`,
              borderColor: `rgba(${node.accentRgb},0.25)`,
              backdropFilter: "blur(16px)",
              ...(node.angle >= 90 && node.angle < 270
                ? { right: "calc(100% + 12px)", top: "50%", transform: "translateY(-50%)" }
                : { left: "calc(100% + 12px)", top: "50%", transform: "translateY(-50%)" }),
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
          >
            <div className="text-sm font-bold text-white mb-2">{node.label} <span className="font-normal text-slate-500">· {node.sublabel}</span></div>
            <div className="space-y-1.5">
              {node.features.map((feat, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: `rgba(${node.accentRgb},0.6)` }} />
                  <span className="text-xs lg:text-sm text-slate-400 leading-tight">{feat}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Outer Module Node ────────────────────────────────────────
function OuterModuleNode({
  mod, index, total, isHighlighted, isSelected, onClick,
}: {
  mod: ModuleConfig; index: number; total: number; isHighlighted: boolean; isSelected: boolean; onClick: () => void;
}) {
  const outerR = 215;
  const pos = getPosition(index, total, outerR);
  const leftPct = ((250 + pos.x) / 500) * 100;
  const topPct = ((250 + pos.y) / 500) * 100;
  const anchor = getLabelAnchor(pos.angle);
  const IconComp = mod.Icon;
  const feature = featureByKey[mod.key];
  const isActive = isHighlighted || isSelected;

  return (
    <motion.div
      className="absolute -translate-x-1/2 -translate-y-1/2 z-25 cursor-pointer"
      style={{ left: `${leftPct}%`, top: `${topPct}%` }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: isActive ? 1.15 : 1 }}
      transition={{ delay: 0.6 + index * 0.08, type: "spring", stiffness: 260, damping: 22 }}
    >
      {/* Pulse glow */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            className="absolute -inset-3 rounded-xl"
            style={{ boxShadow: mod.glowShadow }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0.5, 1, 0.5], scale: [0.95, 1.05, 0.95] }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </AnimatePresence>

      {/* Card */}
      <motion.button
        className={`relative w-16 h-16 md:w-20 md:h-20 rounded-xl flex flex-col items-center justify-center border backdrop-blur-sm transition-colors duration-300 cursor-pointer ${
          isActive ? `${mod.bgActive} ${mod.borderActive}` : "bg-white/5 border-white/10 hover:bg-white/8"
        }`}
        style={isActive ? { boxShadow: mod.glowShadow } : undefined}
        onClick={onClick}
        whileTap={{ scale: 0.95 }}
      >
        <IconComp className={`w-5 h-5 md:w-6 md:h-6 mb-0.5 transition-colors duration-300 ${isActive ? mod.color : "text-slate-500"}`} />
        <span className={`text-[10px] md:text-xs font-semibold tracking-wide transition-colors duration-300 ${isActive ? mod.color : "text-slate-600"}`}>
          {mod.label}
        </span>
      </motion.button>

      {/* Side label */}
      <motion.div
        className={`absolute top-1/2 -translate-y-1/2 whitespace-nowrap pointer-events-none hidden md:block ${
          anchor === "right" ? "left-[calc(100%+10px)]" : "right-[calc(100%+10px)]"
        }`}
        animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : anchor === "right" ? -5 : 5 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <div className={`text-sm font-semibold leading-snug ${isActive ? "text-white" : "text-slate-500"} ${anchor === "right" ? "text-left" : "text-right"}`}>
          {feature.label}
        </div>
        {isActive && mod.badge && (
          <motion.div
            className={`mt-0.5 ${anchor === "right" ? "text-left" : "text-right"}`}
            initial={{ opacity: 0, y: -2 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className={`text-[10px] md:text-xs font-medium px-1.5 py-0.5 rounded-full border backdrop-blur-md ${mod.borderActive} ${mod.bgActive} ${mod.color}`}>
              {mod.badge}
            </span>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ── Detail Popover (click on outer module) ───────────────────
function DetailPopover({
  mod, feature, onClose,
}: {
  mod: ModuleConfig; feature: FeatureItem; onClose: () => void;
}) {
  const IconComp = feature.Icon;
  return (
    <motion.div
      className="absolute z-50 inset-0 flex items-center justify-center pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 pointer-events-auto" onClick={onClose} />
      <motion.div
        className={`relative pointer-events-auto max-w-xs w-full mx-4 rounded-2xl border backdrop-blur-xl p-5 ${mod.bgActive} ${mod.borderActive}`}
        style={{ boxShadow: `${mod.glowShadow}, 0 8px 32px rgba(0,0,0,0.4)` }}
        initial={{ scale: 0.85, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.85, y: 20, opacity: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
      >
        <button className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/20 transition-colors cursor-pointer" onClick={onClose}>
          <X className="w-3 h-3" />
        </button>
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${mod.borderActive} ${mod.bgActive}`}>
            <IconComp className={`w-5 h-5 ${mod.color}`} />
          </div>
          <div>
            <div className={`text-sm font-bold ${mod.color}`}>{feature.label}</div>
            {mod.badge && <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full border ${mod.borderActive} ${mod.bgActive} ${mod.color}`}>{mod.badge}</span>}
          </div>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">{feature.description}</p>
      </motion.div>
    </motion.div>
  );
}

// ── Auto-cycle hook ──────────────────────────────────────────
function useAutoCycle(keys: ModuleKey[], intervalMs: number, paused: boolean) {
  const [idx, setIdx] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (paused) { if (timerRef.current) clearInterval(timerRef.current); return; }
    timerRef.current = setInterval(() => setIdx((p) => (p + 1) % keys.length), intervalMs);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [keys.length, intervalMs, paused]);
  return keys[idx];
}

// ═══════════════════════════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════════════════════════

export function SolutionHubSlide() {
  const [selectedModule, setSelectedModule] = useState<ModuleKey | null>(null);
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const cycleKey = useAutoCycle(modules.map((m) => m.key), 2500, selectedModule !== null);
  const highlightModule = selectedModule ?? cycleKey;

  const handleNodeClick = useCallback((key: ModuleKey) => {
    setSelectedModule((prev) => (prev === key ? null : key));
  }, []);
  const handleCloseDetail = useCallback(() => setSelectedModule(null), []);

  const selectedMod = selectedModule ? modules.find((m) => m.key === selectedModule)! : null;
  const selectedFeature = selectedModule ? featureByKey[selectedModule] : null;

  return (
    <div className="w-full h-full flex flex-col relative overflow-hidden bg-[#020617]">
      <SlideBackground />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full px-4 md:px-8 lg:px-12 py-3 md:py-5 lg:py-6">

        {/* ── Title ── */}
        <motion.div
          className="mb-1 md:mb-3 text-center shrink-0"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-1 justify-center">
            <div className="w-1 h-5 rounded-full bg-blue-500" />
            <span className="text-[10px] md:text-xs font-semibold tracking-widest text-blue-400/80 uppercase">
              Platform Architecture
            </span>
          </div>
          <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-white tracking-tight">
            <span className="text-cyan-400">Unified</span>{" "}
            Solution{" · "}
            <span className="text-violet-400">Technical</span>{" "}
            Edge
          </h2>
          <p className="text-[10px] md:text-xs text-slate-500 mt-1 max-w-xl mx-auto">
            Infrastructure inside, functional modules outside — one interlocking ecosystem. Hover to explore.
          </p>
        </motion.div>

        {/* ── Desktop: Dual-Ring Diagram ── */}
        <div className="hidden md:flex flex-1 items-center justify-center min-h-0 relative">
          <motion.div
            className="relative w-full max-w-lg lg:max-w-xl aspect-square"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
          >
            {/* SVG rings */}
            <DualOrbitalRings />
            <OrbitingParticles />
            <ConnectionLines highlightModule={highlightModule} />

            {/* Center */}
            <CoreHexagon isAnyActive={highlightModule !== null} />

            {/* Inner ring: Tech nodes */}
            {techNodes.map((node) => (
              <InnerTechNode
                key={node.id}
                node={node}
                isSelected={selectedTech === node.id}
                onSelect={setSelectedTech}
              />
            ))}

            {/* Outer ring: Module nodes */}
            {modules.map((mod, i) => (
              <OuterModuleNode
                key={mod.key}
                mod={mod}
                index={i}
                total={modules.length}
                isHighlighted={highlightModule === mod.key}
                isSelected={selectedModule === mod.key}
                onClick={() => handleNodeClick(mod.key)}
              />
            ))}
          </motion.div>

          {/* Detail popover */}
          <AnimatePresence>
            {selectedMod && selectedFeature && (
              <DetailPopover mod={selectedMod} feature={selectedFeature} onClose={handleCloseDetail} />
            )}
          </AnimatePresence>
        </div>

        {/* ── Mobile: Condensed view ── */}
        <div className="flex md:hidden flex-1 flex-col items-center justify-center gap-2 min-h-0 relative">
          <motion.div className="origin-center" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 0.65 }} transition={{ delay: 0.3 }}>
            <div className="relative" style={{ width: 320, height: 320 }}>
              <DualOrbitalRings />
              <CoreHexagon isAnyActive={true} />
              {techNodes.map((node) => (
                <InnerTechNode key={node.id} node={node} isSelected={false} onSelect={() => setMobileOpen(true)} />
              ))}
              {modules.map((mod, i) => (
                <OuterModuleNode key={mod.key} mod={mod} index={i} total={modules.length} isHighlighted={highlightModule === mod.key} isSelected={false} onClick={() => setMobileOpen(true)} />
              ))}
            </div>
          </motion.div>
          <MobileExpandButton label="Tap to explore architecture" onClick={() => setMobileOpen(true)} />
        </div>

        {/* ── Bottom status ── */}
        <motion.div
          className="mt-1 md:mt-2 hidden md:flex items-center justify-center gap-5 text-[10px] text-slate-600 shrink-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
        >
          <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />All Systems Operational</span>
          <span className="w-px h-3 bg-slate-700" />
          <span>6 Modules · 6 Infra · 1 Core</span>
          <span className="w-px h-3 bg-slate-700" />
          <span className="flex items-center gap-1"><DollarSign className="w-3 h-3 text-amber-400/60" />$0 to Start</span>
          <span className="w-px h-3 bg-slate-700" />
          <span className="flex items-center gap-1"><Activity className="w-3 h-3 text-cyan-400/60" />&lt;100ms Edge</span>
        </motion.div>
      </div>

      {/* ── Mobile Detail Modal ── */}
      <MobileDetailModal
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        title="Platform Architecture"
        subtitle="Infrastructure + Functional Modules"
      >
        <div className="space-y-4">
          {/* Tech Stack */}
          <div>
            <div className="text-[10px] font-mono text-cyan-400/60 uppercase tracking-widest mb-2">Infrastructure</div>
            <div className="space-y-2.5">
              {techNodes.map((node) => {
                const LogoComp = node.Logo;
                return (
                  <div key={node.id} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/3 border border-white/5">
                    <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center border" style={{ background: `radial-gradient(circle, rgba(${node.accentRgb},0.1), rgba(15,23,42,0.8))`, borderColor: `rgba(${node.accentRgb},0.2)` }}>
                      <LogoComp className={`w-4 h-4 ${node.logoColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-xs font-bold ${node.logoColor}`}>{node.label}</div>
                      <div className="text-[8px] font-mono text-slate-600">{node.sublabel}</div>
                      <div className="mt-1 space-y-0.5">
                        {node.features.slice(0, 2).map((f, j) => (
                          <div key={j} className="flex items-start gap-1.5">
                            <CheckCircle2 className="w-2.5 h-2.5 shrink-0 mt-px" style={{ color: `rgba(${node.accentRgb},0.5)` }} />
                            <span className="text-[9px] text-slate-400 leading-tight">{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Modules */}
          <div className="pt-3 border-t border-white/5">
            <div className="text-[10px] font-mono text-blue-400/60 uppercase tracking-widest mb-2">Functional Modules</div>
            <div className="space-y-2.5">
              {features.map((feature) => {
                const modConfig = modules.find((m) => m.key === feature.moduleKey);
                const IconComp = feature.Icon;
                return (
                  <div key={feature.moduleKey} className="flex items-start gap-3 p-2.5 rounded-xl bg-white/3 border border-white/5">
                    <div className="shrink-0 w-8 h-8 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center">
                      <IconComp className={`w-4 h-4 ${modConfig?.color ?? "text-white"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-white">{feature.label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">{feature.description}</div>
                      {modConfig?.badge && <span className={`inline-block mt-1 text-[9px] font-medium px-2 py-0.5 rounded-full border ${modConfig.borderActive} ${modConfig.bgActive} ${modConfig.color}`}>{modConfig.badge}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </MobileDetailModal>
    </div>
  );
}
