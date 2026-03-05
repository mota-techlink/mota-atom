// src/config/pitch-decks.ts
// Static registry for pitch deck metadata.
// No fs/path — safe for Cloudflare Pages / Edge Runtime.
//
// Each deck lives in content/pitch-decks/<slug>/ with a meta.json.
// To add a new deck:
//   1. Create content/pitch-decks/<slug>/meta.json + deck.tsx + slides
//   2. Import the meta.json below and spread it into PITCH_DECK_REGISTRY
//   3. Add a case in src/app/[locale]/pitch-deck/[slug]/pitch-deck-viewer.tsx

import elmsMeta from "@content/pitch-decks/elms-logistics/meta.json";
import aiWeb3Meta from "@content/pitch-decks/ai-web3-logistics/meta.json";
import aiFamilyBizMeta from "@content/pitch-decks/ai-family-biz/meta.json";

export interface PitchDeckMeta {
  title: string;
  slug: string;
  description: string;
  author: string;
  date: string;
  status: "published" | "draft" | "archived";
  previewSlides: number;
  defaultTransition: "fade" | "slide" | "zoom" | "flip";
  tags: string[];
  coverImage?: string;
}

/**
 * All available pitch decks.
 * Key = slug used in the URL (/pitch-deck/[slug]).
 * Automatically populated from each deck's meta.json.
 */
export const PITCH_DECK_REGISTRY: Record<string, PitchDeckMeta> = Object.fromEntries(
  [elmsMeta, aiWeb3Meta, aiFamilyBizMeta].map((m) => [m.slug, m as PitchDeckMeta])
);

/**
 * Helper: get all decks as an array, sorted by date (newest first).
 */
export function getAllPitchDecks(): PitchDeckMeta[] {
  return Object.values(PITCH_DECK_REGISTRY).sort((a, b) =>
    (b.date || "").localeCompare(a.date || "")
  );
}
