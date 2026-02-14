// src/config/pitch-decks.ts
// Static registry for pitch deck metadata.
// No fs/path — safe for Cloudflare Pages / Edge Runtime.
// When adding a new deck, add an entry here AND create the corresponding
// deck component in src/components/pitch-deck/decks/.

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
 */
export const PITCH_DECK_REGISTRY: Record<string, PitchDeckMeta> = {
  "elms-logistics": {
    title: "ELMS - European Logistics Management System",
    slug: "elms-logistics",
    description:
      "AI-Powered Logistics Infrastructure for European Cross-Border Commerce",
    author: "MOTA TechLink",
    date: "2026-02-14",
    status: "published",
    previewSlides: 3,
    defaultTransition: "slide",
    tags: ["logistics", "AI", "MCP", "europe", "cross-border"],
    coverImage: "/images/pitch-decks/elms-cover.png",
  },
};

/**
 * Helper: get all decks as an array, sorted by date (newest first).
 */
export function getAllPitchDecks(): PitchDeckMeta[] {
  return Object.values(PITCH_DECK_REGISTRY).sort((a, b) =>
    (b.date || "").localeCompare(a.date || "")
  );
}
