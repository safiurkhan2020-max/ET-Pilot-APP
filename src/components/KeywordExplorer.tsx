import React, { useState } from "react";
import {
  Compass,
  Search,
  Sparkles,
  TrendingUp,
  Gift,
  Copy,
  Check,
  Zap,
  Tag,
  Star,
  RefreshCw,
  SlidersHorizontal,
} from "lucide-react";
import { KeywordResearchResult } from "../types";
import { copyToClipboard, triggerConfetti } from "../utils/etsyHelpers";

export const KeywordExplorer: React.FC = () => {
  const [seedKeyword, setSeedKeyword] = useState("birth flower necklace");
  const [category, setCategory] = useState("Jewelry & Accessories");
  const [targetSeason, setTargetSeason] = useState("Mother's Day & Spring Gifting");

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<KeywordResearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [filterOnlyTags, setFilterOnlyTags] = useState(false);

  const sampleKeywords = [
    "Birth Flower Necklace",
    "Digital Budget Planner",
    "Embroidered Pet Sweatshirt",
    "Acrylic Wedding Sign",
    "Chunky Knit Blanket",
    "Crochet Amigurumi Pattern",
  ];

  const copyFeedback = (key: string, text: string) => {
    copyToClipboard(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSearch = async (overrideKeyword?: string) => {
    const query = overrideKeyword || seedKeyword;
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/keyword-ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keyword: query,
          category,
          targetSeason,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to retrieve keyword metrics");
      }

      const data: KeywordResearchResult = await response.json();
      setResult(data);
      triggerConfetti();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error analyzing keywords");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredKeywords = result
    ? filterOnlyTags
      ? result.keywords.filter((k) => k.fitsInEtsyTag)
      : result.keywords
    : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
          Etsy Keyword & Long-Tail Explorer
        </h1>
        <p className="text-sm text-stone-600 mt-1">
          Uncover low-competition "Golden Nugget" long-tail keywords, gifting queries, and emerging aesthetic search trends with live Etsy tag validation.
        </p>

        {/* Quick Suggestion Pills */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-stone-500 mr-1">Trending Searches:</span>
          {sampleKeywords.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setSeedKeyword(item);
                handleSearch(item);
              }}
              className="rounded-full border border-stone-200 bg-white px-2.5 py-1 text-xs font-medium text-stone-700 shadow-xs hover:border-[#F1641E] hover:text-[#F1641E] cursor-pointer"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar & Filters */}
      <div className="mb-8 rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-12">
          <div className="sm:col-span-6">
            <label className="block text-xs font-semibold text-stone-800 mb-1">
              Seed Keyword / Product Focus
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. ceramic coffee mug, digital sticker, bridesmaid gift..."
                value={seedKeyword}
                onChange={(e) => setSeedKeyword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full rounded-xl border border-stone-300 pl-9 pr-3 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-[#F1641E] focus:outline-none"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label className="block text-xs font-semibold text-stone-800 mb-1">Etsy Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-xs text-stone-900 focus:border-[#F1641E] focus:outline-none"
            >
              <option value="Jewelry & Accessories">Jewelry & Accessories</option>
              <option value="Home & Living">Home & Living</option>
              <option value="Clothing & Shoes">Clothing & Shoes</option>
              <option value="Digital Downloads">Digital Downloads</option>
              <option value="Weddings & Party">Weddings & Party</option>
              <option value="Craft Supplies">Craft Supplies</option>
            </select>
          </div>

          <div className="sm:col-span-3 flex items-end">
            <button
              type="button"
              onClick={() => handleSearch()}
              disabled={isLoading || !seedKeyword.trim()}
              id="search-keywords-btn"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#F1641E] px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#D94F0C] active:scale-[0.99] disabled:opacity-50 transition cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Discovering...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Explore Keywords</span>
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs text-red-700">
            {error}
          </div>
        )}
      </div>

      {/* Results Section */}
      {result && (
        <div className="space-y-8">
          {/* Niche Overview Card */}
          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-stone-900">
                    Keyword Intelligence for: <span className="text-[#F1641E]">"{result.seedKeyword}"</span>
                  </h3>
                </div>
                <p className="text-xs text-stone-600 mt-1 max-w-2xl leading-relaxed">
                  {result.nicheOverview}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex flex-col items-center justify-center rounded-xl bg-orange-50 border border-orange-200 px-4 py-2 text-center">
                  <span className="text-xl font-bold text-[#F1641E]">{result.opportunityScore}</span>
                  <span className="text-[10px] font-semibold text-stone-500">Niche Opportunity / 100</span>
                </div>
              </div>
            </div>

            {/* Ranking Strategy Summary */}
            <div className="mt-4 rounded-xl bg-stone-50 p-3.5 border border-stone-100">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-900 mb-1">
                <Zap className="h-4 w-4 text-orange-500" />
                <span>Etsy Algorithm Top-10 Ranking Playbook:</span>
              </div>
              <p className="text-xs text-stone-700 leading-relaxed font-medium">
                {result.rankingStrategy}
              </p>
            </div>
          </div>

          {/* Keyword Opportunity Matrix */}
          <div className="rounded-2xl border border-stone-200 bg-white shadow-xs overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 p-5 border-b border-stone-100 bg-stone-50/50">
              <div>
                <h3 className="text-sm font-bold text-stone-900">
                  Long-Tail Keyword Opportunities ({filteredKeywords.length})
                </h3>
                <p className="text-xs text-stone-500">
                  Target multi-word phrases for higher conversion rates and lower advertising costs
                </p>
              </div>

              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 text-xs font-medium text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filterOnlyTags}
                    onChange={(e) => setFilterOnlyTags(e.target.checked)}
                    className="rounded text-[#F1641E] focus:ring-orange-200"
                  />
                  <span>Only show keywords fitting 20-char Etsy tag limit</span>
                </label>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-stone-200 bg-stone-100/70 text-stone-600 font-semibold">
                  <tr>
                    <th className="px-4 py-3">Search Term / Longtail</th>
                    <th className="px-4 py-3">Chars</th>
                    <th className="px-4 py-3">Search Demand</th>
                    <th className="px-4 py-3">Competition</th>
                    <th className="px-4 py-3">Opportunity</th>
                    <th className="px-4 py-3">Buyer Intent</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-800">
                  {filteredKeywords.map((kw, idx) => (
                    <tr key={idx} className="hover:bg-orange-50/20 transition">
                      <td className="px-4 py-3 font-semibold text-stone-900 flex items-center gap-2">
                        <span>{kw.term}</span>
                        {kw.opportunityTier.includes("Golden") && (
                          <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500 shrink-0" />
                        )}
                      </td>
                      <td className="px-4 py-3 font-mono">
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] ${
                            kw.fitsInEtsyTag
                              ? "bg-emerald-100 text-emerald-800 font-bold"
                              : "bg-stone-200 text-stone-600"
                          }`}
                        >
                          {kw.charCount} / 20
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-stone-700">{kw.searchVolumeTier}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            kw.competitionLevel === "Low"
                              ? "bg-emerald-100 text-emerald-800"
                              : kw.competitionLevel === "Medium"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {kw.competitionLevel}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-stone-900 text-[11px]">
                          {kw.opportunityTier}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-stone-600">{kw.buyerIntent}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => copyFeedback(`kw-${idx}`, kw.term)}
                          className="rounded-lg border border-stone-200 bg-white px-2 py-1 text-[11px] font-semibold text-stone-700 hover:border-[#F1641E] hover:text-[#F1641E] shadow-2xs transition cursor-pointer"
                        >
                          {copiedKey === `kw-${idx}` ? (
                            <Check className="h-3 w-3 text-emerald-600 inline" />
                          ) : (
                            <Copy className="h-3 w-3 inline mr-1" />
                          )}
                          <span>Copy</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Gifting Searches & Aesthetic Trends Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Gifting Searches */}
            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
              <div className="flex items-center gap-2 mb-3 border-b border-stone-100 pb-2">
                <Gift className="h-4 w-4 text-[#F1641E]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                  Gift-Buyer Intent Searches
                </h4>
              </div>

              <div className="space-y-2.5">
                {result.giftingKeywords.map((gift, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-xl border border-stone-100 bg-stone-50 p-3 text-xs"
                  >
                    <div>
                      <span className="font-bold text-stone-900 block">{gift.term}</span>
                      <span className="text-[11px] text-stone-500">
                        Recipient: {gift.recipient} • Timing: {gift.seasonality}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => copyFeedback(`gift-${i}`, gift.term)}
                      className="rounded p-1 text-stone-400 hover:text-stone-700"
                    >
                      {copiedKey === `gift-${i}` ? (
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Emerging Aesthetic Micro-Trends */}
            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
              <div className="flex items-center gap-2 mb-3 border-b border-stone-100 pb-2">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                  Emerging Aesthetic Sub-Niches
                </h4>
              </div>

              <div className="space-y-3">
                {result.emergingAestheticTrends.map((trend, i) => (
                  <div key={i} className="rounded-xl border border-stone-100 bg-stone-50 p-3 text-xs">
                    <span className="font-bold text-stone-900 block text-xs mb-0.5">
                      ✨ {trend.trendName}
                    </span>
                    <p className="text-stone-600 text-[11px] leading-relaxed mb-2">
                      {trend.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-1">
                      <span className="text-[10px] font-semibold text-stone-500 mr-1">Pair with:</span>
                      {trend.tagsToPair.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="rounded bg-white border border-stone-200 px-1.5 py-0.2 text-[10px] text-stone-700 font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
