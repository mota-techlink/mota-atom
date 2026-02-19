"use client";

import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  PieChart as PieChartIcon,
  ShieldCheck,
  Cpu,
  Globe,
  Lock,
  Rocket,
  Crown,
  Clock,
  ArrowRight,
  Zap,
  Target,
} from "lucide-react";
import { motion, useMotionValue, animate } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import {
  MobileDetailModal,
  MobileExpandButton,
} from "./MobileDetailModal";

// ─── Color Palette ───────────────────────────────────────────────
const DEEP_BLUE = "#0a1628";
const METALLIC_GOLD = "#d4a853";
const GOLD_LIGHT = "#f0d48a";
const GOLD_DIM = "rgba(212,168,83,0.6)";
const NAVY_ACCENT = "#1a2744";
const EQUITY_BLUE = "#2563eb";
const INVESTOR_GOLD = "#d4a853";

// ─── Fund Allocation Data ────────────────────────────────────────
const fundAllocation = [
  {
    name: "Product R&D & AI",
    value: 40,
    amount: "€60,000",
    color: "#3b82f6",
    icon: <Cpu className="w-4 h-4" />,
    description: "Continuous module iteration, AI agent development & integration",
  },
  {
    name: "Market & Operations",
    value: 30,
    amount: "€45,000",
    color: METALLIC_GOLD,
    icon: <Globe className="w-4 h-4" />,
    description: "18-month admin, market expansion & merchant onboarding",
  },
  {
    name: "Security & Compliance",
    value: 20,
    amount: "€30,000",
    color: "#10b981",
    icon: <Lock className="w-4 h-4" />,
    description: "EU high-standard servers, GDPR audit & legal compliance",
  },
  {
    name: "Contingency Reserve",
    value: 10,
    amount: "€15,000",
    color: "#8b5cf6",
    icon: <ShieldCheck className="w-4 h-4" />,
    description: "Risk buffer for logistics market fluctuations",
  },
];

// ─── Animated Counter ────────────────────────────────────────────
function AnimatedCounter({
  target,
  prefix = "",
  suffix = "",
  duration = 2,
  delay = 0,
  className = "",
}: {
  target: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  delay?: number;
  className?: string;
}) {
  const count = useMotionValue(0);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(count, target, {
      duration,
      delay,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return controls.stop;
  }, [count, target, duration, delay]);

  return (
    <span className={className}>
      {prefix}
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

// ─── Custom Pie Chart Tooltip ────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const data = payload[0];
  return (
    <div className="bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 shadow-2xl max-w-56">
      <div className="text-sm font-bold text-white/90">{data.name}</div>
      <div className="text-xs font-mono text-amber-400 mt-0.5">
        {data.payload.amount} ({data.value}%)
      </div>
      <div className="text-[10px] text-slate-400 mt-1 leading-relaxed">
        {data.payload.description}
      </div>
    </div>
  );
}

// ─── Valuation Stacked Bar ───────────────────────────────────────
function ValuationBar() {
  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.6 }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm lg:text-base font-mono text-slate-400 uppercase tracking-wider">
          Valuation at Launch
        </span>
        <motion.span
          className="text-base lg:text-lg font-black font-mono"
          style={{ color: METALLIC_GOLD }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
        >
          €350k+
        </motion.span>
      </div>

      {/* Stacked horizontal bar */}
      <div className="relative w-full h-11 lg:h-12 rounded-xl overflow-hidden bg-white/5 border border-white/10">
        {/* Founder Equity layer */}
        <motion.div
          className="absolute inset-y-0 left-0 flex items-center justify-center"
          style={{ backgroundColor: `${EQUITY_BLUE}cc`, width: "57.14%" }}
          initial={{ width: 0 }}
          animate={{ width: "57.14%" }}
          transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
        >
          <span className="text-xs lg:text-sm font-mono font-bold text-white/90 truncate px-2">
            Technical Equity €200k
          </span>
        </motion.div>

        {/* Investor Cash layer */}
        <motion.div
          className="absolute inset-y-0 flex items-center justify-center"
          style={{
            backgroundColor: `${INVESTOR_GOLD}cc`,
            left: "57.14%",
            width: "42.86%",
          }}
          initial={{ width: 0 }}
          animate={{ width: "42.86%" }}
          transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}
        >
          <span className="text-xs lg:text-sm font-mono font-bold text-slate-900 truncate px-2">
            Investor €150k
          </span>
        </motion.div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-2">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: EQUITY_BLUE }} />
          <span className="text-xs lg:text-sm font-mono text-slate-400">
            Founder Tech Equity (57%)
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: INVESTOR_GOLD }} />
          <span className="text-xs lg:text-sm font-mono text-slate-400">
            Cash Injection (43%)
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Fund allocation icon components for SVG rendering (inside pie slices) ───
// These match the Lucide icons used in the legend: Cpu, Globe, Lock, ShieldCheck
const FUND_ICONS_SVG: Record<string, (color: string) => React.ReactNode> = {
  "Product R&D & AI": (color: string) => (
    // Cpu icon – matches Lucide <Cpu>
    <g>
      <circle cx="0" cy="0" r="8" fill={color} opacity="0.85" />
      <rect x="-3.5" y="-3.5" width="7" height="7" rx="1" fill="none" stroke="#fff" strokeWidth="1" opacity="0.8" />
      <rect x="-1.5" y="-1.5" width="3" height="3" rx="0.5" fill="#fff" opacity="0.6" />
      {/* Top pins */}
      <line x1="-1.5" y1="-3.5" x2="-1.5" y2="-5.5" stroke="#fff" strokeWidth="0.8" opacity="0.5" />
      <line x1="1.5" y1="-3.5" x2="1.5" y2="-5.5" stroke="#fff" strokeWidth="0.8" opacity="0.5" />
      {/* Bottom pins */}
      <line x1="-1.5" y1="3.5" x2="-1.5" y2="5.5" stroke="#fff" strokeWidth="0.8" opacity="0.5" />
      <line x1="1.5" y1="3.5" x2="1.5" y2="5.5" stroke="#fff" strokeWidth="0.8" opacity="0.5" />
      {/* Left pins */}
      <line x1="-3.5" y1="-1.5" x2="-5.5" y2="-1.5" stroke="#fff" strokeWidth="0.8" opacity="0.5" />
      <line x1="-3.5" y1="1.5" x2="-5.5" y2="1.5" stroke="#fff" strokeWidth="0.8" opacity="0.5" />
      {/* Right pins */}
      <line x1="3.5" y1="-1.5" x2="5.5" y2="-1.5" stroke="#fff" strokeWidth="0.8" opacity="0.5" />
      <line x1="3.5" y1="1.5" x2="5.5" y2="1.5" stroke="#fff" strokeWidth="0.8" opacity="0.5" />
    </g>
  ),
  "Market & Operations": (color: string) => (
    // Globe icon – matches Lucide <Globe>
    <g>
      <circle cx="0" cy="0" r="7" fill={color} opacity="0.85" />
      <circle cx="0" cy="0" r="5" fill="none" stroke="#fff" strokeWidth="0.9" opacity="0.6" />
      <ellipse cx="0" cy="0" rx="2.5" ry="5" fill="none" stroke="#fff" strokeWidth="0.8" opacity="0.5" />
      <line x1="-5" y1="0" x2="5" y2="0" stroke="#fff" strokeWidth="0.7" opacity="0.45" />
    </g>
  ),
  "Security & Compliance": (color: string) => (
    // Lock icon – matches Lucide <Lock>
    <g>
      <circle cx="0" cy="0" r="8" fill={color} opacity="0.85" />
      <rect x="-3.5" y="-1" width="7" height="5.5" rx="1" fill="none" stroke="#fff" strokeWidth="0.9" opacity="0.7" />
      <path d="M-2,-1 L-2,-3 C-2,-5 2,-5 2,-3 L2,-1" fill="none" stroke="#fff" strokeWidth="0.9" opacity="0.6" />
      <circle cx="0" cy="1.5" r="0.8" fill="#fff" opacity="0.6" />
    </g>
  ),
  "Contingency Reserve": (color: string) => (
    // ShieldCheck icon – matches Lucide <ShieldCheck>
    <g>
      <circle cx="0" cy="0" r="8" fill={color} opacity="0.85" />
      <path d="M0,-5.5 L4.5,-3 L4.5,0.5 C4.5,3.5 2.5,5 0,6.2 C-2.5,5 -4.5,3.5 -4.5,0.5 L-4.5,-3 Z" fill="none" stroke="#fff" strokeWidth="0.9" opacity="0.6" />
      <path d="M-1.8,0.5 L-0.5,2 L2,-.8" fill="none" stroke="#fff" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
    </g>
  ),
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderPieIconLabel({ cx, cy, midAngle, innerRadius, outerRadius, index }: any) {
  const RADIAN = Math.PI / 180;
  // Place icon at the midpoint of the slice (between inner and outer radius)
  const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  const item = fundAllocation[index];
  const iconRenderer = FUND_ICONS_SVG[item.name];
  if (!iconRenderer) return null;
  return (
    <g transform={`translate(${x},${y}) scale(1.6)`}>
      {iconRenderer(item.color)}
    </g>
  );
}

// ─── Interactive Use of Funds Pie (icons inside slices) ──────────
function UseOfFundsPie({
  activeIndex,
  onHover,
  onClick,
}: {
  activeIndex: number | null;
  onHover: (index: number | null) => void;
  onClick: (index: number) => void;
}) {
  return (
    <motion.div
      className="flex flex-col items-center"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.0, duration: 0.6 }}
    >
      <div className="text-xs lg:text-sm font-mono text-slate-400 uppercase tracking-wider mb-0">
        Allocation of Funds
      </div>
      <div className="w-full relative" style={{ height: "clamp(200px, 40vh, 480px)" }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={fundAllocation}
              cx="50%"
              cy="50%"
              innerRadius="28%"
              outerRadius={activeIndex !== null ? "72%" : "68%"}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
              onMouseEnter={(_, index) => onHover(index)}
              onMouseLeave={() => onHover(null)}
              onClick={(_, index) => onClick(index)}
              animationDuration={600}
              label={renderPieIconLabel}
              labelLine={false}
            >
              {fundAllocation.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={entry.color}
                  opacity={activeIndex === null || activeIndex === index ? 1 : 0.25}
                  strokeWidth={activeIndex === index ? 2 : 0}
                  stroke={activeIndex === index ? "#fff" : "none"}
                  style={{
                    cursor: "pointer",
                    transition: "opacity 0.25s, stroke-width 0.25s",
                    filter: activeIndex === index ? `drop-shadow(0 0 8px ${entry.color})` : "none",
                  }}
                />
              ))}
            </Pie>
            {/* <Tooltip content={<CustomTooltip />} /> */}
            {/* Center label when a slice is active */}
            {activeIndex !== null && (
              <>
                <text
                  x="50%"
                  y="46%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={fundAllocation[activeIndex].color}
                  fontSize="22"
                  fontFamily="monospace"
                  fontWeight="900"
                >
                  {fundAllocation[activeIndex].value}%
                </text>
                <text
                  x="50%"
                  y="56%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="rgba(255,255,255,0.5)"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  {fundAllocation[activeIndex].amount}
                </text>
              </>
            )}
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

// ─── 18-Month Runway Badge ───────────────────────────────────────
function RunwayBadge() {
  return (
    <motion.div
      className="relative flex items-center gap-3 px-4 py-3 rounded-xl overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${METALLIC_GOLD}15, ${METALLIC_GOLD}08)`,
        border: `1px solid ${METALLIC_GOLD}30`,
      }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.6, duration: 0.5 }}
    >
      {/* Shimmer */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(90deg, transparent, ${METALLIC_GOLD}10, transparent)`,
        }}
        animate={{ x: ["-100%", "200%"] }}
        transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
      />
      <div className="relative flex items-center gap-5 w-full">
        <motion.div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{
            background: `${METALLIC_GOLD}18`,
            border: `1px solid ${METALLIC_GOLD}30`,
          }}
          animate={{ rotate: [0, 3, -3, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Clock className="w-5 h-5" style={{ color: METALLIC_GOLD }} />
        </motion.div>
        <div className="flex-1 min-w-0">
          <div className="text-base lg:text-lg font-bold text-white/90">
            18-Month Runway Secured
          </div>
          <div className="text-xs lg:text-sm font-mono text-slate-400">
            No further capital ask required during this period
          </div>
        </div>
        <motion.div
          className="shrink-0 px-3 py-1.5 rounded-lg font-mono font-black text-base lg:text-lg"
          style={{
            background: `${METALLIC_GOLD}20`,
            border: `1px solid ${METALLIC_GOLD}35`,
            color: GOLD_LIGHT,
          }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          18 MO
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Investment Ask Hero Card (compact) ──────────────────────────
function InvestmentAskCard() {
  return (
    <motion.div
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${METALLIC_GOLD}12, ${NAVY_ACCENT}60)`,
        border: `1px solid ${METALLIC_GOLD}30`,
      }}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.3, duration: 0.7, type: "spring" }}
    >
      {/* Glow */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(90deg, transparent, ${METALLIC_GOLD}08, transparent)`,
        }}
        animate={{ x: ["-100%", "200%"] }}
        transition={{ duration: 4, repeat: Infinity, repeatDelay: 3 }}
      />

      <div className="relative p-3 lg:p-4">
        {/* Header row */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2.5">
            <motion.div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: `${METALLIC_GOLD}15`,
                border: `1px solid ${METALLIC_GOLD}30`,
              }}
              animate={{ rotate: [0, 3, -3, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <TrendingUp
                className="w-5 h-5"
                style={{ color: METALLIC_GOLD }}
              />
            </motion.div>
            <div>
              <div className="text-base lg:text-lg font-bold text-white/95">
                Seed Round
              </div>
              <div
                className="text-xs lg:text-sm font-mono uppercase tracking-wider"
                style={{ color: GOLD_DIM }}
              >
                Total Investment Ask
              </div>
            </div>
          </div>

          {/* Amount badge */}
          <motion.div
            className="px-3 py-1.5 rounded-xl"
            style={{
              background: `${METALLIC_GOLD}15`,
              border: `1px solid ${METALLIC_GOLD}30`,
            }}
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <div
              className="text-[9px] font-mono uppercase tracking-wider"
              style={{ color: GOLD_DIM }}
            >
              Raise
            </div>
            <div
              className="text-2xl lg:text-3xl font-black font-mono"
              style={{ color: GOLD_LIGHT }}
            >
              <AnimatedCounter
                target={150}
                prefix="€"
                suffix="k"
                delay={0.5}
                duration={1.8}
              />
            </div>
          </motion.div>
        </div>

        {/* Two compact rows side by side */}
        <div className="flex gap-2">
          {/* Asset Value Injection */}
          <motion.div
            className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{
              background: `${EQUITY_BLUE}12`,
              border: `1px solid ${EQUITY_BLUE}30`,
            }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Crown className="w-5 h-5 text-blue-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-sm lg:text-base font-bold text-blue-300">
                Tech Equity: €200k
              </div>
              <div className="text-[10px] lg:text-xs text-slate-400 font-mono truncate">
                Pre-built framework &amp; API libraries (FMV)
              </div>
            </div>
          </motion.div>

          {/* Capital Efficiency */}
          <motion.div
            className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{
              background: "rgba(16,185,129,0.06)",
              border: "1px solid rgba(16,185,129,0.2)",
            }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >
            <Zap className="w-5 h-5 text-emerald-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-sm lg:text-base font-semibold text-white/80">
                Capital Efficiency: 0% Waste
              </div>
              <div className="text-[10px] lg:text-xs text-slate-500 font-mono truncate">
                Lead Architect as shareholder — 100% drives product
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── 2×2 Grid Fund Legend with icons (below pie, z-50 tooltips) ──
function FundLegend({
  activeIndex,
  onHover,
  onClick,
}: {
  activeIndex: number | null;
  onHover: (index: number | null) => void;
  onClick: (index: number) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-1.5 w-full">
      {fundAllocation.map((item, i) => {
        const isActive = activeIndex === i;
        return (
          <motion.button
            key={item.name}
            className="relative flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer select-none text-left"
            style={{
              backgroundColor: isActive ? `${item.color}18` : `${item.color}06`,
              border: `1px solid ${isActive ? `${item.color}50` : `${item.color}15`}`,
              boxShadow: isActive ? `0 0 10px ${item.color}20` : "none",
              transition: "all 0.2s ease",
            }}
            animate={{
              opacity: activeIndex === null || isActive ? 1 : 0.5,
              scale: isActive ? 1.03 : 1,
            }}
            transition={{ duration: 0.2 }}
            onMouseEnter={() => onHover(i)}
            onMouseLeave={() => onHover(null)}
            onClick={() => onClick(i)}
          >
            {/* Icon in colored block */}
            <div
              className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
              style={{
                backgroundColor: `${item.color}25`,
                border: `1px solid ${item.color}40`,
              }}
            >
              <div style={{ color: item.color }} className="w-4 h-4 flex items-center justify-center">
                {item.icon}
              </div>
            </div>
            {/* Title + amount */}
            <div className="flex-1 min-w-0">
              <div
                className="text-xs lg:text-sm font-bold leading-tight truncate"
                style={{ color: isActive ? item.color : "rgba(255,255,255,0.75)" }}
              >
                {item.name}
              </div>
              <div className="text-[10px] font-mono text-slate-500 leading-tight">
                {item.amount}
              </div>
            </div>
            <span
              className="text-base lg:text-lg font-mono font-black shrink-0"
              style={{ color: item.color }}
            >
              {item.value}%
            </span>

            {/* Tooltip on hover — z-50 to overlay other components */}
            {isActive && (
              <motion.div
                className="absolute left-0 right-0 z-50 pointer-events-none"
                style={{ bottom: "calc(100% + 6px)" }}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.12 }}
              >
                <div
                  className="bg-slate-900/95 backdrop-blur-xl border rounded-lg px-3 py-2 shadow-2xl"
                  style={{ borderColor: `${item.color}40` }}
                >
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <div style={{ color: item.color }}>{item.icon}</div>
                    <span className="text-xs font-bold text-white/90">
                      {item.name}
                    </span>
                  </div>
                  <div
                    className="text-xs font-mono font-bold mb-0.5"
                    style={{ color: item.color }}
                  >
                    {item.amount} · {item.value}%
                  </div>
                  <div className="text-[10px] text-slate-400 leading-relaxed">
                    {item.description}
                  </div>
                </div>
                <div className="flex justify-center -mt-px">
                  <div
                    className="w-2 h-2 rotate-45"
                    style={{
                      backgroundColor: "rgba(15,23,42,0.95)",
                      borderRight: `1px solid ${item.color}40`,
                      borderBottom: `1px solid ${item.color}40`,
                    }}
                  />
                </div>
              </motion.div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

// ─── Capital Leverage Visual ─────────────────────────────────────
function CapitalLeverageVisual() {
  return (
    <motion.div
      className="relative w-full rounded-xl overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${DEEP_BLUE}, ${NAVY_ACCENT})`,
        border: `1px solid ${METALLIC_GOLD}20`,
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.4, duration: 0.6 }}
    >
      <div className="relative flex items-center justify-center py-4 px-6">
        {/* Abstract leverage visualization with SVG */}
        <svg viewBox="0 0 300 120" className="w-full max-w-70">
          {/* Fulcrum triangle */}
          <motion.polygon
            points="150,90 140,110 160,110"
            fill={`${METALLIC_GOLD}60`}
            stroke={METALLIC_GOLD}
            strokeWidth="1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6 }}
          />

          {/* Lever beam */}
          <motion.line
            x1="40"
            y1="80"
            x2="260"
            y2="80"
            stroke={METALLIC_GOLD}
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 1.7, duration: 0.8 }}
          />

          {/* Small weight (investor €150k) - left side */}
          <motion.g
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.0, type: "spring" }}
          >
            <rect
              x="55"
              y="55"
              width="50"
              height="25"
              rx="4"
              fill={`${METALLIC_GOLD}40`}
              stroke={METALLIC_GOLD}
              strokeWidth="1"
            />
            <text
              x="80"
              y="71"
              textAnchor="middle"
              fill={GOLD_LIGHT}
              fontSize="9"
              fontFamily="monospace"
              fontWeight="bold"
            >
              €150k
            </text>
            <text
              x="80"
              y="50"
              textAnchor="middle"
              fill={GOLD_DIM}
              fontSize="7"
              fontFamily="monospace"
            >
              INVEST
            </text>
          </motion.g>

          {/* Large lifted object (€350k+ value) - right side, elevated */}
          <motion.g
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.3, type: "spring" }}
          >
            <rect
              x="180"
              y="30"
              width="80"
              height="48"
              rx="6"
              fill={`${EQUITY_BLUE}30`}
              stroke={`${EQUITY_BLUE}80`}
              strokeWidth="1.5"
            />
            {/* Glow effect */}
            <rect
              x="182"
              y="32"
              width="76"
              height="44"
              rx="5"
              fill="none"
              stroke={`${METALLIC_GOLD}30`}
              strokeWidth="0.5"
            />
            <text
              x="220"
              y="50"
              textAnchor="middle"
              fill="#93c5fd"
              fontSize="10"
              fontFamily="monospace"
              fontWeight="bold"
            >
              €350k+
            </text>
            <text
              x="220"
              y="63"
              textAnchor="middle"
              fill="#60a5fa"
              fontSize="7"
              fontFamily="monospace"
            >
              LAUNCH VALUE
            </text>
            <text
              x="220"
              y="73"
              textAnchor="middle"
              fill={GOLD_DIM}
              fontSize="6"
              fontFamily="monospace"
            >
              ▲ 2.3× LEVERAGE
            </text>
          </motion.g>

          {/* Upward arrow */}
          <motion.path
            d="M220,26 L220,16 M215,20 L220,14 L225,20"
            stroke={METALLIC_GOLD}
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.6, 1] }}
            transition={{ delay: 2.6, duration: 1.5, repeat: Infinity }}
          />
        </svg>
      </div>

      {/* Label */}
      <div className="text-center pb-3">
        <span
          className="text-xs lg:text-sm font-mono uppercase tracking-widest"
          style={{ color: GOLD_DIM }}
        >
          Capital Leverage Effect
        </span>
      </div>
    </motion.div>
  );
}

// ─── Main Slide Component ────────────────────────────────────────
export function FinancialTransparencySlide() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleHover = (index: number | null) => setActiveIndex(index);
  const handleClick = (index: number) =>
    setActiveIndex((prev) => (prev === index ? null : index));

  return (
    <div
      className="w-full h-full flex flex-col justify-center items-center text-white relative overflow-hidden p-2 md:p-2 lg:p-3"
      style={{
        background: `linear-gradient(135deg, ${DEEP_BLUE}, #0d1b33, ${DEEP_BLUE})`,
      }}
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(212,168,83,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(212,168,83,0.15) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Accent glows */}
      <div
        className="absolute top-1/4 left-[16%] w-64 h-64 rounded-full blur-[100px]"
        style={{ background: `${METALLIC_GOLD}06` }}
      />
      <div
        className="absolute bottom-1/4 right-[20%] w-72 h-72 rounded-full blur-[100px]"
        style={{ background: `${EQUITY_BLUE}08` }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-[120px]"
        style={{ background: `${METALLIC_GOLD}04` }}
      />

      {/* ── Header ── */}
      <div className="relative z-10 text-center mb-0 md:mb-0.5 lg:mb-1">
        <motion.div
          className="flex items-center justify-center gap-2 mb-0.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <TrendingUp
            className="w-4 h-4 md:w-5 md:h-5"
            style={{ color: GOLD_DIM }}
          />
          <span
            className="text-xs md:text-sm lg:text-base font-mono tracking-[0.25em] uppercase"
            style={{ color: GOLD_DIM }}
          >
            Investment Opportunity
          </span>
          <PieChartIcon
            className="w-4 h-4 md:w-5 md:h-5"
            style={{ color: GOLD_DIM }}
          />
        </motion.div>

        <motion.h2
          className="text-lg md:text-2xl lg:text-3xl font-black tracking-tight"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Investment Opportunity{" "}
          <span style={{ color: METALLIC_GOLD }}>&amp;</span> Capital
          Efficiency
        </motion.h2>
        <motion.p
          className="text-[10px] md:text-xs lg:text-sm text-slate-500 font-mono"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Scaling ELMS to a World-Class Logistics Infrastructure
        </motion.p>
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* DESKTOP LAYOUT                                           */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div className="relative z-10 w-full max-w-5xl 2xl:max-w-6xl hidden md:flex flex-col gap-1 flex-1 min-h-0 mx-auto justify-center">
        {/* Main row: Left info + Right pie & legend */}
        <div className="flex gap-4 lg:gap-5 items-stretch">
          {/* ── LEFT column: Investment info (enlarged fonts) ── */}
          <div className="flex-1 flex flex-col gap-1.5 min-w-0 justify-center">
            <InvestmentAskCard />
            <ValuationBar />
            <CapitalLeverageVisual />
          </div>

          {/* ── RIGHT column: Pie Chart + 2×2 Legend Grid ── */}
          <div className="w-80 lg:w-90 2xl:w-100 shrink-0 flex flex-col justify-end gap-1">
            <UseOfFundsPie
              activeIndex={activeIndex}
              onHover={handleHover}
              onClick={handleClick}
            />
            {/* 2×2 legend grid directly below pie */}
            <div className="shrink-0">
              <FundLegend
                activeIndex={activeIndex}
                onHover={handleHover}
                onClick={handleClick}
              />
            </div>
          </div>
        </div>

        {/* Bottom: Runway Badge + inline key metrics */}
        <div className="shrink-0 flex gap-1 items-stretch mt-2">
          <div className="flex-1 min-w-0">
            <RunwayBadge />
          </div>
          {/* Inline key metrics — compact horizontal strip */}
          <div className="flex gap-1 shrink-0">
            {[
              { label: "Total Ask", value: "€150k", color: METALLIC_GOLD },
              { label: "Tech Equity", value: "€200k", color: "#60a5fa" },
              { label: "Launch Value", value: "€350k+", color: "#10b981" },
              { label: "Runway", value: "18 Mo", color: "#a78bfa" },
            ].map((m) => (
              <motion.div
                key={m.label}
                className="flex flex-col items-center justify-center px-3 py-1.5 rounded-lg"
                style={{
                  backgroundColor: `${m.color}10`,
                  border: `1px solid ${m.color}25`,
                }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.0 }}
              >
                <div
                  className="text-sm lg:text-base font-black font-mono leading-tight"
                  style={{ color: m.color }}
                >
                  {m.value}
                </div>
                <div className="text-[8px] lg:text-[9px] font-mono text-slate-500 leading-tight">
                  {m.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* MOBILE LAYOUT                                            */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div className="relative z-10 flex md:hidden flex-col items-center gap-2.5 flex-1 justify-center min-h-0 w-full max-w-sm">
        {/* Investment Ask hero */}
        <div className="w-full">
          <motion.div
            className="flex items-center justify-between w-full px-4 py-3 rounded-xl"
            style={{
              background: `linear-gradient(135deg, ${METALLIC_GOLD}12, ${NAVY_ACCENT}60)`,
              border: `1px solid ${METALLIC_GOLD}30`,
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div>
              <div
                className="text-[8px] font-mono uppercase tracking-wider"
                style={{ color: GOLD_DIM }}
              >
                Seed Round
              </div>
              <div
                className="text-2xl font-black font-mono"
                style={{ color: GOLD_LIGHT }}
              >
                €150k
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500" />
            <div className="text-center">
              <div className="text-[8px] font-mono uppercase tracking-wider text-blue-400/60">
                Tech Equity
              </div>
              <div className="text-xl font-black font-mono text-blue-400">
                €200k
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500" />
            <div className="text-right">
              <div className="text-[8px] font-mono uppercase tracking-wider text-emerald-400/60">
                Launch Value
              </div>
              <div className="text-xl font-black font-mono text-emerald-400">
                €350k+
              </div>
            </div>
          </motion.div>
        </div>

        {/* Key badges row */}
        <div className="flex gap-2 w-full">
          <motion.div
            className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg"
            style={{
              background: `${METALLIC_GOLD}10`,
              border: `1px solid ${METALLIC_GOLD}25`,
            }}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Clock className="w-3 h-3" style={{ color: METALLIC_GOLD }} />
            <span
              className="text-[8px] font-mono font-bold"
              style={{ color: METALLIC_GOLD }}
            >
              18-Mo Runway
            </span>
          </motion.div>
          <motion.div
            className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Zap className="w-3 h-3 text-emerald-400" />
            <span className="text-[8px] font-mono font-bold text-emerald-400">
              0% Vendor Waste
            </span>
          </motion.div>
          <motion.div
            className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <TrendingUp className="w-3 h-3 text-blue-400" />
            <span className="text-[8px] font-mono font-bold text-blue-400">
              2.3× Leverage
            </span>
          </motion.div>
        </div>

        {/* Compact allocation */}
        <motion.div
          className="w-full grid grid-cols-2 gap-1.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {fundAllocation.map((item) => (
            <div
              key={item.name}
              className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.05]"
            >
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-[7px] font-mono text-white/60 truncate">
                {item.name}
              </span>
              <span
                className="text-[8px] font-mono font-bold ml-auto"
                style={{ color: item.color }}
              >
                {item.value}%
              </span>
            </div>
          ))}
        </motion.div>

        <MobileExpandButton
          label="Tap to explore full investment breakdown"
          onClick={() => setMobileOpen(true)}
        />
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* MOBILE DETAIL MODAL                                      */}
      {/* ══════════════════════════════════════════════════════════ */}
      <MobileDetailModal
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        title="Investment Opportunity & Capital Efficiency"
        subtitle="Scaling ELMS to World-Class Logistics"
      >
        <div className="space-y-4">
          {/* Investment Ask */}
          <div
            className="p-3 rounded-xl"
            style={{
              background: `${METALLIC_GOLD}08`,
              border: `1px solid ${METALLIC_GOLD}20`,
            }}
          >
            <div className="flex items-center gap-2.5 mb-2">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{
                  background: `${METALLIC_GOLD}15`,
                  border: `1px solid ${METALLIC_GOLD}30`,
                }}
              >
                <TrendingUp className="w-4 h-4" style={{ color: METALLIC_GOLD }} />
              </div>
              <div>
                <div className="text-[11px] font-bold text-white/90">
                  Seed Round Investment
                </div>
                <div
                  className="text-[8px] font-mono uppercase tracking-wider"
                  style={{ color: GOLD_DIM }}
                >
                  Total Ask
                </div>
              </div>
              <div className="ml-auto text-right">
                <div
                  className="text-xl font-black font-mono"
                  style={{ color: GOLD_LIGHT }}
                >
                  €150k
                </div>
              </div>
            </div>
          </div>

          {/* Technical Equity */}
          <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/15">
            <div className="flex items-center gap-2 mb-1.5">
              <Crown className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-[10px] font-bold text-blue-300">
                Technical Equity Asset Injection
              </span>
            </div>
            <div className="text-[9px] text-slate-400 leading-relaxed mb-2">
              Pre-developed framework, API logic libraries &amp; architecture
              design contributed by core technical partner. Fair Market Value:{" "}
              <span className="font-bold text-blue-300">€200,000</span>
            </div>
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-blue-500/[0.08] border border-blue-500/15">
              <Zap className="w-3 h-3 text-blue-400" />
              <span className="text-[8px] font-mono text-blue-400/80">
                Investors enter with a €200k technical foundation already built
              </span>
            </div>
          </div>

          {/* Valuation Bar */}
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2">
              Launch Valuation Composition
            </div>
            <div className="w-full h-8 rounded-lg overflow-hidden flex">
              <div
                className="flex items-center justify-center"
                style={{ backgroundColor: `${EQUITY_BLUE}99`, width: "57%" }}
              >
                <span className="text-[8px] font-mono font-bold text-white/90">
                  Tech €200k
                </span>
              </div>
              <div
                className="flex items-center justify-center"
                style={{ backgroundColor: `${METALLIC_GOLD}99`, width: "43%" }}
              >
                <span className="text-[8px] font-mono font-bold text-slate-900">
                  Cash €150k
                </span>
              </div>
            </div>
            <div className="text-center mt-1.5">
              <span className="text-sm font-black font-mono text-emerald-400">
                Total: €350k+
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 py-1">
            <div className="flex-1 h-px bg-white/10" />
            <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
              <span
                className="text-[10px] font-black"
                style={{ color: GOLD_DIM }}
              >
                USE OF FUNDS
              </span>
            </div>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Allocation breakdown */}
          <div className="space-y-2">
            {fundAllocation.map((item) => (
              <div
                key={item.name}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.05]"
              >
                <div
                  className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: `${item.color}20`,
                    border: `1px solid ${item.color}40`,
                  }}
                >
                  <div style={{ color: item.color }}>{item.icon}</div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-semibold text-white/70">
                    {item.name}
                  </div>
                  <div className="text-[8px] text-slate-500 font-mono truncate">
                    {item.description}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div
                    className="text-[10px] font-black font-mono"
                    style={{ color: item.color }}
                  >
                    {item.value}%
                  </div>
                  <div className="text-[8px] font-mono text-slate-500">
                    {item.amount}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 18-Month Runway */}
          <div
            className="flex items-center gap-2.5 p-2.5 rounded-lg"
            style={{
              background: `${METALLIC_GOLD}08`,
              border: `1px solid ${METALLIC_GOLD}20`,
            }}
          >
            <Clock
              className="w-4 h-4 shrink-0"
              style={{ color: METALLIC_GOLD }}
            />
            <div>
              <div className="text-[10px] font-bold text-white/80">
                18-Month Runway — No Further Capital Ask
              </div>
              <div className="text-[8px] font-mono text-slate-500">
                This funding secures the project through market entry and first
                revenue
              </div>
            </div>
            <div
              className="shrink-0 px-2 py-1 rounded-md text-[10px] font-mono font-bold"
              style={{ background: `${METALLIC_GOLD}15`, color: GOLD_LIGHT }}
            >
              18 MO
            </div>
          </div>

          {/* Key metrics */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            {[
              {
                label: "Seed Round",
                value: "€150k",
                color: METALLIC_GOLD,
                bg: `${METALLIC_GOLD}10`,
                border: `${METALLIC_GOLD}25`,
              },
              {
                label: "Tech Equity",
                value: "€200k",
                color: "#60a5fa",
                bg: `${EQUITY_BLUE}10`,
                border: `${EQUITY_BLUE}25`,
              },
              {
                label: "Launch Value",
                value: "€350k+",
                color: "#10b981",
                bg: "rgba(16,185,129,0.08)",
                border: "rgba(16,185,129,0.2)",
              },
              {
                label: "Leverage Ratio",
                value: "2.3×",
                color: "#a78bfa",
                bg: "rgba(139,92,246,0.08)",
                border: "rgba(139,92,246,0.2)",
              },
            ].map((m) => (
              <div
                key={m.label}
                className="flex flex-col items-center p-2 rounded-lg"
                style={{
                  backgroundColor: m.bg,
                  border: `1px solid ${m.border}`,
                }}
              >
                <span
                  className="text-sm font-black font-mono"
                  style={{ color: m.color }}
                >
                  {m.value}
                </span>
                <span className="text-[8px] text-slate-500 font-mono">
                  {m.label}
                </span>
              </div>
            ))}
          </div>

          {/* Trust signals */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: <ShieldCheck className="w-3 h-3" />, label: "GDPR Compliant" },
              { icon: <Target className="w-3 h-3" />, label: "Capital Efficient" },
              { icon: <Rocket className="w-3 h-3" />, label: "Growth-First" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.05] text-[9px] text-slate-400 font-mono"
              >
                <span style={{ color: `${METALLIC_GOLD}80` }}>{item.icon}</span>
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </MobileDetailModal>
    </div>
  );
}
