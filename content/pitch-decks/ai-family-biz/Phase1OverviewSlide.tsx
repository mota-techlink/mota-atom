"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useContent } from "./useContent";

/* ─── Feature detail popup (50%+ larger fonts) ─── */
function FeaturePopup({
  feature,
  onClose,
}: {
  feature: { icon: string; title: string; description: string; details: string[] };
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
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-amber-400/60 hover:text-amber-300 text-2xl"
        >
          ✕
        </button>
        <div className="text-4xl mb-4">{feature.icon}</div>
        <h3 className="text-2xl font-bold text-amber-100 mb-3">{feature.title}</h3>
        <p className="text-lg text-amber-200/80 mb-5 leading-relaxed">{feature.description}</p>
        <ul className="space-y-3">
          {feature.details.map((d, i) => (
            <motion.li
              key={i}
              className="flex items-start gap-3 text-base text-amber-100/70"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
            >
              <span className="text-amber-500 mt-1 text-lg">●</span>
              <span>{d}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );
}

/* ─── Feature Card for 2×2 grid ─── */
function FeatureCard({
  feature,
  index,
  onClick,
}: {
  feature: { icon: string; title: string; description: string; details: string[] };
  index: number;
  onClick: () => void;
}) {
  return (
    <motion.div
      className="relative cursor-pointer rounded-2xl bg-amber-950/25 border border-amber-700/30 backdrop-blur-sm p-5 sm:p-6 flex flex-col items-center text-center shadow-lg hover:shadow-xl transition-shadow"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3 + index * 0.15, duration: 0.6, ease: "easeOut" }}
      whileHover={{ scale: 1.04, borderColor: "rgba(217,170,110,0.6)" }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
    >
      <span className="text-3xl sm:text-4xl mb-3">{feature.icon}</span>
      <h3 className="text-lg sm:text-xl font-bold text-amber-100 mb-2">{feature.title}</h3>
      <p className="text-sm sm:text-base text-amber-200/60 leading-relaxed line-clamp-2">{feature.description}</p>

      {/* Click visual indicator */}
      <motion.div
        className="absolute top-3 right-3 w-6 h-6 rounded-full bg-amber-600/20 border border-amber-500/40 flex items-center justify-center"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-[10px] text-amber-400">↗</span>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SLIDE 3 — Phase 1 Overview: 2×2 Grid
   ═══════════════════════════════════════════════════════════ */
export function Phase1OverviewSlide() {
  const c = useContent().slide3;
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#1a0f08] via-[#2C1810] to-[#1a0f08] px-4">
      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 50% 40% at 50% 50%, rgba(196,168,130,0.05) 0%, transparent 70%)" }} />

      {/* Badge */}
      <motion.div
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-900/30 border border-amber-700/40 text-amber-300/80 text-xs font-mono tracking-widest uppercase mb-3"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
        {c.badge}
      </motion.div>

      {/* Title */}
      <motion.h2
        className="text-3xl sm:text-4xl md:text-5xl font-black text-center mb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.6 }}
      >
        <span className="text-amber-100/90">{c.title.replace(c.titleHighlight, "")}</span>
        <span className="bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 bg-clip-text text-transparent">{c.titleHighlight}</span>
      </motion.h2>

      <motion.p
        className="text-sm sm:text-base text-amber-100/50 mb-3 text-center max-w-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
      >
        {c.subtitle}
      </motion.p>

      {/* Click hint */}
      <motion.p
        className="text-sm text-amber-400/50 mb-6 tracking-wide"
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        {c.clickHint}
      </motion.p>

      {/* ─── 2×2 Grid ─── */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-2xl w-full">
        {c.features.map((f, i) => (
          <FeatureCard
            key={i}
            feature={f}
            index={i}
            onClick={() => setSelected(i)}
          />
        ))}
      </div>

      {/* Objective footer */}
      <motion.div
        className="mt-6 max-w-2xl px-5 py-3 rounded-xl bg-amber-900/15 border border-amber-800/25 backdrop-blur-sm"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <p className="text-sm text-amber-200/60 text-center leading-relaxed">{c.objective}</p>
      </motion.div>

      {/* Detail Popup */}
      <AnimatePresence>
        {selected !== null && (
          <FeaturePopup
            feature={c.features[selected]}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
