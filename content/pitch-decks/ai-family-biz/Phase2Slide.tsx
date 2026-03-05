"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useContent } from "./useContent";

/* ─── Floating Coffee Bean Particles ─── */
const BEANS = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 12 + Math.random() * 16,
  delay: Math.random() * 6,
  duration: 8 + Math.random() * 8,
  rotation: Math.random() * 360,
}));

function CoffeeBeanParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {BEANS.map((b) => (
        <motion.div
          key={b.id}
          className="absolute select-none"
          style={{ left: `${b.x}%`, top: `${b.y}%`, fontSize: b.size }}
          initial={{ opacity: 0, rotate: b.rotation }}
          animate={{
            opacity: [0, 0.18, 0.12, 0.18, 0],
            y: [0, -30, -15, -30, 0],
            rotate: [b.rotation, b.rotation + 60],
          }}
          transition={{
            duration: b.duration,
            delay: b.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          ☕
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Strategy Banner (business first → system follows → grow together) ─── */
function StrategyBanner({
  strategy,
}: {
  strategy: {
    title: string;
    steps: { icon: string; label: string; desc: string }[];
    tagline: string;
  };
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <motion.div
      className="w-full rounded-xl bg-gradient-to-r from-amber-950/40 via-amber-900/25 to-amber-950/40 border border-amber-600/30 p-3 sm:p-4"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
    >
      <h4 className="text-sm sm:text-base font-bold text-amber-100 text-center mb-3">{strategy.title}</h4>
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3">
        {strategy.steps.map((s, i) => (
          <motion.div
            key={i}
            className="relative rounded-xl border p-3 cursor-default transition-colors bg-amber-900/15 border-amber-700/25 hover:border-amber-500/50 hover:bg-amber-800/25"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 + i * 0.12 }}
            whileHover={{ scale: 1.02 }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">{s.icon}</span>
              <span className="text-sm sm:text-base font-bold text-amber-100">{s.label}</span>
            </div>
            {/* Step number pill */}
            <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-amber-600/30 text-[10px] text-amber-200 flex items-center justify-center font-bold">{i + 1}</span>
            {/* Hover tooltip */}
            <AnimatePresence>
              {hovered === i && (
                <motion.div
                  className="absolute z-30 left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 px-3 py-2.5 rounded-xl border shadow-xl"
                  style={{
                    borderColor: "rgba(217,170,80,0.35)",
                    backgroundColor: "#1a0f08",
                    boxShadow: "0 4px 24px rgba(196,140,40,0.15)",
                  }}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.18 }}
                >
                  <p className="text-xs text-amber-200/85 leading-relaxed">{s.desc}</p>
                  <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent" style={{ borderTopColor: "rgba(217,170,80,0.35)" }} />
                </motion.div>
              )}
            </AnimatePresence>
            {/* Arrow connector */}
            {i < strategy.steps.length - 1 && (
              <motion.span
                className="hidden sm:block absolute -right-3 top-1/2 -translate-y-1/2 text-amber-500/50 text-lg z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 + i * 0.12 }}
              >
                →
              </motion.span>
            )}
          </motion.div>
        ))}
      </div>
      <motion.p
        className="text-center text-xs sm:text-sm text-amber-300/60 italic"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        {strategy.tagline}
      </motion.p>
    </motion.div>
  );
}

/* ─── Word Cloud (AI-silhouette-ish scattered layout) ─── */
function WordCloud({
  roles,
}: {
  roles: { role: string; size: number }[];
}) {
  const items = useMemo(() => {
    const positions = [
      { x: 15, y: 18 }, { x: 55, y: 8 }, { x: 30, y: 45 },
      { x: 70, y: 35 }, { x: 10, y: 70 }, { x: 50, y: 60 },
      { x: 80, y: 15 }, { x: 40, y: 80 }, { x: 65, y: 70 },
      { x: 20, y: 40 },
    ];
    return roles.map((r, i) => ({
      ...r,
      x: positions[i % positions.length].x,
      y: positions[i % positions.length].y,
    }));
  }, [roles]);

  const sizeMap: Record<number, string> = {
    2: "text-xs sm:text-sm",
    3: "text-sm sm:text-base",
    4: "text-base sm:text-lg font-bold",
  };

  return (
    <div className="relative w-full h-24 sm:h-28">
      {items.map((item, i) => (
        <motion.div
          key={i}
          className={`absolute ${sizeMap[item.size] || "text-sm"} text-amber-300/50 whitespace-nowrap`}
          style={{ left: `${item.x}%`, top: `${item.y}%`, transform: "translate(-50%, -50%)" }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 0.7, scale: 1 }}
          transition={{ delay: 0.3 + i * 0.08, duration: 0.5 }}
        >
          <span className="line-through decoration-amber-500/40 decoration-2">{item.role}</span>
        </motion.div>
      ))}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl sm:text-4xl font-black text-amber-400/80"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, type: "spring", damping: 12 }}
      >
        🤖 AI
      </motion.div>
    </div>
  );
}

/* ─── Tech Stack Cell (hover tooltip for details) ─── */
function TechCell({
  layer,
  index,
  wide,
}: {
  layer: { name: string; color: string; techs: string[]; detail: string };
  index: number;
  wide?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      className={`relative rounded-xl border cursor-default overflow-visible ${wide ? "col-span-2" : ""}`}
      style={{ borderColor: `${layer.color}40`, backgroundColor: `${layer.color}10` }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
      whileHover={{ borderColor: layer.color }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={`flex flex-col gap-1 px-3 py-2 ${wide ? "items-center" : ""}`}>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: layer.color }} />
          <span className="text-sm font-semibold text-amber-100/90">{layer.name}</span>
        </div>
        <div className={`flex flex-wrap gap-1 ${wide ? "justify-center" : ""}`}>
          {layer.techs.map((t) => (
            <span key={t} className="px-1.5 py-0.5 rounded-full text-[10px] text-amber-300/60 border" style={{ borderColor: `${layer.color}30` }}>{t}</span>
          ))}
        </div>
      </div>
      {/* Hover tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            className="absolute z-30 left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 px-3 py-2.5 rounded-xl border shadow-xl"
            style={{ borderColor: `${layer.color}40`, backgroundColor: "#1a0f08", boxShadow: `0 4px 24px ${layer.color}20` }}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.18 }}
          >
            <p className="text-xs text-amber-200/80 leading-relaxed">{layer.detail}</p>
            <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent" style={{ borderTopColor: `${layer.color}40` }} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── ESB Popup (large fonts) ─── */
function ESBPopup({
  esb,
  onClose,
}: {
  esb: typeof import("./locale/en.json")["slide8"]["esb"];
  onClose: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="relative bg-gradient-to-br from-[#2C1810] to-[#1a0f08] border border-amber-700/40 rounded-2xl p-8 max-w-lg w-full shadow-2xl max-h-[85vh] overflow-y-auto"
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-amber-400/60 hover:text-amber-300 text-2xl">✕</button>
        <h3 className="text-2xl font-bold text-amber-100 mb-2">{esb.title}</h3>
        <p className="text-lg text-amber-300/70 mb-4">{esb.subtitle}</p>
        <p className="text-lg text-amber-200/80 leading-relaxed mb-5">{esb.desc}</p>

        <h4 className="text-lg font-semibold text-amber-200 mb-3">Protocol Bridges</h4>
        <div className="space-y-2 mb-5">
          {esb.protocols.map((p, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-amber-900/20 border border-amber-700/20"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.1 }}
            >
              <span className="text-lg">{p.icon}</span>
              <span className="text-base text-green-300/70 font-medium">{p.modern}</span>
              <span className="text-amber-500/40">↔</span>
              <span className="text-base text-red-300/60">{p.legacy}</span>
            </motion.div>
          ))}
        </div>

        <h4 className="text-lg font-semibold text-amber-200 mb-2">Capabilities</h4>
        <ul className="space-y-2">
          {esb.capabilities.map((cap, i) => (
            <motion.li
              key={i}
              className="flex items-start gap-2 text-base text-amber-100/70"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.08 }}
            >
              <span className="text-amber-500 mt-1">●</span>
              <span>{cap}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SLIDE 8 — Phase 2: Coffee Bean Supply Chain + Strategy
   ═══════════════════════════════════════════════════════════ */
export function Phase2Slide() {
  const c = useContent().slide8;
  const [showESB, setShowESB] = useState(false);

  return (
    <div className="relative w-full h-full flex flex-col items-center overflow-y-auto overflow-x-hidden bg-gradient-to-br from-[#1a0f08] via-[#2C1810] to-[#1a0f08]">
      {/* Coffee bean floating particles */}
      <CoffeeBeanParticles />

      {/* Glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 50% 40% at 50% 50%, rgba(196,168,130,0.05) 0%, transparent 70%)" }} />

      {/* ── All slide content — my-auto centers vertically when there is room ── */}
      <div className="relative z-10 my-auto w-full max-w-5xl flex flex-col items-center px-3 py-3 gap-2">

      {/* Badge */}
      <motion.div
        className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-900/30 border border-amber-700/40 text-amber-200 text-xs font-mono tracking-widest uppercase"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
        {c.badge}
      </motion.div>

      {/* Title */}
      <motion.h2
        className="text-xl sm:text-2xl font-black text-center"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <span className="text-amber-50">{c.title.replace(c.titleHighlight, "")}</span>
        <span className="bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 bg-clip-text text-transparent">{c.titleHighlight}</span>
      </motion.h2>
      <motion.p className="text-xs text-amber-200/70 text-center max-w-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
        {c.subtitle}
      </motion.p>

      {/* Speed badge */}
      <motion.div
        className="flex items-center gap-3"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
      >
        <span className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent">{c.highlight}</span>
        <span className="text-sm text-amber-300/70">{c.highlightLabel}</span>
      </motion.div>

      {/* ─── Strategy Banner ─── */}
      <div className="w-full">
        <StrategyBanner strategy={c.strategy} />
      </div>

      {/* ─── Two-Column Layout ─── */}
      <div className="flex flex-col lg:flex-row gap-3 w-full">

        {/* LEFT — Word Cloud + Tech Stack */}
        <div className="flex-1 flex flex-col gap-2">
          {/* Word cloud */}
          <div className="rounded-xl bg-amber-950/20 border border-amber-700/20 p-3">
            <h4 className="text-sm font-semibold text-amber-100 mb-1">{c.wordCloud.title}</h4>
            <WordCloud roles={c.wordCloud.roles} />
          </div>

          {/* Tech stack — 田字 grid (2×2) + full-width AI bottom */}
          <div className="rounded-xl bg-amber-950/20 border border-amber-700/20 p-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-amber-100">{c.techStack.title}</h4>
              <span className="text-[10px] text-amber-400/50">Hover for details</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {/* First 4 layers: 2×2 grid */}
              {c.techStack.layers.slice(0, 4).map((layer, i) => (
                <TechCell key={layer.name} layer={layer} index={i} />
              ))}
              {/* 5th layer (AI): span full width like a merged cell */}
              {c.techStack.layers[4] && (
                <TechCell layer={c.techStack.layers[4]} index={4} wide />
              )}
            </div>
          </div>
        </div>

        {/* RIGHT — ESB + Supply chain flow */}
        <div className="flex-1 flex flex-col gap-2">
          {/* ESB card */}
          <motion.div
            className="rounded-xl bg-gradient-to-b from-blue-950/20 to-amber-950/20 border border-blue-700/25 p-4 cursor-pointer hover:border-blue-500/40 transition-colors"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.01 }}
            onClick={() => setShowESB(true)}
          >
            <h4 className="text-base sm:text-lg font-bold text-blue-200/80 mb-1">{c.esb.title}</h4>
            <p className="text-sm text-blue-300/50 mb-3">{c.esb.subtitle}</p>

            <div className="space-y-1.5 mb-3">
              {c.esb.protocols.map((p, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-900/15 border border-blue-800/20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                >
                  <span>{p.icon}</span>
                  <span className="text-xs text-green-300/60">{p.modern}</span>
                  <span className="text-amber-500/30 text-xs">↔</span>
                  <span className="text-xs text-red-300/50">{p.legacy}</span>
                </motion.div>
              ))}
            </div>

            <motion.p
              className="text-xs text-blue-400/40 text-center"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              {c.esb.clickHint}
            </motion.p>
          </motion.div>

          {/* Supply chain flow — coffee bean journey */}
          <motion.div
            className="rounded-xl bg-gradient-to-r from-amber-950/25 via-yellow-950/15 to-amber-950/25 border border-amber-600/25 p-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <h4 className="text-xs font-semibold text-amber-200/60 text-center mb-2">☕ Bean Journey — Colombia → Japan → Customer</h4>
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
              {c.flow.map((step: string, i: number) => (
                <React.Fragment key={i}>
                  <motion.div
                    className="px-2.5 py-1.5 rounded-lg bg-amber-800/25 border border-amber-600/25 text-xs sm:text-sm text-amber-100/80 font-medium"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1 + i * 0.1 }}
                  >
                    {step}
                  </motion.div>
                  {i < c.flow.length - 1 && (
                    <motion.span
                      className="text-amber-500/40 text-sm"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.05 + i * 0.1 }}
                    >
                      →
                    </motion.span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      </div>{/* end my-auto wrapper */}

      {/* ESB Popup */}
      <AnimatePresence>
        {showESB && <ESBPopup esb={c.esb} onClose={() => setShowESB(false)} />}
      </AnimatePresence>
    </div>
  );
}
