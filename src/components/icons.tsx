// src/components/icons.tsx
import { 
  Wallet, 
  Layers, 
  Cpu, 
  Bot, 
  Blocks, 
  Glasses, 
  Zap,
  Globe,
  LayoutDashboard
} from "lucide-react";

export const Icons = {
  wallet: Wallet,
  layers: Layers,
  cpu: Cpu,
  bot: Bot,
  blocks: Blocks,
  glasses: Glasses,
  zap: Zap,
  globe: Globe,
  dashboard: LayoutDashboard,
};

export type IconKey = keyof typeof Icons;