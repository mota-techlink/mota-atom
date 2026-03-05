"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useContent } from "./useContent";

/* ─── Word Cloud (AI-silhouette-ish scattered layout) ─── */
function WordCloud({
  roles,
}: {
  roles: { role: string; size: number }[];
}) {
  /* Pre-compute scattered positions within a rough ellipse */
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
    <div className="relative w-full h-44 sm:h-52">
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
      {/* "AI" label in center */}
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

/* ─── Tech Stack Layer (click-to-expand) ─── */
function TechLayer({
  layer,
  index,
  expanded,
  onToggle,
}: {
  layer: { name: string; color: string; techs: string[]; detail: string };
  index: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div
      className="rounded-xl border cursor-pointer overflow-hidden"
      style={{ borderColor: `${layer.color}40`, backgroundColor: `${layer.color}10` }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
      whileHover={{ borderColor: layer.color }}
      onClick={onToggle}
      layout
    >
      <div className="flex items-center gap-3 px-4 py-2.5">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: layer.color }} />
        <span className="text-sm sm:text-base font-semibold text-amber-100/90">{layer.name}</span>
        <div className="flex-1 flex flex-wrap gap-1.5 justify-end">
          {layer.techs.map((t) => (
            <span key={t} className="px-2 py-0.5 rounded-full text-[10px] sm:text-xs text-amber-300/60 border" style={{ borderColor: `${layer.color}30` }}>{t}</span>
          ))}
        </div>
        <motion.span
          className="text-amber-400/50 text-sm"
          animate={{ rotate: expanded ? 180 : 0 }}
        >
          ▾
        </motion.span>
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div
            className="px-4 pb-3"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-base text-amber-200/70 leading-relaxed">{layer.detail}</p>
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
        className="relative bg-gradient-to-br from-[#2C1810] to-[#1a0f08] border border-amber-700/40 rounded-2xl p-8 max-w-lg w-full shadow-2xl"
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-amber-400/60 hover:text-amber-300 text-2xl">✕</button>
        <h3 className="text-2xl font-bold text-amber-100 mb-2">{esb.title}</h3>
        <p className="text-lg text-amber-300/70 mb-4">{esb.subtitle}</p>
        <p className="text-lg text-amber-200/80 leading-relaxed mb-5">{esb.desc}</p>

        {/* Protocol bridges */}
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

        {/* Capabilities */}
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
   SLIDE 8 — Phase 2: Word Cloud + Tech Stack + ESB
   ═══════════════════════════════════════════════════════════ */
export function Phase2Slide() {
  const c = useContent().slide8;
  const [expandedLayer, setExpandedLayer] = useState<number | null>(null);
  const [showESB, setShowESB] = useState(false);

  return (
    <div className="relative w-full h-full flex flex-col items-center overflow-hidden bg-gradient-to-br from-[#1a0f08] via-[#2C1810] to-[#1a0f08] px-3 py-4">
      {/* Glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 50% 40% at 50% 50%, rgba(196,168,130,0.04) 0%, transparent 70%)" }} />

      {/* Badge */}
      <motion.div
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-900/30 border border-amber-700/40 text-amber-300/80 text-xs font-mono tracking-widest uppercase mb-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
        {c.badge}
      </motion.div>

      {/* Title */}
      <motion.h2
        className="text-2xl sm:text-3xl font-black text-center mb-1"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <span className="text-amber-100/90">{c.title.replace(c.titleHighlight, "")}</span>
        <span className="bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 bg-clip-text text-transparent">{c.titleHighlight}</span>
      </motion.h2>
      <motion.p className="text-xs text-amber-100/50 mb-3 text-center max-w-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
        {c.subtitle}
      </motion.p>

      {/* Speed badge */}
      <motion.div
        className="flex items-center gap-3 mb-4"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
      >
        <span className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent">{c.highlight}</span>
        <span className="text-sm text-amber-400/60">{c.highlightLabel}</span>
      </motion.div>

      {/* ─── Two-Column Layout ─── */}
      <div className="relative z-10 flex flex-col lg:flex-row gap-4 w-full max-w-5xl flex-1 min-h-0 overflow-auto">

        {/* LEFT — Word Cloud + Tech Stack */}
        <div className="flex-1 flex flex-col gap-3">
          {/* Word cloud */}
          <div className="rounded-xl bg-amber-950/20 border border-amber-700/20 p-3">
            <h4 className="text-sm font-semibold text-amber-200/80 mb-1">{c.wordCloud.title}</h4>
            <WordCloud roles={c.wordCloud.roles} />
          </div>

          {/* Tech stack */}
          <div className="rounded-xl bg-amber-950/20 border border-amber-700/20 p-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-amber-200/80">{c.techStack.title}</h4>
              <span className="text-[10px] text-amber-400/40">{c.techStack.clickHint}</span>
            </div>
            <div className="space-y-2">
              {c.techStack.layers.map((layer, i) => (
                <TechLayer
                  key={layer.name}
                  layer={layer}
                  index={i}
                  expanded={expandedLayer === i}
                  onToggle={() => setExpandedLayer(expandedLayer === i ? null : i)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — ESB + Supply chain flow */}
        <div className="flex-1 flex flex-col gap-3">
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

            {/* Protocol bridges preview */}
            <div className="space-y-2 mb-3">
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

          {/* Supply chain flow */}
          <motion.div
            className="rounded-xl bg-amber-950/20 border border-amber-700/20 p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              {c.flow.map((step, i) => (
                <React.Fragment key={i}>
                  <motion.div
                    className="px-3 py-2 rounded-lg bg-amber-800/20 border border-amber-700/20 text-sm text-amber-200/70"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1 + i * 0.12 }}
                  >
                    {step}
                  </motion.div>
                  {i < c.flow.length - 1 && (
                    <motion.span
                      className="text-amber-500/30"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.1 + i * 0.12 }}
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

      {/* ESB Popup */}
      <AnimatePresence>
        {showESB && <ESBPopup esb={c.esb} onClose={() => setShowESB(false)} />}
      </AnimatePresence>
    </div>
  );
}
