"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface BionicContextType {
  isBionic: boolean;
  toggleBionic: () => void;
}

const BionicContext = createContext<BionicContextType | undefined>(undefined);

export function BionicProvider({ children }: { children: React.ReactNode }) {
  // 默认关闭
  const [isBionic, setIsBionic] = useState(false);

  // 可选：从 localStorage 读取用户偏好
  useEffect(() => {
    const saved = localStorage.getItem("bionic-reading-mode");
    if (saved) {
      setIsBionic(JSON.parse(saved));
    }
  }, []);

  const toggleBionic = () => {
    setIsBionic((prev) => {
      const newValue = !prev;
      localStorage.setItem("bionic-reading-mode", JSON.stringify(newValue));
      return newValue;
    });
  };

  return (
    <BionicContext.Provider value={{ isBionic, toggleBionic }}>
      {children}
    </BionicContext.Provider>
  );
}

export function useBionic() {
  const context = useContext(BionicContext);
  if (context === undefined) {
    throw new Error("useBionic must be used within a BionicProvider");
  }
  return context;
}