"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useContent } from "./useContent";

/* ─── Stage card ─── */
function StageCard({
  stage,
  index,
  total,
  onTap,
}: {
  stage: { level: number; title: string; subtitle: string; desc: string; specs: string[]; icon: string };
  index: number;
  total: number;
  onTap: () => void;
}) {
  /* Graduating scale: taller as we go right/down */
  const heightPx = 160 + index * 40;
  const barColors = ["from-amber-700/40 to-amber-900/20", "from-yellow-600/40 to-amber-800/20", "from-orange-500/40 to-amber-700/30"];

  return (
    <motion.div
      className="relative flex flex-col items-center cursor-pointer group"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.2, duration: 0.7 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onTap}
    >
      {/* Growing bar behind card */}
      <motion.div
        className={`absolute bottom-0 w-full rounded-t-xl bg-gradient-to-t ${barColors[index]} opacity-30`}
        initial={{ height: 0 }}
        animate={{ height: heightPx }}
        transition={{ delay: 0.5 + index * 0.2, duration: 0.8, ease: "easeOut" }}
      />

      {/* Card content */}
      <div className="relative z-10 flex flex-col items-center text-center p-4 sm:p-5 rounded-2xl bg-amber-950/30 border border-amber-700/25 backdrop-blur-sm w-full max-w-[220px]">
        <span className="text-3xl sm:text-4xl mb-2">{stage.icon}</span>
        <div className="text-xs font-mono text-amber-400/50 uppercase tracking-widest mb-1">Level {stage.level}</div>
        <h4 className="text-lg sm:text-xl font-bold text-amber-100 mb-1">{stage.title}</h4>
        <p className="text-sm text-amber-300/60 font-medium mb-2">{stage.subtitle}</p>
        <div className="flex flex-wrap justify-center gap-1">
          {stage.specs.map((s, si) => (
            <span key={si} className="px-2 py-0.5 rounded-full bg-amber-800/20 border border-amber-700/20 text-[10px] text-amber-300/60">{s}</span>
          ))}
        </div>
        {/* Growth arrow between stages */}
        {index < total - 1 && (
          <motion.div
            className="absolute -right-6 top-1/2 text-amber-500/40 text-lg hidden sm:block"
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            →
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Stage detail popup (large fonts) ─── */
function StagePopup({
  stage,
  onClose,
}: {
  stage: { level: number; title: string; subtitle: string; desc: string; specs: string[]; icon: string };
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
        className="relative bg-gradient-to-br from-[#2C1810] to-[#1a0f08] border border-amber-700/40 rounded-2xl p-8 max-w-md w-full shadow-2xl"
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-amber-400/60 hover:text-amber-300 text-2xl">✕</button>
        <div className="text-4xl mb-3">{stage.icon}</div>
        <div className="text-sm font-mono text-amber-400/50 uppercase tracking-widest mb-1">Level {stage.level}</div>
        <h3 className="text-2xl font-bold text-amber-100 mb-1">{stage.title}</h3>
        <p className="text-lg text-amber-300/70 mb-4">{stage.subtitle}</p>
        <p className="text-lg text-amber-200/80 leading-relaxed mb-5">{stage.desc}</p>
        <div className="flex flex-wrap gap-2">
          {stage.specs.map((s, i) => (
            <span key={i} className="px-3 py-1 rounded-full bg-amber-800/25 border border-amber-700/30 text-base text-amber-200/70">{s}</span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SLIDE 7 — Growth Architecture (3 Stages)
   ═══════════════════════════════════════════════════════════ */
export function InfraSlide() {
  const c = useContent().slide7;
  type Stage = (typeof c.stages)[number];
  const [selected, setSelected] = useState<Stage | null>(null);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#1a0f08] via-[#2C1810] to-[#1a0f08] px-4 py-4">
      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 50% 40% at 50% 60%, rgba(196,168,130,0.05) 0%, transparent 70%)" }} />

      {/* Badge */}
      <motion.div
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-900/30 border border-amber-700/40 text-amber-300/80 text-xs font-mono tracking-widest uppercase mb-3"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
        {c.badge}
      </motion.div>

      {/* Title */}
      <motion.h2
        className="text-2xl sm:text-3xl md:text-4xl font-black text-center mb-1"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <span className="text-amber-100/90">{c.title.replace(c.titleHighlight, "")}</span>
        <span className="bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 bg-clip-text text-transparent">{c.titleHighlight}</span>
      </motion.h2>
      <motion.p className="text-sm text-amber-100/50 mb-6 text-center max-w-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
        {c.subtitle}
      </motion.p>

      {/* ─── Growth Stages ─── */}
      <div className="relative z-10 flex flex-col sm:flex-row items-end justify-center gap-6 sm:gap-8 mb-6">
        {c.stages.map((stage, i) => (
          <StageCard key={stage.level} stage={stage} index={i} total={c.stages.length} onTap={() => setSelected(stage)} />
        ))}
      </div>

      {/* Upgrade note */}
      <motion.p
        className="text-xs text-amber-300/40 text-center max-w-lg mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        {c.upgradeNote}
      </motion.p>

      {/* ─── Data Sovereignty Shield ─── */}
      <motion.div
        className="relative z-10 w-full max-w-2xl rounded-2xl bg-gradient-to-r from-green-900/15 via-amber-900/10 to-green-900/15 border border-green-700/25 p-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <div className="flex items-center gap-3 mb-3">
          <h4 className="text-base sm:text-lg font-bold text-green-300/80">{c.dataShield.title}</h4>
          <span className="px-2 py-0.5 rounded-full bg-green-900/30 border border-green-700/30 text-xs text-green-400/70">{c.dataShield.badge}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {c.dataShield.points.map((p, i) => (
            <motion.div
              key={i}
              className="flex items-start gap-2 text-sm text-green-200/60"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 + i * 0.1 }}
            >
              <span className="text-green-400/60 mt-0.5">✓</span>
              <span>{p}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Stage popup */}
      <AnimatePresence>
        {selected && <StagePopup stage={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  );
}
