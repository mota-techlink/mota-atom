import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { PitchDeckViewer } from "./pitch-deck-viewer";
import { PITCH_DECK_REGISTRY } from "@/config/pitch-decks";

interface PageProps {
  params: Promise<{ slug: string; locale: string }>;
}

export default async function PitchDeckPage({ params }: PageProps) {
  const { slug } = await params;

  // Check if deck exists in static registry
  const meta = PITCH_DECK_REGISTRY[slug];
  if (!meta) {
    notFound();
  }

  // Check authentication — allow public preview but restrict full access
  let isAuthenticated = false;
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      if (profile && (profile.role === "admin" || profile.role === "staff")) {
        isAuthenticated = true;
      }
    }
  } catch {
    // Not authenticated
  }

  return (
    <PitchDeckViewer
      slug={slug}
      meta={meta}
      isAuthenticated={isAuthenticated}
    />
  );
}

// Generate static params for known decks
export function generateStaticParams() {
  return Object.keys(PITCH_DECK_REGISTRY).map((slug) => ({ slug }));
}
