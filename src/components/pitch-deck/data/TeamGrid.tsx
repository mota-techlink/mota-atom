"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface TeamMember {
  name: string;
  role: string;
  avatar?: string;
  description?: string;
}

interface TeamGridProps {
  members: TeamMember[];
  className?: string;
}

export function TeamGrid({ members, className }: TeamGridProps) {
  return (
    <div
      className={cn(
        "grid gap-6",
        members.length <= 3 && "grid-cols-3",
        members.length === 4 && "grid-cols-4",
        members.length > 4 && "grid-cols-3 lg:grid-cols-4",
        className
      )}
    >
      {members.map((member, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1, duration: 0.4 }}
          className="flex flex-col items-center text-center p-4 rounded-xl bg-white/5 border border-white/10"
        >
          {member.avatar ? (
            <img
              src={member.avatar}
              alt={member.name}
              className="w-20 h-20 rounded-full object-cover mb-3 border-2 border-white/20"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-3 text-2xl font-bold text-white/60">
              {member.name.charAt(0)}
            </div>
          )}
          <h4 className="font-semibold text-sm">{member.name}</h4>
          <p className="text-xs text-white/50 mt-0.5">{member.role}</p>
          {member.description && (
            <p className="text-xs text-white/40 mt-2 leading-relaxed">
              {member.description}
            </p>
          )}
        </motion.div>
      ))}
    </div>
  );
}
