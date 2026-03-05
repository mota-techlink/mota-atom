"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useContent } from "./useContent";

/* ─── Mini SVG Trend Chart ─── */
function TrendChart({ data }: { data: typeof import("./locale/en.json")["slide5"]["revenueTrend"] }) {
  const maxVal = Math.max(...data.revenue, ...data.expense);
  const w = 280;
  const h = 120;
  const pad = 20;
  const chartW = w - pad * 2;
  const chartH = h - pad * 2;

  const toPoint = (vals: number[]) =>
    vals.map((v, i) => `${pad + (i / (vals.length - 1)) * chartW},${pad + chartH - (v / maxVal) * chartH}`).join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto">
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((r) => (
        <line key={r} x1={pad} y1={pad + chartH * (1 - r)} x2={w - pad} y2={pad + chartH * (1 - r)} stroke="rgba(196,168,130,0.1)" strokeWidth="0.5" />
      ))}
      {/* Revenue line */}
      <motion.polyline
        points={toPoint(data.revenue)}
        fill="none"
        stroke="#22C55E"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
      />
      {/* Expense line */}
      <motion.polyline
        points={toPoint(data.expense)}
        fill="none"
        stroke="#EF4444"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="4 3"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
      />
      {/* Month labels */}
      {data.months.map((m, i) => (
        <text key={m} x={pad + (i / (data.months.length - 1)) * chartW} y={h - 2} textAnchor="middle" fill="rgba(196,168,130,0.5)" fontSize="8">{m}</text>
      ))}
      {/* Legend */}
      <circle cx={pad} cy={8} r={3} fill="#22C55E" />
      <text x={pad + 6} y={11} fill="rgba(196,168,130,0.6)" fontSize="7">{data.revenueLabel}</text>
      <circle cx={pad + 50} cy={8} r={3} fill="#EF4444" />
      <text x={pad + 56} y={11} fill="rgba(196,168,130,0.6)" fontSize="7">{data.expenseLabel}</text>
    </svg>
  );
}

/* ─── Mini SVG Pie Chart ─── */
function PieChart({ data }: { data: typeof import("./locale/en.json")["slide5"]["warrantyPie"] }) {
  const total = data.segments.reduce((s, seg) => s + seg.value, 0);
  let cumOffset = 0;
  const radius = 40;
  const size = 100;

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-auto max-w-[120px] mx-auto">
      {data.segments.map((seg, i) => {
        const fraction = seg.value / total;
        const dashLen = 2 * Math.PI * radius * fraction;
        const dashTotal = 2 * Math.PI * radius;
        const offset = cumOffset;
        cumOffset += dashLen;
        return (
          <motion.circle
            key={i}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={seg.color}
            strokeWidth="16"
            strokeDasharray={`${dashLen} ${dashTotal - dashLen}`}
            strokeDashoffset={-offset}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 + i * 0.2, duration: 0.5 }}
          />
        );
      })}
      <text x={size / 2} y={size / 2 - 3} textAnchor="middle" fill="rgba(196,168,130,0.8)" fontSize="12" fontWeight="bold">{data.segments[0].value}%</text>
      <text x={size / 2} y={size / 2 + 9} textAnchor="middle" fill="rgba(196,168,130,0.5)" fontSize="6">{data.segments[0].label}</text>
    </svg>
  );
}

/* ─── Mini SVG Bar Chart ─── */
function BarChart({ data }: { data: typeof import("./locale/en.json")["slide5"]["occupancyBar"] }) {
  const maxVal = 100;
  const barW = 14;
  const gap = 4;
  const w = data.buildings.length * (barW + gap);
  const h = 100;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto">
      {data.rates.map((rate, i) => {
        const barH = (rate / maxVal) * 70;
        const x = i * (barW + gap);
        const color = rate >= 90 ? "#22C55E" : rate >= 80 ? "#F59E0B" : "#EF4444";
        return (
          <g key={i}>
            <motion.rect
              x={x}
              y={h - 18 - barH}
              width={barW}
              height={barH}
              rx={3}
              fill={color}
              fillOpacity={0.7}
              initial={{ height: 0, y: h - 18 }}
              animate={{ height: barH, y: h - 18 - barH }}
              transition={{ delay: 0.3 + i * 0.05, duration: 0.5 }}
            />
            <text x={x + barW / 2} y={h - 18 - barH - 4} textAnchor="middle" fill="rgba(196,168,130,0.6)" fontSize="6">{rate}%</text>
            <text x={x + barW / 2} y={h - 5} textAnchor="middle" fill="rgba(196,168,130,0.4)" fontSize="6">{data.buildings[i]}</text>
          </g>
        );
      })}
    </svg>
  );
}

/* ─── Drill-down popup (large fonts) ─── */
function DrillDownPopup({
  data,
  onClose,
}: {
  data: typeof import("./locale/en.json")["slide5"]["drillDown"];
  onClose: () => void;
}) {
  const c = data.case;
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
        <button onClick={onClose} className="absolute top-4 right-4 text-amber-400/60 hover:text-amber-300 text-2xl">✕</button>
        <h3 className="text-xl font-bold text-amber-100 mb-2">{data.title}</h3>
        <div className="flex flex-wrap gap-3 mb-4">
          <span className="px-3 py-1 rounded-full bg-amber-800/30 text-base text-amber-200 font-mono">{c.id}</span>
          <span className="px-3 py-1 rounded-full bg-amber-600/20 text-base text-amber-300">{c.status}</span>
        </div>
        <h4 className="text-lg font-semibold text-amber-100 mb-3">{c.title}</h4>
        <div className="grid grid-cols-2 gap-3 mb-4 text-base">
          <div className="text-amber-300/60">Assignee: <span className="text-amber-100/80">{c.assignee}</span></div>
          <div className="text-amber-300/60">Cost: <span className="text-amber-100/80">{c.cost}</span></div>
          <div className="text-amber-300/60 col-span-2">Timeline: <span className="text-amber-100/80">{c.timeline}</span></div>
        </div>
        <div className="border-t border-amber-800/30 pt-3">
          <h5 className="text-base font-semibold text-amber-200 mb-2">Event Timeline</h5>
          <ul className="space-y-2">
            {c.history.map((h, i) => (
              <motion.li
                key={i}
                className="flex items-start gap-2 text-base text-amber-100/70"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.1 }}
              >
                <span className="mt-1.5 w-2 h-2 rounded-full bg-amber-500/60 shrink-0" />
                <span>{h}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SLIDE 5 — Executive Command Dashboard
   ═══════════════════════════════════════════════════════════ */
export function ExecutiveDashboardSlide() {
  const c = useContent().slide5;
  const [showDrill, setShowDrill] = useState(false);

  const priorityColors: Record<string, string> = {
    high: "text-red-400 border-red-800/40 bg-red-900/15",
    medium: "text-amber-400 border-amber-700/40 bg-amber-900/15",
    low: "text-green-400 border-green-800/40 bg-green-900/15",
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center overflow-hidden bg-gradient-to-br from-[#1a0f08] via-[#2C1810] to-[#1a0f08] px-3 py-4">
      {/* Badge */}
      <motion.div
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-900/30 border border-amber-700/40 text-amber-300/80 text-xs font-mono tracking-widest uppercase mb-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        {c.badge}
      </motion.div>

      {/* Title */}
      <motion.h2
        className="text-2xl sm:text-3xl font-black text-center mb-1"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <span className="text-amber-100/90">{c.title.replace(c.titleHighlight, "")}</span>
        <span className="bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 bg-clip-text text-transparent">{c.titleHighlight}</span>
      </motion.h2>
      <motion.p className="text-xs text-amber-100/50 mb-3 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
        {c.subtitle}
      </motion.p>

      {/* Drill hint */}
      <motion.p
        className="text-xs text-amber-400/50 mb-3"
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        {c.drillHint}
      </motion.p>

      {/* ─── Dashboard Grid ─── */}
      <div className="relative z-10 w-full max-w-5xl grid grid-cols-2 lg:grid-cols-4 gap-3 flex-1 min-h-0">

        {/* Revenue Trend */}
        <motion.div
          className="col-span-2 rounded-xl bg-amber-950/25 border border-amber-700/25 p-3 cursor-pointer hover:border-amber-500/40 transition-colors"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.01 }}
          onClick={() => setShowDrill(true)}
        >
          <h4 className="text-sm font-semibold text-amber-200/80 mb-2">{c.revenueTrend.title}</h4>
          <TrendChart data={c.revenueTrend} />
        </motion.div>

        {/* Warranty Pie */}
        <motion.div
          className="rounded-xl bg-amber-950/25 border border-amber-700/25 p-3 cursor-pointer hover:border-amber-500/40 transition-colors"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
          onClick={() => setShowDrill(true)}
        >
          <h4 className="text-sm font-semibold text-amber-200/80 mb-2">{c.warrantyPie.title}</h4>
          <PieChart data={c.warrantyPie} />
          <div className="flex flex-wrap gap-2 mt-2 justify-center">
            {c.warrantyPie.segments.map((seg) => (
              <div key={seg.label} className="flex items-center gap-1 text-[10px] text-amber-300/50">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: seg.color }} />
                {seg.label}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Property Map */}
        <motion.div
          className="rounded-xl bg-amber-950/25 border border-amber-700/25 p-3 cursor-pointer hover:border-amber-500/40 transition-colors"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          whileHover={{ scale: 1.02 }}
          onClick={() => setShowDrill(true)}
        >
          <h4 className="text-sm font-semibold text-amber-200/80 mb-2">{c.propertyMap.title}</h4>
          <div className="text-3xl font-black text-amber-100/90 mb-1">{c.propertyMap.count}</div>
          <div className="space-y-1">
            {c.propertyMap.locations.map((loc) => (
              <div key={loc} className="text-xs text-amber-300/50 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500/40" />
                {loc}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Occupancy Bar */}
        <motion.div
          className="col-span-2 rounded-xl bg-amber-950/25 border border-amber-700/25 p-3 cursor-pointer hover:border-amber-500/40 transition-colors"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.01 }}
          onClick={() => setShowDrill(true)}
        >
          <h4 className="text-sm font-semibold text-amber-200/80 mb-2">{c.occupancyBar.title}</h4>
          <BarChart data={c.occupancyBar} />
        </motion.div>

        {/* Todo List */}
        <motion.div
          className="col-span-2 rounded-xl bg-amber-950/25 border border-amber-700/25 p-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <h4 className="text-sm font-semibold text-amber-200/80 mb-2">{c.todoList.title}</h4>
          <div className="space-y-2">
            {c.todoList.items.map((item, i) => (
              <motion.div
                key={i}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${priorityColors[item.priority]} cursor-pointer`}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.08 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => setShowDrill(true)}
              >
                <span className="w-2 h-2 rounded-full bg-current shrink-0" />
                <span className="text-sm">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Drill-down popup */}
      <AnimatePresence>
        {showDrill && (
          <DrillDownPopup data={c.drillDown} onClose={() => setShowDrill(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
