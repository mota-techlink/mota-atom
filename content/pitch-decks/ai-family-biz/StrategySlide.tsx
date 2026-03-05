"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useContent } from "./useContent";

/* ─── Popup overlay with 50%+ larger fonts ─── */
function DetailPopup({
  principle,
  onClose,
}: {
  principle: { icon: string; title: string; description: string; details: string[] };
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
        <div className="text-4xl mb-4">{principle.icon}</div>
        <h3 className="text-2xl font-bold text-amber-100 mb-3">{principle.title}</h3>
        <p className="text-lg text-amber-200/80 mb-5 leading-relaxed">{principle.description}</p>
        <ul className="space-y-3">
          {principle.details.map((d, i) => (
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

/* ─── Triangle Card ─── */
function PrincipleCard({
  principle,
  index,
  onClick,
}: {
  principle: { icon: string; title: string; description: string; details: string[] };
  index: number;
  onClick: () => void;
}) {
  const borderColors = ["border-amber-500/40", "border-yellow-600/40", "border-orange-600/40"];
  const glowColors = ["shadow-amber-500/10", "shadow-yellow-600/10", "shadow-orange-600/10"];

  return (
    <motion.div
      className={`relative cursor-pointer rounded-2xl bg-amber-950/30 border ${borderColors[index]} backdrop-blur-sm p-6 sm:p-8 flex flex-col items-center text-center max-w-xs w-full shadow-lg ${glowColors[index]} hover:shadow-xl transition-shadow`}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.2, duration: 0.7, ease: "easeOut" }}
      whileHover={{ scale: 1.05, y: -5, borderColor: "rgba(217,170,110,0.7)" }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
    >
      {/* Glow background */}
      <div className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, rgba(196,168,130,0.06) 0%, transparent 70%)" }} />

      <span className="text-4xl sm:text-5xl mb-4">{principle.icon}</span>
      <h3 className="text-xl sm:text-2xl font-bold text-amber-100 mb-3">{principle.title}</h3>
      <p className="text-base text-amber-200/60 leading-relaxed line-clamp-3">{principle.description}</p>

      {/* Tap hint */}
      <motion.div
        className="mt-4 text-xs text-amber-400/40 tracking-wider uppercase"
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        tap for details
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SLIDE 2 — Strategy: Triangle Layout
   ═══════════════════════════════════════════════════════════ */
export function StrategySlide() {
  const c = useContent().slide2;
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#1a0f08] via-[#2C1810] to-[#1a0f08] px-4">
      {/* Subtle radial glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 50% 40% at 50% 55%, rgba(196,168,130,0.06) 0%, transparent 70%)" }} />

      {/* Badge */}
      <motion.div
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-900/30 border border-amber-700/40 text-amber-300/80 text-xs font-mono tracking-widest uppercase mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
        {c.badge}
      </motion.div>

      {/* Title */}
      <motion.h2
        className="text-3xl sm:text-4xl md:text-5xl font-black text-center mb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <span className="text-amber-100/90">{c.title.replace(c.titleHighlight, "")}</span>
        <span className="bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 bg-clip-text text-transparent">{c.titleHighlight}</span>
      </motion.h2>

      <motion.p
        className="text-base sm:text-lg text-amber-100/50 mb-8 text-center max-w-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {c.subtitle}
      </motion.p>

      {/* ─── Triangle Layout ─── */}
      <div className="relative z-10 flex flex-col items-center gap-6 sm:gap-8">
        {/* Top card — apex of the triangle */}
        <div className="flex justify-center">
          <PrincipleCard
            principle={c.principles[0]}
            index={0}
            onClick={() => setSelected(0)}
          />
        </div>

        {/* Bottom two cards — base of the triangle */}
        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
          <PrincipleCard
            principle={c.principles[1]}
            index={1}
            onClick={() => setSelected(1)}
          />
          <PrincipleCard
            principle={c.principles[2]}
            index={2}
            onClick={() => setSelected(2)}
          />
        </div>

        {/* SVG connecting lines (triangle edges) */}
        <svg
          className="absolute inset-0 pointer-events-none hidden sm:block"
          style={{ width: "100%", height: "100%", overflow: "visible" }}
        >
          <motion.line
            x1="50%" y1="25%" x2="25%" y2="75%"
            stroke="rgba(196,168,130,0.15)"
            strokeWidth="1"
            strokeDasharray="6 4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 1, duration: 1 }}
          />
          <motion.line
            x1="50%" y1="25%" x2="75%" y2="75%"
            stroke="rgba(196,168,130,0.15)"
            strokeWidth="1"
            strokeDasharray="6 4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
          />
          <motion.line
            x1="25%" y1="75%" x2="75%" y2="75%"
            stroke="rgba(196,168,130,0.15)"
            strokeWidth="1"
            strokeDasharray="6 4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 1.4, duration: 1 }}
          />
        </svg>
      </div>

      {/* Detail Popup */}
      <AnimatePresence>
        {selected !== null && (
          <DetailPopup
            principle={c.principles[selected]}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
