"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Bot,
  Send,
  Cpu,
  Package,
  Truck,
  ShieldCheck,
  Zap,
  ArrowRight,
  Sparkles,
  Globe,
  Clock,
  CheckCircle2,
  BarChart3,
  Leaf,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Typing Effect Hook ──────────────────────────────────────────
function useTypingEffect(text: string, speed = 38, startDelay = 800) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let idx = 0;
    const delayTimer = setTimeout(() => {
      const interval = setInterval(() => {
        idx++;
        setDisplayed(text.slice(0, idx));
        if (idx >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
      return () => clearInterval(interval);
    }, startDelay);
    return () => clearTimeout(delayTimer);
  }, [text, speed, startDelay]);

  return { displayed, done };
}

// ─── Glowing Pulse Ring ──────────────────────────────────────────
function PulseRing({
  size = 80,
  color = "emerald",
  delay = 0,
}: {
  size?: number;
  color?: string;
  delay?: number;
}) {
  const colorMap: Record<string, string> = {
    emerald: "border-emerald-400/40",
    cyan: "border-cyan-400/30",
    blue: "border-blue-400/30",
  };
  return (
    <motion.div
      className={`absolute rounded-full border ${colorMap[color] || colorMap.emerald}`}
      style={{ width: size, height: size }}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: [0, 0.6, 0], scale: [0.6, 1.3, 1.6] }}
      transition={{
        duration: 2.5,
        repeat: Infinity,
        delay,
        ease: "easeOut",
      }}
    />
  );
}

// ─── Data Flow Particle ──────────────────────────────────────────
function DataParticle({
  delay,
  direction,
}: {
  delay: number;
  direction: "left" | "right";
}) {
  const x = direction === "right" ? [0, 60] : [-60, 0];
  return (
    <motion.div
      className="absolute w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]"
      initial={{ opacity: 0, x: x[0] }}
      animate={{
        opacity: [0, 1, 1, 0],
        x: [x[0], x[0] + (x[1] - x[0]) * 0.4, x[0] + (x[1] - x[0]) * 0.8, x[1]],
      }}
      transition={{
        duration: 1.6,
        delay,
        repeat: Infinity,
        repeatDelay: 2,
        ease: "easeInOut",
      }}
    />
  );
}

// ─── MCP Bridge Node ─────────────────────────────────────────────
function MCPBridgeNode({ active }: { active: boolean }) {
  return (
    <div className="relative flex flex-col items-center justify-center gap-3 px-3">
      {/* Pulse rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        <PulseRing size={90} delay={0} />
        <PulseRing size={110} delay={0.8} />
        <PulseRing size={130} delay={1.6} color="cyan" />
      </div>

      {/* Left data flow */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2">
        {active && (
          <>
            <DataParticle delay={0} direction="right" />
            <DataParticle delay={0.5} direction="right" />
            <DataParticle delay={1.0} direction="right" />
          </>
        )}
      </div>

      {/* Right data flow */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2">
        {active && (
          <>
            <DataParticle delay={0.3} direction="right" />
            <DataParticle delay={0.8} direction="right" />
            <DataParticle delay={1.3} direction="right" />
          </>
        )}
      </div>

      {/* Central node */}
      <motion.div
        className="relative z-10 flex flex-col items-center"
        animate={active ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.div
          className={`p-3 lg:p-4 rounded-2xl border-2 backdrop-blur-xl transition-all duration-700 ${
            active
              ? "bg-emerald-500/15 border-emerald-400/50 shadow-[0_0_30px_rgba(52,211,153,0.25)]"
              : "bg-white/5 border-white/10"
          }`}
        >
          <Cpu
            className={`w-6 h-6 lg:w-7 lg:h-7 transition-colors duration-500 ${
              active ? "text-emerald-400" : "text-slate-500"
            }`}
          />
        </motion.div>

        <motion.div
          className="mt-2 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div
            className={`text-[10px] lg:text-xs font-bold font-mono tracking-wider uppercase transition-colors duration-500 ${
              active ? "text-emerald-400" : "text-slate-500"
            }`}
          >
            MCP Protocol
          </div>
          <AnimatePresence>
            {active && (
              <motion.div
                className="flex items-center gap-1 mt-1 text-[9px] lg:text-[10px] text-emerald-400/70 font-mono"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Zap className="w-2.5 h-2.5" />
                Processing
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
}

// ─── AI Chat Console (Left) ──────────────────────────────────────
function AIChatConsole({ onComplete }: { onComplete: () => void }) {
  const prompt =
    "Ship 50 boxes of electronics from Shenzhen to Dublin via the fastest route.";
  const { displayed, done } = useTypingEffect(prompt, 35, 1000);

  useEffect(() => {
    if (done) {
      const timer = setTimeout(onComplete, 600);
      return () => clearTimeout(timer);
    }
  }, [done, onComplete]);

  return (
    <motion.div
      className="flex flex-col h-full rounded-2xl border border-white/10 bg-white/4 backdrop-blur-xl overflow-hidden"
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/10 bg-white/2">
        <div className="flex items-center gap-1.5">
          <Bot className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold text-white/80 font-mono">
            ELMS AI Console
          </span>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[9px] text-emerald-400/70 font-mono">
            CONNECTED
          </span>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 p-3 lg:p-4 space-y-3 overflow-hidden">
        {/* System message */}
        <motion.div
          className="flex items-start gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="p-1 rounded-md bg-emerald-500/10">
            <Sparkles className="w-3 h-3 text-emerald-400" />
          </div>
          <div className="text-[10px] lg:text-xs text-slate-400 font-mono leading-relaxed">
            ELMS AI ready. MCP server connected.
            <br />
            <span className="text-emerald-400/60">
              Available tools: ship, track, customs, carbon
            </span>
          </div>
        </motion.div>

        {/* User typing prompt */}
        <div className="flex items-start gap-2 mt-2">
          <div className="p-1 rounded-md bg-blue-500/10">
            <Send className="w-3 h-3 text-blue-400" />
          </div>
          <div className="flex-1">
            <div className="text-[10px] lg:text-xs text-white/90 font-mono leading-relaxed min-h-10">
              {displayed}
              {!done && (
                <motion.span
                  className="inline-block w-0.5 h-3 bg-emerald-400 ml-0.5 align-middle"
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                />
              )}
            </div>
          </div>
        </div>

        {/* AI processing indicator */}
        <AnimatePresence>
          {done && (
            <motion.div
              className="flex items-center gap-2 mt-1"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="p-1 rounded-md bg-emerald-500/10">
                <Sparkles className="w-3 h-3 text-emerald-400" />
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-400/80 font-mono">
                <motion.div
                  className="flex gap-0.5"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <span>●</span>
                  <span>●</span>
                  <span>●</span>
                </motion.div>
                Calling MCP tools...
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input bar */}
      <div className="px-3 py-2 border-t border-white/10 bg-white/2">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
          <span className="text-[10px] text-slate-500 font-mono flex-1">
            Ask ELMS anything...
          </span>
          <Send className="w-3 h-3 text-slate-500" />
        </div>
      </div>
    </motion.div>
  );
}

// ─── Shipment Result Card (Right) ────────────────────────────────
interface ShipmentField {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}

function ShipmentCard({ visible }: { visible: boolean }) {
  const fields: ShipmentField[] = useMemo(
    () => [
      {
        icon: <Truck className="w-3.5 h-3.5" />,
        label: "Carrier",
        value: "SF Express International",
        color: "text-emerald-400",
      },
      {
        icon: <Zap className="w-3.5 h-3.5" />,
        label: "Service",
        value: "Priority Express (2-3 days)",
        color: "text-cyan-400",
      },
      {
        icon: <Globe className="w-3.5 h-3.5" />,
        label: "Route",
        value: "SZX → DUB (via AMS hub)",
        color: "text-blue-400",
      },
      {
        icon: <ShieldCheck className="w-3.5 h-3.5" />,
        label: "Customs",
        value: "EU-Compliant · Auto-declared",
        color: "text-emerald-400",
      },
      {
        icon: <Package className="w-3.5 h-3.5" />,
        label: "Labels",
        value: "50x generated · QR attached",
        color: "text-purple-400",
      },
      {
        icon: <Leaf className="w-3.5 h-3.5" />,
        label: "Carbon",
        value: "1.2t CO₂ · Offset available",
        color: "text-green-400",
      },
    ],
    []
  );

  return (
    <motion.div
      className="flex flex-col h-full rounded-2xl border border-white/10 bg-white/4 backdrop-blur-xl overflow-hidden"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/10 bg-white/2">
        <div className="flex items-center gap-1.5">
          <Package className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold text-white/80 font-mono">
            Shipment Output
          </span>
        </div>
        <div className="ml-auto">
          <AnimatePresence>
            {visible && (
              <motion.div
                className="flex items-center gap-1"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span className="text-[9px] text-emerald-400 font-mono font-bold">
                  READY
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Shipment ID */}
      <div className="px-4 pt-3">
        <AnimatePresence>
          {visible && (
            <motion.div
              className="flex items-center justify-between px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div>
                <div className="text-[9px] text-emerald-400/60 font-mono uppercase">
                  Shipment ID
                </div>
                <div className="text-xs text-emerald-300 font-mono font-bold">
                  ELMS-2026-SZX-DUB-0847
                </div>
              </div>
              <BarChart3 className="w-4 h-4 text-emerald-400/40" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Fields */}
      <div className="flex-1 p-3 lg:p-4 space-y-1.5 overflow-hidden">
        {fields.map((field, i) => (
          <AnimatePresence key={field.label}>
            {visible && (
              <motion.div
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-white/3 border border-white/5 hover:bg-white/6 transition-colors"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.18, ease: "easeOut" }}
              >
                <div className={`${field.color} opacity-70`}>{field.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-[9px] text-slate-500 font-mono uppercase tracking-wider">
                    {field.label}
                  </div>
                  <div className="text-[11px] lg:text-xs text-white/90 font-mono font-medium truncate">
                    {field.value}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        ))}
      </div>

      {/* Footer stats */}
      <AnimatePresence>
        {visible && (
          <motion.div
            className="px-4 py-2 border-t border-white/10 bg-white/2 flex items-center justify-between"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
          >
            <div className="flex items-center gap-1 text-[9px] text-emerald-400/60 font-mono">
              <Clock className="w-2.5 h-2.5" />
              Generated in 1.2s
            </div>
            <div className="flex items-center gap-1 text-[9px] text-emerald-400/60 font-mono">
              <Zap className="w-2.5 h-2.5" />
              3 MCP tools called
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Connection Lines (SVG) ──────────────────────────────────────
function ConnectionLine({
  active,
  side,
}: {
  active: boolean;
  side: "left" | "right";
}) {
  return (
    <div className="hidden lg:flex items-center justify-center w-12 xl:w-16">
      <svg className="w-full h-16" viewBox="0 0 60 60" fill="none">
        <motion.path
          d={side === "left" ? "M0 30 H60" : "M0 30 H60"}
          stroke={active ? "rgba(52,211,153,0.4)" : "rgba(255,255,255,0.08)"}
          strokeWidth="1.5"
          strokeDasharray="4 4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: side === "left" ? 0.5 : 1.5 }}
        />
        {active && (
          <motion.circle
            cx="0"
            cy="30"
            r="2.5"
            fill="#34D399"
            filter="url(#glow)"
            animate={{ cx: [0, 60] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatDelay: 1.5,
              ease: "easeInOut",
            }}
          />
        )}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
    </div>
  );
}

// ─── Flow Arrow (Mobile) ─────────────────────────────────────────
function FlowArrow({ active }: { active: boolean }) {
  return (
    <div className="flex lg:hidden items-center justify-center py-1">
      <motion.div
        className={`transition-colors duration-500 ${
          active ? "text-emerald-400" : "text-slate-600"
        }`}
        animate={active ? { y: [0, 3, 0] } : {}}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <ArrowRight className="w-4 h-4 rotate-90 lg:rotate-0" />
      </motion.div>
    </div>
  );
}

// ─── Main Slide Component ────────────────────────────────────────
export function AILogisticsLabSlide() {
  const [mcpActive, setMcpActive] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleTypingComplete = React.useCallback(() => {
    setMcpActive(true);
    setTimeout(() => setShowResult(true), 1200);
  }, []);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center bg-linear-to-br from-slate-950 via-[#0a1628] to-slate-950 text-white relative overflow-hidden aspect-video p-6 lg:p-10">
      {/* Background effects */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(52,211,153,0.3) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Emerald glow spots */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[100px]" />

      {/* ── Header ── */}
      <div className="relative z-10 text-center mb-4 lg:mb-6">
        <motion.div
          className="flex items-center justify-center gap-2 mb-1.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-400/60" />
          <span className="text-[10px] lg:text-xs font-mono text-emerald-400/70 tracking-[0.25em] uppercase">
            Live Demo
          </span>
          <Sparkles className="w-3.5 h-3.5 text-emerald-400/60" />
        </motion.div>

        <motion.h2
          className="text-xl lg:text-3xl xl:text-4xl font-black tracking-tight"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          <span className="text-white">AI Logistics Lab</span>
          <span className="text-emerald-400 ml-2">×</span>
          <span className="text-emerald-300 ml-2">MCP</span>
        </motion.h2>

        <motion.p
          className="mt-1.5 text-[11px] lg:text-sm text-slate-400 font-mono max-w-lg mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Natural language → MCP Protocol → Automated shipment execution
        </motion.p>
      </div>

      {/* ── Main 3-Panel Layout ── */}
      <div className="relative z-10 flex flex-col lg:flex-row items-stretch justify-center gap-2 lg:gap-0 w-full max-w-6xl flex-1 min-h-0">
        {/* Left: AI Chat Console */}
        <div className="flex-1 min-w-0 lg:max-w-sm xl:max-w-md min-h-40 lg:min-h-0">
          <AIChatConsole onComplete={handleTypingComplete} />
        </div>

        {/* Connection: Left → MCP */}
        <ConnectionLine active={mcpActive} side="left" />
        <FlowArrow active={mcpActive} />

        {/* Center: MCP Bridge */}
        <div className="flex items-center justify-center px-2 lg:px-4 py-2 lg:py-0 min-w-25 lg:min-w-32">
          <MCPBridgeNode active={mcpActive} />
        </div>

        {/* Connection: MCP → Output */}
        <ConnectionLine active={showResult} side="right" />
        <FlowArrow active={showResult} />

        {/* Right: Shipment Output */}
        <div className="flex-1 min-w-0 lg:max-w-sm xl:max-w-md min-h-40 lg:min-h-0">
          <ShipmentCard visible={showResult} />
        </div>
      </div>

      {/* ── Bottom: Compatibility Bar ── */}
      <motion.div
        className="relative z-10 mt-4 lg:mt-6 flex flex-wrap items-center justify-center gap-3 lg:gap-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        {[
          { label: "Compatible", value: "Claude · GPT · Gemini" },
          { label: "Protocol", value: "MCP (Model Context Protocol)" },
          { label: "Latency", value: "< 2s end-to-end" },
        ].map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/3 border border-white/5"
          >
            <span className="text-[9px] lg:text-[10px] text-slate-500 font-mono uppercase">
              {item.label}
            </span>
            <span className="text-[10px] lg:text-xs text-emerald-300/80 font-mono font-semibold">
              {item.value}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
