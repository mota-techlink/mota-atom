"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useContent } from "./useContent";

/* ─── Coffee Steam Particles ─── */
function CoffeeSteam() {
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left: 20 + Math.random() * 60,
    delay: Math.random() * 4,
    duration: 3 + Math.random() * 3,
    size: 2 + Math.random() * 4,
    opacity: 0.15 + Math.random() * 0.2,
  }));
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            bottom: "0%",
            width: p.size,
            height: p.size,
            background: `radial-gradient(circle, rgba(196,168,130,${p.opacity}) 0%, transparent 70%)`,
          }}
          animate={{
            y: [0, -400 - Math.random() * 300],
            x: [0, (Math.random() - 0.5) * 80],
            opacity: [0, p.opacity, p.opacity * 0.6, 0],
            scale: [0.5, 1.5, 2.5],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

/* ─── Animated Coffee Bean SVG ─── */
function CoffeeBeanBg() {
  const beans = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    x: 5 + Math.random() * 90,
    y: 5 + Math.random() * 90,
    rotation: Math.random() * 360,
    scale: 0.3 + Math.random() * 0.5,
    delay: i * 0.6,
  }));
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.06]">
      {beans.map((b) => (
        <motion.svg
          key={b.id}
          className="absolute"
          style={{ left: `${b.x}%`, top: `${b.y}%` }}
          width="60"
          height="80"
          viewBox="0 0 60 80"
          initial={{ opacity: 0, rotate: b.rotation, scale: b.scale }}
          animate={{ opacity: 1, rotate: b.rotation + 15 }}
          transition={{ duration: 8, delay: b.delay, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        >
          <ellipse cx="30" cy="40" rx="24" ry="36" fill="#C4A882" />
          <path d="M30 8 C26 25, 26 55, 30 72" stroke="#2C1810" strokeWidth="2.5" fill="none" />
        </motion.svg>
      ))}
    </div>
  );
}

/* ─── Shimmer Title ─── */
function ShimmerTitle({ text, highlight }: { text: string; highlight: string }) {
  const parts = text.split(highlight);
  return (
    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight leading-[1.1] relative">
      {parts[0]}
      <span className="relative inline-block">
        <span className="bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 bg-clip-text text-transparent">
          {highlight}
        </span>
        <motion.span
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent bg-clip-text text-transparent"
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
          style={{ WebkitBackgroundClip: "text" }}
        >
          {highlight}
        </motion.span>
      </span>
      {parts[1]}
    </h1>
  );
}

/* ─── Stat Pill ─── */
function StatPill({ value, label, delay }: { value: string; label: string; delay: number }) {
  return (
    <motion.div
      className="flex flex-col items-center px-4 sm:px-6 py-3 sm:py-4 rounded-2xl bg-amber-900/20 border border-amber-700/30 backdrop-blur-sm"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay / 1000, duration: 0.6, ease: "easeOut" }}
      whileHover={{ scale: 1.05, borderColor: "rgba(217,170,110,0.6)" }}
    >
      <span className="text-2xl sm:text-3xl md:text-4xl font-black text-amber-100">{value}</span>
      <span className="text-[10px] sm:text-xs text-amber-300/70 font-medium mt-1 tracking-wider uppercase">{label}</span>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SLIDE 1 — Title / Vision
   ═══════════════════════════════════════════════════════════ */
export function TitleVisionSlide() {
  const c = useContent().slide1;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#1a0f08] via-[#2C1810] to-[#1a0f08]">
      {/* Background layers */}
      <CoffeeBeanBg />
      <CoffeeSteam />
      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(196,168,130,0.08) 0%, transparent 70%)" }} />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl">
        {/* Badge */}
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-900/30 border border-amber-700/40 text-amber-300/80 text-xs font-mono tracking-widest uppercase mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          {c.badge}
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <ShimmerTitle text={c.title} highlight={c.titleHighlight} />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          className="mt-4 text-lg sm:text-xl md:text-2xl text-amber-100/70 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          {c.subtitle}
        </motion.p>

        {/* Proposed by */}
        <motion.p
          className="mt-2 text-sm text-amber-300/50 font-mono"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.6 }}
        >
          {c.proposedBy}
        </motion.p>

        {/* Vision statement */}
        <motion.div
          className="mt-8 max-w-3xl px-6 py-4 rounded-xl bg-amber-900/15 border border-amber-800/30 backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.7 }}
        >
          <p className="text-sm sm:text-base text-amber-100/80 leading-relaxed">
            {c.vision.split(c.visionHighlight).map((part, i, arr) => (
              <React.Fragment key={i}>
                {part}
                {i < arr.length - 1 && (
                  <span className="font-bold text-amber-200">{c.visionHighlight}</span>
                )}
              </React.Fragment>
            ))}
          </p>
        </motion.div>

        {/* Tagline */}
        <motion.p
          className="mt-4 text-xs sm:text-sm text-amber-400/60 italic font-light tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
        >
          {c.tagline}
        </motion.p>

        {/* Stats row */}
        <motion.div
          className="mt-8 flex items-center gap-4 sm:gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
        >
          {c.stats.map((s, i) => (
            <StatPill key={i} value={s.value} label={s.label} delay={1700 + i * 200} />
          ))}
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#1a0f08] to-transparent pointer-events-none" />
    </div>
  );
}
