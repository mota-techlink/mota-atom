"use client";

import React, { useState, useMemo } from "react";
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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ───────────────────────────────────────────────────────
type ModuleKey =
  | "shipping"
  | "customs"
  | "delivery"
  | "iot"
  | "ai-mcp"
  | "carbon";

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
  color: string; // tailwind text color
  bgActive: string; // active bg
  borderActive: string; // active border glow
  glowShadow: string; // active glow shadow (inline style)
  badge?: string; // extra info badge on hover
}

// ─── Data ────────────────────────────────────────────────────────
const features: FeatureItem[] = [
  {
    Icon: Link,
    label: "Seamless System Integration",
    description:
      "Eliminate barriers between systems. One source of truth for all logistics data across the entire supply chain.",
    moduleKey: "shipping",
  },
  {
    Icon: Printer,
    label: "Auto Label Generation",
    description:
      "Generate accurate last-mile delivery labels automatically from synced shipping data.",
    moduleKey: "delivery",
  },
  {
    Icon: FileCheck,
    label: "Customs Compliance",
    description:
      "Trustworthy, validated data ensures smooth customs clearance with zero manual errors.",
    moduleKey: "customs",
  },
  {
    Icon: Leaf,
    label: "Carbon Emission Tracking",
    description:
      "Integrated carbon emission tracking meeting EU environmental standards and regulations.",
    moduleKey: "carbon",
  },
  {
    Icon: Cpu,
    label: "AI-Powered Intelligence",
    description:
      "Predictive analytics, route optimization, and automated decision-making via MCP.",
    moduleKey: "ai-mcp",
  },
  {
    Icon: Radio,
    label: "IoT Device Integration",
    description:
      "Real-time data from IoT devices for temperature, location, and condition monitoring.",
    moduleKey: "iot",
  },
];

const modules: ModuleConfig[] = [
  {
    key: "shipping",
    label: "Shipping",
    Icon: Ship,
    color: "text-blue-400",
    bgActive: "bg-blue-500/25",
    borderActive: "border-blue-400/60",
    glowShadow: "0 0 20px rgba(59,130,246,0.5), 0 0 40px rgba(59,130,246,0.2)",
    badge: "API-First Architecture",
  },
  {
    key: "customs",
    label: "Customs",
    Icon: ShieldCheck,
    color: "text-emerald-400",
    bgActive: "bg-emerald-500/25",
    borderActive: "border-emerald-400/60",
    glowShadow:
      "0 0 20px rgba(52,211,153,0.5), 0 0 40px rgba(52,211,153,0.2)",
    badge: "AEO Certified Flow",
  },
  {
    key: "delivery",
    label: "Delivery",
    Icon: Truck,
    color: "text-purple-400",
    bgActive: "bg-purple-500/25",
    borderActive: "border-purple-400/60",
    glowShadow:
      "0 0 20px rgba(168,85,247,0.5), 0 0 40px rgba(168,85,247,0.2)",
    badge: "Last-Mile Optimized",
  },
  {
    key: "iot",
    label: "IoT",
    Icon: Radio,
    color: "text-orange-400",
    bgActive: "bg-orange-500/25",
    borderActive: "border-orange-400/60",
    glowShadow:
      "0 0 20px rgba(251,146,60,0.5), 0 0 40px rgba(251,146,60,0.2)",
    badge: "Real-Time Telemetry",
  },
  {
    key: "ai-mcp",
    label: "AI / MCP",
    Icon: BrainCircuit,
    color: "text-cyan-400",
    bgActive: "bg-cyan-500/25",
    borderActive: "border-cyan-400/60",
    glowShadow:
      "0 0 20px rgba(34,211,238,0.5), 0 0 40px rgba(34,211,238,0.2)",
    badge: "MCP Protocol Native",
  },
  {
    key: "carbon",
    label: "Carbon",
    Icon: Footprints,
    color: "text-green-400",
    bgActive: "bg-green-500/25",
    borderActive: "border-green-400/60",
    glowShadow:
      "0 0 20px rgba(34,197,94,0.5), 0 0 40px rgba(34,197,94,0.2)",
    badge: "ISO 14067 Compliant",
  },
];

// ─── Module position calculator (hexagonal orbit) ────────────────
function getModulePosition(index: number, total: number, radius: number) {
  // Start from top (-90°), go clockwise
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
  };
}

// ─── SVG Connection Lines ────────────────────────────────────────
function ConnectionLines({
  activeModule,
  centerX,
  centerY,
  radius,
}: {
  activeModule: ModuleKey | null;
  centerX: number;
  centerY: number;
  radius: number;
}) {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox={`0 0 ${centerX * 2} ${centerY * 2}`}
    >
      <defs>
        {/* Marching-ants / flowing-liquid dash pattern */}
        <linearGradient id="lineGradIdle" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(148,163,184,0)" />
          <stop offset="50%" stopColor="rgba(148,163,184,0.15)" />
          <stop offset="100%" stopColor="rgba(148,163,184,0)" />
        </linearGradient>
        {modules.map((mod) => {
          const colorMap: Record<ModuleKey, string> = {
            shipping: "rgba(59,130,246,0.6)",
            customs: "rgba(52,211,153,0.6)",
            delivery: "rgba(168,85,247,0.6)",
            iot: "rgba(251,146,60,0.6)",
            "ai-mcp": "rgba(34,211,238,0.6)",
            carbon: "rgba(34,197,94,0.6)",
          };
          return (
            <linearGradient
              key={mod.key}
              id={`lineGrad-${mod.key}`}
              x1="0"
              y1="0"
              x2="1"
              y2="0"
            >
              <stop offset="0%" stopColor="rgba(148,163,184,0)" />
              <stop offset="50%" stopColor={colorMap[mod.key]} />
              <stop offset="100%" stopColor="rgba(148,163,184,0)" />
            </linearGradient>
          );
        })}
      </defs>

      {modules.map((mod, i) => {
        const pos = getModulePosition(i, modules.length, radius);
        const isActive = activeModule === mod.key;
        const endX = centerX + pos.x;
        const endY = centerY + pos.y;

        return (
          <g key={mod.key}>
            {/* Base line (always visible, faint) */}
            <line
              x1={centerX}
              y1={centerY}
              x2={endX}
              y2={endY}
              stroke="rgba(148,163,184,0.08)"
              strokeWidth="1"
            />
            {/* Animated line */}
            <motion.line
              x1={centerX}
              y1={centerY}
              x2={endX}
              y2={endY}
              stroke={
                isActive
                  ? `url(#lineGrad-${mod.key})`
                  : "url(#lineGradIdle)"
              }
              strokeWidth={isActive ? 2 : 1}
              strokeDasharray={isActive ? "6 4" : "3 8"}
              initial={false}
              animate={{
                strokeDashoffset: [0, -20],
                opacity: isActive ? 1 : 0.3,
              }}
              transition={{
                strokeDashoffset: {
                  duration: isActive ? 0.8 : 3,
                  repeat: Infinity,
                  ease: "linear",
                },
                opacity: { type: "spring", stiffness: 200, damping: 25 },
              }}
            />
          </g>
        );
      })}
    </svg>
  );
}

// ─── Core Hexagon ────────────────────────────────────────────────
function CoreHexagon({ isAnyActive }: { isAnyActive: boolean }) {
  return (
    <motion.div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center justify-center"
      animate={{
        scale: isAnyActive ? [1, 1.04, 1] : [1, 1.02, 1],
      }}
      transition={{
        duration: isAnyActive ? 1.5 : 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {/* Outer glow ring */}
      <motion.div
        className="absolute w-28 h-28 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Hexagon shape */}
      <div className="relative w-20 h-20 flex items-center justify-center">
        <svg
          viewBox="0 0 80 80"
          className="absolute inset-0 w-full h-full"
        >
          <motion.polygon
            points="40,4 73,22 73,58 40,76 7,58 7,22"
            fill="rgba(15,23,42,0.8)"
            stroke="rgba(59,130,246,0.3)"
            strokeWidth="1.5"
            animate={{
              stroke: isAnyActive
                ? [
                    "rgba(59,130,246,0.5)",
                    "rgba(52,211,153,0.5)",
                    "rgba(59,130,246,0.5)",
                  ]
                : [
                    "rgba(59,130,246,0.2)",
                    "rgba(59,130,246,0.4)",
                    "rgba(59,130,246,0.2)",
                  ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </svg>
        <div className="relative z-10 text-center">
          <Hexagon className="w-5 h-5 text-blue-400/70 mx-auto mb-0.5" />
          <div className="text-[9px] font-bold tracking-widest text-blue-300/90">
            ELMS
          </div>
          <div className="text-[7px] tracking-wider text-slate-500">
            CORE
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Orbital Module Node ─────────────────────────────────────────
function ModuleNode({
  mod,
  index,
  total,
  radius,
  isActive,
}: {
  mod: ModuleConfig;
  index: number;
  total: number;
  radius: number;
  isActive: boolean;
}) {
  const pos = getModulePosition(index, total, radius);
  const IconComp = mod.Icon;

  return (
    <motion.div
      className="absolute z-20"
      style={{
        top: "50%",
        left: "50%",
      }}
      animate={{
        x: pos.x - 28,
        y: pos.y - 28,
        scale: isActive ? 1.15 : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 22,
      }}
    >
      {/* Outer pulse ring on active */}
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

      {/* Node card */}
      <motion.div
        className={`relative w-14 h-14 rounded-xl flex flex-col items-center justify-center border backdrop-blur-sm transition-colors duration-300 ${
          isActive
            ? `${mod.bgActive} ${mod.borderActive}`
            : "bg-white/5 border-white/10"
        }`}
        style={isActive ? { boxShadow: mod.glowShadow } : undefined}
      >
        <IconComp
          className={`w-5 h-5 mb-0.5 transition-colors duration-300 ${
            isActive ? mod.color : "text-slate-500"
          }`}
        />
        <span
          className={`text-[8px] font-semibold tracking-wide transition-colors duration-300 ${
            isActive ? mod.color : "text-slate-600"
          }`}
        >
          {mod.label}
        </span>
      </motion.div>

      {/* Badge tooltip on active */}
      <AnimatePresence>
        {isActive && mod.badge && (
          <motion.div
            className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <span
              className={`text-[7px] font-medium px-2 py-0.5 rounded-full border backdrop-blur-md ${mod.borderActive} ${mod.bgActive} ${mod.color}`}
            >
              {mod.badge}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Architecture Diagram (Right Side) ───────────────────────────
function ArchitectureDiagram({
  activeModule,
}: {
  activeModule: ModuleKey | null;
}) {
  const size = 320;
  const center = size / 2;
  const orbitRadius = 110;

  return (
    <div
      className="relative mx-auto"
      style={{ width: size, height: size }}
    >
      {/* Faint orbit ring */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/5"
        style={{ width: orbitRadius * 2 + 56, height: orbitRadius * 2 + 56 }}
      />

      {/* SVG connection lines */}
      <ConnectionLines
        activeModule={activeModule}
        centerX={center}
        centerY={center}
        radius={orbitRadius}
      />

      {/* Core hexagon */}
      <CoreHexagon isAnyActive={activeModule !== null} />

      {/* Orbital module nodes */}
      {modules.map((mod, i) => (
        <ModuleNode
          key={mod.key}
          mod={mod}
          index={i}
          total={modules.length}
          radius={orbitRadius}
          isActive={activeModule === mod.key}
        />
      ))}
    </div>
  );
}

// ─── Feature Card (Left Side) ────────────────────────────────────
function FeatureCard({
  feature,
  index,
  isActive,
  onHoverStart,
  onHoverEnd,
}: {
  feature: FeatureItem;
  index: number;
  isActive: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}) {
  const IconComp = feature.Icon;

  // Find the module config for color matching
  const modConfig = modules.find((m) => m.key === feature.moduleKey);

  return (
    <motion.div
      className={`relative flex items-start gap-3 px-3.5 py-3 rounded-xl border backdrop-blur-sm cursor-pointer transition-colors duration-200 ${
        isActive
          ? "bg-white/8 border-white/15"
          : "bg-white/3 border-white/5 hover:bg-white/6"
      }`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        delay: 0.3 + index * 0.1,
        type: "spring",
        stiffness: 200,
        damping: 25,
      }}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      whileHover={{ x: 4 }}
    >
      {/* Active indicator bar */}
      <motion.div
        className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full"
        style={{
          backgroundColor: isActive
            ? modConfig?.color
                .replace("text-", "")
                .includes("blue")
              ? "rgba(59,130,246,0.7)"
              : modConfig?.color.includes("emerald")
                ? "rgba(52,211,153,0.7)"
                : modConfig?.color.includes("purple")
                  ? "rgba(168,85,247,0.7)"
                  : modConfig?.color.includes("orange")
                    ? "rgba(251,146,60,0.7)"
                    : modConfig?.color.includes("cyan")
                      ? "rgba(34,211,238,0.7)"
                      : "rgba(34,197,94,0.7)"
            : "transparent",
        }}
        animate={{ opacity: isActive ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />

      {/* Icon */}
      <div
        className={`shrink-0 mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center border transition-colors duration-200 ${
          isActive
            ? "bg-white/10 border-white/15"
            : "bg-white/5 border-white/8"
        }`}
      >
        <IconComp
          className={`w-4 h-4 transition-colors duration-200 ${
            isActive ? (modConfig?.color ?? "text-white") : "text-slate-500"
          }`}
        />
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <div
          className={`text-xs font-semibold leading-snug transition-colors duration-200 ${
            isActive ? "text-white" : "text-slate-300"
          }`}
        >
          {feature.label}
        </div>
        <motion.div
          className="text-[10px] leading-relaxed text-slate-500 mt-0.5"
          animate={{ opacity: isActive ? 1 : 0.6 }}
          transition={{ duration: 0.2 }}
        >
          {feature.description}
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Main Slide Component ────────────────────────────────────────
export function SolutionHubSlide() {
  const [activeModule, setActiveModule] = useState<ModuleKey | null>(null);

  return (
    <div className="w-full h-full flex flex-col relative overflow-hidden aspect-video bg-[#020617]">
      {/* Background gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 30% 50%, rgba(15,23,42,1) 0%, rgba(2,6,23,1) 70%)",
        }}
      />

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-30">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="solutionGrid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="20" cy="20" r="0.5" fill="rgba(148,163,184,0.1)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#solutionGrid)" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full px-10 lg:px-14 py-8 lg:py-10">
        {/* Header */}
        <motion.div
          className="mb-6 lg:mb-8"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-5 rounded-full bg-blue-500" />
            <span className="text-[10px] font-semibold tracking-widest text-blue-400/80 uppercase">
              Platform Architecture
            </span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
            Our Solution
          </h2>
          <p className="text-xs lg:text-sm text-slate-500 mt-1 max-w-md">
            ELMS eliminates barriers between fragmented logistics systems.
            One platform — seamlessly synced across the entire supply chain.
          </p>
        </motion.div>

        {/* Two-column layout */}
        <div className="flex-1 flex gap-8 lg:gap-12 items-center min-h-0">
          {/* Left: Feature list */}
          <div className="w-[45%] shrink-0 flex flex-col gap-2">
            {features.map((feature, i) => (
              <FeatureCard
                key={feature.moduleKey}
                feature={feature}
                index={i}
                isActive={activeModule === feature.moduleKey}
                onHoverStart={() => setActiveModule(feature.moduleKey)}
                onHoverEnd={() => setActiveModule(null)}
              />
            ))}
          </div>

          {/* Right: Architecture diagram */}
          <motion.div
            className="flex-1 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
          >
            <ArchitectureDiagram activeModule={activeModule} />
          </motion.div>
        </div>

        {/* Bottom status bar */}
        <motion.div
          className="mt-4 flex items-center justify-between text-[9px] text-slate-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
              All Systems Operational
            </span>
            <span className="w-px h-3 bg-slate-700" />
            <span>6 Modules • 1 Unified Core</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="tracking-wider">Hover to explore architecture</span>
            <motion.span
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
