"use client";

import React from "react";
import { motion } from "framer-motion";
import { useContent } from "./useContent";

/* ═══════════════════════════════════════════════════════════
   SLIDE 9 — CTA / Next Steps
   ═══════════════════════════════════════════════════════════ */
export function CTASlide() {
  const c = useContent().slide9;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#1a0f08] via-[#2C1810] to-[#1a0f08] px-4">
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 50% 40% at 50% 50%, rgba(196,168,130,0.08) 0%, transparent 70%)" }}
      />

      {/* Decorative particles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-amber-300/10"
          style={{
            width: 3 + Math.random() * 4,
            height: 3 + Math.random() * 4,
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
          }}
          animate={{
            y: [0, -30 - Math.random() * 40, 0],
            opacity: [0, 0.3, 0],
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            delay: Math.random() * 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl">
        {/* Badge */}
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-900/30 border border-amber-700/40 text-amber-300/80 text-xs font-mono tracking-widest uppercase mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          {c.badge}
        </motion.div>

        {/* Title */}
        <motion.h2
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-3"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          <span className="text-amber-100/90">{c.title.replace(c.titleHighlight, "")}</span>
          <span className="bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 bg-clip-text text-transparent">{c.titleHighlight}</span>
        </motion.h2>

        <motion.p
          className="text-base sm:text-lg text-amber-100/50 mb-8 max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          {c.subtitle}
        </motion.p>

        {/* Advantages */}
        <motion.div
          className="flex flex-col sm:flex-row items-stretch gap-4 mb-8 w-full max-w-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {c.advantages.map((adv, i) => (
            <motion.div
              key={i}
              className="flex-1 rounded-xl bg-amber-950/25 border border-amber-700/25 p-4 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.15 }}
              whileHover={{ scale: 1.03, borderColor: "rgba(217,170,110,0.5)" }}
            >
              <div className="text-3xl mb-2">{adv.icon}</div>
              <h4 className="text-lg font-bold text-amber-100 mb-1">{adv.title}</h4>
              <p className="text-sm text-amber-200/60 leading-relaxed">{adv.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Next Steps */}
        <motion.div
          className="w-full max-w-2xl rounded-xl bg-amber-900/15 border border-amber-800/30 p-5 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <h4 className="text-lg font-bold text-amber-200/80 mb-4">{c.nextSteps.title}</h4>
          <div className="space-y-3">
            {c.nextSteps.steps.map((step, i) => (
              <motion.div
                key={i}
                className="flex items-start gap-3"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + i * 0.15 }}
              >
                <span className="shrink-0 w-7 h-7 rounded-full bg-amber-700/30 border border-amber-600/40 flex items-center justify-center text-sm font-bold text-amber-300">
                  {step.number}
                </span>
                <p className="text-base text-amber-100/70 leading-relaxed pt-0.5">{step.action}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.a
          href={`https://${c.cta.website}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-700 to-amber-600 text-white font-bold text-lg shadow-lg hover:shadow-amber-700/30 transition-all"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, type: "spring", damping: 15 }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.97 }}
        >
          {c.cta.label}
          <span className="text-amber-200/80 font-mono text-base">{c.cta.website}</span>
        </motion.a>

        {/* Footer */}
        <motion.p
          className="mt-6 text-xs text-amber-400/30 tracking-wider"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
        >
          {c.footer}
        </motion.p>
      </div>
    </div>
  );
}
