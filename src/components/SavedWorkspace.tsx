import React, { useState } from "react";
import {
  Bookmark,
  Search,
  Copy,
  Check,
  Download,
  Trash2,
  ExternalLink,
  Tag,
  ArrowRight,
  FileSpreadsheet,
} from "lucide-react";
import { GeneratedListing } from "../types";
import { copyToClipboard, exportListingToCSV, triggerConfetti } from "../utils/etsyHelpers";

interface SavedWorkspaceProps {
  savedListings: GeneratedListing[];
  onLoadListing: (listing: GeneratedListing) => void;
  onDeleteListing: (id: string) => void;
  onClearAll: () => void;
}

export const SavedWorkspace: React.FC<SavedWorkspaceProps> = ({
  savedListings,
  onLoadListing,
  onDeleteListing,
  onClearAll,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyFeedback = (key: string, text: string) => {
    copyToClipboard(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const filtered = savedListings.filter(
    (l) =>
      l.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExportAll = () => {
    if (savedListings.length === 0) return;
    savedListings.forEach((listing) => {
      exportListingToCSV(listing);
    });
    triggerConfetti();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
            Saved Etsy Listings Workspace
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Manage your generated listings, copy 13-tag bundles in 1 click, and export Etsy-compatible CSVs for quick publishing.
          </p>
        </div>

        {savedListings.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportAll}
              className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3.5 py-2 text-xs font-bold text-stone-800 shadow-xs hover:border-[#F1641E] hover:text-[#F1641E] cursor-pointer"
            >
              <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
              <span>Export All CSVs</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (confirm("Are you sure you want to clear all saved drafts?")) {
                  onClearAll();
                }
              }}
              className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100 cursor-pointer"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Search Filter */}
      {savedListings.length > 0 && (
        <div className="mb-6 max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Search saved listings by title or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-stone-300 pl-9 pr-3 py-2 text-xs text-stone-900 focus:border-[#F1641E] focus:outline-none"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
          </div>
        </div>
      )}

      {savedListings.length === 0 ? (
        <div className="flex h-96 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-stone-200 bg-stone-50/50 p-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-200 text-stone-600 mb-3">
            <Bookmark className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-stone-900">No Saved Listings Yet</h3>
          <p className="max-w-md text-xs text-stone-500 mt-1 mb-4">
            When you generate listings in the Listing Architect, click "Save Draft" to keep them here for quick access and export.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-8 text-center text-xs text-stone-500">
          No listings match your search "{searchQuery}".
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((listing) => {
            const activeTitle =
              listing.titles[listing.selectedTitleIndex]?.title || listing.titles[0]?.title || "";
            const commaTags = listing.tags.map((t) => t.tag).join(", ");

            return (
              <div
                key={listing.id}
                className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs flex flex-col justify-between hover:border-orange-200 transition"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="rounded bg-orange-50 border border-orange-200 px-2 py-0.5 text-[10px] font-bold text-[#D94F0C]">
                      {listing.category}
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono">
                      {new Date(listing.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-stone-900 line-clamp-2 mb-2">
                    {activeTitle}
                  </h3>

                  {/* 13 Tag Pills Preview */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1">
                      <span className="font-semibold">Tags ({listing.tags.length}/13):</span>
                      <button
                        type="button"
                        onClick={() => copyFeedback(`tags-${listing.id}`, commaTags)}
                        className="text-[#F1641E] hover:underline font-bold"
                      >
                        {copiedKey === `tags-${listing.id}` ? "Copied!" : "Copy 13 Tags"}
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {listing.tags.slice(0, 5).map((t, idx) => (
                        <span
                          key={idx}
                          className="rounded bg-stone-50 border border-stone-200 px-1.5 py-0.2 text-[10px] text-stone-700"
                        >
                          {t.tag}
                        </span>
                      ))}
                      {listing.tags.length > 5 && (
                        <span className="text-[10px] text-stone-400">
                          +{listing.tags.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="rounded-xl bg-stone-50 p-2.5 text-xs text-stone-600 line-clamp-3 mb-3 border border-stone-100 font-sans">
                    {listing.description.fullFormattedText}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => onLoadListing(listing)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#F1641E] hover:text-[#D94F0C] cursor-pointer"
                  >
                    <span>Open in Architect</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => exportListingToCSV(listing)}
                      className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition"
                      title="Download CSV"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteListing(listing.id)}
                      className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                      title="Delete draft"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
