"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  XCircle,
  CheckCircle2,
  Zap,
  Sparkles,
  Monitor,
  Cpu,
  Link2,
  ShieldAlert,
  Leaf,
  Radio,
  BrainCircuit,
  DollarSign,
  TrendingDown,
  BadgeCheck,
  AlertTriangle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MobileDetailModal,
  MobileExpandButton,
} from "./MobileDetailModal";

// ─── Types ───────────────────────────────────────────────────────
interface ComparisonRow {
  dimension: string;
  icon: React.ReactNode;
  traditional: { tag: string; text: string };
  elms: { tag: string; text: string };
  elmsExclusive?: boolean;
}

// ─── Data ────────────────────────────────────────────────────────
const comparisonRows: ComparisonRow[] = [
  {
    dimension: "System Integration",
    icon: <Link2 className="w-5 h-5 lg:w-6 lg:h-6" />,
    traditional: { tag: "Siloed", text: "Fragmented manual sync" },
    elms: { tag: "Unified", text: "Instant API Ecosystem" },
  },
  {
    dimension: "Customs",
    icon: <ShieldAlert className="w-5 h-5 lg:w-6 lg:h-6" />,
    traditional: { tag: "Manual", text: "Error-prone paper trails" },
    elms: { tag: "Auto-Pilot", text: "100% Validated Digital" },
  },
  {
    dimension: "Sustainability",
    icon: <Leaf className="w-5 h-5 lg:w-6 lg:h-6" />,
    traditional: { tag: "Blind", text: "Zero visibility on Carbon" },
    elms: { tag: "Eco-Compliant", text: "Native ISO Tracking" },
  },
  {
    dimension: "IoT / Real-time",
    icon: <Radio className="w-5 h-5 lg:w-6 lg:h-6" />,
    traditional: { tag: "Delayed", text: "Batch-processed data" },
    elms: { tag: "Live", text: "Real-time Edge Intelligence" },
  },
  {
    dimension: "AI / MCP",
    icon: <BrainCircuit className="w-5 h-5 lg:w-6 lg:h-6" />,
    traditional: { tag: "None", text: "Static legacy software" },
    elms: { tag: "Autonomous", text: "MCP-Native AI Agent" },
    elmsExclusive: true,
  },
  {
    dimension: "Cost Model",
    icon: <DollarSign className="w-5 h-5 lg:w-6 lg:h-6" />,
    traditional: { tag: "Fixed", text: "Heavy upfront licensing" },
    elms: { tag: "Elastic", text: "Scalable Pay-as-you-go" },
  },
];

// ─── Animated Check Icon (pathLength draw) ───────────────────────
function AnimatedCheck({ delay }: { delay: number }) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      className="w-6 h-6 lg:w-7 lg:h-7 shrink-0"
      fill="none"
      initial="hidden"
      animate="visible"
    >
      <motion.circle
        cx="12"
        cy="12"
        r="10"
        stroke="rgba(52,211,153,0.3)"
        strokeWidth="1.5"
        fill="none"
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          visible: {
            pathLength: 1,
            opacity: 1,
            transition: { delay, duration: 0.5, ease: "easeOut" },
          },
        }}
      />
      <motion.path
        d="M8 12.5l2.5 2.5 5-5"
        stroke="rgb(52,211,153)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          visible: {
            pathLength: 1,
            opacity: 1,
            transition: {
              delay: delay + 0.3,
              duration: 0.4,
              ease: "easeOut",
            },
          },
        }}
      />
    </motion.svg>
  );
}

// ─── Radar Pulse Waves (ELMS background) ─────────────────────────
function RadarPulseWaves() {
  const waves = Array.from({ length: 5 }, (_, i) => ({
    id: i,
    delay: i * 1.2,
    duration: 6,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center">
      {waves.map((w) => (
        <motion.div
          key={w.id}
          className="absolute rounded-full border border-emerald-400/30"
          style={{ width: 20, height: 20 }}
          animate={{
            width: ["20px", "120%"],
            height: ["20px", "120%"],
            opacity: [0.6, 0],
            borderWidth: ["2px", "0.5px"],
          }}
          transition={{
            duration: w.duration,
            repeat: Infinity,
            delay: w.delay,
            ease: "easeOut",
          }}
        />
      ))}
      {/* Central dot */}
      <motion.div
        className="absolute w-3 h-3 rounded-full bg-emerald-400/60"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Radar sweep line */}
      <motion.div
        className="absolute"
        style={{
          width: "70%",
          height: "1px",
          background: "linear-gradient(to right, rgba(16,185,129,0.5), transparent)",
          left: "50%",
          top: "50%",
          transformOrigin: "0% 50%",
        }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

// ─── Falling Debris / Decay Particles (Traditional background) ──
function DecayParticles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => ({
        id: i,
        left: `${5 + ((i * 37 + 13) % 90)}%`,
        size: 1.5 + ((i * 17 + 7) % 30) / 10,
        duration: 3 + ((i * 23 + 11) % 40) / 10,
        delay: ((i * 31 + 5) % 50) / 10,
        opacity: 0.12 + ((i * 19 + 3) % 20) / 100,
        rotate: ((i * 41 + 9) % 360),
        rotateEnd: ((i * 53 + 7) % 720) - 360,
        borderRadius: i % 2 === 0 ? "50%" : "1px",
        xDrift: ((i * 29 + 3) % 30) - 15,
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute bg-red-400/40"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            borderRadius: p.borderRadius,
          }}
          animate={{
            y: ["-10%", "110%"],
            opacity: [0, p.opacity, p.opacity, 0],
            rotate: [p.rotate, p.rotateEnd],
            x: [0, p.xDrift],
          }}
          transition={{
            y: { duration: p.duration, repeat: Infinity, delay: p.delay, ease: [0.2, 0, 0.8, 1] },
            opacity: {
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              times: [0, 0.1, 0.8, 1],
            },
            rotate: { duration: p.duration, repeat: Infinity, delay: p.delay, ease: "linear" },
            x: { duration: p.duration, repeat: Infinity, delay: p.delay, ease: "easeInOut" },
          }}
        />
      ))}
    </div>
  );
}

// ─── Glitch / Static Noise Overlay (Traditional) ─────────────────
function StaticNoise() {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none opacity-[0.04] z-10"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        backgroundSize: "128px 128px",
      }}
      animate={{
        backgroundPosition: ["0px 0px", "128px 128px"],
      }}
      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
    />
  );
}

// ─── Horizontal Glitch Lines (Traditional) ───────────────────────
function GlitchLines() {
  const lines = useMemo(
    () =>
      Array.from({ length: 4 }, (_, i) => ({
        id: i,
        top: `${15 + ((i * 37 + 11) % 70)}%`,
        delay: 2 + ((i * 23 + 7) % 60) / 10,
        duration: 0.15 + ((i * 17 + 3) % 10) / 100,
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {lines.map((l) => (
        <motion.div
          key={l.id}
          className="absolute left-0 right-0 h-px bg-red-400/25"
          style={{ top: l.top }}
          animate={{
            opacity: [0, 0, 0.8, 1, 0.6, 0, 0],
            scaleX: [0, 0, 1, 1, 1, 0, 0],
          }}
          transition={{
            duration: l.duration + 3,
            repeat: Infinity,
            delay: l.delay,
            times: [0, 0.42, 0.45, 0.48, 0.52, 0.55, 1],
          }}
        />
      ))}
    </div>
  );
}

// ─── Crumbling Edge Cracks (Traditional) ─────────────────────────
function CrumblingEdge() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-30">
      <motion.line
        x1="85%" y1="0%" x2="95%" y2="15%"
        stroke="rgba(239,68,68,0.4)" strokeWidth="0.8"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 1.5, duration: 1.5, ease: "easeOut" }}
      />
      <motion.line
        x1="90%" y1="75%" x2="100%" y2="90%"
        stroke="rgba(239,68,68,0.3)" strokeWidth="0.6"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 2.5, duration: 1.5, ease: "easeOut" }}
      />
      <motion.line
        x1="0%" y1="85%" x2="12%" y2="100%"
        stroke="rgba(239,68,68,0.3)" strokeWidth="0.6"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 2, duration: 1.2, ease: "easeOut" }}
      />
      <motion.line
        x1="0%" y1="10%" x2="8%" y2="0%"
        stroke="rgba(239,68,68,0.25)" strokeWidth="0.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 3, duration: 1.0, ease: "easeOut" }}
      />
    </svg>
  );
}

// ─── Glowing Border Animation (ELMS Card) ────────────────────────
function GlowBorder() {
  return (
    <>
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0%, rgba(16,185,129,0.4) 10%, transparent 20%, transparent 100%)",
          maskImage:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
          padding: "1.5px",
        }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      />
      <div className="absolute inset-0 rounded-2xl border border-emerald-500/20 pointer-events-none" />
    </>
  );
}

// ─── Flickering Warning Icon (Traditional header) ────────────────
function FlickeringWarning() {
  return (
    <motion.div
      className="absolute top-3 right-4 z-20"
      animate={{
        opacity: [0, 0, 0.7, 0.3, 0.8, 0, 0],
      }}
      transition={{ duration: 4, repeat: Infinity, times: [0, 0.4, 0.42, 0.45, 0.47, 0.5, 1] }}
    >
      <AlertTriangle className="w-5 h-5 text-red-400/60" />
    </motion.div>
  );
}

// ─── Feature Row (spans across both cards) ───────────────────────
function FeatureRow({
  row,
  index,
  totalRows,
}: {
  row: ComparisonRow;
  index: number;
  totalRows: number;
}) {
  const [hovered, setHovered] = useState(false);
  const baseDelay = 0.6 + index * 0.12;

  return (
    <motion.div
      className="grid grid-cols-[1fr_auto_1fr] items-stretch cursor-default group"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: baseDelay, duration: 0.4, ease: "easeOut" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── Traditional side (left-aligned, transparent bg so decay effects show through) ── */}
      <div className="flex items-center gap-2 lg:gap-3 px-4 lg:px-6 py-2.5 lg:py-3">
        <XCircle className="w-5 h-5 lg:w-6 lg:h-6 text-red-400/40 shrink-0" />
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[18px] lg:text-[20px] font-mono font-bold text-red-400/50 uppercase tracking-wider">
              {row.traditional.tag}
            </span>
          </div>
          <span className="text-[14px] lg:text-[16px] text-slate-500/80 leading-snug block">
            {row.traditional.text}
          </span>
        </div>
      </div>

      {/* ── Center dimension label ── */}
      <div className="flex flex-col items-center justify-center px-2 lg:px-4 relative">
        <motion.div
          className="w-12 h-12 lg:w-14 lg:h-14 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-500"
          animate={{
            borderColor: hovered
              ? "rgba(52,211,153,0.4)"
              : "rgba(255,255,255,0.1)",
            scale: hovered ? 1.1 : 1,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {row.icon}
        </motion.div>
        <span className="text-[14px] lg:text-[16px] font-mono text-slate-600 mt-1 text-center leading-tight whitespace-nowrap">
          {row.dimension}
        </span>
      </div>

      {/* ── ELMS side (left-aligned from card edge) ── */}
      <motion.div
        className="flex items-center gap-2 lg:gap-3 px-4 lg:px-6 py-2.5 lg:py-3 rounded-lg"
        animate={{
          backgroundColor: hovered
            ? "rgba(16,185,129,0.08)"
            : "rgba(0,0,0,0)",
          scale: hovered ? 1.02 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <AnimatedCheck delay={baseDelay + 0.2} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[18px] lg:text-[20px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
              {row.elms.tag}
            </span>
            {row.elmsExclusive && (
              <motion.span
                className="text-[14px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 uppercase tracking-wider"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: baseDelay + 0.5 }}
              >
                Exclusive
              </motion.span>
            )}
          </div>
          <span className="text-[14px] lg:text-[16px] text-emerald-200/80 leading-snug block">
            {row.elms.text}
          </span>
        </div>
      </motion.div>

      {/* Divider line */}
      {index < totalRows - 1 && (
        <div className="col-span-3 h-px bg-white/5 mx-3" />
      )}
    </motion.div>
  );
}

// ─── Main Slide Component ────────────────────────────────────────
export function VersusComparisonSlide() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center bg-linear-to-br from-slate-950 via-[#060b18] to-slate-950 text-white relative overflow-hidden p-3 md:p-5 lg:p-8">
      {/* Background grid dots */}
      <div className="absolute inset-0 opacity-30">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="vsGrid" width="36" height="36" patternUnits="userSpaceOnUse">
              <circle cx="18" cy="18" r="0.5" fill="rgba(148,163,184,0.08)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#vsGrid)" />
        </svg>
      </div>

      {/* Accent glows */}
      <div className="absolute top-1/3 left-1/6 w-60 h-60 bg-red-500/3 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/3 right-1/6 w-60 h-60 bg-emerald-500/5 rounded-full blur-[100px]" />

      {/* ── Header ── */}
      <motion.div
        className="relative z-10 text-center mb-3 md:mb-4 lg:mb-6"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-center gap-2 mb-1">
          <Zap className="w-4 h-4 md:w-5 md:h-5 text-blue-400/60" />
          <span className="text-[18px] md:text-[20px] lg:text-2xl font-mono text-blue-400/70 tracking-[0.25em] uppercase">
            Competitive Advantage
          </span>
          <Zap className="w-4 h-4 md:w-5 md:h-5 text-blue-400/60" />
        </div>
        <h2 className="text-2xl md:text-3xl lg:text-5xl font-black tracking-tight">
          <span className="text-slate-400">Why</span>
          <span className="text-white mx-1.5 md:mx-2">ELMS</span>
          <span className="text-slate-400">?</span>
        </h2>
      </motion.div>

      {/* ── Desktop: Versus Layout ── */}
      <div className="relative z-10 hidden md:flex w-full max-w-5xl flex-1 min-h-0 gap-0 items-stretch">
        {/* ═══ LEFT CARD: Traditional ═══ */}
        <motion.div
          className="flex-1 flex flex-col rounded-2xl border border-dashed border-white/8 bg-slate-900/50 overflow-hidden relative"
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, duration: 0.6, ease: "easeOut" }}
        >

          {/* Header image area */}
          <div className="relative h-20 lg:h-24 shrink-0 overflow-hidden z-20">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, rgba(120,90,60,0.15) 0%, rgba(80,60,40,0.1) 50%, rgba(30,20,15,0.2) 100%)",
              }}
            />
            {/* Dusty paper texture overlay */}
            <div className="absolute inset-0 opacity-20">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="paperTexture" width="8" height="8" patternUnits="userSpaceOnUse">
                    <rect width="8" height="8" fill="rgba(180,160,120,0.06)" />
                    <circle cx="4" cy="4" r="0.3" fill="rgba(180,160,120,0.15)" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#paperTexture)" />
              </svg>
            </div>

            {/* Flickering warning */}
            <FlickeringWarning />

            <div className="absolute inset-0 flex items-center px-4 lg:px-5 gap-3">
              {/* Slightly shaking icon */}
              <motion.div
                className="w-11 h-11 lg:w-12 lg:h-12 rounded-xl bg-slate-800/60 border border-white/5 flex items-center justify-center"
                animate={{
                  x: [0, -1.5, 2, -1, 0.5, 0],
                  rotate: [0, -0.8, 0.6, -0.3, 0],
                }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <Monitor className="w-6 h-6 lg:w-7 lg:h-7 text-slate-500/60" />
              </motion.div>
              <div>
                <motion.div
                  className="text-[18px] lg:text-[22px] font-bold text-slate-400/70"
                  animate={{ opacity: [0.7, 0.4, 0.7, 0.5, 0.7] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  Traditional Logistics
                </motion.div>
                <div className="text-[14px] lg:text-[16px] font-mono text-slate-600 tracking-wider">
                  LEGACY FRICTION
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-px bg-white/5" />
          </div>

          {/* Rows (left half only rendered via the FeatureRow grid) */}
          <div className="flex-1 flex flex-col justify-center" />
        </motion.div>

        {/* ═══ CENTER DIVIDER: VS ═══ */}
        <div className="relative w-10 lg:w-12 shrink-0 flex items-center justify-center z-30">
          {/* Vertical glow line */}
          <div
            className="absolute top-4 bottom-4 w-px left-1/2 -translate-x-1/2"
            style={{
              background:
                "linear-gradient(to bottom, transparent 0%, rgba(52,211,153,0.3) 30%, rgba(59,130,246,0.3) 70%, transparent 100%)",
            }}
          />
          {/* VS badge */}
          <motion.div
            className="relative w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center z-10"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: 0.5,
              type: "spring",
              stiffness: 400,
              damping: 15,
            }}
          >
            <motion.span
              className="text-[18px] lg:text-[20px] font-black text-white/70 tracking-wider"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              VS
            </motion.span>
          </motion.div>
        </div>

        {/* ═══ RIGHT CARD: ELMS ═══ */}
        <motion.div
          className="flex-1 flex flex-col rounded-2xl overflow-hidden relative"
          style={{
            boxShadow: "0 0 30px rgba(16,185,129,0.12), 0 0 60px rgba(16,185,129,0.05)",
          }}
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
        >
          {/* Glassmorphism background */}
          <div className="absolute inset-0 bg-linear-to-br from-blue-600/15 via-slate-900/50 to-emerald-600/15 backdrop-blur-xl" />

          {/* Animated border glow */}
          <GlowBorder />

          {/* Radar pulse waves */}
          <RadarPulseWaves />

          {/* Header image area */}
          <div className="relative h-20 lg:h-24 shrink-0 overflow-hidden z-10">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(59,130,246,0.06) 50%, rgba(16,185,129,0.1) 100%)",
              }}
            />
            {/* Subtle digital grid */}
            <div className="absolute inset-0 opacity-40">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="digiGrid" width="12" height="12" patternUnits="userSpaceOnUse">
                    <rect width="12" height="12" fill="none" stroke="rgba(16,185,129,0.06)" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#digiGrid)" />
              </svg>
            </div>
            {/* Floating cube glow */}
            <motion.div
              className="absolute top-1/2 right-5 -translate-y-1/2 w-10 h-10 lg:w-12 lg:h-12 rounded-lg border border-emerald-400/30"
              style={{
                background:
                  "linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(59,130,246,0.1) 100%)",
                boxShadow:
                  "0 0 15px rgba(16,185,129,0.2), inset 0 0 10px rgba(16,185,129,0.1)",
              }}
              animate={{
                rotate: [0, 6, -3, 0],
                scale: [1, 1.05, 0.98, 1],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <Cpu className="w-5 h-5 lg:w-6 lg:h-6 text-emerald-400/70" />
              </div>
            </motion.div>
            <div className="absolute inset-0 flex items-center px-4 lg:px-5 gap-3 z-10">
              <div className="w-11 h-11 lg:w-12 lg:h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <Sparkles className="w-6 h-6 lg:w-7 lg:h-7 text-emerald-400" />
              </div>
              <div>
                <div className="text-[18px] lg:text-[22px] font-bold text-emerald-300">
                  ELMS Platform
                </div>
                <div className="text-[14px] lg:text-[16px] font-mono text-emerald-400/60 tracking-wider">
                  THE FUTURE
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-px bg-emerald-500/10" />
          </div>

          {/* Rows (right half only rendered via the FeatureRow grid) */}
          <div className="flex-1 flex flex-col justify-center" />
        </motion.div>

        {/* ═══ OVERLAY: Feature Rows spanning both cards ═══ */}
        <div className="absolute inset-0 z-20 flex flex-col pointer-events-none">
          {/* Spacer for header area */}
          <div className="h-20 lg:h-24 shrink-0" />

          {/* Feature rows */}
          <div className="flex-1 flex flex-col justify-center px-0 pointer-events-auto">
            {comparisonRows.map((row, i) => (
              <FeatureRow
                key={row.dimension}
                row={row}
                index={i}
                totalRows={comparisonRows.length}
              />
            ))}
          </div>
        </div>

        {/* ═══ DECAY EFFECTS: Rendered ABOVE the overlay, left half only ═══ */}
        <div className="absolute top-0 left-0 bottom-0 w-[calc(50%-20px)] z-25 pointer-events-none rounded-2xl overflow-hidden">
          <DecayParticles />
          <StaticNoise />
          <GlitchLines />
          <CrumblingEdge />
          {/* Fading red vignette */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse at center, transparent 30%, rgba(127,29,29,0.12) 100%)",
            }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* ── Mobile: Condensed view ── */}
      <div className="relative z-10 flex md:hidden flex-col items-center gap-3 flex-1 justify-center min-h-0 w-full">
        {/* Mini VS visual */}
        <div className="flex items-center gap-3">
          <motion.div
            className="px-3 py-2 rounded-xl border border-dashed border-white/10 bg-slate-900/50"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Monitor className="w-5 h-5 text-slate-500/60 mx-auto mb-1" />
            <div className="text-[16px] font-mono text-slate-500 text-center">Traditional</div>
          </motion.div>

          <motion.div
            className="text-[20px] font-black text-white/50"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.35, type: "spring" }}
          >
            VS
          </motion.div>

          <motion.div
            className="px-3 py-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5"
            style={{ boxShadow: "0 0 15px rgba(16,185,129,0.1)" }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Sparkles className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
            <div className="text-[16px] font-mono text-emerald-400 text-center">ELMS</div>
          </motion.div>
        </div>

        {/* Score summary */}
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <span className="text-red-400/60 text-[18px] font-mono">0/6</span>
          <span className="text-slate-600 text-[18px]">vs</span>
          <span className="text-emerald-400 text-[18px] font-mono font-bold">6/6</span>
          <BadgeCheck className="w-5 h-5 text-emerald-400" />
        </motion.div>

        <MobileExpandButton
          label="Tap to compare all features"
          onClick={() => setMobileOpen(true)}
        />
      </div>

      {/* ── Bottom stats (desktop) ── */}
      <motion.div
        className="relative z-10 mt-2 md:mt-3 hidden md:flex items-center justify-center gap-4 lg:gap-6 text-[18px] font-mono text-slate-600"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8 }}
      >
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>
            <span className="text-emerald-400 font-bold">6/6</span> advantages
          </span>
        </div>
        <div className="h-4 w-px bg-slate-700" />
        <div className="flex items-center gap-1.5">
          <TrendingDown className="w-5 h-5 text-emerald-400" />
          <span>
            <span className="text-emerald-400 font-bold">50%+</span> cost reduction
          </span>
        </div>
        <div className="h-4 w-px bg-slate-700" />
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <span>
            <span className="text-cyan-400 font-bold">MCP-Native</span> AI exclusive
          </span>
        </div>
      </motion.div>

      {/* ── Mobile Detail Modal ── */}
      <MobileDetailModal
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        title="Why ELMS?"
        subtitle="6 dimensions · Head-to-head comparison"
      >
        <div className="space-y-3">
          {comparisonRows.map((row) => (
            <div
              key={row.dimension}
              className="rounded-xl border border-white/5 overflow-hidden"
            >
              {/* Dimension header */}
              <div className="flex items-center gap-2 px-3 py-2 bg-white/3 border-b border-white/5">
                <span className="text-slate-400">{row.icon}</span>
                <span className="text-[20px] font-bold text-white/80">{row.dimension}</span>
                {row.elmsExclusive && (
                  <span className="text-[14px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 uppercase">
                    Exclusive
                  </span>
                )}
              </div>

              {/* Traditional */}
              <div className="flex items-center gap-2 px-3 py-2 border-b border-white/3">
                <XCircle className="w-5 h-5 text-red-400/40 shrink-0" />
                <div>
                  <span className="text-[16px] font-mono font-bold text-red-400/50 uppercase mr-1">
                    {row.traditional.tag}:
                  </span>
                  <span className="text-[14px] text-slate-500">
                    {row.traditional.text}
                  </span>
                </div>
              </div>

              {/* ELMS */}
              <div className="flex items-center gap-2 px-3 py-2 bg-emerald-500/5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-[16px] font-mono font-bold text-emerald-400 uppercase mr-1">
                    {row.elms.tag}:
                  </span>
                  <span className="text-[14px] text-emerald-200/80">
                    {row.elms.text}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </MobileDetailModal>
    </div>
  );
}
