"use client";

import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ComparisonColumn {
  header: string;
  highlight?: boolean;
  items: (string | ReactNode)[];
}

interface ComparisonTableProps {
  rows: string[]; // row labels
  columns: ComparisonColumn[];
  className?: string;
}

export function ComparisonTable({ rows, columns, className }: ComparisonTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={cn("w-full overflow-hidden rounded-xl border border-white/10", className)}
    >
      <table className="w-full text-left">
        <thead>
          <tr>
            <th className="p-4 bg-white/5 text-white/60 text-sm font-medium" />
            {columns.map((col, i) => (
              <th
                key={i}
                className={cn(
                  "p-4 text-center text-sm font-bold uppercase tracking-wider",
                  col.highlight
                    ? "bg-blue-600/30 text-blue-300"
                    : "bg-white/5 text-white/60"
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((rowLabel, rowIdx) => (
            <motion.tr
              key={rowIdx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: rowIdx * 0.1, duration: 0.3 }}
              className="border-t border-white/5"
            >
              <td className="p-4 text-sm font-medium text-white/80">{rowLabel}</td>
              {columns.map((col, colIdx) => (
                <td
                  key={colIdx}
                  className={cn(
                    "p-4 text-center text-sm",
                    col.highlight ? "bg-blue-600/10" : ""
                  )}
                >
                  {col.items[rowIdx]}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}
