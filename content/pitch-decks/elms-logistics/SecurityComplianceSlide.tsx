"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  ShieldCheck,
  Gavel,
  Lock,
  Leaf,
  Fingerprint,
  Server,
  Eye,
  CheckCircle2,
  Activity,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import {
  MobileDetailModal,
  MobileExpandButton,
} from "./MobileDetailModal";

// ─── Types ───────────────────────────────────────────────────────
interface ComplianceCard {
  id: string;
  Icon: React.ElementType;
  title: string;
  subtitle: string;
  description: string;
  details: string[];
  color: string; // tailwind text color
  accentRgb: string; // for glows
  badgeLabel: string;
}

// ─── Data ────────────────────────────────────────────────────────
const complianceCards: ComplianceCard[] = [
  {
    id: "gdpr",
    Icon: ShieldCheck,
    title: "EU Data Sovereignty",
    subtitle: "GDPR",
    description:
      "Data strictly localized in Dublin (eu-west-1). 100% GDPR & Irish Data Protection Act 2018 compliant. Zero data residency friction.",
    details: [
      "AWS eu-west-1 (Ireland) data residency",
      "Supabase Auth with JWT + MFA",
      "Irish Data Protection Act 2018 aligned",
      "Data Processing Agreements (DPA) ready",
      "Right to erasure & portability built-in",
    ],
    color: "text-emerald-400",
    accentRgb: "16,185,129",
    badgeLabel: "EU COMPLIANT",
  },
  {
    id: "legal",
    Icon: Gavel,
    title: "Shareholder Protection",
    subtitle: "Legal",
    description:
      "Institutional-grade Shareholder Agreements. Clear IP protections and liability shielding for all investors.",
    details: [
      "Professional shareholder agreements",
      "IP ownership & licensing clarity",
      "Liability limitation framework",
      "Board governance structure defined",
      "Exit strategy & valuation clauses",
    ],
    color: "text-blue-400",
    accentRgb: "59,130,246",
    badgeLabel: "SECURED",
  },
  {
    id: "security",
    Icon: Lock,
    title: "Military-Grade Defense",
    subtitle: "Security",
    description:
      "Zero-Trust Architecture: AES-256 encryption at-rest, TLS 1.3 in-transit. PostgreSQL RLS prevents unauthorized data leakage at the kernel level.",
    details: [
      "AES-256 encryption at-rest",
      "TLS 1.3 in-transit encryption",
      "PostgreSQL Row-Level Security (RLS)",
      "Cloudflare WAF & DDoS protection",
      "Automated audit logging & SIEM",
    ],
    color: "text-cyan-400",
    accentRgb: "34,211,238",
    badgeLabel: "ZERO-TRUST",
  },
  {
    id: "eco",
    Icon: Leaf,
    title: "ESG Automation",
    subtitle: "Eco",
    description:
      "Built-in ISO 14067 carbon accounting. Meet EU environmental standards with zero manual effort. Automated scope-3 emission reporting.",
    details: [
      "Native ISO 14067 carbon tracking",
      "Automated EU scope-3 reporting",
      "Per-shipment carbon footprint calc",
      "ESG dashboard for stakeholders",
      "EU environmental regulation aligned",
    ],
    color: "text-green-400",
    accentRgb: "34,197,94",
    badgeLabel: "ISO 14067",
  },
];

// ─── EU Flag SVG (mini) ──────────────────────────────────────────
function EUFlag({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 16" className={className} fill="none">
      <rect width="24" height="16" rx="2" fill="#003399" />
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
        const cx = 12 + Math.cos(angle) * 5;
        const cy = 8 + Math.sin(angle) * 4;
        return (
          <circle key={i} cx={cx} cy={cy} r="0.7" fill="#FFD700" />
        );
      })}
    </svg>
  );
}

// ─── Floating Particles ──────────────────────────────────────────
function FloatingParticles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 24 }).map((_, i) => ({
        id: i,
        x: `${5 + Math.random() * 90}%`,
        y: `${5 + Math.random() * 90}%`,
        size: 1.5 + Math.random() * 3,
        duration: 5 + Math.random() * 8,
        delay: Math.random() * 4,
        color:
          i % 4 === 0
            ? "16,185,129"
            : i % 4 === 1
              ? "59,130,246"
              : i % 4 === 2
                ? "34,211,238"
                : "34,197,94",
      })),
    [],
  );

  return (
    <>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full pointer-events-none hidden md:block"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            background: `rgba(${p.color},0.4)`,
            boxShadow: `0 0 ${p.size * 3}px rgba(${p.color},0.25)`,
          }}
          animate={{
            y: [0, -20, 10, -15, 0],
            x: [0, 8, -6, 4, 0],
            opacity: [0.2, 0.7, 0.3, 0.6, 0.2],
            scale: [1, 1.4, 0.8, 1.2, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </>
  );
}

// ─── Orbiting Shield Ring ────────────────────────────────────────
function OrbitRing() {
  return (
    <motion.div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 lg:w-200 lg:h-200 rounded-full border border-emerald-500/4 pointer-events-none hidden md:block"
      animate={{ rotate: [0, 360] }}
      transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
    >
      {/* Orbiting dot */}
      <motion.div
        className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-emerald-400/30"
        style={{ boxShadow: "0 0 12px rgba(16,185,129,0.4)" }}
      />
      <motion.div
        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400/20"
        style={{ boxShadow: "0 0 10px rgba(34,211,238,0.3)" }}
      />
    </motion.div>
  );
}

// ─── Animated Gradient Border ────────────────────────────────────
function GlassBorder({ accentRgb, active }: { accentRgb: string; active: boolean }) {
  return (
    <>
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: `conic-gradient(from 0deg, transparent 0%, rgba(${accentRgb},${active ? 0.6 : 0.15}) 10%, transparent 20%, transparent 50%, rgba(${accentRgb},${active ? 0.4 : 0.08}) 60%, transparent 70%, transparent 100%)`,
          maskImage:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
          padding: "1.5px",
        }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: active ? 3 : 10, repeat: Infinity, ease: "linear" }}
      />
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none border"
        style={{ borderColor: `rgba(${accentRgb},0.08)` }}
      />
    </>
  );
}

// ─── Live Status Pill ────────────────────────────────────────────
function LiveStatus({ color }: { color: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="relative flex h-2 w-2">
        <span
          className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${color.replace("text-", "bg-")}`}
        />
        <span
          className={`relative inline-flex h-2 w-2 rounded-full ${color.replace("text-", "bg-")}`}
        />
      </span>
      <span className="text-[9px] lg:text-[10px] font-mono font-bold text-emerald-400/80 uppercase tracking-widest">
        Active
      </span>
    </div>
  );
}

// ─── Security Card ───────────────────────────────────────────────
function SecurityCard({
  card,
  index,
}: {
  card: ComplianceCard;
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const IconComp = card.Icon;
  const baseDelay = 0.3 + index * 0.15;

  // Staggered entry directions for visual dynamism
  const directions = [
    { x: -30, y: -20, rotate: -2 },
    { x: 30, y: -20, rotate: 2 },
    { x: -30, y: 20, rotate: 2 },
    { x: 30, y: 20, rotate: -2 },
  ];
  const dir = directions[index % 4];

  return (
    <motion.div
      className="relative rounded-2xl overflow-hidden cursor-default group"
      style={{
        background: `linear-gradient(135deg, rgba(${card.accentRgb},0.06) 0%, rgba(15,23,42,0.7) 40%, rgba(${card.accentRgb},0.03) 100%)`,
        backdropFilter: "blur(20px)",
      }}
      initial={{ opacity: 0, x: dir.x, y: dir.y, scale: 0.9, rotate: dir.rotate }}
      animate={{ opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 }}
      transition={{ delay: baseDelay, duration: 0.7, type: "spring", stiffness: 120, damping: 14 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{
        y: -6,
        scale: 1.02,
        transition: { type: "spring", stiffness: 300, damping: 18 },
      }}
    >
      {/* Animated border */}
      <GlassBorder accentRgb={card.accentRgb} active={hovered} />

      {/* Shimmer sweep on hover */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute -left-1/2 top-0 w-[200%] h-full"
              style={{
                background: `linear-gradient(105deg, transparent 40%, rgba(${card.accentRgb},0.06) 45%, rgba(${card.accentRgb},0.12) 50%, rgba(${card.accentRgb},0.06) 55%, transparent 60%)`,
              }}
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.5 }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hover glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        animate={{
          boxShadow: hovered
            ? `0 8px 40px rgba(${card.accentRgb},0.15), 0 0 80px rgba(${card.accentRgb},0.06), inset 0 1px 0 rgba(${card.accentRgb},0.1)`
            : `0 0 0px rgba(${card.accentRgb},0), inset 0 1px 0 rgba(255,255,255,0.03)`,
        }}
        transition={{ duration: 0.4 }}
      />

      {/* Content */}
      <div className="relative z-20 p-4 lg:p-5">
        {/* Top row: icon + status */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-10 h-10 lg:w-11 lg:h-11 rounded-xl flex items-center justify-center border"
              style={{
                backgroundColor: `rgba(${card.accentRgb},0.1)`,
                borderColor: `rgba(${card.accentRgb},0.25)`,
              }}
              animate={{
                boxShadow: hovered
                  ? `0 0 16px rgba(${card.accentRgb},0.4)`
                  : `0 0 0px rgba(${card.accentRgb},0)`,
                scale: hovered ? 1.08 : 1,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <IconComp className={`w-5 h-5 ${card.color}`} />
            </motion.div>
            <div>
              <div className={`text-sm lg:text-base font-bold ${card.color}`}>
                {card.title}
              </div>
              <div className="text-[10px] lg:text-xs font-mono text-slate-500 uppercase tracking-wider">
                {card.subtitle}
              </div>
            </div>
          </div>
          <LiveStatus color={card.color} />
        </div>

        {/* EU flag for GDPR card */}
        {card.id === "gdpr" && (
          <div className="flex items-center gap-2 mb-2.5">
            <EUFlag className="w-6 h-4" />
            <span className="text-[10px] lg:text-xs font-mono text-blue-400/70 tracking-wider">
              EU DATA SOVEREIGNTY
            </span>
          </div>
        )}

        {/* Description */}
        <p className="text-xs lg:text-sm text-slate-400 leading-relaxed mb-3">
          {card.description}
        </p>

        {/* Details list */}
        <div className="space-y-1.5">
          {card.details.slice(0, 3).map((detail, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-2 text-[10px] lg:text-xs text-slate-500"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: baseDelay + 0.3 + i * 0.1 }}
            >
              <CheckCircle2 className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-emerald-500/60 shrink-0" />
              <span>{detail}</span>
            </motion.div>
          ))}
        </div>

        {/* Badge */}
        <motion.div
          className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[9px] lg:text-[10px] font-mono font-bold uppercase tracking-widest"
          style={{
            backgroundColor: `rgba(${card.accentRgb},0.08)`,
            borderColor: `rgba(${card.accentRgb},0.25)`,
            color: `rgba(${card.accentRgb},0.85)`,
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: baseDelay + 0.5 }}
          whileHover={{ scale: 1.05 }}
        >
          <ShieldCheck className="w-3 h-3" />
          {card.badgeLabel}
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Trust Score Counter ─────────────────────────────────────────
function TrustScore() {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(count, 100, {
      duration: 2.5,
      delay: 1.2,
      ease: "easeOut",
    });
    const unsub = rounded.on("change", (v) => setDisplay(v));
    return () => {
      controls.stop();
      unsub();
    };
  }, [count, rounded]);

  return (
    <motion.div
      className="flex items-center gap-4 lg:gap-5"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.0, type: "spring", stiffness: 100 }}
    >
      {/* Score bar */}
      <div className="flex items-center gap-3 flex-1 max-w-sm">
        <span className="text-[10px] lg:text-xs font-mono text-slate-500 shrink-0">Trust Score</span>
        <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-linear-to-r from-emerald-500 via-cyan-400 to-blue-500"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 1.2, duration: 2.5, ease: "easeOut" }}
          />
        </div>
        <motion.span
          className="text-base lg:text-lg font-mono font-black text-emerald-400 w-12 text-right"
          animate={{ scale: display === 100 ? [1, 1.15, 1] : 1 }}
          transition={{ duration: 0.3 }}
        >
          {display}%
        </motion.span>
      </div>

      {/* Cert badges */}
      <div className="hidden lg:flex items-center gap-2">
        {["GDPR", "ISO", "SOC2"].map((cert, i) => (
          <motion.span
            key={cert}
            className="text-[9px] lg:text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border border-emerald-500/20 bg-emerald-500/5 text-emerald-400/70 tracking-wider"
            initial={{ opacity: 0, scale: 0.8, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 1.8 + i * 0.15, type: "spring" }}
            whileHover={{ scale: 1.1, borderColor: "rgba(16,185,129,0.4)" }}
          >
            {cert}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Background Security Grid ────────────────────────────────────
function SecurityBackground() {
  return (
    <>
      {/* Hex grid pattern */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="secGrid"
              width="40"
              height="46"
              patternUnits="userSpaceOnUse"
              patternTransform="scale(1)"
            >
              <path
                d="M20 0 L40 12 L40 34 L20 46 L0 34 L0 12 Z"
                fill="none"
                stroke="rgba(16,185,129,0.04)"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#secGrid)" />
        </svg>
      </div>

      {/* Animated glow spots */}
      <motion.div
        className="absolute top-1/4 left-1/5 w-72 h-72 bg-emerald-500/5 rounded-full blur-[100px]"
        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-cyan-500/4 rounded-full blur-[100px]"
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/3 rounded-full blur-[120px]"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
      />

      {/* Floating particles */}
      <FloatingParticles />

      {/* Orbiting ring */}
      <OrbitRing />

      {/* Floating security icons with more lively animation */}
      {[
        { Icon: Fingerprint, x: "8%", y: "22%", size: 22, delay: 0 },
        { Icon: Eye, x: "90%", y: "28%", size: 20, delay: 1 },
        { Icon: Server, x: "10%", y: "72%", size: 18, delay: 2 },
        { Icon: Activity, x: "87%", y: "74%", size: 20, delay: 1.5 },
        { Icon: Sparkles, x: "50%", y: "12%", size: 16, delay: 3 },
        { Icon: Lock, x: "75%", y: "85%", size: 16, delay: 2.5 },
      ].map(({ Icon, x, y, size, delay }, i) => (
        <motion.div
          key={i}
          className="absolute text-slate-600/60 hidden md:block"
          style={{ left: x, top: y }}
          animate={{
            opacity: [0.03, 0.1, 0.05, 0.08, 0.03],
            rotate: [0, 8, -8, 4, 0],
            y: [0, -6, 3, -3, 0],
          }}
          transition={{
            opacity: { duration: 5 + i, repeat: Infinity, delay },
            rotate: { duration: 8 + i * 2, repeat: Infinity, delay },
            y: { duration: 6 + i, repeat: Infinity, delay, ease: "easeInOut" },
          }}
        >
          <Icon style={{ width: size, height: size }} />
        </motion.div>
      ))}
    </>
  );
}

// ─── Main Slide Component ────────────────────────────────────────
export function SecurityComplianceSlide() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center bg-linear-to-br from-slate-950 via-[#060a14] to-slate-950 text-white relative overflow-hidden p-3 md:p-5 lg:p-8">
      {/* Background */}
      <SecurityBackground />

      {/* ── Header ── */}
      <motion.div
        className="relative z-10 text-center mb-3 md:mb-5 lg:mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
      >
        <motion.div
          className="flex items-center justify-center gap-2 mb-1.5"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Lock className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-400/60" />
          <span className="text-xs md:text-sm lg:text-base font-mono text-emerald-400/70 tracking-[0.25em] uppercase">
            Security Command Center
          </span>
          <Lock className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-400/60" />
        </motion.div>

        <motion.h2
          className="text-lg md:text-2xl lg:text-3xl font-black tracking-tight"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 120 }}
        >
          <span className="text-white">Security</span>
          <motion.span
            className="text-emerald-400 mx-1.5 md:mx-2.5 inline-block"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            &
          </motion.span>
          <span className="text-white">Compliance</span>
        </motion.h2>

        <motion.p
          className="mt-1.5 text-[10px] md:text-xs lg:text-sm text-slate-500 font-mono max-w-xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          Enterprise-grade protection · Supabase Auth · PostgreSQL RLS · Cloudflare WAF
        </motion.p>
      </motion.div>

      {/* ── Desktop: 2×2 Card Grid ── */}
      <div className="relative z-10 hidden md:grid grid-cols-2 gap-4 lg:gap-5 w-full max-w-4xl flex-1 min-h-0">
        {complianceCards.map((card, i) => (
          <SecurityCard key={card.id} card={card} index={i} />
        ))}
      </div>

      {/* ── Mobile: Condensed view ── */}
      <div className="relative z-10 flex md:hidden flex-col items-center gap-3 flex-1 justify-center min-h-0 w-full">
        {/* Mini card preview */}
        <div className="grid grid-cols-2 gap-2.5 w-full max-w-xs">
          {complianceCards.map((card, i) => {
            const IconComp = card.Icon;
            return (
              <motion.div
                key={card.id}
                className="relative rounded-xl p-3 border"
                style={{
                  background: `linear-gradient(135deg, rgba(${card.accentRgb},0.06) 0%, rgba(15,23,42,0.6) 100%)`,
                  borderColor: `rgba(${card.accentRgb},0.15)`,
                }}
                initial={{ opacity: 0, y: 12, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.2 + i * 0.1, type: "spring" }}
              >
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div
                    className="w-6 h-6 rounded-md flex items-center justify-center"
                    style={{ backgroundColor: `rgba(${card.accentRgb},0.12)` }}
                  >
                    <IconComp className={`w-3.5 h-3.5 ${card.color}`} />
                  </div>
                  <LiveStatus color={card.color} />
                </div>
                <div className={`text-[10px] font-bold ${card.color}`}>
                  {card.title}
                </div>
                <div className="text-[9px] text-slate-600 font-mono">
                  {card.subtitle}
                </div>
              </motion.div>
            );
          })}
        </div>

        <MobileExpandButton
          label="Tap to view security details"
          onClick={() => setMobileOpen(true)}
        />
      </div>

      {/* ── Trust Score (desktop) ── */}
      <div className="relative z-10 mt-3 md:mt-4 w-full max-w-4xl hidden md:block">
        <TrustScore />
      </div>

      {/* ── Mobile Detail Modal ── */}
      <MobileDetailModal
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        title="Security & Compliance"
        subtitle="4 pillars · Enterprise-grade protection"
      >
        <div className="space-y-4">
          {complianceCards.map((card) => {
            const IconComp = card.Icon;
            return (
              <div key={card.id}>
                {/* Header */}
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center border"
                    style={{
                      backgroundColor: `rgba(${card.accentRgb},0.1)`,
                      borderColor: `rgba(${card.accentRgb},0.2)`,
                    }}
                  >
                    <IconComp className={`w-4.5 h-4.5 ${card.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${card.color}`}>
                        {card.title}
                      </span>
                      <LiveStatus color={card.color} />
                    </div>
                    <span className="text-[9px] font-mono text-slate-600 uppercase tracking-wider">
                      {card.subtitle}
                    </span>
                  </div>
                </div>

                {/* EU flag for GDPR */}
                {card.id === "gdpr" && (
                  <div className="flex items-center gap-2 mb-1.5">
                    <EUFlag className="w-6 h-4" />
                    <span className="text-[9px] font-mono text-blue-400/60">
                      EU DATA SOVEREIGNTY
                    </span>
                  </div>
                )}

                {/* Description */}
                <p className="text-xs text-slate-400 leading-relaxed mb-2">
                  {card.description}
                </p>

                {/* All details */}
                <div className="space-y-1.5">
                  {card.details.map((detail, j) => (
                    <div
                      key={j}
                      className="flex items-center gap-2 text-[10px] text-slate-500"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-500/50 shrink-0" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>

                {/* Badge */}
                <div
                  className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[8px] font-mono font-bold uppercase tracking-widest"
                  style={{
                    backgroundColor: `rgba(${card.accentRgb},0.08)`,
                    borderColor: `rgba(${card.accentRgb},0.2)`,
                    color: `rgba(${card.accentRgb},0.8)`,
                  }}
                >
                  <ShieldCheck className="w-3 h-3" />
                  {card.badgeLabel}
                </div>
              </div>
            );
          })}

          {/* Trust score in modal */}
          <div className="pt-3 border-t border-white/5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-500">Trust Score</span>
              <span className="text-base font-mono font-black text-emerald-400">100%</span>
            </div>
            <div className="h-2 rounded-full bg-white/5 overflow-hidden mt-1.5">
              <div className="h-full w-full rounded-full bg-linear-to-r from-emerald-500 via-cyan-400 to-blue-500" />
            </div>
            <div className="flex items-center gap-2 mt-2">
              {["GDPR", "ISO", "SOC2"].map((cert) => (
                <span
                  key={cert}
                  className="text-[8px] font-mono font-bold px-2 py-0.5 rounded-md border border-emerald-500/20 bg-emerald-500/5 text-emerald-400/70 tracking-wider"
                >
                  {cert}
                </span>
              ))}
            </div>
          </div>
        </div>
      </MobileDetailModal>
    </div>
  );
}
