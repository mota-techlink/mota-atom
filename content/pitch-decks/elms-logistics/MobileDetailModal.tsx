"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown } from "lucide-react";

// ─── Mobile Detail Modal ─────────────────────────────────────────
// A shared fullscreen overlay used by pitch deck slides to show
// content that overflows on mobile (aspect-video) viewports.
// ──────────────────────────────────────────────────────────────────

interface MobileDetailModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function MobileDetailModal({
  open,
  onClose,
  title,
  subtitle,
  children,
}: MobileDetailModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Panel — slides up from bottom */}
          <motion.div
            className="relative mt-auto w-full max-h-[85vh] flex flex-col rounded-t-2xl border-t border-white/10 bg-slate-900/98 overflow-hidden"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
          >
            {/* Drag handle */}
            <div className="flex items-center justify-center py-2">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>

            {/* Header */}
            {(title || subtitle) && (
              <div className="flex items-center justify-between px-5 pb-3 border-b border-white/5">
                <div>
                  {title && (
                    <h3 className="text-sm font-bold text-white">{title}</h3>
                  )}
                  {subtitle && (
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      {subtitle}
                    </p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto overscroll-contain p-5">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── "Tap to explore" pill button ────────────────────────────────
// Shown on mobile when content is hidden/condensed
interface MobileExpandButtonProps {
  label?: string;
  onClick: () => void;
  className?: string;
}

export function MobileExpandButton({
  label = "Tap to explore",
  onClick,
  className = "",
}: MobileExpandButtonProps) {
  return (
    <motion.button
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/8 border border-white/10 text-[10px] font-medium text-slate-300 backdrop-blur-sm active:scale-95 transition-transform ${className}`}
      onClick={onClick}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      whileTap={{ scale: 0.95 }}
    >
      <ChevronDown className="w-3 h-3" />
      {label}
    </motion.button>
  );
}
