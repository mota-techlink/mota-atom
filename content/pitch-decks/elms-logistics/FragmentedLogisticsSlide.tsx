"use client";

import React, { useEffect, useState } from "react";
import {
  ShoppingCart,
  FileCheck,
  Truck,
  AlertTriangle,
  Unplug,
  RefreshCcwDot,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MobileDetailModal,
  MobileExpandButton,
} from "./MobileDetailModal";

// ─── Broken Particle ────────────────────────────────────────────────
interface ParticleProps {
  delay: number;
  startX: number;
  startY: number;
  direction: "left" | "right";
}

function BrokenParticle({ delay, startX, startY, direction }: ParticleProps) {
  const dx = direction === "right" ? 30 : -30;

  return (
    <motion.div
      className="absolute w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"
      style={{ left: startX, top: startY }}
      initial={{ opacity: 0, x: 0, y: 0, scale: 0.5 }}
      animate={{
        opacity: [0, 1, 1, 0.6, 0],
        x: [0, dx * 0.4, dx * 0.6, dx * 0.7, dx * 0.5],
        y: [0, -4, 2, 14, 28],
        scale: [0.5, 1, 1.1, 0.8, 0.3],
      }}
      transition={{
        duration: 2.2,
        delay,
        repeat: Infinity,
        repeatDelay: 1.4,
        ease: "easeInOut",
      }}
    />
  );
}

// ─── Broken Data Flow between columns ────────────────────────────
function BrokenDataFlow() {
  const particles = [
    { delay: 0, startX: 0, startY: 8, direction: "right" as const },
    { delay: 0.3, startX: 4, startY: 20, direction: "right" as const },
    { delay: 0.7, startX: -2, startY: 14, direction: "left" as const },
    { delay: 1.0, startX: 2, startY: 4, direction: "right" as const },
    { delay: 1.4, startX: -4, startY: 26, direction: "left" as const },
    { delay: 0.5, startX: 6, startY: 10, direction: "right" as const },
  ];

  return (
    <div className="relative flex flex-col items-center justify-center w-10 lg:w-16 h-40 self-center">
      {/* Broken cable icon */}
      <motion.div
        className="text-red-500/60 z-10"
        animate={{ rotate: [0, 4, -4, 0], scale: [1, 1.05, 0.95, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <Unplug className="w-5 h-5 lg:w-6 lg:h-6" />
      </motion.div>

      {/* Dashed broken line */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 40 140"
        fill="none"
      >
        <motion.line
          x1="20" y1="10" x2="20" y2="130"
          stroke="rgba(239,68,68,0.25)"
          strokeWidth="1.5"
          strokeDasharray="4 6"
          animate={{ strokeDashoffset: [0, -20] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
      </svg>

      {/* Particles */}
      {particles.map((p, i) => (
        <BrokenParticle key={i} {...p} />
      ))}
    </div>
  );
}

// ─── Glitch Text Effect ──────────────────────────────────────────
function GlitchText({ text }: { text: string }) {
  return (
    <motion.span
      className="relative inline-block"
      animate={{
        x: [0, -1, 2, -1, 0],
        textShadow: [
          "0 0 0 transparent",
          "-2px 0 #ef4444, 2px 0 #3b82f6",
          "0 0 0 transparent",
          "2px 0 #ef4444, -2px 0 #3b82f6",
          "0 0 0 transparent",
        ],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        repeatDelay: 4,
        ease: "easeInOut",
      }}
    >
      {text}
    </motion.span>
  );
}

// ─── Sync Error Badge ────────────────────────────────────────────
function SyncErrorBadge({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 text-[10px] lg:text-xs font-mono font-bold tracking-wider uppercase"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4 }}
    >
      <motion.div
        className="w-1.5 h-1.5 rounded-full bg-red-500"
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 1.2, repeat: Infinity }}
      />
      <RefreshCcwDot className="w-3 h-3" />
      Sync Error
    </motion.div>
  );
}

// ─── Silo Card ───────────────────────────────────────────────────
interface SiloCardProps {
  icon: React.ReactNode;
  title: string;
  items: string[];
  delay: number;
}

function SiloCard({ icon, title, items, delay }: SiloCardProps) {
  return (
    <motion.div
      className="relative flex flex-col items-center p-5 lg:p-6 rounded-2xl border-2 border-dashed border-slate-500/40 bg-slate-800/40 backdrop-blur-sm group hover:border-red-500/30 transition-colors duration-500"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: "easeOut" }}
    >
      {/* Noise overlay */}
      <div className="absolute inset-0 rounded-2xl opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI2EpIi8+PC9zdmc+')]" />

      {/* Icon */}
      <div className="relative mb-3">
        <div className="p-3 rounded-xl bg-slate-700/50 border border-slate-600/30 text-slate-400 group-hover:text-slate-300 transition-colors">
          {icon}
        </div>
        {/* Disconnected pulse ring */}
        <motion.div
          className="absolute -inset-1 rounded-xl border border-red-500/20"
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: delay + 0.5 }}
        />
      </div>

      {/* Title */}
      <h3 className="text-sm lg:text-base font-bold text-slate-200 mb-1 tracking-wide uppercase font-mono">
        {title}
      </h3>

      {/* Badge */}
      <div className="mb-3">
        <SyncErrorBadge delay={delay + 0.6} />
      </div>

      {/* Items */}
      <ul className="space-y-1.5 w-full">
        {items.map((item, i) => (
          <motion.li
            key={i}
            className="flex items-center gap-2 text-[11px] lg:text-xs text-slate-400/80 font-mono"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + 0.8 + i * 0.1 }}
          >
            <span className="w-1 h-1 rounded-full bg-slate-500/50 shrink-0" />
            {item}
          </motion.li>
        ))}
      </ul>

      {/* Corner warning */}
      <motion.div
        className="absolute -top-1.5 -right-1.5"
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
      >
        <AlertTriangle className="w-4 h-4 text-amber-500/60" />
      </motion.div>
    </motion.div>
  );
}

// ─── Scanning Line Effect ─────────────────────────────────────────
function ScanLine() {
  return (
    <motion.div
      className="absolute left-0 right-0 h-px bg-linear-to-r from-transparent via-red-500/30 to-transparent pointer-events-none"
      animate={{ top: ["0%", "100%"] }}
      transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
    />
  );
}

// ─── Main Slide Component ────────────────────────────────────────
export function FragmentedLogisticsSlide() {
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden p-8 lg:p-12">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Scan line */}
      <ScanLine />

      {/* Faint red vignette at corners */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl" />

      {/* ── Header ── */}
      <div className="relative text-center mb-4 md:mb-6 lg:mb-10 z-10">
        <motion.div
          className="flex items-center justify-center gap-2 mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.span
            className="inline-block w-8 h-0.5 bg-red-500/60"
            animate={{ scaleX: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-[10px] lg:text-xs font-mono text-red-400/80 tracking-[0.3em] uppercase">
            The Problem
          </span>
          <motion.span
            className="inline-block w-8 h-0.5 bg-red-500/60"
            animate={{ scaleX: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          />
        </motion.div>

        <motion.h2
          className="text-xl md:text-2xl lg:text-4xl xl:text-5xl font-black tracking-tight font-mono"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <GlitchText text="The Barricades:" />
          <br />
          <span className="text-slate-400 text-base md:text-2xl lg:text-4xl xl:text-5xl">
            Fragmentation in Global Logistics
          </span>
        </motion.h2>

        <motion.p
          className="mt-2 md:mt-3 text-[10px] md:text-xs lg:text-sm text-slate-500 font-mono max-w-lg mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Three isolated silos. Zero interoperability. Every handoff is a failure point.
        </motion.p>
      </div>

      {/* ── Desktop: 3-Column Grid with Broken Data Flows ── */}
      {mounted && (
        <div className="relative z-10 hidden md:flex items-stretch justify-center gap-0 w-full max-w-5xl">
          {/* Silo 1: E-commerce */}
          <div className="flex-1 min-w-0 max-w-xs">
            <SiloCard
              icon={<ShoppingCart className="w-6 h-6" />}
              title="E-commerce Platforms"
              items={[
                "Order fragmentation",
                "SKU mismatch across stores",
                "No real-time inventory sync",
                "Manual CSV exports",
              ]}
              delay={0.3}
            />
          </div>

          {/* Broken Flow 1 → 2 */}
          <BrokenDataFlow />

          {/* Silo 2: Customs */}
          <div className="flex-1 min-w-0 max-w-xs">
            <SiloCard
              icon={<FileCheck className="w-6 h-6" />}
              title="Customs Compliance"
              items={[
                "Paper-based declarations",
                "HS code errors",
                "Delayed clearance cycles",
                "Regulatory blind spots",
              ]}
              delay={0.6}
            />
          </div>

          {/* Broken Flow 2 → 3 */}
          <BrokenDataFlow />

          {/* Silo 3: Last-Mile */}
          <div className="flex-1 min-w-0 max-w-xs">
            <SiloCard
              icon={<Truck className="w-6 h-6" />}
              title="Last-Mile Carriers"
              items={[
                "Label re-entry by hand",
                "Wrong address formats",
                "No delivery confirmation",
                "Carbon tracking gap",
              ]}
              delay={0.9}
            />
          </div>
        </div>
      )}

      {/* ── Mobile: Condensed 3 icons + tap to expand ── */}
      <div className="relative z-10 flex md:hidden flex-col items-center gap-3">
        {/* Mini silo row */}
        <div className="flex items-center gap-3">
          {[
            { icon: <ShoppingCart className="w-4 h-4" />, label: "E-commerce", color: "text-red-400" },
            { icon: <Unplug className="w-3 h-3 text-red-500/40" />, label: "" },
            { icon: <FileCheck className="w-4 h-4" />, label: "Customs", color: "text-red-400" },
            { icon: <Unplug className="w-3 h-3 text-red-500/40" />, label: "" },
            { icon: <Truck className="w-4 h-4" />, label: "Last-Mile", color: "text-red-400" },
          ].map((item, i) =>
            item.label ? (
              <motion.div
                key={i}
                className="flex flex-col items-center gap-1 p-2 rounded-xl border border-dashed border-slate-500/30 bg-slate-800/40"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <div className="p-1.5 rounded-lg bg-slate-700/50 text-slate-400">
                  {item.icon}
                </div>
                <span className="text-[8px] font-mono text-slate-400 uppercase">{item.label}</span>
                <div className="flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-[7px] font-mono text-red-400/70">SYNC ERR</span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={i}
                className="text-red-500/40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.1 }}
              >
                {item.icon}
              </motion.div>
            )
          )}
        </div>

        <MobileExpandButton
          label="Tap to view silo details"
          onClick={() => setMobileOpen(true)}
        />
      </div>

      {/* ── Bottom stat bar ── */}
      <motion.div
        className="relative z-10 mt-4 md:mt-6 lg:mt-10 flex items-center gap-3 md:gap-4 lg:gap-8 text-[8px] md:text-[10px] lg:text-xs font-mono text-slate-500"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
      >
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-red-500/60 animate-pulse" />
          <span>
            <span className="text-red-400 font-bold">37%</span> data lost
          </span>
        </div>
        <div className="h-3 w-px bg-slate-700" />
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-amber-500/60 animate-pulse" />
          <span>
            <span className="text-amber-400 font-bold">€4.2B</span> cost
          </span>
        </div>
        <div className="h-3 w-px bg-slate-700" />
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-red-500/60 animate-pulse" />
          <span>
            <span className="text-red-400 font-bold">72h</span> delay
          </span>
        </div>
      </motion.div>

      {/* ── Mobile Detail Modal ── */}
      <MobileDetailModal
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        title="Fragmented Logistics Silos"
        subtitle="Three isolated systems. Every handoff is a failure point."
      >
        <div className="space-y-4">
          {[
            {
              icon: <ShoppingCart className="w-5 h-5" />,
              title: "E-commerce Platforms",
              items: [
                "Order fragmentation",
                "SKU mismatch across stores",
                "No real-time inventory sync",
                "Manual CSV exports",
              ],
            },
            {
              icon: <FileCheck className="w-5 h-5" />,
              title: "Customs Compliance",
              items: [
                "Paper-based declarations",
                "HS code errors",
                "Delayed clearance cycles",
                "Regulatory blind spots",
              ],
            },
            {
              icon: <Truck className="w-5 h-5" />,
              title: "Last-Mile Carriers",
              items: [
                "Label re-entry by hand",
                "Wrong address formats",
                "No delivery confirmation",
                "Carbon tracking gap",
              ],
            },
          ].map((silo, si) => (
            <div
              key={si}
              className="p-4 rounded-xl border border-dashed border-slate-500/30 bg-slate-800/40"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-slate-700/50 text-slate-400">
                  {silo.icon}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-200 font-mono uppercase">
                    {silo.title}
                  </h4>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-[10px] font-mono text-red-400">
                      Sync Error
                    </span>
                  </div>
                </div>
              </div>
              <ul className="space-y-1.5">
                {silo.items.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-xs text-slate-400 font-mono"
                  >
                    <span className="w-1 h-1 rounded-full bg-slate-500/50 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            {[
              { value: "37%", label: "Data lost in handoffs", color: "text-red-400" },
              { value: "€4.2B", label: "Annual EU cost", color: "text-amber-400" },
              { value: "72h", label: "Avg customs delay", color: "text-red-400" },
            ].map((stat) => (
              <div
                key={stat.value}
                className="text-center p-2 rounded-lg bg-white/3 border border-white/5"
              >
                <div className={`text-lg font-black font-mono ${stat.color}`}>{stat.value}</div>
                <div className="text-[9px] text-slate-500 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </MobileDetailModal>
    </div>
  );
}
