"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Package,
  Plane,
  Globe,
  Shield,
  Cpu,
  Zap,
  Network,
  Container,
} from "lucide-react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

// ─── Mouse Parallax Hook ─────────────────────────────────────────
function useMouseParallax() {
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springConfig = { damping: 30, stiffness: 80 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [mouseX, mouseY]);

  return { springX, springY };
}

// ─── Logistics Flow SVG Background ──────────────────────────────
function LogisticsFlowBackground({
  springX,
  springY,
}: {
  springX: ReturnType<typeof useSpring>;
  springY: ReturnType<typeof useSpring>;
}) {
  const x = useTransform(springX, [0, 1], [-15, 15]);
  const y = useTransform(springY, [0, 1], [-10, 10]);

  // Route paths simulating logistics routes
  const routes = [
    // Asia → Europe routes
    { d: "M750 350 Q600 280 450 300 Q300 320 200 250", delay: 0 },
    { d: "M800 400 Q650 350 500 320 Q350 290 150 330", delay: 0.5 },
    { d: "M720 300 Q550 220 380 260 Q250 290 120 200", delay: 1.0 },
    // Cross routes
    { d: "M600 150 Q500 250 400 200 Q300 150 100 250", delay: 1.5 },
    { d: "M850 200 Q700 300 550 250 Q400 200 250 350", delay: 2.0 },
    // Lower routes
    { d: "M700 450 Q550 400 400 420 Q280 440 100 400", delay: 0.8 },
  ];

  // Node points (logistics hubs)
  const nodes = [
    { cx: 750, cy: 350, label: "SZX" },
    { cx: 500, cy: 300, label: "AMS" },
    { cx: 200, cy: 250, label: "DUB" },
    { cx: 600, cy: 150, label: "FRA" },
    { cx: 350, cy: 420, label: "CDG" },
    { cx: 850, cy: 200, label: "NRT" },
    { cx: 120, cy: 380, label: "LHR" },
    { cx: 450, cy: 200, label: "BRU" },
  ];

  return (
    <motion.div className="absolute inset-0 overflow-hidden" style={{ x, y }}>
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 960 540"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <defs>
          <filter id="nodeGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="routeGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(52,211,153,0)" />
            <stop offset="50%" stopColor="rgba(52,211,153,0.15)" />
            <stop offset="100%" stopColor="rgba(52,211,153,0)" />
          </linearGradient>
        </defs>

        {/* Route lines */}
        {routes.map((route, i) => (
          <g key={i}>
            {/* Static path */}
            <path
              d={route.d}
              stroke="rgba(148,163,184,0.06)"
              strokeWidth="1"
              strokeDasharray="4 8"
            />
            {/* Animated traveling light */}
            <motion.circle r="2" fill="rgba(52,211,153,0.4)" filter="url(#nodeGlow)">
              <animateMotion
                dur={`${6 + i * 0.5}s`}
                repeatCount="indefinite"
                begin={`${route.delay}s`}
              >
                <mpath href={`#route-${i}`} />
              </animateMotion>
            </motion.circle>
            <path id={`route-${i}`} d={route.d} fill="none" />
          </g>
        ))}

        {/* Hub nodes */}
        {nodes.map((node, i) => (
          <g key={`node-${i}`}>
            <motion.circle
              cx={node.cx}
              cy={node.cy}
              r="2"
              fill="rgba(52,211,153,0.3)"
              animate={{ r: [2, 3, 2], opacity: [0.3, 0.6, 0.3] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.4,
              }}
            />
            <circle
              cx={node.cx}
              cy={node.cy}
              r="8"
              fill="none"
              stroke="rgba(52,211,153,0.08)"
              strokeWidth="0.5"
            />
          </g>
        ))}

        {/* Grid dots */}
        {Array.from({ length: 20 }).map((_, row) =>
          Array.from({ length: 35 }).map((_, col) => (
            <circle
              key={`dot-${row}-${col}`}
              cx={col * 28 + 10}
              cy={row * 28 + 10}
              r="0.5"
              fill="rgba(148,163,184,0.08)"
            />
          ))
        )}
      </svg>
    </motion.div>
  );
}

// ─── Floating Logistics Icons ────────────────────────────────────
function FloatingIcons({
  springX,
  springY,
}: {
  springX: ReturnType<typeof useSpring>;
  springY: ReturnType<typeof useSpring>;
}) {
  const icons = [
    { Icon: Package, x: "12%", y: "18%", size: 18, parallax: 1.5, delay: 0 },
    { Icon: Plane, x: "85%", y: "22%", size: 20, parallax: 2.0, delay: 0.5 },
    { Icon: Globe, x: "8%", y: "72%", size: 22, parallax: 1.8, delay: 1.0 },
    { Icon: Shield, x: "88%", y: "68%", size: 16, parallax: 1.2, delay: 1.5 },
    { Icon: Container, x: "20%", y: "45%", size: 14, parallax: 2.5, delay: 0.3 },
    { Icon: Network, x: "78%", y: "42%", size: 16, parallax: 1.6, delay: 0.8 },
  ];

  return (
    <>
      {icons.map(({ Icon, x: posX, y: posY, size, parallax, delay }, i) => {
        const moveX = useTransform(springX, [0, 1], [-8 * parallax, 8 * parallax]);
        const moveY = useTransform(springY, [0, 1], [-6 * parallax, 6 * parallax]);

        return (
          <motion.div
            key={i}
            className="absolute"
            style={{ left: posX, top: posY, x: moveX, y: moveY }}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.06, 0.12, 0.06],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              opacity: { duration: 5 + i, repeat: Infinity, delay },
              rotate: { duration: 8 + i * 2, repeat: Infinity, delay },
            }}
          >
            <Icon className="text-slate-400" style={{ width: size, height: size }} />
          </motion.div>
        );
      })}
    </>
  );
}

// ─── MCP Core Animation ──────────────────────────────────────────
function MCPCore() {
  return (
    <motion.div
      className="relative w-20 h-20 md:w-28 md:h-28 lg:w-36 lg:h-36 mx-auto mb-4 md:mb-6"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
    >
      {/* Outer rotating ring */}
      <motion.div
        className="absolute inset-0 rounded-full border border-emerald-500/20"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        {/* Orbital dots */}
        {[0, 90, 180, 270].map((deg) => (
          <div
            key={deg}
            className="absolute w-1.5 h-1.5 rounded-full bg-emerald-400/50"
            style={{
              top: "50%",
              left: "50%",
              transform: `rotate(${deg}deg) translateX(calc(50% + 50px)) translateY(-50%)`,
            }}
          />
        ))}
      </motion.div>

      {/* Middle pulsing ring */}
      <motion.div
        className="absolute inset-3 rounded-full border border-emerald-400/10"
        animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Inner glow ring */}
      <motion.div
        className="absolute inset-6 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(52,211,153,0.08) 0%, transparent 70%)",
        }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />

      {/* Hexagonal inner shape */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="relative"
          animate={{ rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          <svg width="60" height="60" viewBox="0 0 60 60" className="lg:w-18 lg:h-18">
            <motion.polygon
              points="30,2 55,17 55,43 30,58 5,43 5,17"
              fill="none"
              stroke="rgba(52,211,153,0.25)"
              strokeWidth="1"
              animate={{
                stroke: [
                  "rgba(52,211,153,0.2)",
                  "rgba(52,211,153,0.4)",
                  "rgba(52,211,153,0.2)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </svg>
        </motion.div>
      </div>

      {/* Center icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Cpu className="w-7 h-7 lg:w-8 lg:h-8 text-emerald-400/70" />
        </motion.div>
      </div>

      {/* Glow effect underneath */}
      <div
        className="absolute -inset-8 rounded-full blur-2xl pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(52,211,153,0.06) 0%, transparent 60%)",
        }}
      />
    </motion.div>
  );
}

// ─── Title Shimmer + Scanline ────────────────────────────────────
function ShimmerTitle({ text }: { text: string }) {
  return (
    <motion.div
      className="relative inline-block"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.6 }}
    >
      {/* Main title with metallic gradient */}
      <h1
        className="text-4xl md:text-6xl lg:text-8xl xl:text-9xl font-black tracking-tighter leading-none"
        style={{
          background:
            "linear-gradient(135deg, #e2e8f0 0%, #f8fafc 25%, #94a3b8 50%, #f1f5f9 75%, #cbd5e1 100%)",
          backgroundSize: "200% 200%",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {text}
      </h1>

      {/* Shimmer / scanline overlay */}
      <motion.div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <motion.div
          className="absolute top-0 bottom-0 w-20 lg:w-32"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)",
          }}
          animate={{ left: ["-20%", "120%"] }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            repeatDelay: 5,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      {/* AI Scan line (horizontal laser) */}
      <motion.div
        className="absolute left-0 right-0 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(52,211,153,0.5), transparent)",
          boxShadow: "0 0 8px rgba(52,211,153,0.3)",
        }}
        animate={{ top: ["0%", "100%", "0%"] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatDelay: 6,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
}

// ─── Glass Badge ─────────────────────────────────────────────────
function GlassBadge({
  icon,
  text,
  delay,
  pulse,
}: {
  icon: string;
  text: string;
  delay: number;
  pulse?: boolean;
}) {
  return (
    <motion.div
      className="relative flex items-center gap-1.5 md:gap-2 px-2.5 md:px-4 py-1.5 md:py-2 rounded-full backdrop-blur-md border border-emerald-500/20 bg-emerald-500/5"
      initial={{ opacity: 0, y: 15, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      whileHover={{
        scale: 1.05,
        borderColor: "rgba(52,211,153,0.4)",
        boxShadow: "0 0 20px rgba(52,211,153,0.1)",
      }}
    >
      {/* Subtle glow border on hover */}
      <span className="text-xs md:text-sm">{icon}</span>
      <span className="text-[10px] md:text-xs font-medium text-emerald-300/90 tracking-wide">
        {text}
      </span>
      {pulse && (
        <span className="relative ml-0.5 flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
      )}
    </motion.div>
  );
}

// ─── Main Slide Component ────────────────────────────────────────
export function ELMSTitleSlide() {
  const { springX, springY } = useMouseParallax();

  return (
    <div className="w-full h-full flex flex-col justify-center items-center relative overflow-hidden bg-[#020617]">
      {/* Deep navy gradient base */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, #0f172a 0%, #020617 70%)",
        }}
      />

      {/* Animated logistics flow background with mouse parallax */}
      <LogisticsFlowBackground springX={springX} springY={springY} />

      {/* Floating logistics icons with parallax (desktop only) */}
      <div className="hidden md:block">
        <FloatingIcons springX={springX} springY={springY} />
      </div>

      {/* Top vignette */}
      <div
        className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(2,6,23,0.5), transparent)",
        }}
      />

      {/* Bottom vignette */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(2,6,23,0.8), transparent)",
        }}
      />

      {/* ── Main Content ── */}
      <div className="relative z-10 text-center flex flex-col items-center px-4 md:px-8">
        {/* MCP Core Animation */}
        <MCPCore />

        {/* Title with metallic gradient + shimmer */}
        <ShimmerTitle text="ELMS" />

        {/* Subtitle */}
        <motion.p
          className="mt-2 md:mt-4 lg:mt-5 text-xs md:text-sm lg:text-lg xl:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-light tracking-wide"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          European Logistics Management System
        </motion.p>

        <motion.p
          className="mt-1 text-[10px] md:text-xs lg:text-sm text-slate-500 max-w-xl mx-auto tracking-wider"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.5 }}
        >
          AI-Powered Infrastructure for Cross-Border Commerce
        </motion.p>

        {/* Divider line */}
        <motion.div
          className="mt-4 md:mt-6 lg:mt-8 w-12 md:w-16 h-px mx-auto"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(52,211,153,0.4), transparent)",
          }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.6 }}
        />

        {/* Glass Badges */}
        <motion.div
          className="mt-4 md:mt-6 lg:mt-8 flex items-center gap-2 md:gap-3 justify-center flex-wrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          <GlassBadge icon="🇪🇺" text="EU Compliant" delay={1.5} />
          <GlassBadge icon="🤖" text="AI-Empowered" delay={1.65} />
          <GlassBadge icon="🔗" text="MCP Ready" delay={1.8} pulse />
        </motion.div>
      </div>

      {/* ── Bottom Bar ── */}
      <motion.div
        className="absolute bottom-2 sm:bottom-3 md:bottom-6 left-0 right-0 flex items-center justify-center gap-3 md:gap-6 text-[10px] md:text-xs text-slate-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.0, duration: 0.5 }}
      >
        <a
          href="https://atom.motaiot.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-medium tracking-wider text-blue-500 hover:text-blue-400 transition-colors"
        >
          <Image
            src="/logos/mota-icon-v2.webp"
            alt="MOTA TechLink"
            width={16}
            height={16}
            className="rounded-sm"
          />
          MOTA TechLink
        </a>
        <span className="w-px h-3 bg-slate-600 " />
        <span className="tracking-wider">February 2026</span>
      </motion.div>
    </div>
  );
}
