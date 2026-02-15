"use client";

import React, { useState } from "react";
import {
  Euro,
  Shield,
  TrendingDown,
  Handshake,
  Server,
  Code,
  HeadsetIcon,
  Settings,
  ChevronDown,
  Award,
  CheckCircle2,
  BarChart3,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

// ─── Types ───────────────────────────────────────────────────────
interface BudgetItem {
  category: string;
  icon: React.ReactNode;
  amount: string;
  frequency: string;
  annual: string;
  percentage: number;
  description: string;
  includes: string[];
}

// ─── Mock Data ───────────────────────────────────────────────────
const budgetItems: BudgetItem[] = [
  {
    category: "Architecture & Development",
    icon: <Code className="w-4 h-4" />,
    amount: "€26,000",
    frequency: "One-time",
    annual: "€26,000",
    percentage: 26,
    description:
      "Core platform architecture, API design, database schema, and initial module development.",
    includes: [
      "System architecture & technical blueprint",
      "Core API development (REST + GraphQL)",
      "Database design & migration framework",
      "CI/CD pipeline & DevOps setup",
      "Initial MCP server implementation",
    ],
  },
  {
    category: "Technical Support",
    icon: <HeadsetIcon className="w-4 h-4" />,
    amount: "€3,500",
    frequency: "/month",
    annual: "€42,000",
    percentage: 42,
    description:
      "24/7 system monitoring, security patching, performance optimization, and incident response.",
    includes: [
      "24/7 infrastructure monitoring & alerting",
      "Security patching & vulnerability scanning",
      "Performance optimization & scaling",
      "Incident response (< 2h SLA)",
      "Monthly health reports & recommendations",
    ],
  },
  {
    category: "Administration & Operations",
    icon: <Settings className="w-4 h-4" />,
    amount: "€2,000",
    frequency: "/month",
    annual: "€24,000",
    percentage: 24,
    description:
      "Project management, compliance administration, documentation, and stakeholder coordination.",
    includes: [
      "Project management & sprint planning",
      "GDPR & EU regulatory compliance admin",
      "Technical documentation & knowledge base",
      "Stakeholder reporting & coordination",
      "Vendor & partner relationship management",
    ],
  },
  {
    category: "Contingency Reserve",
    icon: <Shield className="w-4 h-4" />,
    amount: "€8,000",
    frequency: "Annual",
    annual: "€8,000",
    percentage: 8,
    description:
      "Strategic reserve for unforeseen requirements, emergency scaling, or regulatory changes.",
    includes: [
      "Emergency infrastructure scaling",
      "Regulatory change adaptation",
      "Unplanned integration requirements",
      "Security incident remediation",
      "Market opportunity rapid response",
    ],
  },
];

const TOTAL_ANNUAL = "€100,000";

// ─── Expandable Table Row ────────────────────────────────────────
function ExpandableRow({ item, index }: { item: BudgetItem; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <TableRow
        className="border-white/5 cursor-pointer group hover:bg-white/3 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <TableCell className="py-3">
          <motion.div
            className="flex items-center gap-2.5"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 shrink-0">
              {item.icon}
            </div>
            <span className="text-xs lg:text-sm font-semibold text-white/90">
              {item.category}
            </span>
          </motion.div>
        </TableCell>
        <TableCell className="py-3 text-right">
          <span className="text-xs lg:text-sm font-mono font-bold text-emerald-400">
            {item.amount}
          </span>
          <span className="text-[10px] text-slate-500 ml-1">
            {item.frequency}
          </span>
        </TableCell>
        <TableCell className="py-3 text-right">
          <span className="text-xs lg:text-sm font-mono text-white/80">
            {item.annual}
          </span>
        </TableCell>
        <TableCell className="py-3 text-right">
          <div className="flex items-center justify-end gap-2">
            <div className="w-16 h-1.5 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-blue-500/60"
                initial={{ width: 0 }}
                animate={{ width: `${item.percentage}%` }}
                transition={{
                  delay: 0.5 + index * 0.1,
                  duration: 0.8,
                  ease: "easeOut",
                }}
              />
            </div>
            <span className="text-[10px] font-mono text-slate-500 w-7 text-right">
              {item.percentage}%
            </span>
          </div>
        </TableCell>
        <TableCell className="py-3 w-8">
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-slate-500 group-hover:text-slate-300 transition-colors"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </motion.div>
        </TableCell>
      </TableRow>

      {/* Expanded detail row */}
      <AnimatePresence>
        {expanded && (
          <tr>
            <td colSpan={5} className="p-0">
              <motion.div
                className="px-4 pb-3 pt-1"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
              >
                <div className="rounded-xl bg-white/2 border border-white/5 p-3 lg:p-4">
                  <p className="text-[11px] lg:text-xs text-slate-400 mb-3 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-1.5">
                    {item.includes.map((inc, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-[10px] lg:text-[11px] text-slate-500"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-500/60 shrink-0" />
                        <span>{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </td>
          </tr>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Value Comparison Bar Chart ──────────────────────────────────
function ValueComparisonChart() {
  const bars = [
    {
      label: "Traditional Vendor",
      sublabel: "License + Consulting + Support",
      value: 200,
      displayValue: "€200,000+",
      color: "from-red-500/60 to-red-600/40",
      bgColor: "bg-red-500/10",
      textColor: "text-red-400",
      borderColor: "border-red-500/20",
    },
    {
      label: "ELMS Partnership",
      sublabel: "Strategic Technical Partnership",
      value: 100,
      displayValue: "€100,000",
      color: "from-emerald-500/60 to-emerald-600/40",
      bgColor: "bg-emerald-500/10",
      textColor: "text-emerald-400",
      borderColor: "border-emerald-500/20",
    },
  ];

  return (
    <div className="space-y-3">
      {bars.map((bar, i) => (
        <motion.div
          key={bar.label}
          className={`rounded-xl border ${bar.borderColor} ${bar.bgColor} p-3`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 + i * 0.2 }}
        >
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className={`text-xs font-semibold ${bar.textColor}`}>
                {bar.label}
              </div>
              <div className="text-[9px] text-slate-500">{bar.sublabel}</div>
            </div>
            <div
              className={`text-sm lg:text-base font-mono font-black ${bar.textColor}`}
            >
              {bar.displayValue}
            </div>
          </div>
          <div className="w-full h-2 rounded-full bg-black/20 overflow-hidden">
            <motion.div
              className={`h-full rounded-full bg-linear-to-r ${bar.color}`}
              initial={{ width: 0 }}
              animate={{ width: `${(bar.value / 220) * 100}%` }}
              transition={{
                delay: 1.0 + i * 0.2,
                duration: 1,
                ease: "easeOut",
              }}
            />
          </div>
        </motion.div>
      ))}

      {/* Savings callout */}
      <motion.div
        className="flex items-center justify-center gap-2 py-2"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
      >
        <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
        <span className="text-xs font-mono font-bold text-emerald-400">
          50%+ Cost Reduction
        </span>
        <span className="text-[10px] text-slate-500">
          vs traditional vendors
        </span>
      </motion.div>
    </div>
  );
}

// ─── Stakeholder Commitment Badge ────────────────────────────────
function StakeholderBadge() {
  return (
    <motion.div
      className="relative rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 lg:p-5 overflow-hidden"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.2, duration: 0.5 }}
    >
      {/* Subtle shimmer */}
      <motion.div
        className="absolute inset-0 bg-linear-to-r from-transparent via-amber-400/5 to-transparent"
        animate={{ x: ["-100%", "200%"] }}
        transition={{ duration: 3, repeat: Infinity, repeatDelay: 4 }}
      />

      <div className="relative flex items-center gap-3 lg:gap-4">
        {/* Badge icon */}
        <div className="shrink-0">
          <motion.div
            className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center"
            animate={{ rotate: [0, 2, -2, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Award className="w-6 h-6 lg:w-7 lg:h-7 text-amber-400" />
          </motion.div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl lg:text-3xl font-black font-mono text-amber-400">
              25%
            </span>
            <div className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
              <span className="text-[9px] font-mono font-bold text-amber-400 uppercase tracking-wider">
                Equity Stake
              </span>
            </div>
          </div>
          <div className="text-xs lg:text-sm font-semibold text-white/90 mb-0.5">
            Technical Stakeholder Commitment
          </div>
          <p className="text-[10px] lg:text-xs text-slate-400 leading-relaxed">
            CTO-level technical equity demonstrates long-term alignment.
            Founder&apos;s skin-in-the-game significantly reduces investor risk.
          </p>
        </div>

        {/* Trust indicators */}
        <div className="hidden lg:flex flex-col gap-1.5 shrink-0">
          {["Long-term Aligned", "Risk Reduced", "Incentivized"].map(
            (label, i) => (
              <motion.div
                key={label}
                className="flex items-center gap-1.5 text-[9px] text-amber-400/70 font-mono"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.5 + i * 0.1 }}
              >
                <Handshake className="w-3 h-3" />
                {label}
              </motion.div>
            )
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Slide Component ────────────────────────────────────────
export function FinancialTransparencySlide() {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center bg-linear-to-br from-slate-950 via-[#0b1222] to-slate-950 text-white relative overflow-hidden aspect-video p-5 lg:p-8">
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
      <div className="absolute top-1/4 left-1/5 w-72 h-72 bg-blue-500/4 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/3 right-1/6 w-72 h-72 bg-emerald-500/3 rounded-full blur-[100px]" />

      {/* ── Header ── */}
      <div className="relative z-10 text-center mb-3 lg:mb-5">
        <motion.div
          className="flex items-center justify-center gap-2 mb-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Euro className="w-3.5 h-3.5 text-emerald-400/60" />
          <span className="text-[10px] lg:text-xs font-mono text-emerald-400/70 tracking-[0.25em] uppercase">
            Year 1 Budget
          </span>
          <Euro className="w-3.5 h-3.5 text-emerald-400/60" />
        </motion.div>

        <motion.h2
          className="text-xl lg:text-3xl font-black tracking-tight"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Financial Transparency
        </motion.h2>
        <motion.p
          className="mt-1 text-[10px] lg:text-xs text-slate-500 font-mono"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Every euro accountable · Strategic partnership model · Long-term value alignment
        </motion.p>
      </div>

      {/* ── Main Content: 2 columns ── */}
      <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-5 gap-4 flex-1 min-h-0">
        {/* Left: Budget Table (3/5) */}
        <div className="lg:col-span-3 flex flex-col gap-3 min-h-0">
          <Card className="bg-white/2 border-white/8 shadow-none flex-1 py-0 gap-0 overflow-hidden">
            <CardHeader className="px-4 py-3 border-b border-white/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-400" />
                  <CardTitle className="text-xs lg:text-sm text-white/90">
                    Budget Breakdown
                  </CardTitle>
                </div>
                <CardDescription className="text-[10px] font-mono text-emerald-400 font-bold m-0">
                  Total: {TOTAL_ANNUAL}/yr
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead className="text-[10px] text-slate-500 font-mono uppercase tracking-wider h-8">
                      Category
                    </TableHead>
                    <TableHead className="text-[10px] text-slate-500 font-mono uppercase tracking-wider text-right h-8">
                      Rate
                    </TableHead>
                    <TableHead className="text-[10px] text-slate-500 font-mono uppercase tracking-wider text-right h-8">
                      Annual
                    </TableHead>
                    <TableHead className="text-[10px] text-slate-500 font-mono uppercase tracking-wider text-right h-8">
                      Share
                    </TableHead>
                    <TableHead className="w-8 h-8" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {budgetItems.map((item, i) => (
                    <ExpandableRow key={item.category} item={item} index={i} />
                  ))}
                  {/* Total row */}
                  <TableRow className="border-white/10 bg-white/2 hover:bg-white/3">
                    <TableCell className="py-3">
                      <span className="text-xs lg:text-sm font-bold text-white flex items-center gap-2">
                        <Euro className="w-4 h-4 text-emerald-400" />
                        Total Year 1
                      </span>
                    </TableCell>
                    <TableCell />
                    <TableCell className="py-3 text-right">
                      <span className="text-sm lg:text-base font-mono font-black text-emerald-400">
                        {TOTAL_ANNUAL}
                      </span>
                    </TableCell>
                    <TableCell className="py-3 text-right">
                      <span className="text-[10px] font-mono text-slate-400">
                        100%
                      </span>
                    </TableCell>
                    <TableCell />
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Click hint */}
          <motion.div
            className="flex items-center justify-center gap-1.5 text-[9px] text-slate-600 font-mono"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: 2 }}
          >
            <ChevronDown className="w-3 h-3" />
            Click any row to expand details
          </motion.div>
        </div>

        {/* Right: Chart + Badge (2/5) */}
        <div className="lg:col-span-2 flex flex-col gap-3 min-h-0">
          {/* Value Comparison */}
          <Card className="bg-white/2 border-white/8 shadow-none py-0 gap-0">
            <CardHeader className="px-4 py-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-emerald-400" />
                <CardTitle className="text-xs lg:text-sm text-white/90">
                  Value Comparison
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-3 lg:p-4">
              <ValueComparisonChart />
            </CardContent>
          </Card>

          {/* Stakeholder Badge */}
          <StakeholderBadge />

          {/* Trust signals */}
          <motion.div
            className="grid grid-cols-3 gap-2"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6 }}
          >
            {[
              { icon: <Server className="w-3 h-3" />, label: "Pay-as-you-go" },
              { icon: <Shield className="w-3 h-3" />, label: "No lock-in" },
              {
                icon: <Handshake className="w-3 h-3" />,
                label: "Full transparency",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-white/2 border border-white/5 text-[9px] lg:text-[10px] text-slate-400 font-mono"
              >
                <span className="text-blue-400/60">{item.icon}</span>
                {item.label}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
