"use client";

import React, { useState } from "react";
import {
  Zap,
  Shield,
  Globe,
  GitBranch,
  Lock,
  Cloud,
  CheckCircle2,
  Sparkles,
  Activity,
  DollarSign,
  Cpu,
  Eye,
  Server,
  RefreshCw,
  ArrowUpRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MobileDetailModal,
  MobileExpandButton,
} from "./MobileDetailModal";

// ═══════════════════════════════════════════════════════════════
// Inline SVG Logos (simplified brand marks)
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
      <path d="M63.7 110.3c-2.6 3.3-8 1.6-8.1-2.5l-1.1-53.8h36.6c6.6 0 10.3 7.7 6.1 12.8L63.7 110.3z" fill="url(#sb-a)"/>
      <path d="M63.7 110.3c-2.6 3.3-8 1.6-8.1-2.5l-1.1-53.8h36.6c6.6 0 10.3 7.7 6.1 12.8L63.7 110.3z" fill="url(#sb-b)" fillOpacity=".2"/>
      <path d="M45.3 2.7c2.6-3.3 8-1.6 8.1 2.5l.5 53.8H17.7c-6.6 0-10.3-7.7-6.1-12.8L45.3 2.7z" fill="#3ECF8E"/>
      <defs>
        <linearGradient id="sb-a" x1="54" y1="55" x2="87" y2="87" gradientUnits="userSpaceOnUse">
          <stop stopColor="#249361"/><stop offset="1" stopColor="#3ECF8E"/>
        </linearGradient>
        <linearGradient id="sb-b" x1="37" y1="30" x2="55" y2="72" gradientUnits="userSpaceOnUse">
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
// Data — Ring Nodes
// ═══════════════════════════════════════════════════════════════

interface RingNode {
  id: string;
  label: string;
  sublabel: string;
  Logo: React.FC<{ className?: string }>;
  logoColor: string; // tailwind text color for the SVG fill
  accentRgb: string;
  features: string[];
  angle: number; // position on the ring in degrees
}

const ringNodes: RingNode[] = [
  {
    id: "cloudflare",
    label: "Cloudflare",
    sublabel: "Edge · CDN · WAF",
    Logo: CloudflareLogo,
    logoColor: "text-orange-400",
    accentRgb: "251,146,60",
    features: [
      "300+ PoPs global edge network",
      "Sub-100ms response worldwide",
      "DDoS protection & WAF",
      "Zero cold-start Workers",
    ],
    angle: 0,
  },
  {
    id: "github",
    label: "GitHub",
    sublabel: "CI/CD · GitOps",
    Logo: GitHubLogo,
    logoColor: "text-white",
    accentRgb: "255,255,255",
    features: [
      "Push to main → deploy in <2 min",
      "Automated CI/CD pipeline",
      "Code scanning & Dependabot",
      "Branch protection & review gates",
    ],
    angle: 60,
  },
  {
    id: "supabase",
    label: "Supabase",
    sublabel: "Database · Auth · RLS",
    Logo: SupabaseLogo,
    logoColor: "text-emerald-400",
    accentRgb: "52,211,153",
    features: [
      "PostgreSQL Row-Level Security",
      "In-database RPC computation",
      "Real-time WebSocket streams",
      "Auth + JWT + MFA built-in",
    ],
    angle: 120,
  },
  {
    id: "nextjs",
    label: "Next.js 15",
    sublabel: "SSR · RSC · Edge",
    Logo: NextjsLogo,
    logoColor: "text-white",
    accentRgb: "255,255,255",
    features: [
      "React Server Components",
      "Incremental Static Regeneration",
      "Edge & Node.js dual runtime",
      "App Router + Middleware",
    ],
    angle: 180,
  },
  {
    id: "tailwind",
    label: "Tailwind CSS",
    sublabel: "Utility-First UI",
    Logo: TailwindLogo,
    logoColor: "text-sky-400",
    accentRgb: "56,189,248",
    features: [
      "Zero-runtime CSS engine",
      "Design system consistency",
      "Mobile-first responsive",
      "Dark mode & theming",
    ],
    angle: 240,
  },
  {
    id: "shadcn",
    label: "shadcn/ui",
    sublabel: "Components · A11y",
    Logo: ShadcnLogo,
    logoColor: "text-white",
    accentRgb: "226,232,240",
    features: [
      "Radix UI primitives (WAI-ARIA)",
      "Copy-paste ownership model",
      "Enterprise-grade components",
      "Full accessibility built-in",
    ],
    angle: 300,
  },
];

// ═══════════════════════════════════════════════════════════════
// Data — Capability Badges (outer ring text)
// ═══════════════════════════════════════════════════════════════

interface CapBadge {
  label: string;
  icon: React.ElementType;
  color: string;
}

const capBadges: CapBadge[] = [
  { label: "Global Acceleration", icon: Globe, color: "text-orange-400" },
  { label: "Code Security", icon: GitBranch, color: "text-white/70" },
  { label: "Data Security", icon: Lock, color: "text-emerald-400" },
  { label: "CI/CD Pipeline", icon: RefreshCw, color: "text-violet-400" },
  { label: "Network Security", icon: Shield, color: "text-sky-400" },
  { label: "Zero-Cost Start", icon: DollarSign, color: "text-amber-400" },
];

// ═══════════════════════════════════════════════════════════════
// Sub-components
// ═══════════════════════════════════════════════════════════════

// ── Background ───────────────────────────────────────────────
function TechBackground() {
  return (
    <>
      <div className="absolute inset-0 bg-linear-to-br from-[#020817] via-[#060e1f] to-[#030c1a]" />

      {/* Radial grid pattern */}
      <div className="absolute inset-0 opacity-15">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="techGrid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="rgba(56,189,248,0.06)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#techGrid)" />
        </svg>
      </div>

      {/* Ambient glows */}
      <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-cyan-500/3 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-violet-500/3 rounded-full blur-[100px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/2 rounded-full blur-[140px]" />
    </>
  );
}

// ── Orbital Ring (SVG) ───────────────────────────────────────
function OrbitalRings() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 400">
      <defs>
        {/* Rotating gradient for outer ring */}
        <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(56,189,248,0.2)" />
          <stop offset="33%" stopColor="rgba(167,139,250,0.15)" />
          <stop offset="66%" stopColor="rgba(52,211,153,0.2)" />
          <stop offset="100%" stopColor="rgba(251,146,60,0.15)" />
        </linearGradient>
        <linearGradient id="ringGradInner" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(34,211,238,0.1)" />
          <stop offset="100%" stopColor="rgba(52,211,153,0.1)" />
        </linearGradient>
        <filter id="ringGlow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Outer dashed ring (capabilities) */}
      <circle cx="200" cy="200" r="185" fill="none" stroke="rgba(56,189,248,0.06)" strokeWidth="1" strokeDasharray="4 8" />

      {/* Main ring */}
      <circle cx="200" cy="200" r="145" fill="none" stroke="url(#ringGrad)" strokeWidth="1.5" filter="url(#ringGlow)" />

      {/* Inner ring */}
      <circle cx="200" cy="200" r="105" fill="none" stroke="url(#ringGradInner)" strokeWidth="0.8" strokeDasharray="3 6" />

      {/* Inner glow circle */}
      <circle cx="200" cy="200" r="50" fill="none" stroke="rgba(34,211,238,0.06)" strokeWidth="0.5" />
    </svg>
  );
}

// ── Orbiting Data Particles ──────────────────────────────────
function OrbitingParticles() {
  const particles = [
    { r: 145, dur: 20, color: "rgba(56,189,248,0.5)", size: 2 },
    { r: 145, dur: 25, color: "rgba(167,139,250,0.5)", size: 1.5 },
    { r: 145, dur: 30, color: "rgba(52,211,153,0.4)", size: 2 },
    { r: 105, dur: 18, color: "rgba(251,146,60,0.4)", size: 1.5 },
    { r: 105, dur: 22, color: "rgba(34,211,238,0.3)", size: 1.5 },
  ];

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 400">
      {particles.map((p, i) => (
        <motion.circle
          key={i}
          r={p.size}
          fill={p.color}
          animate={{
            cx: [
              200 + p.r * Math.cos(0 + i * 1.2),
              200 + p.r * Math.cos(Math.PI * 0.5 + i * 1.2),
              200 + p.r * Math.cos(Math.PI + i * 1.2),
              200 + p.r * Math.cos(Math.PI * 1.5 + i * 1.2),
              200 + p.r * Math.cos(Math.PI * 2 + i * 1.2),
            ],
            cy: [
              200 + p.r * Math.sin(0 + i * 1.2),
              200 + p.r * Math.sin(Math.PI * 0.5 + i * 1.2),
              200 + p.r * Math.sin(Math.PI + i * 1.2),
              200 + p.r * Math.sin(Math.PI * 1.5 + i * 1.2),
              200 + p.r * Math.sin(Math.PI * 2 + i * 1.2),
            ],
            opacity: [0.3, 0.8, 0.3, 0.8, 0.3],
          }}
          transition={{
            duration: p.dur,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </svg>
  );
}

// ── Connection Lines (SVG arcs between nodes) ────────────────
function ConnectionArcs() {
  // Draw faint curved arcs between adjacent nodes to show "interlocking"
  const R = 145;
  const cx = 200;
  const cy = 200;

  const arcs = ringNodes.map((node, i) => {
    const next = ringNodes[(i + 1) % ringNodes.length];
    const a1 = (node.angle * Math.PI) / 180;
    const a2 = (next.angle * Math.PI) / 180;
    const x1 = cx + R * Math.cos(a1);
    const y1 = cy + R * Math.sin(a1);
    const x2 = cx + R * Math.cos(a2);
    const y2 = cy + R * Math.sin(a2);
    return { x1, y1, x2, y2, i };
  });

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 400">
      {arcs.map(({ x1, y1, x2, y2, i }) => (
        <motion.line
          key={i}
          x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={`rgba(56,189,248,0.08)`}
          strokeWidth="0.8"
          strokeDasharray="2 4"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ delay: 0.8 + i * 0.1, duration: 0.6 }}
        />
      ))}
    </svg>
  );
}

// ── Ring Node Component ──────────────────────────────────────
function RingNodeComponent({
  node,
  centerX,
  centerY,
  radius,
  onSelect,
  isSelected,
}: {
  node: RingNode;
  centerX: number;
  centerY: number;
  radius: number;
  onSelect: (id: string | null) => void;
  isSelected: boolean;
}) {
  const angleRad = (node.angle * Math.PI) / 180;
  const x = centerX + radius * Math.cos(angleRad);
  const y = centerY + radius * Math.sin(angleRad);
  const LogoComp = node.Logo;

  // Convert to percentage for positioning
  const leftPct = (x / 400) * 100;
  const topPct = (y / 400) * 100;

  return (
    <motion.div
      className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-30 group"
      style={{ left: `${leftPct}%`, top: `${topPct}%` }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay: 0.4 + (node.angle / 360) * 0.8,
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
      onMouseEnter={() => onSelect(node.id)}
      onMouseLeave={() => onSelect(null)}
    >
      {/* Glow ring on hover */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        animate={{
          boxShadow: isSelected
            ? `0 0 20px rgba(${node.accentRgb},0.3), 0 0 40px rgba(${node.accentRgb},0.1)`
            : `0 0 0px rgba(${node.accentRgb},0)`,
        }}
        transition={{ duration: 0.3 }}
        style={{ margin: "-4px" }}
      />

      {/* Node circle */}
      <div
        className="w-11 h-11 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center border relative overflow-hidden"
        style={{
          background: `radial-gradient(circle at 40% 40%, rgba(${node.accentRgb},0.12) 0%, rgba(15,23,42,0.85) 70%)`,
          borderColor: `rgba(${node.accentRgb},${isSelected ? 0.5 : 0.2})`,
          backdropFilter: "blur(8px)",
        }}
      >
        <LogoComp className={`w-5 h-5 md:w-5.5 md:h-5.5 lg:w-6 lg:h-6 ${node.logoColor}`} />
      </div>

      {/* Label below */}
      <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 text-center whitespace-nowrap pointer-events-none">
        <div className={`text-[7px] lg:text-[8px] font-bold ${node.logoColor} leading-tight`}>
          {node.label}
        </div>
        <div className="text-[6px] lg:text-[7px] font-mono text-slate-600">
          {node.sublabel}
        </div>
      </div>

      {/* Feature popup on hover */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            className="absolute z-50 w-44 lg:w-52 rounded-xl border p-2.5 lg:p-3 pointer-events-none"
            style={{
              background: `linear-gradient(135deg, rgba(${node.accentRgb},0.08) 0%, rgba(10,20,40,0.95) 100%)`,
              borderColor: `rgba(${node.accentRgb},0.25)`,
              backdropFilter: "blur(16px)",
              // Position popup based on angle to avoid going off-screen
              ...(node.angle >= 90 && node.angle < 270
                ? { right: "calc(100% + 12px)", top: "50%", transform: "translateY(-50%)" }
                : { left: "calc(100% + 12px)", top: "50%", transform: "translateY(-50%)" }),
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
          >
            <div className="space-y-1">
              {node.features.map((feat, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <CheckCircle2
                    className="w-2.5 h-2.5 shrink-0 mt-px"
                    style={{ color: `rgba(${node.accentRgb},0.6)` }}
                  />
                  <span className="text-[8px] lg:text-[9px] text-slate-400 leading-tight">
                    {feat}
                  </span>
                </div>
              ))}
            </div>
            {/* Future-Proof badge */}
            <div
              className="mt-2 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full border text-[6px] lg:text-[7px] font-mono font-bold uppercase tracking-widest"
              style={{
                backgroundColor: `rgba(${node.accentRgb},0.08)`,
                borderColor: `rgba(${node.accentRgb},0.2)`,
                color: `rgba(${node.accentRgb},0.7)`,
              }}
            >
              <Sparkles className="w-2 h-2" />
              Future-Proof
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Center Hub ───────────────────────────────────────────────
function CenterHub() {
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center pointer-events-none">
      {/* Pulsing core */}
      <motion.div
        className="w-16 h-16 md:w-18 md:h-18 lg:w-22 lg:h-22 rounded-full border border-cyan-500/20 flex items-center justify-center"
        style={{
          background: "radial-gradient(circle, rgba(34,211,238,0.08) 0%, rgba(15,23,42,0.6) 70%)",
          backdropFilter: "blur(8px)",
        }}
        animate={{
          boxShadow: [
            "0 0 12px rgba(34,211,238,0.05)",
            "0 0 30px rgba(34,211,238,0.12)",
            "0 0 12px rgba(34,211,238,0.05)",
          ],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="text-center">
          <div className="text-[8px] md:text-[9px] lg:text-[11px] font-black text-cyan-400 tracking-wider leading-tight">
            ELMS
          </div>
          <div className="text-[6px] md:text-[7px] lg:text-[8px] font-mono text-slate-500">
            Engine
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ── Capability Badge Ring (outer) ────────────────────────────
function CapabilityBadges() {
  const outerR = 185;
  const cx = 200;
  const cy = 200;

  return (
    <>
      {capBadges.map((badge, i) => {
        const angle = (i / capBadges.length) * 360 + 30; // offset 30deg from nodes
        const rad = (angle * Math.PI) / 180;
        const x = cx + outerR * Math.cos(rad);
        const y = cy + outerR * Math.sin(rad);
        const leftPct = (x / 400) * 100;
        const topPct = (y / 400) * 100;
        const IconComp = badge.icon;

        return (
          <motion.div
            key={badge.label}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none"
            style={{ left: `${leftPct}%`, top: `${topPct}%` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 + i * 0.1 }}
          >
            <div className="flex items-center gap-1 whitespace-nowrap">
              <IconComp className={`w-2 h-2 lg:w-2.5 lg:h-2.5 ${badge.color}`} />
              <span className={`text-[6px] lg:text-[7px] font-mono font-bold ${badge.color} uppercase tracking-wider opacity-60`}>
                {badge.label}
              </span>
            </div>
          </motion.div>
        );
      })}
    </>
  );
}

// ── Pay-As-You-Go Badge ──────────────────────────────────────
function PayAsYouGoBadge() {
  return (
    <motion.div
      className="flex items-center gap-2 lg:gap-3"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.0 }}
    >
      <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-amber-500/15 bg-amber-500/5">
        <DollarSign className="w-3 h-3 text-amber-400" />
        <div>
          <div className="text-[8px] lg:text-[9px] font-bold text-amber-400">
            $0 to Start
          </div>
          <div className="text-[6px] lg:text-[7px] font-mono text-amber-400/50">
            Pay-as-you-go · No upfront cost
          </div>
        </div>
      </div>

      <div className="hidden lg:flex items-center gap-2">
        {[
          { label: "Supabase Free Tier", color: "border-emerald-500/15 text-emerald-400/60" },
          { label: "Cloudflare Free Plan", color: "border-orange-500/15 text-orange-400/60" },
          { label: "Vercel Hobby", color: "border-white/10 text-white/50" },
        ].map((item) => (
          <span
            key={item.label}
            className={`text-[6px] lg:text-[7px] font-mono font-bold px-1.5 py-0.5 rounded border ${item.color} tracking-wider`}
          >
            {item.label}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

// ── KPI Strip ────────────────────────────────────────────────
function KPIStrip() {
  const kpis = [
    { label: "Edge Latency", value: "<100ms", color: "text-orange-400" },
    { label: "Deploy Time", value: "<2 min", color: "text-violet-400" },
    { label: "Uptime", value: "99.99%", color: "text-emerald-400" },
    { label: "Startup Cost", value: "$0", color: "text-amber-400" },
  ];

  return (
    <motion.div
      className="flex items-center gap-3 lg:gap-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.3 }}
    >
      {kpis.map((kpi, i) => (
        <div key={kpi.label} className="flex items-center gap-1.5">
          <span className="text-[7px] lg:text-[8px] font-mono text-slate-600">{kpi.label}</span>
          <motion.span
            className={`text-[9px] lg:text-[11px] font-mono font-black ${kpi.color}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5 + i * 0.12 }}
          >
            {kpi.value}
          </motion.span>
        </div>
      ))}
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════════════════════════

export function TechnicalEdgeSlide() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const ringRadius = 145;
  const ringCenter = 200;

  return (
    <div className="w-full h-full flex flex-col bg-[#020817] text-white relative overflow-hidden p-3 md:p-4 lg:p-6">
      {/* Background */}
      <TechBackground />

      {/* ── Header ── */}
      <div className="relative z-10 shrink-0 mb-1 lg:mb-2">
        <div className="flex items-center justify-between">
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Zap className="w-3 h-3 md:w-3.5 md:h-3.5 text-cyan-400/60" />
            <span className="text-[8px] md:text-[9px] lg:text-[10px] font-mono text-cyan-400/70 tracking-[0.2em] uppercase">
              Technical Edge
            </span>
          </motion.div>
          <motion.div
            className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded-full border border-cyan-500/15 bg-cyan-500/5"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
          >
            <span className="text-[7px] lg:text-[8px] font-mono font-bold text-cyan-400/60 uppercase tracking-widest">
              JAMstack · Edge-Native · Serverless
            </span>
          </motion.div>
        </div>

        <motion.h2
          className="text-sm md:text-lg lg:text-2xl font-black tracking-tight mt-0.5"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <span className="text-white">Built for </span>
          <span className="text-cyan-400">Performance</span>
          <span className="text-white"> & </span>
          <span className="text-violet-400">Scale</span>
        </motion.h2>

        <motion.p
          className="text-[7px] md:text-[8px] lg:text-[9px] text-slate-600 font-mono mt-0.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          An interlocking ecosystem — every component reinforces the next. Zero upfront cost.
        </motion.p>
      </div>

      {/* ── Desktop: Orbital Ring Layout ── */}
      <div className="relative z-10 hidden md:flex flex-1 min-h-0 items-center justify-center">
        <div className="relative w-full max-w-md lg:max-w-lg aspect-square">
          {/* SVG orbital rings */}
          <OrbitalRings />

          {/* Orbiting particles */}
          <OrbitingParticles />

          {/* Connection arcs between nodes */}
          <ConnectionArcs />

          {/* Center hub */}
          <CenterHub />

          {/* Ring nodes */}
          {ringNodes.map((node) => (
            <RingNodeComponent
              key={node.id}
              node={node}
              centerX={ringCenter}
              centerY={ringCenter}
              radius={ringRadius}
              onSelect={setSelectedNode}
              isSelected={selectedNode === node.id}
            />
          ))}

          {/* Capability badges on outer ring */}
          <CapabilityBadges />
        </div>
      </div>

      {/* ── Desktop: Bottom Bar ── */}
      <div className="relative z-10 hidden md:flex items-center justify-between shrink-0 mt-1 lg:mt-2">
        <PayAsYouGoBadge />
        <KPIStrip />
      </div>

      {/* ── Mobile: Condensed View ── */}
      <div className="relative z-10 flex md:hidden flex-col items-center gap-2 flex-1 justify-center min-h-0">
        {/* Mini ring preview — show logos in a circle */}
        <div className="relative w-48 h-48">
          {/* Center */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-12 h-12 rounded-full border border-cyan-500/20 flex items-center justify-center bg-cyan-500/5">
              <div className="text-[7px] font-black text-cyan-400 tracking-wider">ELMS</div>
            </div>
          </div>
          {/* Ring of logos */}
          {ringNodes.map((node, i) => {
            const angle = (node.angle * Math.PI) / 180;
            const r = 70;
            const x = 50 + (r / 96) * 50 * Math.cos(angle);
            const y = 50 + (r / 96) * 50 * Math.sin(angle);
            const LogoComp = node.Logo;
            return (
              <motion.div
                key={node.id}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${x}%`, top: `${y}%` }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.08 }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center border"
                  style={{
                    background: `radial-gradient(circle, rgba(${node.accentRgb},0.1), rgba(15,23,42,0.8))`,
                    borderColor: `rgba(${node.accentRgb},0.2)`,
                  }}
                >
                  <LogoComp className={`w-3.5 h-3.5 ${node.logoColor}`} />
                </div>
              </motion.div>
            );
          })}
          {/* Connecting ring SVG */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <circle cx="50%" cy="50%" r="36%" fill="none" stroke="rgba(56,189,248,0.08)" strokeWidth="0.5" strokeDasharray="2 4" />
          </svg>
        </div>

        {/* $0 badge */}
        <motion.div
          className="flex items-center gap-1.5 px-2 py-1 rounded-full border border-amber-500/15 bg-amber-500/5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <DollarSign className="w-2.5 h-2.5 text-amber-400" />
          <span className="text-[8px] font-bold text-amber-400">$0 to Start · Pay-as-you-go</span>
        </motion.div>

        <MobileExpandButton
          label="Tap to explore tech stack"
          onClick={() => setMobileOpen(true)}
        />
      </div>

      {/* ── Mobile Detail Modal ── */}
      <MobileDetailModal
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        title="Technical Edge"
        subtitle="Interlocking tech ecosystem · $0 to start"
      >
        <div className="space-y-4">
          {/* Tech Stack Nodes */}
          {ringNodes.map((node) => {
            const LogoComp = node.Logo;
            return (
              <div key={node.id}>
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center border shrink-0"
                    style={{
                      background: `radial-gradient(circle, rgba(${node.accentRgb},0.1), rgba(15,23,42,0.8))`,
                      borderColor: `rgba(${node.accentRgb},0.2)`,
                    }}
                  >
                    <LogoComp className={`w-4 h-4 ${node.logoColor}`} />
                  </div>
                  <div>
                    <div className={`text-xs font-bold ${node.logoColor}`}>{node.label}</div>
                    <div className="text-[8px] font-mono text-slate-600">{node.sublabel}</div>
                  </div>
                </div>
                <div className="space-y-1 ml-2.5">
                  {node.features.map((feat, j) => (
                    <div key={j} className="flex items-start gap-1.5">
                      <CheckCircle2
                        className="w-2.5 h-2.5 shrink-0 mt-px"
                        style={{ color: `rgba(${node.accentRgb},0.5)` }}
                      />
                      <span className="text-[9px] text-slate-400 leading-tight">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Capabilities */}
          <div className="pt-3 border-t border-white/5">
            <div className="text-[9px] font-mono text-slate-600 uppercase tracking-widest mb-2">
              Key Capabilities
            </div>
            <div className="flex flex-wrap gap-1.5">
              {capBadges.map((badge) => {
                const IconComp = badge.icon;
                return (
                  <div
                    key={badge.label}
                    className="flex items-center gap-1 px-2 py-1 rounded-md border border-white/5 bg-white/3"
                  >
                    <IconComp className={`w-2.5 h-2.5 ${badge.color}`} />
                    <span className="text-[8px] font-mono text-slate-400">{badge.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pay-as-you-go */}
          <div className="pt-3 border-t border-white/5">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-amber-400" />
              <div>
                <div className="text-xs font-bold text-amber-400">$0 to Start</div>
                <div className="text-[8px] font-mono text-amber-400/50">Pay-as-you-go infrastructure</div>
              </div>
            </div>
            <div className="space-y-1">
              {[
                "Supabase Free Tier — 500MB DB, 50K auth users",
                "Cloudflare Free — unlimited bandwidth, global CDN",
                "Vercel Hobby — 100GB bandwidth, edge functions",
                "GitHub Free — unlimited private repos, Actions CI",
                "Scale costs linearly with revenue, not upfront",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-2.5 h-2.5 text-amber-400/40 shrink-0 mt-px" />
                  <span className="text-[9px] text-slate-400 leading-tight">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* KPIs */}
          <div className="pt-3 border-t border-white/5">
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "Edge Latency", value: "<100ms" },
                { label: "Deploy", value: "<2 min" },
                { label: "Uptime", value: "99.99%" },
                { label: "Start Cost", value: "$0" },
              ].map((kpi) => (
                <div key={kpi.label} className="text-center">
                  <div className="text-[7px] font-mono text-slate-600">{kpi.label}</div>
                  <div className="text-sm font-mono font-black text-cyan-400">{kpi.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </MobileDetailModal>
    </div>
  );
}
