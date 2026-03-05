"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useContent } from "./useContent";

/* ─── Popup with 50%+ enlarged fonts ─── */
function InfoPopup({
  title,
  detail,
  onClose,
}: {
  title: string;
  detail: string;
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
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-amber-400/60 hover:text-amber-300 text-2xl"
        >
          ✕
        </button>
        <h3 className="text-2xl font-bold text-amber-100 mb-4">{title}</h3>
        <p className="text-lg text-amber-200/80 leading-relaxed">{detail}</p>
      </motion.div>
    </motion.div>
  );
}

/* ─── Input source node ─── */
function InputNode({
  source,
  index,
  onTap,
}: {
  source: { icon: string; label: string; detail: string };
  index: number;
  onTap: () => void;
}) {
  return (
    <motion.div
      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-950/30 border border-amber-700/25 cursor-pointer hover:border-amber-500/50 transition-colors"
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onTap}
    >
      <span className="text-2xl">{source.icon}</span>
      <span className="text-sm sm:text-base font-medium text-amber-100/80">{source.label}</span>
    </motion.div>
  );
}

/* ─── AI hub item ─── */
function AiItem({
  item,
  index,
  onTap,
}: {
  item: { icon: string; label: string; detail: string };
  index: number;
  onTap: () => void;
}) {
  return (
    <motion.div
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-800/20 border border-amber-600/25 cursor-pointer hover:border-amber-400/50 transition-colors"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      onClick={onTap}
    >
      <span className="text-lg">{item.icon}</span>
      <span className="text-sm font-medium text-amber-100/80">{item.label}</span>
    </motion.div>
  );
}

/* ─── Animated flow arrow ─── */
function FlowArrow({ delay, direction = "right" }: { delay: number; direction?: "right" | "down" }) {
  const isDown = direction === "down";
  return (
    <motion.div
      className={`flex ${isDown ? "flex-col" : "flex-row"} items-center justify-center ${isDown ? "h-8" : "w-12 sm:w-16"}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
    >
      <motion.div
        className={`${isDown ? "w-0.5 h-full" : "h-0.5 w-full"} bg-gradient-to-${isDown ? "b" : "r"} from-amber-600/30 via-amber-500/50 to-amber-400/30`}
      />
      <motion.div
        className="text-amber-400/60 text-lg"
        animate={{ [isDown ? "y" : "x"]: [0, 5, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        {isDown ? "▼" : "▶"}
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SLIDE 4 — Business Data Flow Topology
   ═══════════════════════════════════════════════════════════ */
export function TopologySlide() {
  const c = useContent().slide4;
  const [popup, setPopup] = useState<{ title: string; detail: string } | null>(null);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#1a0f08] via-[#2C1810] to-[#1a0f08] px-4 py-6">
      {/* Glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(196,168,130,0.05) 0%, transparent 70%)" }} />

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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <span className="text-amber-100/90">{c.title.replace(c.titleHighlight, "")}</span>
        <span className="bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 bg-clip-text text-transparent">{c.titleHighlight}</span>
      </motion.h2>
      <motion.p className="text-sm text-amber-100/50 mb-5 text-center max-w-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
        {c.subtitle}
      </motion.p>

      {/* ─── Three-Column Topology ─── */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center gap-4 lg:gap-0 w-full max-w-5xl">

        {/* LEFT — Input Sources */}
        <div className="flex-1 flex flex-col gap-2 sm:gap-3">
          <motion.div
            className="text-center text-xs font-mono text-amber-400/60 uppercase tracking-widest mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {c.flowLabels[0]}
          </motion.div>
          {c.inputSources.map((s, i) => (
            <InputNode key={i} source={s} index={i} onTap={() => setPopup({ title: s.label, detail: s.detail })} />
          ))}
        </div>

        {/* Arrow: Left → Center */}
        <div className="hidden lg:flex">
          <FlowArrow delay={0.7} />
        </div>
        <div className="lg:hidden">
          <FlowArrow delay={0.7} direction="down" />
        </div>

        {/* CENTER — AI Hub */}
        <div className="flex-1 flex flex-col items-center">
          <motion.div
            className="text-center text-xs font-mono text-amber-400/60 uppercase tracking-widest mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {c.flowLabels[1]}
          </motion.div>
          <motion.div
            className="w-full max-w-xs rounded-2xl bg-gradient-to-b from-amber-900/30 to-amber-950/40 border border-amber-600/30 p-5"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <h4 className="text-lg font-bold text-amber-100 text-center mb-1">{c.aiHub.title}</h4>
            <p className="text-xs text-amber-300/50 text-center mb-3">{c.aiHub.subtitle}</p>
            <div className="grid grid-cols-2 gap-2">
              {c.aiHub.items.map((item, i) => (
                <AiItem key={i} item={item} index={i} onTap={() => setPopup({ title: item.label, detail: item.detail })} />
              ))}
            </div>
            {/* Pulsing core ring */}
            <motion.div
              className="mx-auto mt-3 w-4 h-4 rounded-full border-2 border-amber-400/40"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.2, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        </div>

        {/* Arrow: Center → Right */}
        <div className="hidden lg:flex">
          <FlowArrow delay={1} />
        </div>
        <div className="lg:hidden">
          <FlowArrow delay={1} direction="down" />
        </div>

        {/* RIGHT — Cloud Storage */}
        <div className="flex-1 flex flex-col items-center">
          <motion.div
            className="text-center text-xs font-mono text-amber-400/60 uppercase tracking-widest mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            {c.flowLabels[2]}
          </motion.div>
          <motion.div
            className="w-full max-w-xs rounded-2xl bg-gradient-to-b from-amber-900/20 to-amber-950/30 border border-amber-600/25 p-5 cursor-pointer hover:border-amber-500/50 transition-colors"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => setPopup({ title: c.storage.title, detail: c.storage.detail })}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">{c.storage.icon}</span>
              <h4 className="text-lg font-bold text-amber-100">{c.storage.title}</h4>
            </div>
            <p className="text-sm text-amber-200/60 leading-relaxed line-clamp-3">{c.storage.detail}</p>
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-900/20 border border-green-700/30 text-xs text-green-400/80">
              {c.storage.badge}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Popup */}
      <AnimatePresence>
        {popup && (
          <InfoPopup title={popup.title} detail={popup.detail} onClose={() => setPopup(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
