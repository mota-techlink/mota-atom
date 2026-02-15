"use client";

import React, { useState, useEffect } from "react";
import {
  Euro,
  Shield,
  TrendingDown,
  Zap,
  Clock,
  Users,
  Flame,
  Award,
  CheckCircle2,
  Code2,
  Briefcase,
  PenTool,
  Bug,
  Server,
  LineChart,
  Crown,
  Target,
  Rocket,
  Star,
  ArrowRight,
  X,
  Info,
} from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import {
  MobileDetailModal,
  MobileExpandButton,
} from "./MobileDetailModal";

// ─── Types ───────────────────────────────────────────────────────
interface TraditionalRole {
  title: string;
  abbr: string;
  icon: React.ReactNode;
  salary: string;
  color: string;
  description: string;
  details: string;
}

// ─── Traditional Team Roles ──────────────────────────────────────
const traditionalRoles: TraditionalRole[] = [
  {
    title: "Business Development",
    abbr: "BD",
    icon: <Briefcase className="w-5 h-5" />,
    salary: "€55k",
    color: "text-red-400",
    description: "Client acquisition & sales pipeline",
    details: "Responsible for market research, lead generation, client relationship management, proposal writing, and revenue growth strategy. In a traditional vendor model, this role alone costs €55k/yr and often creates bottlenecks between client needs and technical execution.",
  },
  {
    title: "Project Manager",
    abbr: "PM",
    icon: <LineChart className="w-5 h-5" />,
    salary: "€60k",
    color: "text-orange-400",
    description: "Timeline & resource coordination",
    details: "Manages project timelines, sprint planning, stakeholder communication, risk assessment, and team coordination. At €60k/yr, this middle-management role adds overhead and communication delays between business and technical teams.",
  },
  {
    title: "Solution Architect",
    abbr: "Arch",
    icon: <PenTool className="w-5 h-5" />,
    salary: "€80k",
    color: "text-amber-400",
    description: "System design & tech decisions",
    details: "Designs system architecture, makes technology stack decisions, creates technical specifications, and ensures scalability. The most expensive role at €80k/yr — in the ELMS model, the Shareholder Architect absorbs this role with direct ownership incentive.",
  },
  {
    title: "Frontend Developer",
    abbr: "FE",
    icon: <Code2 className="w-5 h-5" />,
    salary: "€55k",
    color: "text-yellow-400",
    description: "UI implementation & user experience",
    details: "Builds user interfaces, implements responsive designs, handles client-side logic, and ensures cross-browser compatibility. At €55k/yr, a dedicated FE developer is standard but redundant when the Architect can deliver full-stack.",
  },
  {
    title: "QA / QC Engineer",
    abbr: "QA",
    icon: <Bug className="w-5 h-5" />,
    salary: "€45k",
    color: "text-lime-400",
    description: "Quality assurance & testing",
    details: "Performs manual and automated testing, writes test cases, manages bug tracking, and ensures product quality. At €45k/yr, this role is necessary in large teams but can be streamlined with modern CI/CD and automated testing pipelines.",
  },
  {
    title: "Backend Developer",
    abbr: "BE",
    icon: <Server className="w-5 h-5" />,
    salary: "€60k",
    color: "text-green-400",
    description: "API development & data management",
    details: "Develops server-side logic, designs APIs, manages databases, and handles system integrations. At €60k/yr, a separate BE developer creates handoff overhead that the ELMS Shareholder Architect model eliminates entirely.",
  },
];

// ─── Burning Cash Bar ────────────────────────────────────────────
function BurningCashBar({ delay = 0 }: { delay?: number }) {
  const progress = useMotionValue(0);
  const width = useTransform(progress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    const controls = animate(progress, 1, {
      duration: 3,
      delay: delay + 1.5,
      ease: "easeOut",
    });
    return controls.stop;
  }, [progress, delay]);

  return (
    <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden mt-1.5">
      <motion.div
        className="h-full rounded-full bg-linear-to-r from-orange-500/80 via-red-500/80 to-red-600/80"
        style={{ width }}
      />
    </div>
  );
}

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

// ─── Role Detail Modal ──────────────────────────────────────────
function RoleDetailModal({
  role,
  open,
  onClose,
}: {
  role: TraditionalRole;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-100 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          {/* Modal */}
          <motion.div
            className="relative w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/95 backdrop-blur-xl p-5 shadow-2xl"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2.5 rounded-xl bg-white/8 ${role.color}`}>
                {role.icon}
              </div>
              <div>
                <div className="text-base font-bold text-white/90">{role.title}</div>
                <div className="text-sm font-mono text-slate-400">{role.salary} / year</div>
              </div>
            </div>
            <div className="text-sm leading-relaxed text-slate-300">
              {role.details}
            </div>
            <div className="mt-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/8 border border-red-500/20">
              <Flame className="w-4 h-4 text-red-400 shrink-0" />
              <span className="text-xs font-mono text-red-400/80">
                This cost is eliminated in the ELMS Shareholder Architect model
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Traditional Role Card ──────────────────────────────────────
function TraditionalRoleCard({
  role,
  index,
  isStruck,
}: {
  role: TraditionalRole;
  index: number;
  isStruck: boolean;
}) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <motion.div
        className="relative flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 overflow-hidden group cursor-pointer hover:bg-white/8 transition-colors"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 + index * 0.12, type: "spring", stiffness: 200 }}
        onClick={() => setModalOpen(true)}
      >
        {/* Strike-through line */}
        <motion.div
          className="absolute inset-y-0 left-0 w-full flex items-center pointer-events-none z-10"
          initial={{ opacity: 0 }}
          animate={isStruck ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.1 + index * 0.08 }}
        >
          <motion.div
            className="h-0.5 bg-linear-to-r from-emerald-400/0 via-emerald-400 to-emerald-400/0"
            initial={{ width: 0 }}
            animate={isStruck ? { width: "100%" } : { width: 0 }}
            transition={{ delay: 0.1 + index * 0.08, duration: 0.4, ease: "easeOut" }}
          />
        </motion.div>

        {/* Content */}
        <motion.div
          className="flex items-center gap-3 w-full"
          animate={isStruck ? { opacity: 0.3 } : { opacity: 1 }}
          transition={{ delay: 0.2 + index * 0.08 }}
        >
          <div className={`p-2 rounded-lg bg-white/8 ${role.color} shrink-0`}>
            {role.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm lg:text-base font-semibold text-white/90 truncate">
              {role.title}
            </div>
            <div className="text-xs lg:text-sm text-slate-400 truncate">
              {role.description}
            </div>
            <div className="text-[10px] lg:text-xs font-mono text-slate-500 mt-0.5">
              {role.salary}/yr
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <Info className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 transition-colors" />
            <motion.div
              animate={isStruck ? { scale: 0 } : { scale: 1 }}
              transition={{ delay: 0.2 + index * 0.08 }}
            >
              <Flame className="w-4 h-4 text-orange-400/60" />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
      <RoleDetailModal role={role} open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}

// ─── Human Resource Pyramid ─────────────────────────────────────
function ResourcePyramid() {
  const pyramidLayers = [
    { label: "BD + PM + Arch", count: "3 roles", color: "bg-red-500/20 border-red-500/30", textColor: "text-red-400", width: "w-full" },
    { label: "FE + BE + QA", count: "3 roles", color: "bg-orange-500/20 border-orange-500/30", textColor: "text-orange-400", width: "w-4/5" },
    { label: "Middle\nManagement", count: "Overhead", color: "bg-amber-500/20 border-amber-500/30", textColor: "text-amber-400", width: "w-3/5" },
  ];

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <div className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-1">
        Traditional Hierarchy
      </div>
      {pyramidLayers.map((layer, i) => (
        <motion.div
          key={layer.label}
          className={`${layer.width} ${layer.color} border rounded-lg px-3 py-2 flex items-center justify-between`}
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 2 + i * 0.15, duration: 0.4 }}
        >
          <span className={`text-sm font-mono font-semibold ${layer.textColor}`}>
            {layer.label}
          </span>
          <span className="text-xs font-mono text-slate-500">{layer.count}</span>
        </motion.div>
      ))}
      <motion.div
        className="mt-2 flex items-center gap-1.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.6 }}
      >
        <ArrowRight className="w-4 h-4 text-emerald-400" />
        <span className="text-sm font-mono text-emerald-400 font-bold">
          Replaced by 1 Shareholder Architect
        </span>
      </motion.div>
    </div>
  );
}

// ─── ELMS Shareholder Glowing Card ──────────────────────────────
function ELMSShareholderCard({ onStrike }: { onStrike: () => void }) {
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasTriggered(true);
      onStrike();
    }, 3200);
    return () => clearTimeout(timer);
  }, [onStrike]);

  return (
    <motion.div
      className="relative rounded-2xl border border-emerald-500/30 overflow-hidden"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 1.8, duration: 0.6, type: "spring" }}
    >
      {/* Glow background */}
      <div className="absolute inset-0 bg-linear-to-br from-emerald-500/8 via-cyan-500/5 to-blue-500/8" />
      <motion.div
        className="absolute inset-0 bg-linear-to-r from-transparent via-emerald-400/8 to-transparent"
        animate={{ x: ["-100%", "200%"] }}
        transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 2 }}
      />

      {/* Pulsing border glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        style={{ boxShadow: "inset 0 0 30px rgba(16, 185, 129, 0.05), 0 0 40px rgba(16, 185, 129, 0.05)" }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      <div className="relative p-4 lg:p-5">
        {/* Header row */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center"
              animate={{ rotate: [0, 3, -3, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Crown className="w-6 h-6 lg:w-7 lg:h-7 text-emerald-400" />
            </motion.div>
            <div>
              <div className="text-base lg:text-lg font-bold text-white/95">ELMS Agile Structure</div>
              <div className="text-xs lg:text-sm font-mono text-emerald-400/70 tracking-wider uppercase">
                Shareholder-Driven Efficiency
              </div>
            </div>
          </div>

          {/* Phase 1 cost badge */}
          <motion.div
            className="px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/25"
            animate={hasTriggered ? { scale: [1, 1.08, 1] } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="text-xs font-mono text-emerald-400/70 uppercase tracking-wider">Phase 1</div>
            <div className="text-2xl lg:text-3xl font-black font-mono text-emerald-400">
              <AnimatedCounter target={25} prefix="€" suffix="k" delay={2} duration={1.5} />
            </div>
          </motion.div>
        </div>

        {/* Key label */}
        <motion.div
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-amber-500/8 border border-amber-500/20 mb-3"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2 }}
        >
          <Award className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <div className="text-sm lg:text-base font-bold text-amber-300">
              Driven by Core Shareholder Architect (22.5% Stake)
            </div>
            <div className="text-xs lg:text-sm text-slate-400 font-mono">
              Former eBay API Lead · Full-stack cost-to-value optimization
            </div>
          </div>
        </motion.div>

        {/* E-Port integration highlight */}
        <motion.div
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/3 border border-white/6"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5 }}
        >
          <div className="shrink-0 flex flex-col items-center">
            <Rocket className="w-5 h-5 text-cyan-400 mb-0.5" />
            <span className="text-[10px] font-mono text-cyan-400/70">E-Port</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm lg:text-base font-semibold text-white/80">
              E-Port Integration: 1 Month vs 6 Months
            </div>
            <div className="text-xs text-slate-500 font-mono">
              Harling Sun&apos;s API expertise eliminates middle-management overhead
            </div>
          </div>
          <div className="shrink-0 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
            <span className="text-sm font-mono font-bold text-cyan-400">6× Faster</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Metric Badges Row ──────────────────────────────────────────
function MetricBadges() {
  const badges = [
    {
      label: "Industry Avg",
      value: "€150k+",
      icon: <Users className="w-3.5 h-3.5" />,
      color: "text-red-400",
      bg: "bg-red-500/10 border-red-500/20",
      sublabel: "6+ FTEs / yr",
    },
    {
      label: "ELMS Phase 1",
      value: "€25k",
      icon: <Target className="w-3.5 h-3.5" />,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20",
      sublabel: "1 Architect",
    },
    {
      label: "Time-to-Market",
      value: "3× Faster",
      icon: <Zap className="w-3.5 h-3.5" />,
      color: "text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/20",
      sublabel: "Lean delivery",
    },
    {
      label: "Savings",
      value: "83%+",
      icon: <TrendingDown className="w-3.5 h-3.5" />,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10 border-cyan-500/20",
      sublabel: "Cost reduction",
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-2">
      {badges.map((badge, i) => (
        <motion.div
          key={badge.label}
          className={`relative flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl border ${badge.bg} text-center overflow-hidden`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.5 + i * 0.12 }}
        >
          <div className={badge.color}>{badge.icon}</div>
          <div className={`text-lg lg:text-xl font-black font-mono ${badge.color}`}>
            {badge.value}
          </div>
          <div className="text-xs lg:text-sm font-semibold text-white/70">{badge.label}</div>
          <div className="text-[10px] font-mono text-slate-500">{badge.sublabel}</div>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Cost Efficiency Gauge ──────────────────────────────────────
function CostGauge() {
  return (
    <motion.div
      className="relative flex flex-col items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.8 }}
    >
      <svg viewBox="0 0 120 70" className="w-[80%] max-w-56">
        {/* Background arc */}
        <path
          d="M 10 65 A 50 50 0 0 1 110 65"
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="8"
          strokeLinecap="round"
        />
        {/* Red zone (industry) */}
        <motion.path
          d="M 10 65 A 50 50 0 0 1 60 15"
          fill="none"
          stroke="rgba(239,68,68,0.4)"
          strokeWidth="8"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 3, duration: 1 }}
        />
        {/* Green zone (ELMS) */}
        <motion.path
          d="M 60 15 A 50 50 0 0 1 110 65"
          fill="none"
          stroke="rgba(16,185,129,0.5)"
          strokeWidth="8"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 3.5, duration: 0.8 }}
        />
        {/* Needle */}
        <motion.line
          x1="60"
          y1="65"
          x2="95"
          y2="35"
          stroke="rgba(16,185,129,0.9)"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4 }}
        />
        <circle cx="60" cy="65" r="4" fill="rgba(16,185,129,0.6)" />
      </svg>
      <div className="flex items-center gap-4 mt-1.5">
        <span className="text-[10px] font-mono text-red-400/70">€150k+ ◄</span>
        <span className="text-xs font-mono font-bold text-emerald-400">► €25k</span>
      </div>
      <div className="text-[10px] font-mono text-slate-500 mt-0.5">Cost-Efficiency Index</div>
    </motion.div>
  );
}

// ─── Burning Cash Total Counter ─────────────────────────────────
function BurningTotal() {
  return (
    <motion.div
      className="flex items-center justify-between px-4 py-3 rounded-xl bg-red-500/8 border border-red-500/20 mt-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.8 }}
    >
      <div className="flex items-center gap-2">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Flame className="w-5 h-5 text-red-400" />
        </motion.div>
        <div>
          <div className="text-xs font-mono text-red-400/70 uppercase tracking-wider">
            Traditional Annual Burn
          </div>
          <div className="text-[10px] text-slate-500 font-mono">6 FTEs + overhead</div>
        </div>
      </div>
      <div className="text-lg lg:text-xl font-black font-mono text-red-400">
        <AnimatedCounter target={355} prefix="€" suffix="k+" delay={1.5} duration={2} />
      </div>
    </motion.div>
  );
}

// ─── Main Slide Component ────────────────────────────────────────
export function FinancialTransparencySlide() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isStruck, setIsStruck] = useState(false);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center bg-linear-to-br from-slate-950 via-[#0b1222] to-slate-950 text-white relative overflow-hidden p-3 md:p-4 lg:p-6">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Accent glows */}
      <div className="absolute top-1/4 left-1/6 w-64 h-64 bg-red-500/4 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/5 w-72 h-72 bg-emerald-500/5 rounded-full blur-[100px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/3 rounded-full blur-[120px]" />

      {/* ── Header ── */}
      <div className="relative z-10 text-center mb-2 md:mb-3 lg:mb-4">
        <motion.div
          className="flex items-center justify-center gap-2 mb-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Euro className="w-4 h-4 md:w-5 md:h-5 text-emerald-400/60" />
          <span className="text-xs md:text-sm lg:text-base font-mono text-emerald-400/70 tracking-[0.25em] uppercase">
            Financial Efficiency
          </span>
          <Users className="w-4 h-4 md:w-5 md:h-5 text-emerald-400/60" />
        </motion.div>

        <motion.h2
          className="text-lg md:text-2xl lg:text-3xl font-black tracking-tight"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Financial Efficiency{" "}
          <span className="text-emerald-400">&amp;</span>{" "}
          Team Synergy
        </motion.h2>
        <motion.p
          className="mt-0.5 text-[10px] md:text-xs lg:text-sm text-slate-500 font-mono"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Why 1 Shareholder Architect outperforms a 6-person vendor team
        </motion.p>
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* DESKTOP LAYOUT                                           */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div className="relative z-10 w-full max-w-6xl hidden md:flex flex-col gap-3 flex-1 min-h-0">
        {/* Top row: Traditional sidebar | ELMS card + gauge */}
        <div className="flex gap-3 flex-1 min-h-0">
          {/* ── LEFT: Traditional Team ── */}
          <div className="w-80 lg:w-96 shrink-0 flex flex-col min-h-0">
            <motion.div
              className="flex items-center gap-2 mb-2 shrink-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-1 h-5 rounded-full bg-red-500/60" />
              <span className="text-sm lg:text-base font-bold text-white/80 uppercase tracking-wider">
                Traditional Vendor Model
              </span>
            </motion.div>

            {/* Role cards - auto height, scrollable if needed */}
            <div className="flex flex-col gap-1.5 min-h-0 flex-1 overflow-y-auto scrollbar-none">
              {traditionalRoles.map((role, i) => (
                <TraditionalRoleCard
                  key={role.abbr}
                  role={role}
                  index={i}
                  isStruck={isStruck}
                />
              ))}
            </div>

            {/* Burning cash total */}
            <div className="shrink-0">
              <BurningTotal />

              {/* Cash burn progress bar */}
              <motion.div
                className="mt-1.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[10px] font-mono text-orange-400/70">Budget Burn Rate</span>
                  <span className="text-[10px] font-mono text-red-400">100%</span>
                </div>
                <BurningCashBar delay={0} />
              </motion.div>
            </div>
          </div>

          {/* ── CENTER + RIGHT: ELMS Card + Gauge ── */}
          <div className="flex-1 flex flex-col gap-3 min-w-0 min-h-0">
            {/* ELMS Shareholder Card */}
            <div className="shrink-0">
              <ELMSShareholderCard onStrike={() => setIsStruck(true)} />
            </div>

            {/* Bottom strip: Pyramid + Gauge — fills remaining space */}
            <div className="flex gap-3 items-stretch flex-1 min-h-0">
              {/* Resource Pyramid */}
              <motion.div
                className="flex-1 rounded-xl border border-white/6 bg-white/2 px-4 py-3 flex flex-col items-center justify-center"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.2 }}
              >
                <div className="w-full max-w-[85%] flex flex-col items-center justify-center flex-1">
                  <ResourcePyramid />
                </div>
              </motion.div>

              {/* Cost Gauge */}
              <motion.div
                className="flex-1 rounded-xl border border-white/6 bg-white/2 px-4 py-3 flex flex-col items-center justify-center"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.5 }}
              >
                <div className="flex flex-col items-center justify-center flex-1">
                  <CostGauge />
                </div>
              </motion.div>

              {/* Speed advantage */}
              <motion.div
                className="w-40 lg:w-44 rounded-xl border border-cyan-500/15 bg-cyan-500/5 px-4 py-3 flex flex-col items-center justify-center gap-3"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.8 }}
              >
                <Clock className="w-8 h-8 text-cyan-400" />
                <div className="text-center">
                  <div className="text-3xl lg:text-4xl font-black font-mono text-cyan-400">3×</div>
                  <div className="text-sm font-mono text-cyan-400/70 uppercase tracking-wider">Faster</div>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">Time-to-Market</div>
                </div>
                <div className="flex items-center gap-1.5">
                  <motion.div
                    className="w-2 h-2 rounded-full bg-cyan-400"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="text-[10px] font-mono text-slate-500">Lean delivery</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Bottom: Metric Badges */}
        <div className="shrink-0">
          <MetricBadges />
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* MOBILE LAYOUT                                            */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div className="relative z-10 flex md:hidden flex-col items-center gap-2.5 flex-1 justify-center min-h-0 w-full max-w-sm">
        {/* VS comparison hero */}
        <div className="flex items-center gap-3 w-full">
          {/* Traditional */}
          <motion.div
            className="flex-1 text-center rounded-xl bg-red-500/8 border border-red-500/20 py-2.5 px-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Users className="w-4 h-4 text-red-400 mx-auto mb-1" />
            <div className="text-lg font-black font-mono text-red-400">€150k+</div>
            <div className="text-[8px] font-mono text-red-400/60">6+ FTEs</div>
            <div className="text-[7px] text-slate-500 mt-0.5">Traditional</div>
          </motion.div>

          {/* VS */}
          <motion.div
            className="shrink-0"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
          >
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <span className="text-[10px] font-black text-white/40">VS</span>
            </div>
          </motion.div>

          {/* ELMS */}
          <motion.div
            className="flex-1 text-center rounded-xl bg-emerald-500/8 border border-emerald-500/20 py-2.5 px-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Crown className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
            <div className="text-lg font-black font-mono text-emerald-400">€25k</div>
            <div className="text-[8px] font-mono text-emerald-400/60">1 Architect</div>
            <div className="text-[7px] text-slate-500 mt-0.5">ELMS Phase 1</div>
          </motion.div>
        </div>

        {/* Key badges row */}
        <div className="flex gap-2 w-full">
          <motion.div
            className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Award className="w-3 h-3 text-amber-400" />
            <span className="text-[8px] font-mono font-bold text-amber-400">22.5% Stake</span>
          </motion.div>
          <motion.div
            className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Zap className="w-3 h-3 text-cyan-400" />
            <span className="text-[8px] font-mono font-bold text-cyan-400">3× Faster</span>
          </motion.div>
          <motion.div
            className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <TrendingDown className="w-3 h-3 text-emerald-400" />
            <span className="text-[8px] font-mono font-bold text-emerald-400">83% Saved</span>
          </motion.div>
        </div>

        {/* Savings pill */}
        <motion.div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <Star className="w-3 h-3 text-emerald-400" />
          <span className="text-[8px] font-mono text-emerald-400">
            Former eBay API Lead · E-Port in 1 month (vs 6)
          </span>
        </motion.div>

        <MobileExpandButton
          label="Tap to explore full breakdown"
          onClick={() => setMobileOpen(true)}
        />
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* MOBILE DETAIL MODAL                                      */}
      {/* ══════════════════════════════════════════════════════════ */}
      <MobileDetailModal
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        title="Financial Efficiency & Team Synergy"
        subtitle="Why 1 Shareholder Architect > 6 FTEs"
      >
        <div className="space-y-4">
          {/* Traditional team section */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-3.5 h-3.5 text-red-400" />
              <span className="text-[11px] font-bold text-white/80 uppercase tracking-wider">
                Traditional Vendor Team
              </span>
            </div>
            <div className="space-y-1.5">
              {traditionalRoles.map((role) => (
                <div
                  key={role.abbr}
                  className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/3 border border-white/5"
                >
                  <div className="flex items-center gap-2">
                    <div className={`p-1 rounded-md bg-white/5 ${role.color}`}>
                      {role.icon}
                    </div>
                    <span className="text-[10px] font-semibold text-white/70">{role.title}</span>
                  </div>
                  <span className="text-[10px] font-mono text-red-400/70">{role.salary}/yr</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
              <div className="flex items-center gap-2">
                <Flame className="w-3.5 h-3.5 text-red-400" />
                <span className="text-[10px] font-bold text-red-400">Total Annual Burn</span>
              </div>
              <span className="text-sm font-black font-mono text-red-400">€355k+</span>
            </div>
          </div>

          {/* VS divider */}
          <div className="flex items-center gap-3 py-1">
            <div className="flex-1 h-px bg-white/10" />
            <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
              <span className="text-[10px] font-black text-white/40">VS</span>
            </div>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* ELMS section */}
          <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                <Crown className="w-4.5 h-4.5 text-emerald-400" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-white/90">ELMS Agile Structure</div>
                <div className="text-[8px] font-mono text-emerald-400/70 uppercase tracking-wider">
                  Shareholder-Driven Efficiency
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-amber-500/8 border border-amber-500/20 mb-2">
              <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <div>
                <div className="text-[9px] font-bold text-amber-300">
                  Core Shareholder Architect (22.5% Stake)
                </div>
                <div className="text-[8px] text-slate-400 font-mono">
                  Former eBay API Lead · Full-stack
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col items-center p-2 rounded-lg bg-white/3 border border-white/5">
                <Euro className="w-3.5 h-3.5 text-emerald-400 mb-1" />
                <span className="text-base font-black font-mono text-emerald-400">€25k</span>
                <span className="text-[8px] text-slate-500 font-mono">Phase 1 Cost</span>
              </div>
              <div className="flex flex-col items-center p-2 rounded-lg bg-white/3 border border-white/5">
                <Clock className="w-3.5 h-3.5 text-cyan-400 mb-1" />
                <span className="text-base font-black font-mono text-cyan-400">3×</span>
                <span className="text-[8px] text-slate-500 font-mono">Faster Delivery</span>
              </div>
            </div>
          </div>

          {/* E-Port highlight */}
          <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-cyan-500/8 border border-cyan-500/15">
            <Rocket className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <div className="text-[10px] font-semibold text-white/80">
                E-Port Integration: 1 Month vs 6 Months
              </div>
              <div className="text-[8px] text-slate-500 font-mono">
                Harling Sun&apos;s API expertise eliminates middle-management
              </div>
            </div>
          </div>

          {/* Key metrics */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            {[
              { label: "Industry Avg", value: "€150k+", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
              { label: "ELMS Phase 1", value: "€25k", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
              { label: "Cost Savings", value: "83%+", color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/20" },
              { label: "Time-to-Market", value: "3× Faster", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
            ].map((m) => (
              <div
                key={m.label}
                className={`flex flex-col items-center p-2 rounded-lg border ${m.bg}`}
              >
                <span className={`text-sm font-black font-mono ${m.color}`}>{m.value}</span>
                <span className="text-[8px] text-slate-500 font-mono">{m.label}</span>
              </div>
            ))}
          </div>

          {/* Trust signals */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: <Shield className="w-3 h-3" />, label: "No lock-in" },
              { icon: <CheckCircle2 className="w-3 h-3" />, label: "Transparent" },
              { icon: <Zap className="w-3 h-3" />, label: "Pay-as-you-go" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-white/3 border border-white/5 text-[9px] text-slate-400 font-mono"
              >
                <span className="text-blue-400/60">{item.icon}</span>
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </MobileDetailModal>
    </div>
  );
}
