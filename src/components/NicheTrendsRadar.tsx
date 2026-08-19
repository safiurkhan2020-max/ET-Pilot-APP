import React, { useState } from "react";
import {
  TrendingUp,
  Calendar,
  Sparkles,
  Flame,
  Layers,
  Copy,
  Check,
  RefreshCw,
  Gift,
  ArrowUpRight,
} from "lucide-react";
import { NicheTrendsResult } from "../types";
import { INITIAL_TRENDS } from "../data/mockData";
import { copyToClipboard, triggerConfetti } from "../utils/etsyHelpers";

interface NicheTrendsRadarProps {
  onUseTrendTags?: (tags: string[]) => void;
}

export const NicheTrendsRadar: React.FC<NicheTrendsRadarProps> = ({ onUseTrendTags }) => {
  const [trends, setTrends] = useState<NicheTrendsResult>(INITIAL_TRENDS);
  const [selectedCategory, setSelectedCategory] = useState("All Top Categories");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyFeedback = (key: string, text: string) => {
    copyToClipboard(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleRefreshTrends = async (cat?: string) => {
    const categoryFilter = cat || selectedCategory;
    setIsLoading(true);

    try {
      const res = await fetch("/api/niche-trends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryFilter }),
      });

      if (!res.ok) throw new Error("Failed to fetch trends");
      const data: NicheTrendsResult = await res.json();
      setTrends(data);
      triggerConfetti();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const categories = [
    "All Top Categories",
    "Jewelry & Personalized Gifts",
    "Home & Living / Decor",
    "Digital Downloads & Planners",
    "Apparel & Accessories",
    "Weddings & Bridal Party",
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
              Etsy Trend Radar & Seasonality Calendar
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-700">
              <Flame className="h-3.5 w-3.5 text-red-600" /> LIVE FORECAST
            </span>
          </div>
          <p className="text-sm text-stone-600 mt-1">
            Real-time Etsy shopper search velocity, breakout sub-niches, winning product blueprints, and strategic gifting timelines.
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleRefreshTrends()}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3.5 py-2 text-xs font-bold text-stone-800 shadow-xs hover:border-[#F1641E] hover:text-[#F1641E] transition cursor-pointer"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
          <span>Refresh AI Trend Analysis</span>
        </button>
      </div>

      {/* Category Pills Filter */}
      <div className="mb-8 flex flex-wrap items-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => {
              setSelectedCategory(cat);
              handleRefreshTrends(cat);
            }}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
              selectedCategory === cat
                ? "bg-stone-900 text-white shadow-xs"
                : "bg-white border border-stone-200 text-stone-700 hover:border-stone-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Trends Banner */}
      <div className="mb-8 rounded-2xl border border-orange-200/80 bg-gradient-to-r from-orange-50/60 via-amber-50/40 to-stone-50 p-6 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D94F0C] mb-1">
          <Sparkles className="h-4 w-4 text-[#F1641E]" />
          <span>Current Market Pulse</span>
        </div>
        <h2 className="text-lg font-bold text-stone-900 sm:text-xl">
          {trends.currentSeasonHeadline}
        </h2>
        <p className="text-xs text-stone-700 mt-2 leading-relaxed max-w-4xl font-medium">
          {trends.marketTrendSummary}
        </p>
      </div>

      {/* Breakout Niches Grid */}
      <div className="mb-10">
        <h3 className="text-base font-bold text-stone-900 mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-[#F1641E]" />
          <span>Breakout High-Demand Niches ({trends.trendingNiches.length})</span>
        </h3>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {trends.trendingNiches.map((niche, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs flex flex-col justify-between hover:border-orange-300 transition"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                      {niche.category}
                    </span>
                    <h4 className="text-base font-bold text-stone-900 mt-0.5">{niche.nicheName}</h4>
                  </div>
                  <span className="shrink-0 rounded-full bg-red-50 border border-red-200 px-2.5 py-1 text-[11px] font-bold text-red-700">
                    {niche.growthRate}
                  </span>
                </div>

                <div className="text-xs text-stone-600 mb-3">
                  <span className="font-semibold text-stone-800">Target Buyer: </span>
                  {niche.buyerPersona}
                </div>

                {/* Winning Product Ideas */}
                <div className="mb-3 rounded-xl bg-stone-50 p-3 border border-stone-100">
                  <span className="text-[11px] font-bold text-stone-900 block mb-1.5">
                    🚀 Proven Winning Product Formats:
                  </span>
                  <ul className="space-y-1 text-xs text-stone-700">
                    {niche.winningProductIdeas.map((idea, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="text-[#F1641E] font-bold">•</span>
                        <span>{idea}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Suggested Tags Preview */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold text-stone-700">
                      Starter Tag Bundle ({niche.suggested13TagsPreview.length} tags):
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        copyFeedback(`trend-tags-${idx}`, niche.suggested13TagsPreview.join(", "))
                      }
                      className="text-[11px] font-semibold text-[#F1641E] hover:text-[#D94F0C] flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === `trend-tags-${idx}` ? (
                        <Check className="h-3 w-3 text-emerald-600" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                      <span>Copy Tags</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {niche.suggested13TagsPreview.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="rounded-md border border-stone-200 bg-stone-50 px-2 py-0.5 text-[10px] font-medium text-stone-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="text-stone-500 font-medium">Sweetspot Price:</span>
                <span className="font-bold text-stone-900 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded px-2 py-0.5">
                  {niche.averagePriceRange}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Seasonal Gifting Timeline & Playbook */}
      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-4 border-b border-stone-100 pb-3">
          <Calendar className="h-5 w-5 text-indigo-600" />
          <div>
            <h3 className="text-base font-bold text-stone-900">
              Etsy Seasonal Gifting Calendar & Timeline Playbook
            </h3>
            <p className="text-xs text-stone-500">
              Timing is everything on Etsy. Launch listings 45–60 days before search volume peaks.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {trends.seasonalGiftingCalendar.map((season, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-stone-200 bg-stone-50/60 p-4 text-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1.5 text-stone-900 font-bold text-sm mb-1">
                  <Gift className="h-4 w-4 text-[#F1641E]" />
                  <span>{season.occasion}</span>
                </div>

                <span className="rounded bg-indigo-50 border border-indigo-200 px-2 py-0.5 text-[10px] font-bold text-indigo-700 block mb-2">
                  {season.timing}
                </span>

                <div className="mb-2">
                  <span className="font-bold text-stone-800 block text-[11px]">Top Products:</span>
                  <p className="text-stone-600 text-[11px] leading-relaxed mt-0.5">
                    {season.keyProducts}
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-stone-200/60">
                <span className="font-bold text-emerald-800 block text-[10px]">Seller Strategy:</span>
                <p className="text-stone-700 text-[11px] italic mt-0.5 leading-snug">
                  "{season.marketingTip}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
