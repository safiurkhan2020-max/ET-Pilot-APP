import React, { useState } from "react";
import {
  Search,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  RefreshCw,
  Sparkles,
  Copy,
  Check,
  ArrowRight,
  ShieldAlert,
  Zap,
} from "lucide-react";
import { AuditResult, GeneratedListing, EtsyTag } from "../types";
import { SAMPLE_AUDIT_DATA } from "../data/mockData";
import { copyToClipboard, triggerConfetti } from "../utils/etsyHelpers";

interface ListingAuditorProps {
  onApplyFixedListing: (listing: Partial<GeneratedListing>) => void;
}

export const ListingAuditor: React.FC<ListingAuditorProps> = ({ onApplyFixedListing }) => {
  const [title, setTitle] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Jewelry / Necklaces");

  const [isLoading, setIsLoading] = useState(false);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyFeedback = (key: string, text: string) => {
    copyToClipboard(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleLoadSample = () => {
    setTitle(SAMPLE_AUDIT_DATA.title);
    setTagsInput(SAMPLE_AUDIT_DATA.tags.join(", "));
    setDescription(SAMPLE_AUDIT_DATA.description);
    setPrice(SAMPLE_AUDIT_DATA.price);
    setCategory(SAMPLE_AUDIT_DATA.category);
  };

  const handleRunAudit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!title.trim() && !description.trim()) {
      setError("Please paste a listing title or description to audit.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const tagsArray = tagsInput
      .split(/,|\n/)
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      const response = await fetch("/api/audit-listing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          tags: tagsArray,
          description,
          price,
          category,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error ${response.status}`);
      }

      const data: AuditResult = await response.json();
      setAuditResult(data);
      triggerConfetti();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to audit listing. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith("A")) return "bg-emerald-500 text-white";
    if (grade.startsWith("B")) return "bg-blue-500 text-white";
    if (grade.startsWith("C")) return "bg-amber-500 text-white";
    return "bg-rose-500 text-white";
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
            Etsy Listing Audit & Health Doctor
          </h1>
          <p className="text-sm text-stone-600">
            Paste any active or draft Etsy listing to detect keyword gaps, character waste, missing tags, and get an instant 1-click SEO fix.
          </p>
        </div>

        <button
          type="button"
          onClick={handleLoadSample}
          className="rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 shadow-xs hover:border-[#F1641E] hover:text-[#F1641E] cursor-pointer"
        >
          Load Underperforming Sample Listing
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Input Column */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
            <div className="mb-4 flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-[#F1641E]" />
                <h2 className="text-sm font-bold text-stone-900">Listing Data to Audit</h2>
              </div>
              <span className="text-[11px] text-stone-400">Etsy Search Doctor</span>
            </div>

            <form onSubmit={handleRunAudit} className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-stone-800">
                    Etsy Listing Title <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[10px] text-stone-400 font-mono">{title.length}/140 chars</span>
                </div>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Necklace for women gold jewelry gift cute handmade pendant..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:border-[#F1641E] focus:outline-none"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-stone-800">
                    Etsy Tags (Comma-separated)
                  </label>
                  <span className="text-[10px] text-stone-400">
                    {tagsInput ? tagsInput.split(",").filter(Boolean).length : 0}/13 tags
                  </span>
                </div>
                <textarea
                  rows={3}
                  placeholder="e.g. necklace, jewelry, gold, gift, handmade..."
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:border-[#F1641E] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1">Price ($)</label>
                  <input
                    type="text"
                    placeholder="29.99"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full rounded-lg border border-stone-300 px-3 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:border-[#F1641E] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1">Category</label>
                  <input
                    type="text"
                    placeholder="Jewelry / Necklaces"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-lg border border-stone-300 px-3 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:border-[#F1641E] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1">
                  Listing Description (First 1500 chars)
                </label>
                <textarea
                  rows={4}
                  placeholder="Paste current listing description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:border-[#F1641E] focus:outline-none"
                />
              </div>

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                id="run-audit-submit-btn"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-stone-800 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Auditing Against Etsy Algorithm...</span>
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 text-orange-400" />
                    <span>Diagnose Listing Health</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Audit Results Column */}
        <div className="lg:col-span-7">
          {!auditResult ? (
            <div className="flex h-96 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-stone-200 bg-stone-50/50 p-8 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-200 text-stone-600 mb-3">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-stone-900">Your Audit Report Will Appear Here</h3>
              <p className="max-w-md text-xs text-stone-500 mt-1 mb-4">
                Paste your listing info on the left or click "Load Underperforming Sample" above to run an instant deep analysis.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Scorecard Hero Banner */}
              <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-16 w-16 flex-col items-center justify-center rounded-2xl font-bold shadow-xs ${getGradeColor(
                        auditResult.grade
                      )}`}
                    >
                      <span className="text-2xl leading-none">{auditResult.grade}</span>
                      <span className="text-[10px] opacity-90">{auditResult.overallScore}/100</span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-stone-900">
                        Listing Health: {auditResult.overallScore >= 85 ? "Optimal" : auditResult.overallScore >= 70 ? "Needs Improvement" : "Critical Fixes Needed"}
                      </h3>
                      <p className="text-xs text-stone-600 max-w-md mt-0.5 leading-relaxed">
                        {auditResult.summary}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 4 Dimension Metrics */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mt-4">
                  <div className="rounded-xl bg-stone-50 p-3 text-center border border-stone-100">
                    <span className="text-[10px] font-semibold text-stone-500 block">Title SEO</span>
                    <span className="text-base font-bold text-stone-900">{auditResult.metrics.titleStrength}%</span>
                  </div>
                  <div className="rounded-xl bg-stone-50 p-3 text-center border border-stone-100">
                    <span className="text-[10px] font-semibold text-stone-500 block">Tag Coverage</span>
                    <span className="text-base font-bold text-stone-900">{auditResult.metrics.tagCoverage}%</span>
                  </div>
                  <div className="rounded-xl bg-stone-50 p-3 text-center border border-stone-100">
                    <span className="text-[10px] font-semibold text-stone-500 block">Keyword Diversity</span>
                    <span className="text-base font-bold text-stone-900">{auditResult.metrics.keywordDiversity}%</span>
                  </div>
                  <div className="rounded-xl bg-stone-50 p-3 text-center border border-stone-100">
                    <span className="text-[10px] font-semibold text-stone-500 block">Readability</span>
                    <span className="text-base font-bold text-stone-900">{auditResult.metrics.conversionReadability}%</span>
                  </div>
                </div>
              </div>

              {/* Critical Issues & Good Practices */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-red-200 bg-red-50/40 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldAlert className="h-4 w-4 text-red-600" />
                    <h4 className="text-xs font-bold text-red-900">Critical Issues Detected</h4>
                  </div>
                  <ul className="space-y-1.5 text-xs text-red-800">
                    {auditResult.criticalIssues.map((issue, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-red-500 font-bold">•</span>
                        <span>{issue}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <h4 className="text-xs font-bold text-emerald-900">Good Practices Retained</h4>
                  </div>
                  <ul className="space-y-1.5 text-xs text-emerald-800">
                    {auditResult.goodPractices.map((good, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{good}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Missing High-Volume Keywords */}
              {auditResult.missingKeywords.length > 0 && (
                <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-xs">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-[#F1641E]" />
                    <h4 className="text-xs font-bold text-stone-900">High-Traffic Missing Keywords</h4>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {auditResult.missingKeywords.map((kw, i) => (
                      <span
                        key={i}
                        className="rounded-full border border-orange-200 bg-orange-50 px-2.5 py-0.5 text-xs font-medium text-orange-900"
                      >
                        + {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 1-Click Optimized Fixes */}
              <div className="rounded-2xl border-2 border-[#F1641E]/40 bg-gradient-to-br from-orange-50/30 to-amber-50/30 p-5 shadow-xs">
                <div className="flex items-center justify-between mb-3 border-b border-orange-200/60 pb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-[#F1641E]" />
                    <h3 className="text-sm font-bold text-stone-900">1-Click AI Optimized Revision</h3>
                  </div>
                  <span className="rounded-full bg-[#F1641E] px-2 py-0.5 text-[10px] font-bold text-white">
                    Score: 98/100
                  </span>
                </div>

                <div className="space-y-4">
                  {/* Recommended Title */}
                  <div className="rounded-xl border border-stone-200 bg-white p-3.5 shadow-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-bold text-stone-500 uppercase">Fixed Title:</span>
                      <button
                        type="button"
                        onClick={() => copyFeedback("audit-title", auditResult.optimizedFixes.recommendedTitle)}
                        className="text-stone-400 hover:text-stone-700 text-xs flex items-center gap-1"
                      >
                        {copiedKey === "audit-title" ? (
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                        <span>Copy Title</span>
                      </button>
                    </div>
                    <p className="text-xs font-bold text-stone-900">
                      {auditResult.optimizedFixes.recommendedTitle}
                    </p>
                    <p className="text-[11px] text-stone-500 mt-1 italic">
                      Why: {auditResult.optimizedFixes.titleImprovementReason}
                    </p>
                  </div>

                  {/* Recommended 13 Tags */}
                  <div className="rounded-xl border border-stone-200 bg-white p-3.5 shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-stone-500 uppercase">
                        Fixed 13 Tags ({auditResult.optimizedFixes.recommended13Tags.length}/13):
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const commaTags = auditResult.optimizedFixes.recommended13Tags.map((t) => t.tag).join(", ");
                          copyFeedback("audit-tags", commaTags);
                        }}
                        className="text-[#F1641E] hover:text-[#D94F0C] text-xs font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        {copiedKey === "audit-tags" ? (
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                        <span>Copy All 13 Tags</span>
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {auditResult.optimizedFixes.recommended13Tags.map((tagObj, idx) => (
                        <span
                          key={idx}
                          className="rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-1 text-[11px] font-medium text-emerald-900"
                        >
                          {tagObj.tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Optimized Hook */}
                  <div className="rounded-xl border border-stone-200 bg-white p-3.5 shadow-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-bold text-stone-500 uppercase">Improved Opening Hook:</span>
                      <button
                        type="button"
                        onClick={() => copyFeedback("audit-hook", auditResult.optimizedFixes.improvedDescriptionHook)}
                        className="text-stone-400 hover:text-stone-700 text-xs flex items-center gap-1"
                      >
                        {copiedKey === "audit-hook" ? (
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                        <span>Copy Hook</span>
                      </button>
                    </div>
                    <p className="text-xs text-stone-700 leading-relaxed font-medium">
                      {auditResult.optimizedFixes.improvedDescriptionHook}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
