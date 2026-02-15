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
  ArrowLeft,
  Sparkles,
  Globe,
  Clock,
  CheckCircle2,
  BarChart3,
  Leaf,
  ExternalLink,
  FileCheck,
  MapPin,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDeck } from "@/components/pitch-deck";
import {
  MobileDetailModal,
  MobileExpandButton,
} from "./MobileDetailModal";

// ─── AI Brand Icons (inline SVGs) ────────────────────────────────
function ChatGPTIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
    </svg>
  );
}

function GeminiIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 24C12 18.833 10.35 14.55 7.05 11.15C3.75 7.75 0 5.5 0 5.5C0 5.5 0 0 12 0C24 0 24 5.5 24 5.5C24 5.5 20.25 7.75 16.95 11.15C13.65 14.55 12 18.833 12 24Z"
        fill="url(#gemini-grad)"
      />
      <defs>
        <linearGradient id="gemini-grad" x1="0" y1="0" x2="24" y2="24">
          <stop stopColor="#4285F4" />
          <stop offset="0.5" stopColor="#9B72CB" />
          <stop offset="1" stopColor="#D96570" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function GrokIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M2.04 4.055h4.032l6.781 9.89L19.64 4.054h4.032v.001L14.86 15.946l5.107 3.999h-4.032l-3.082-2.414-3.078 2.414H5.743l5.104-3.999L2.04 4.055z" />
    </svg>
  );
}

function ClaudeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M14.957 4.386l-5.08 15.228h-3.68L11.277 4.386h3.68zm-2.68 0l5.08 15.228h3.68L15.957 4.386h-3.68z" />
    </svg>
  );
}

// ─── AI Brand Icons with Hover Tooltip & Sequential Glow ─────────
const aiBrands = [
  { name: "ChatGPT", Icon: ChatGPTIcon, color: "text-emerald-400", glowColor: "rgba(52,211,153,0.5)" },
  { name: "Gemini", Icon: GeminiIcon, color: "", glowColor: "rgba(66,133,244,0.5)" },
  { name: "Grok", Icon: GrokIcon, color: "text-white/80", glowColor: "rgba(255,255,255,0.4)" },
  { name: "Claude", Icon: ClaudeIcon, color: "text-orange-400", glowColor: "rgba(251,146,60,0.5)" },
] as const;

function AIBrandIcons() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div className="flex items-center gap-1.5">
      {aiBrands.map((brand, i) => (
        <div
          key={brand.name}
          className="relative"
          onMouseEnter={() => setHoveredIdx(i)}
          onMouseLeave={() => setHoveredIdx(null)}
        >
          {/* Sequential glow animation */}
          <motion.div
            className={`p-1 rounded-md transition-colors duration-200 ${
              hoveredIdx === i ? "bg-white/10" : ""
            }`}
            animate={{
              scale: hoveredIdx === null
                ? [1, 1, 1.15, 1, 1]
                : hoveredIdx === i ? 1.2 : 1,
            }}
            transition={
              hoveredIdx === null
                ? {
                    duration: 2.4,
                    repeat: Infinity,
                    delay: i * 0.6,
                    ease: "easeInOut",
                  }
                : { duration: 0.2 }
            }
          >
            <motion.div
              animate={
                hoveredIdx === null
                  ? {
                      filter: [
                        "drop-shadow(0 0 0px transparent)",
                        "drop-shadow(0 0 0px transparent)",
                        `drop-shadow(0 0 6px ${brand.glowColor})`,
                        "drop-shadow(0 0 0px transparent)",
                        "drop-shadow(0 0 0px transparent)",
                      ],
                    }
                  : hoveredIdx === i
                    ? { filter: `drop-shadow(0 0 8px ${brand.glowColor})` }
                    : { filter: "drop-shadow(0 0 0px transparent)" }
              }
              transition={
                hoveredIdx === null
                  ? { duration: 2.4, repeat: Infinity, delay: i * 0.6, ease: "easeInOut" }
                  : { duration: 0.2 }
              }
            >
              <brand.Icon className={`w-4 h-4 ${brand.color}`} />
            </motion.div>
          </motion.div>

          {/* Tooltip */}
          <AnimatePresence>
            {hoveredIdx === i && (
              <motion.div
                className="absolute left-1/2 -translate-x-1/2 -top-8 px-2 py-0.5 rounded-md bg-slate-800 border border-white/10 shadow-lg whitespace-nowrap z-20 pointer-events-none"
                initial={{ opacity: 0, y: 4, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.9 }}
                transition={{ duration: 0.15 }}
              >
                <span className="text-[9px] font-mono font-semibold text-white/90">
                  {brand.name}
                </span>
                {/* Arrow */}
                <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 rotate-45 bg-slate-800 border-r border-b border-white/10" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

// ─── Business Navigation Links ───────────────────────────────────
function BusinessLinks() {
  const links = [
    { label: "ELMS Products", href: "/products/mota-ai/" },
    { label: "Case Studies", href: "/showcase" },
    { label: "Documentation", href: "/docs" },
  ];

  return (
    <motion.div
      className="flex flex-wrap items-center gap-2 mt-2"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
    >
      <a
        href="/pitch-deck/elms-logistics"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] lg:text-xs text-slate-400 font-mono hover:text-emerald-400 hover:border-emerald-400/30 hover:bg-emerald-500/5 transition-all duration-300 group"
      >
        <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
        Back to Deck
      </a>
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] lg:text-xs text-slate-400 font-mono hover:text-emerald-400 hover:border-emerald-400/30 hover:bg-emerald-500/5 transition-all duration-300 group"
        >
          {link.label}
          <ExternalLink className="w-2.5 h-2.5 opacity-50 group-hover:opacity-100 transition-opacity" />
        </a>
      ))}
    </motion.div>
  );
}

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
function AIChatConsole({
  onComplete,
  showResult,
  onShipmentClick,
}: {
  onComplete: () => void;
  showResult: boolean;
  onShipmentClick: () => void;
}) {
  const prompt =
    "Ship 50 boxes of electronics from Shenzhen to Dublin via the fastest route.";
  const { displayed, done } = useTypingEffect(prompt, 35, 1000);
  const chatEndRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (done) {
      const timer = setTimeout(onComplete, 600);
      return () => clearTimeout(timer);
    }
  }, [done, onComplete]);

  // Auto-scroll to bottom when new content appears
  useEffect(() => {
    if (showResult) {
      const timer = setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [showResult]);

  return (
    <motion.div
      className="flex flex-col h-full rounded-2xl border border-white/10 bg-white/4 backdrop-blur-xl overflow-visible"
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/10 bg-white/2 rounded-t-2xl overflow-visible relative z-20">
        <div className="flex items-center gap-1.5">
          <Bot className="w-4 h-4 text-emerald-400" />
          <AIBrandIcons />
        </div>
        <div className="ml-auto flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[9px] text-emerald-400/70 font-mono">
            CONNECTED
          </span>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 p-3 lg:p-4 space-y-3 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
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
          <div className="text-xs lg:text-sm text-slate-400 font-mono leading-relaxed">
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
            <div className="text-xs lg:text-sm text-white/90 font-mono leading-relaxed min-h-10">
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
              <div className="flex items-center gap-1.5 text-xs text-emerald-400/80 font-mono">
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

        {/* ── Shipment Result Return Card ── */}
        <AnimatePresence>
          {showResult && (
            <motion.div
              className="mt-2"
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.5, ease: "easeOut" }}
            >
              {/* AI response text */}
              <div className="flex items-start gap-2 mb-2">
                <div className="p-1 rounded-md bg-emerald-500/10">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                </div>
                <div className="text-xs lg:text-sm text-emerald-400/80 font-mono leading-relaxed">
                  ✅ Shipment created successfully. Click to track:
                </div>
              </div>

              {/* Clickable shipment card */}
              <motion.button
                onClick={onShipmentClick}
                className="w-full group cursor-pointer rounded-xl border border-emerald-500/30 bg-linear-to-br from-emerald-500/10 via-emerald-500/5 to-cyan-500/5 p-3 lg:p-3.5 text-left transition-all duration-300 hover:border-emerald-400/50 hover:shadow-[0_0_20px_rgba(52,211,153,0.15)] hover:from-emerald-500/15 hover:to-cyan-500/10 active:scale-[0.98]"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                {/* Card header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/20">
                      <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-[9px] lg:text-[10px] text-emerald-400/60 font-mono uppercase tracking-wider">
                        Shipment Created
                      </div>
                      <div className="text-xs lg:text-sm text-emerald-300 font-mono font-bold">
                        ELMS-2026-SZX-DUB-0847
                      </div>
                    </div>
                  </div>
                  <motion.div
                    className="text-emerald-400/60 group-hover:text-emerald-400 transition-colors"
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </div>

                {/* Mini route info */}
                <div className="flex items-center gap-3 text-[9px] lg:text-[10px] font-mono text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5 text-emerald-400/50" />
                    SZX → DUB
                  </span>
                  <span className="flex items-center gap-1">
                    <Package className="w-2.5 h-2.5 text-cyan-400/50" />
                    50 boxes
                  </span>
                  <span className="flex items-center gap-1">
                    <Truck className="w-2.5 h-2.5 text-blue-400/50" />
                    SF Express
                  </span>
                </div>

                {/* Click hint */}
                <div className="mt-2 pt-2 border-t border-emerald-500/10 flex items-center justify-center gap-1.5">
                  <span className="text-[9px] lg:text-[10px] text-emerald-400/50 font-mono group-hover:text-emerald-400/80 transition-colors">
                    View Route Dashboard & Documents
                  </span>
                  <ArrowRight className="w-3 h-3 text-emerald-400/40 group-hover:text-emerald-400/80 group-hover:translate-x-0.5 transition-all" />
                </div>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Scroll anchor */}
        <div ref={chatEndRef} />
      </div>

      {/* Input bar */}
      <div className="px-3 py-2 border-t border-white/10 bg-white/2">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
          <span className="text-xs text-slate-500 font-mono flex-1">
            Ask ELMS anything...
          </span>
          <Send className="w-3 h-3 text-slate-500" />
        </div>
      </div>

      {/* Business navigation links */}
      <div className="px-3 py-2 border-t border-white/5">
        <BusinessLinks />
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const { nextSlide } = useDeck();

  const handleTypingComplete = React.useCallback(() => {
    setMcpActive(true);
    setTimeout(() => setShowResult(true), 1200);
  }, []);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center bg-linear-to-br from-slate-950 via-[#0a1628] to-slate-950 text-white relative overflow-hidden p-4 md:p-6 lg:p-10">
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
      <div className="relative z-10 text-center mb-3 md:mb-4 lg:mb-6">
        <motion.div
          className="flex items-center justify-center gap-2 mb-1.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Sparkles className="w-3 h-3 md:w-3.5 md:h-3.5 text-emerald-400/60" />
          <span className="text-[9px] md:text-[10px] lg:text-xs font-mono text-emerald-400/70 tracking-[0.25em] uppercase">
            Live Demo
          </span>
          <Sparkles className="w-3 h-3 md:w-3.5 md:h-3.5 text-emerald-400/60" />
        </motion.div>

        <motion.h2
          className="text-lg md:text-xl lg:text-3xl xl:text-4xl font-black tracking-tight"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          <span className="text-white">AI Logistics Lab</span>
          <span className="text-emerald-400 ml-1 md:ml-2">×</span>
          <span className="text-emerald-300 ml-1 md:ml-2">MCP</span>
        </motion.h2>

        <motion.p
          className="mt-1 text-[10px] md:text-[11px] lg:text-sm text-slate-400 font-mono max-w-lg mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Natural language → MCP Protocol → Automated shipment execution
        </motion.p>
      </div>

      {/* ── Desktop: Main 3-Panel Layout ── */}
      <div className="relative z-10 hidden md:flex flex-col lg:flex-row items-stretch justify-center gap-2 lg:gap-0 w-full max-w-6xl flex-1 min-h-0">
        {/* Left: AI Chat Console */}
        <div className="flex-1 min-w-0 lg:max-w-sm xl:max-w-md min-h-40 lg:min-h-0">
          <AIChatConsole
            onComplete={handleTypingComplete}
            showResult={showResult}
            onShipmentClick={nextSlide}
          />
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

      {/* ── Mobile: Condensed flow diagram + expand ── */}
      <div className="relative z-10 flex md:hidden flex-col items-center gap-3 flex-1 justify-center min-h-0">
        {/* Flow diagram */}
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {/* AI Console mini */}
          <div className="flex flex-col items-center gap-1 p-2.5 rounded-xl bg-white/4 border border-white/10">
            <Bot className="w-4 h-4 text-emerald-400" />
            <span className="text-[7px] font-mono text-slate-400">AI Console</span>
          </div>

          <motion.div
            className="text-emerald-400/50"
            animate={{ x: [0, 3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ArrowRight className="w-3 h-3" />
          </motion.div>

          {/* MCP mini */}
          <div className="flex flex-col items-center gap-1 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <span className="text-[7px] font-mono text-emerald-400/70">MCP</span>
          </div>

          <motion.div
            className="text-emerald-400/50"
            animate={{ x: [0, 3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
          >
            <ArrowRight className="w-3 h-3" />
          </motion.div>

          {/* Output mini */}
          <div className="flex flex-col items-center gap-1 p-2.5 rounded-xl bg-white/4 border border-white/10">
            <Package className="w-4 h-4 text-emerald-400" />
            <span className="text-[7px] font-mono text-slate-400">Output</span>
          </div>
        </motion.div>

        {/* Mini shipment ID */}
        <motion.div
          className="px-3 py-1.5 rounded-lg bg-emerald-500/5 border border-emerald-500/15"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <span className="text-[9px] font-mono text-emerald-300 font-bold">
            ELMS-2026-SZX-DUB-0847
          </span>
        </motion.div>

        <MobileExpandButton
          label="Tap to view full demo"
          onClick={() => setMobileOpen(true)}
        />
      </div>

      {/* ── Desktop: Compatibility Bar ── */}
      <motion.div
        className="relative z-10 mt-3 md:mt-4 lg:mt-6 hidden md:flex flex-wrap items-center justify-center gap-3 lg:gap-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        {[
          {
            label: "Compatible",
            value: (
              <span className="inline-flex items-center gap-1.5">
                <ClaudeIcon className="w-3.5 h-3.5 text-orange-400" />
                <ChatGPTIcon className="w-3.5 h-3.5 text-emerald-400" />
                <GeminiIcon className="w-3.5 h-3.5" />
                <GrokIcon className="w-3.5 h-3.5 text-white/80" />
              </span>
            ),
          },
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

      {/* ── Mobile Detail Modal ── */}
      <MobileDetailModal
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        title="AI Logistics Lab × MCP"
        subtitle="Natural language → Automated execution"
      >
        <div className="space-y-4">
          {/* Prompt */}
          <div className="p-3 rounded-xl bg-white/4 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1 rounded-md bg-blue-500/10">
                <Send className="w-3 h-3 text-blue-400" />
              </div>
              <span className="text-[10px] font-mono text-slate-500 uppercase">User Prompt</span>
            </div>
            <p className="text-xs text-white/90 font-mono leading-relaxed">
              &quot;Ship 50 boxes of electronics from Shenzhen to Dublin via the fastest route.&quot;
            </p>
          </div>

          {/* MCP Processing */}
          <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1 rounded-md bg-emerald-500/10">
                <Cpu className="w-3 h-3 text-emerald-400" />
              </div>
              <span className="text-[10px] font-mono text-emerald-400/70 uppercase">MCP Protocol</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-400/80 font-mono">
              <Zap className="w-3 h-3" />
              3 tools called: ship, customs, carbon
            </div>
          </div>

          {/* Result fields */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1 rounded-md bg-emerald-500/10">
                <Package className="w-3 h-3 text-emerald-400" />
              </div>
              <span className="text-[10px] font-mono text-slate-500 uppercase">Shipment Output</span>
            </div>
            {[
              { icon: <Truck className="w-3.5 h-3.5" />, label: "Carrier", value: "SF Express International", color: "text-emerald-400" },
              { icon: <Zap className="w-3.5 h-3.5" />, label: "Service", value: "Priority Express (2-3 days)", color: "text-cyan-400" },
              { icon: <Globe className="w-3.5 h-3.5" />, label: "Route", value: "SZX → DUB (via AMS hub)", color: "text-blue-400" },
              { icon: <ShieldCheck className="w-3.5 h-3.5" />, label: "Customs", value: "EU-Compliant · Auto-declared", color: "text-emerald-400" },
              { icon: <Package className="w-3.5 h-3.5" />, label: "Labels", value: "50x generated · QR attached", color: "text-purple-400" },
              { icon: <Leaf className="w-3.5 h-3.5" />, label: "Carbon", value: "1.2t CO₂ · Offset available", color: "text-green-400" },
            ].map((field) => (
              <div
                key={field.label}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white/3 border border-white/5"
              >
                <span className={`${field.color} opacity-70`}>{field.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[9px] text-slate-500 font-mono uppercase tracking-wider">
                    {field.label}
                  </div>
                  <div className="text-xs text-white/90 font-mono font-medium">
                    {field.value}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Clickable shipment card — Mobile */}
          <button
            onClick={() => {
              setMobileOpen(false);
              setTimeout(() => nextSlide(), 300);
            }}
            className="w-full group rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3 text-left transition-all duration-300 hover:border-emerald-400/50 active:scale-[0.98] mt-3"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/20">
                  <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div>
                  <div className="text-[9px] text-emerald-400/60 font-mono uppercase tracking-wider">
                    Shipment Created
                  </div>
                  <div className="text-xs text-emerald-300 font-mono font-bold">
                    ELMS-2026-SZX-DUB-0847
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-emerald-400/60 group-hover:text-emerald-400" />
            </div>
            <div className="flex items-center gap-3 text-[9px] font-mono text-slate-400">
              <span className="flex items-center gap-1">
                <MapPin className="w-2.5 h-2.5 text-emerald-400/50" />
                SZX → DUB
              </span>
              <span className="flex items-center gap-1">
                <Package className="w-2.5 h-2.5 text-cyan-400/50" />
                50 boxes
              </span>
            </div>
            <div className="mt-2 pt-2 border-t border-emerald-500/10 flex items-center justify-center gap-1.5">
              <span className="text-[9px] text-emerald-400/50 font-mono">
                View Route Dashboard & Documents →
              </span>
            </div>
          </button>

          {/* Compatibility */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            {[
              {
                label: "Compatible",
                value: (
                  <span className="inline-flex items-center gap-1">
                    <ClaudeIcon className="w-3 h-3 text-orange-400" />
                    <ChatGPTIcon className="w-3 h-3 text-emerald-400" />
                    <GeminiIcon className="w-3 h-3" />
                    <GrokIcon className="w-3 h-3 text-white/80" />
                  </span>
                ),
              },
              { label: "Protocol", value: "MCP" },
              { label: "Latency", value: "< 2s" },
            ].map((item) => (
              <div
                key={item.label}
                className="text-center p-2 rounded-lg bg-white/3 border border-white/5"
              >
                <div className="text-[9px] text-slate-500 font-mono">{item.label}</div>
                <div className="text-[10px] text-emerald-300/80 font-mono font-semibold mt-0.5">
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </MobileDetailModal>
    </div>
  );
}
