"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useContent } from "./useContent";

/* ──────────────────── Types ──────────────────── */
type SlideContent = ReturnType<typeof useContent>["slide6"];
type Expert = SlideContent["experts"][number];
type Department = SlideContent["departments"][number];
type Project = SlideContent["projects"][number];

/* ──────────────────── Staff Tooltip ──────────────────── */
function StaffBadge({ s }: { s: { icon: string; name: string; role: string } }) {
  const [hover, setHover] = useState(false);
  return (
    <span
      className="relative inline-flex cursor-default"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <span className="text-xl select-none">{s.icon}</span>
      <AnimatePresence>
        {hover && (
          <motion.span
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 whitespace-nowrap rounded-lg bg-[#2C1810] border border-amber-600/50 px-2.5 py-1.5 shadow-xl z-50 pointer-events-none"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
          >
            <span className="block text-xs font-bold text-amber-100">{s.name}</span>
            <span className="block text-[10px] text-amber-300/70">{s.role}</span>
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

/* ──────────────────── Expert Popup ──────────────────── */
function ExpertPopup({ expert, onClose }: { expert: Expert; onClose: () => void }) {
  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="relative bg-gradient-to-br from-[#2C1810] to-[#1a0f08] border border-amber-700/40 rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl max-h-[85vh] overflow-y-auto"
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-amber-400/60 hover:text-amber-300 text-2xl">✕</button>
        <div className="flex items-center gap-3 mb-5">
          <span className="text-3xl">{expert.icon}</span>
          <h3 className="text-xl sm:text-2xl font-bold text-amber-100">{expert.label}</h3>
        </div>

        {/* Expertise */}
        <div className="mb-5">
          <h4 className="text-sm font-semibold text-amber-300/80 uppercase tracking-wider mb-2">⚡ Professional Expertise</h4>
          <ul className="space-y-1.5">
            {expert.expertise.map((e: string, i: number) => (
              <li key={i} className="flex items-start gap-2 text-sm text-amber-200/80">
                <span className="text-amber-500 mt-0.5 text-xs">●</span>
                {e}
              </li>
            ))}
          </ul>
        </div>

        {/* Enterprise Knowledge */}
        <div className="mb-5 p-3 rounded-xl bg-amber-900/20 border border-amber-700/20">
          <h4 className="text-sm font-semibold text-amber-300/80 uppercase tracking-wider mb-2">🏢 Enterprise Domain Knowledge</h4>
          <p className="text-sm text-amber-200/70 leading-relaxed">{expert.enterpriseKnowledge}</p>
        </div>

        {/* Daily Training */}
        <div className="p-3 rounded-xl bg-amber-900/20 border border-amber-700/20">
          <h4 className="text-sm font-semibold text-amber-300/80 uppercase tracking-wider mb-2">🔄 Daily Data Iterative Training</h4>
          <p className="text-sm text-amber-200/70 leading-relaxed">{expert.dailyTraining}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ──────────────────── Department Popup ──────────────────── */
function DepartmentPopup({ dept, onClose }: { dept: Department; onClose: () => void }) {
  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="relative bg-gradient-to-br from-[#2C1810] to-[#1a0f08] border border-amber-700/40 rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl max-h-[85vh] overflow-y-auto"
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-amber-400/60 hover:text-amber-300 text-2xl">✕</button>
        <div className="flex items-center gap-3 mb-5">
          <span className="text-3xl">{dept.icon}</span>
          <h3 className="text-xl sm:text-2xl font-bold text-amber-100">{dept.label}</h3>
          <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300/80 border border-amber-600/30">DEPT AGENT</span>
        </div>

        {/* Historical Events */}
        <div className="mb-5">
          <h4 className="text-sm font-semibold text-amber-300/80 uppercase tracking-wider mb-2">📜 Historical Events</h4>
          <div className="space-y-2 pl-3 border-l-2 border-amber-700/30">
            {dept.historicalEvents.map((ev: string, i: number) => (
              <p key={i} className="text-sm text-amber-200/80 leading-relaxed">{ev}</p>
            ))}
          </div>
        </div>

        {/* Work Insights */}
        <div className="mb-5 p-3 rounded-xl bg-amber-900/20 border border-amber-700/20">
          <h4 className="text-sm font-semibold text-amber-300/80 uppercase tracking-wider mb-2">📊 Work Gains & Losses</h4>
          <p className="text-sm text-amber-200/70 leading-relaxed">{dept.workInsights}</p>
        </div>

        {/* External Liaison */}
        <div className="mb-5">
          <h4 className="text-sm font-semibold text-amber-300/80 uppercase tracking-wider mb-2">🤝 External Liaison</h4>
          <ul className="space-y-1.5">
            {dept.externalLiaison.map((el: string, i: number) => (
              <li key={i} className="flex items-start gap-2 text-sm text-amber-200/80">
                <span className="text-amber-500 mt-0.5 text-xs">▸</span>
                {el}
              </li>
            ))}
          </ul>
        </div>

        {/* Daily Training */}
        <div className="p-3 rounded-xl bg-amber-900/20 border border-amber-700/20">
          <h4 className="text-sm font-semibold text-amber-300/80 uppercase tracking-wider mb-2">🔄 Daily Business Iterative Training</h4>
          <p className="text-sm text-amber-200/70 leading-relaxed">{dept.dailyTraining}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ──────────────────── Project Popup (with staff) ──────────────────── */
function ProjectPopup({ project, onClose }: { project: Project; onClose: () => void }) {
  /* Shuffle staff for "random" display */
  const shuffled = [...(project.staff ?? [])].sort(() => Math.random() - 0.5);

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="relative bg-gradient-to-br from-[#2C1810] to-[#1a0f08] border border-amber-700/40 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl max-h-[85vh] overflow-y-auto"
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-amber-400/60 hover:text-amber-300 text-2xl">✕</button>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: project.color }} />
          <h3 className="text-2xl font-bold text-amber-100">{project.name}</h3>
        </div>
        <p className="text-base text-amber-200/80 leading-relaxed mb-5">{project.desc}</p>

        {/* Staff icons */}
        {shuffled.length > 0 && (
          <div className="mb-5 p-3 rounded-xl bg-amber-900/15 border border-amber-700/20">
            <h4 className="text-xs font-semibold text-amber-300/60 uppercase tracking-wider mb-3">👥 Team Members</h4>
            <div className="flex flex-wrap gap-3">{shuffled.map((s, i) => <StaffBadge key={i} s={s} />)}</div>
          </div>
        )}

        <div className="border-t border-amber-800/30 pt-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🤖</span>
            <h4 className="text-lg font-semibold text-amber-200">{project.roleAgent}</h4>
          </div>
          <p className="text-sm text-amber-100/70 leading-relaxed">{project.retention}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SLIDE 6 — Agent Matrix (Dept × Expert)
   ═══════════════════════════════════════════════════════════ */
export function AgentMatrixSlide() {
  const c = useContent().slide6;
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);

  /* Build lookup: dept-expert → project */
  const matrixLookup = new Map<string, Project>();
  c.projects.forEach((p) => matrixLookup.set(`${p.dept}-${p.expert}`, p));

  return (
    <div className="relative w-full h-full flex flex-col items-center overflow-hidden bg-gradient-to-br from-[#1a0f08] via-[#2C1810] to-[#1a0f08] px-3 py-3">
      {/* Glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(196,168,130,0.04) 0%, transparent 70%)" }} />

      {/* Badge */}
      <motion.div
        className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-900/30 border border-amber-700/40 text-amber-300/80 text-[10px] font-mono tracking-widest uppercase mb-1.5"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
        {c.badge}
      </motion.div>

      {/* Title */}
      <motion.h2
        className="text-xl sm:text-2xl font-black text-center mb-0.5"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <span className="text-amber-100/90">{c.title.replace(c.titleHighlight, "")}</span>
        <span className="bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 bg-clip-text text-transparent">{c.titleHighlight}</span>
      </motion.h2>
      <motion.p className="text-[10px] text-amber-100/50 mb-2 text-center max-w-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
        {c.subtitle}
      </motion.p>

      {/* ─── Stats Bar ─── */}
      <motion.div
        className="flex items-center justify-center gap-4 sm:gap-6 mb-2 w-full max-w-3xl"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        {c.stats.map((s: { value: string; label: string }, i: number) => (
          <div key={i} className="flex flex-col items-center">
            <span className="text-lg sm:text-xl font-black bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent">{s.value}</span>
            <span className="text-[9px] text-amber-400/50 font-medium">{s.label}</span>
          </div>
        ))}
      </motion.div>

      {/* ─── Constitution Wrapper ─── */}
      <motion.div
        className="relative z-10 w-full max-w-5xl rounded-2xl border-2 border-dashed border-amber-600/25 p-2 sm:p-3 flex-1 min-h-0 flex flex-col"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        {/* Constitution header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-1 mb-2 px-2">
          <div className="text-xs font-bold text-amber-300/70">{c.constitution.title}</div>
          <div className="flex flex-wrap gap-3 text-[10px] text-amber-400/60">
            <span>{c.constitution.gmAgent}</span>
            <span>{c.constitution.schedulerAgent}</span>
          </div>
        </div>

        {/* ─── Matrix Grid ─── */}
        <div className="flex-1 overflow-auto">
          <div className="min-w-[560px]">
            {/* Header row: experts */}
            <div className="grid gap-1" style={{ gridTemplateColumns: `140px repeat(${c.experts.length}, 1fr)` }}>
              <div className="flex items-center justify-center text-[9px] text-amber-500/40 font-mono">DEPT ↓ × EXPERT →</div>
              {c.experts.map((exp, i) => (
                <motion.div
                  key={exp.id}
                  className="text-center py-2 px-1 rounded-lg bg-amber-900/25 border border-amber-700/25 cursor-pointer hover:bg-amber-800/30 hover:border-amber-600/40 transition-colors"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedExpert(exp)}
                >
                  <div className="text-xl mb-0.5">{exp.icon}</div>
                  <div className="text-[10px] sm:text-xs font-semibold text-amber-200/80 leading-tight">{exp.label}</div>
                  <div className="text-[8px] text-amber-400/40 mt-0.5">click for details</div>
                </motion.div>
              ))}
            </div>

            {/* Body rows: departments */}
            {c.departments.map((dept, dIdx) => (
              <div
                key={dept.id}
                className="grid gap-1 mt-1"
                style={{ gridTemplateColumns: `140px repeat(${c.experts.length}, 1fr)` }}
              >
                {/* Row header — ENLARGED & CLICKABLE */}
                <motion.div
                  className="flex items-center gap-2 py-2 px-3 rounded-lg bg-amber-900/25 border border-amber-700/25 cursor-pointer hover:bg-amber-800/30 hover:border-amber-600/40 transition-colors"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + dIdx * 0.1 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedDept(dept)}
                >
                  <span className="text-2xl">{dept.icon}</span>
                  <div className="flex flex-col">
                    <span className="text-xs sm:text-sm font-bold text-amber-200/90 leading-tight">{dept.label}</span>
                    <span className="text-[8px] text-amber-400/40">Agent · click</span>
                  </div>
                </motion.div>

                {/* Cells: one per expert */}
                {c.experts.map((exp) => {
                  const proj = matrixLookup.get(`${dept.id}-${exp.id}`);
                  if (!proj) {
                    return (
                      <div key={exp.id} className="rounded-lg bg-amber-950/10 border border-amber-800/10 min-h-[52px] flex items-center justify-center">
                        <span className="text-amber-800/20 text-lg">—</span>
                      </div>
                    );
                  }
                  const staffIcons = (proj.staff ?? []).slice(0, 3);
                  return (
                    <motion.div
                      key={exp.id}
                      className="rounded-lg border cursor-pointer flex flex-col items-center justify-center p-1.5 min-h-[52px] hover:scale-[1.04] transition-transform gap-0.5"
                      style={{
                        backgroundColor: `${proj.color}15`,
                        borderColor: `${proj.color}40`,
                      }}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + dIdx * 0.08 + c.experts.indexOf(exp) * 0.05 }}
                      whileHover={{ borderColor: proj.color }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedProject(proj)}
                    >
                      <span className="text-[9px] sm:text-[11px] font-bold text-center leading-tight" style={{ color: proj.color }}>
                        {proj.name}
                      </span>
                      {/* Inline staff preview */}
                      {staffIcons.length > 0 && (
                        <div className="flex -space-x-1 mt-0.5">
                          {staffIcons.map((s, si) => (
                            <span key={si} className="text-[10px] select-none">{s.icon}</span>
                          ))}
                          {(proj.staff ?? []).length > 3 && (
                            <span className="text-[8px] text-amber-400/50 ml-1">+{(proj.staff ?? []).length - 3}</span>
                          )}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Constitution footer */}
        <motion.div
          className="mt-2 flex flex-col sm:flex-row items-center justify-between gap-2 py-2 px-3 rounded-lg bg-amber-900/15 border border-amber-700/20"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <p className="text-xs sm:text-sm text-amber-300/70 font-medium">{c.constitution.roleRetention}</p>
          <p className="text-[9px] sm:text-[10px] text-amber-200/40 max-w-xs text-right">{c.constitution.desc}</p>
        </motion.div>
      </motion.div>

      {/* ─── Popups ─── */}
      <AnimatePresence>
        {selectedProject && <ProjectPopup project={selectedProject} onClose={() => setSelectedProject(null)} />}
      </AnimatePresence>
      <AnimatePresence>
        {selectedExpert && <ExpertPopup expert={selectedExpert} onClose={() => setSelectedExpert(null)} />}
      </AnimatePresence>
      <AnimatePresence>
        {selectedDept && <DepartmentPopup dept={selectedDept} onClose={() => setSelectedDept(null)} />}
      </AnimatePresence>
    </div>
  );
}
