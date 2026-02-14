import React from "react";

export default function PitchDeckLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Full screen layout — no header, no footer, no sidebar
  return (
    <div className="w-screen h-screen overflow-hidden bg-slate-950">
      {children}
    </div>
  );
}
