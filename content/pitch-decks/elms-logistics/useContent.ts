"use client";

import { useDeckLocale } from "@/components/pitch-deck";
import en from "./locale/en.json";
import zh from "./locale/zh.json";
import ja from "./locale/ja.json";
import ar from "./locale/ar.json";

const contentMap: Record<string, typeof en> = { en, zh, ja, ar };

export function useContent() {
  const { deckLocale } = useDeckLocale();
  return contentMap[deckLocale] ?? en;
}
