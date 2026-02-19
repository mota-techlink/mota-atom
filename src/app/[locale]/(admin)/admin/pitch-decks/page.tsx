import React from "react";
import { Link } from "@/navigation";
import { getLocale } from "next-intl/server";
import { getAllPitchDecks } from "@/config/pitch-decks";
import {
  Presentation,
  ExternalLink,
  Calendar,
  Tag,
  Eye,
} from "lucide-react";

const statusStyles: Record<string, string> = {
  published: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  draft: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  archived: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
};

export default async function PitchDecksAdminPage() {
  const locale = await getLocale();
  const decks = getAllPitchDecks();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Presentation className="w-6 h-6" />
            Pitch Decks
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage and preview pitch deck presentations
          </p>
        </div>
      </div>

      {/* Deck Grid */}
      {decks.length === 0 ? (
        <div className="text-center py-16 text-slate-500 dark:text-slate-400">
          <Presentation className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No pitch decks found.</p>
          <p className="text-sm mt-1">
            Create a folder in <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">content/pitch-decks/</code> with a <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">meta.json</code> file.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decks.map((deck) => (
            <div
              key={deck.slug}
              className="group rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Card header with gradient preview */}
              <div className="h-32 bg-linear-to-br from-blue-900 via-blue-800 to-indigo-900 relative flex items-center justify-center">
                <Presentation className="w-12 h-12 text-white/30" />
                {/* Status badge */}
                <span
                  className={`absolute top-3 right-3 text-xs font-medium px-2 py-0.5 rounded-full ${statusStyles[deck.status] || statusStyles.draft}`}
                >
                  {deck.status}
                </span>
              </div>

              {/* Card body */}
              <div className="p-5">
                <h3 className="font-semibold text-slate-900 dark:text-white text-lg mb-1">
                  {deck.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">
                  {deck.description}
                </p>

                {/* Meta info */}
                <div className="flex items-center gap-4 text-xs text-slate-400 dark:text-slate-500 mb-4">
                  {deck.date && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {deck.date}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {deck.previewSlides} preview slides
                  </span>
                </div>

                {/* Tags */}
                {deck.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {deck.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                      >
                        <Tag className="w-2.5 h-2.5" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Action */}
                <Link
                  href={`/pitch-deck/${deck.slug}`}
                  target="_blank"
                  className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open Presentation
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
