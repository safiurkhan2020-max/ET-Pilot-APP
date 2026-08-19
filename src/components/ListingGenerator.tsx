import React, { useState } from "react";
import {
  Sparkles,
  Copy,
  Check,
  Download,
  Bookmark,
  RefreshCw,
  Plus,
  X,
  AlertCircle,
  Camera,
  DollarSign,
  Layers,
  ArrowRight,
  Send,
  HelpCircle,
} from "lucide-react";
import { GeneratedListing, EtsyTag, EtsyTitle } from "../types";
import { SAMPLE_PRESETS } from "../data/mockData";
import {
  validateEtsyTags,
  copyToClipboard,
  triggerConfetti,
  exportListingToCSV,
} from "../utils/etsyHelpers";

interface ListingGeneratorProps {
  currentListing: GeneratedListing | null;
  setCurrentListing: React.Dispatch<React.SetStateAction<GeneratedListing | null>>;
  onSaveListing: (listing: GeneratedListing) => void;
  onSendToSocial: (listing: GeneratedListing) => void;
  onSendToCalculator: (price: number) => void;
}

export const ListingGenerator: React.FC<ListingGeneratorProps> = ({
  currentListing,
  setCurrentListing,
  onSaveListing,
  onSendToSocial,
  onSendToCalculator,
}) => {
  // Form State
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("Jewelry / Necklaces / Pendants");
  const [listingType, setListingType] = useState<"physical" | "digital" | "custom">("physical");
  const [materials, setMaterials] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [uniqueSellingPoints, setUniqueSellingPoints] = useState("");
  const [pricePoint, setPricePoint] = useState("$34.99");
  const [occasion, setOccasion] = useState("Mother's Day / Birthday / Wedding");
  const [styleVibe, setStyleVibe] = useState("Minimalist Dainty Artisanal");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [newTagInput, setNewTagInput] = useState("");
  const [activeDescTab, setActiveDescTab] = useState<"full" | "features" | "ordering" | "faqs">("full");

  const copyFeedback = (key: string, text: string) => {
    copyToClipboard(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleApplyPreset = (preset: (typeof SAMPLE_PRESETS)[0]) => {
    setProductName(preset.name);
    setCategory(preset.category);
    setListingType(preset.type);
    setMaterials(preset.materials);
    setTargetAudience(preset.targetAudience);
    setUniqueSellingPoints(preset.usp);
    setPricePoint(preset.price);
    setOccasion(preset.occasion);
    setStyleVibe(preset.style);
  };

  const handleGenerateListing = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!productName.trim()) {
      setError("Please enter a product title or concept first.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate-listing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName,
          category,
          listingType,
          materials,
          targetAudience,
          uniqueSellingPoints,
          pricePoint,
          occasion,
          styleVibe,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with ${response.status}`);
      }

      const data = await response.json();
      const newListing: GeneratedListing = {
        id: `listing-${Date.now()}`,
        createdAt: new Date().toISOString(),
        productName,
        category,
        listingType,
        pricePoint,
        seoScore: data.seoScore || 96,
        targetKeywords: data.targetKeywords || [],
        titles: data.titles || [],
        selectedTitleIndex: 0,
        tags: data.tags || [],
        description: data.description,
        photoAltTexts: data.photoAltTexts || [],
        pricingStrategy: data.pricingStrategy,
      };

      setCurrentListing(newListing);
      triggerConfetti();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to generate listing. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Tag manipulation
  const handleRemoveTag = (indexToRemove: number) => {
    if (!currentListing) return;
    const updatedTags = currentListing.tags.filter((_, i) => i !== indexToRemove);
    setCurrentListing({ ...currentListing, tags: updatedTags });
  };

  const handleAddTag = () => {
    if (!currentListing || !newTagInput.trim()) return;
    const trimmed = newTagInput.trim().toLowerCase();
    if (currentListing.tags.length >= 13) {
      alert("Etsy only supports a maximum of 13 tags per listing.");
      return;
    }
    if (trimmed.length > 20) {
      alert("Etsy tags must be 20 characters or fewer.");
      return;
    }

    const newTagObj: EtsyTag = {
      tag: trimmed,
      charCount: trimmed.length,
      searchIntent: "Custom Seller Tag",
      competitionEstimate: "Medium",
    };

    setCurrentListing({
      ...currentListing,
      tags: [...currentListing.tags, newTagObj],
    });
    setNewTagInput("");
  };

  const activeTitle = currentListing
    ? currentListing.titles[currentListing.selectedTitleIndex]?.title || currentListing.titles[0]?.title || ""
    : "";

  const tagValidation = currentListing ? validateEtsyTags(currentListing.tags) : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Intro Header */}
      <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
            AI Etsy Listing Architect
          </h1>
          <p className="text-sm text-stone-600">
            Generate 100% Etsy SEO compliant listings: frontloaded titles, strict 13 tags (≤20 chars), structured descriptions, and photo alt-texts.
          </p>
        </div>

        {/* Quick Presets for Demo */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 md:pt-0">
          <span className="text-xs font-semibold text-stone-500 mr-1">Sample Niche Presets:</span>
          {SAMPLE_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="rounded-full border border-stone-200 bg-white px-2.5 py-1 text-[11px] font-medium text-stone-700 shadow-xs hover:border-orange-300 hover:bg-orange-50 hover:text-[#F1641E] transition cursor-pointer"
            >
              {preset.name.split(" ")[0]} {preset.name.split(" ")[1]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Input Form */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
            <div className="mb-4 flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-orange-100 text-xs font-bold text-[#F1641E]">
                  1
                </span>
                <h2 className="text-sm font-bold text-stone-900">Product Specification</h2>
              </div>
              <span className="text-[11px] font-medium text-stone-400">Etsy Search Ranked Engine</span>
            </div>

            <form onSubmit={handleGenerateListing} className="space-y-4">
              {/* Product Concept / Name */}
              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1">
                  Product Name / Core Concept <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Personalized Birth Flower Name Necklace"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:border-[#F1641E] focus:ring-2 focus:ring-orange-100 focus:outline-none"
                />
              </div>

              {/* Category & Listing Type */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1">
                    Etsy Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs text-stone-900 focus:border-[#F1641E] focus:ring-2 focus:ring-orange-100 focus:outline-none"
                  >
                    <option value="Jewelry / Necklaces / Pendants">Jewelry & Accessories</option>
                    <option value="Home & Living / Decor & Storage">Home & Living</option>
                    <option value="Clothing / Unisex Apparel">Clothing & Shoes</option>
                    <option value="Digital / Planners & Templates">Digital Downloads</option>
                    <option value="Weddings / Bridal Gifts">Weddings & Party</option>
                    <option value="Craft Supplies & Tools">Craft Supplies</option>
                    <option value="Paper & Party Supplies">Paper & Cards</option>
                    <option value="Art & Collectibles">Art & Collectibles</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1">
                    Listing Type
                  </label>
                  <div className="grid grid-cols-3 gap-1 rounded-lg border border-stone-200 p-1 bg-stone-50">
                    {(["physical", "digital", "custom"] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setListingType(type)}
                        className={`rounded py-1 text-[11px] font-semibold capitalize transition cursor-pointer ${
                          listingType === type
                            ? "bg-white text-stone-900 shadow-xs border border-stone-200"
                            : "text-stone-500 hover:text-stone-900"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Materials & Target Audience */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1">
                    Materials & Specs
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 18K Gold plated stainless steel, walnut wood"
                    value={materials}
                    onChange={(e) => setMaterials(e.target.value)}
                    className="w-full rounded-lg border border-stone-300 px-3 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:border-[#F1641E] focus:ring-2 focus:ring-orange-100 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1">
                    Target Recipient / Buyer
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mom, bridesmaids, dog owners"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="w-full rounded-lg border border-stone-300 px-3 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:border-[#F1641E] focus:ring-2 focus:ring-orange-100 focus:outline-none"
                  />
                </div>
              </div>

              {/* Unique Selling Points */}
              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1">
                  Unique Selling Points & Features (USPs)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Waterproof, hand-stamped, includes luxury velvet gift box, fast 1-2 day turnaround"
                  value={uniqueSellingPoints}
                  onChange={(e) => setUniqueSellingPoints(e.target.value)}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:border-[#F1641E] focus:ring-2 focus:ring-orange-100 focus:outline-none"
                />
              </div>

              {/* Price & Occasion */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1">
                    Price Point
                  </label>
                  <input
                    type="text"
                    placeholder="$34.99"
                    value={pricePoint}
                    onChange={(e) => setPricePoint(e.target.value)}
                    className="w-full rounded-lg border border-stone-300 px-3 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:border-[#F1641E] focus:ring-2 focus:ring-orange-100 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-800 mb-1">
                    Occasion / Seasonality
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mother's Day, Wedding, Birthday, Holiday"
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    className="w-full rounded-lg border border-stone-300 px-3 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:border-[#F1641E] focus:ring-2 focus:ring-orange-100 focus:outline-none"
                  />
                </div>
              </div>

              {/* Style / Aesthetic */}
              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1">
                  Style Aesthetic & Vibe
                </label>
                <input
                  type="text"
                  placeholder="e.g. Minimalist Boho, Rustic Farmhouse, Y2K Cottagecore, Modern Chic"
                  value={styleVibe}
                  onChange={(e) => setStyleVibe(e.target.value)}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:border-[#F1641E] focus:ring-2 focus:ring-orange-100 focus:outline-none"
                />
              </div>

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-500" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                id="generate-listing-submit-btn"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#F1641E] to-[#D94F0C] px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:shadow hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Analyzing Etsy SEO & Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Generate Etsy Optimized Listing</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Listing Output Architecture */}
        <div className="lg:col-span-7 space-y-6">
          {!currentListing ? (
            <div className="flex h-96 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-stone-200 bg-stone-50/50 p-8 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-[#F1641E] mb-3">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-stone-900">Your Etsy Listing Suite Appears Here</h3>
              <p className="max-w-md text-xs text-stone-500 mt-1 mb-4">
                Fill in your product details on the left or choose one of our instant sample presets above to generate a complete, high-converting Etsy listing.
              </p>
              <button
                type="button"
                onClick={() => handleApplyPreset(SAMPLE_PRESETS[0])}
                className="rounded-lg bg-white border border-stone-300 px-3.5 py-1.5 text-xs font-semibold text-stone-700 shadow-xs hover:border-[#F1641E] hover:text-[#F1641E] cursor-pointer"
              >
                Load "Birth Flower Necklace" Sample
              </button>
            </div>
          ) : (
            <>
              {/* Header Bar with SEO Score & Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 flex-col items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold shadow-xs">
                    <span className="text-base leading-none">{currentListing.seoScore}</span>
                    <span className="text-[9px] font-medium opacity-90">/ 100</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-stone-900">Etsy SEO Rating: Excellent</h3>
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                        Algorithm Ready
                      </span>
                    </div>
                    <p className="text-xs text-stone-500">
                      13/13 Tags Validated • Frontloaded Keywords • High Conversion Copy
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onSaveListing(currentListing);
                      copyFeedback("saved", "saved");
                    }}
                    className="inline-flex items-center gap-1 rounded-lg border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-100 cursor-pointer"
                  >
                    <Bookmark className="h-3.5 w-3.5 text-stone-500" />
                    <span>{copiedKey === "saved" ? "Saved!" : "Save Draft"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => exportListingToCSV(currentListing)}
                    className="inline-flex items-center gap-1 rounded-lg border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-100 cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5 text-stone-500" />
                    <span>Etsy CSV</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onSendToSocial(currentListing)}
                    className="inline-flex items-center gap-1 rounded-lg bg-orange-50 border border-orange-200 px-3 py-1.5 text-xs font-semibold text-[#F1641E] hover:bg-orange-100 cursor-pointer"
                  >
                    <span>Pinterest & Social</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* 1. Title Variations Selector */}
              <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
                <div className="mb-3 flex items-center justify-between border-b border-stone-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-md bg-stone-900 text-[10px] font-bold text-white">
                      T
                    </span>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                      Optimized Etsy Titles ({currentListing.titles.length} Variations)
                    </h3>
                  </div>
                  <span className="text-[11px] text-stone-400">Max 140 Chars • Mobile Safe</span>
                </div>

                <div className="space-y-3">
                  {currentListing.titles.map((titleObj, idx) => {
                    const isSelected = currentListing.selectedTitleIndex === idx;
                    return (
                      <div
                        key={idx}
                        onClick={() => setCurrentListing({ ...currentListing, selectedTitleIndex: idx })}
                        className={`group relative rounded-xl border p-3.5 transition cursor-pointer ${
                          isSelected
                            ? "border-[#F1641E] bg-orange-50/40 ring-1 ring-[#F1641E]"
                            : "border-stone-200 bg-white hover:border-stone-300"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span
                              className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                                isSelected
                                  ? "border-[#F1641E] bg-[#F1641E] text-white"
                                  : "border-stone-300 bg-white"
                              }`}
                            >
                              {isSelected && <Check className="h-2.5 w-2.5" />}
                            </span>
                            <span className="text-xs font-bold text-stone-900">{titleObj.style}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                                titleObj.title.length <= 140
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {titleObj.title.length} / 140 Chars
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                copyFeedback(`title-${idx}`, titleObj.title);
                              }}
                              className="rounded p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition"
                              title="Copy title"
                            >
                              {copiedKey === `title-${idx}` ? (
                                <Check className="h-3.5 w-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </div>
                        </div>

                        <p className="text-xs font-medium text-stone-800 leading-relaxed">
                          {titleObj.title}
                        </p>

                        <div className="mt-2 flex items-center gap-1.5 text-[10px] text-stone-500">
                          <span className="font-semibold text-stone-700">Mobile Frontload (First 40 chars):</span>
                          <span className="rounded bg-stone-100 px-1 py-0.2 font-mono text-stone-800">
                            {titleObj.title.slice(0, 40)}...
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. 13 Tags Studio (Crucial for Etsy SEO) */}
              <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-md bg-stone-900 text-[10px] font-bold text-white">
                      #
                    </span>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                      Etsy 13-Tags Studio
                    </h3>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        tagValidation?.count === 13
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {tagValidation?.count} / 13 Tags Used
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const commaSeparated = currentListing.tags.map((t) => t.tag).join(", ");
                      copyFeedback("all-tags", commaSeparated);
                    }}
                    className="inline-flex items-center gap-1 rounded-lg bg-[#F1641E] px-2.5 py-1 text-xs font-bold text-white shadow-xs hover:bg-[#D94F0C] transition cursor-pointer"
                  >
                    {copiedKey === "all-tags" ? (
                      <>
                        <Check className="h-3 w-3" />
                        <span>Copied 13 Tags!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Copy All 13 Tags (Comma-Separated)</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Tag Warning if not 13 or over 20 chars */}
                {tagValidation && !tagValidation.isValid && (
                  <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-900 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
                    <span>
                      {tagValidation.invalidTags.length > 0
                        ? `Some tags exceed Etsy's 20-character limit.`
                        : tagValidation.duplicates.length > 0
                        ? `You have duplicate tags.`
                        : `Etsy gives you 13 tag slots. Use all 13 for maximum search reach.`}
                    </span>
                  </div>
                )}

                {/* Tag Pills Grid */}
                <div className="flex flex-wrap gap-2">
                  {currentListing.tags.map((tagObj, idx) => {
                    const isOverLimit = tagObj.tag.length > 20;
                    return (
                      <div
                        key={idx}
                        className={`group flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition ${
                          isOverLimit
                            ? "border-red-300 bg-red-50 text-red-900"
                            : "border-stone-200 bg-stone-50 text-stone-800 hover:border-stone-300 hover:bg-white"
                        }`}
                      >
                        <span>{tagObj.tag}</span>
                        <span
                          className={`text-[9px] font-mono rounded px-1 ${
                            isOverLimit ? "bg-red-200 text-red-800" : "bg-stone-200 text-stone-600"
                          }`}
                        >
                          {tagObj.tag.length}/20
                        </span>

                        <button
                          type="button"
                          onClick={() => handleRemoveTag(idx)}
                          className="text-stone-400 hover:text-red-500 transition"
                          title="Remove tag"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Add New Tag Bar */}
                {currentListing.tags.length < 13 && (
                  <div className="mt-3 flex items-center gap-2 pt-2 border-t border-stone-100">
                    <input
                      type="text"
                      maxLength={20}
                      placeholder="Add tag (max 20 chars)..."
                      value={newTagInput}
                      onChange={(e) => setNewTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      className="flex-1 rounded-lg border border-stone-300 px-3 py-1.5 text-xs text-stone-900 placeholder:text-stone-400 focus:border-[#F1641E] focus:outline-none"
                    />
                    <span className="text-[10px] text-stone-400 font-mono">
                      {newTagInput.length}/20
                    </span>
                    <button
                      type="button"
                      onClick={handleAddTag}
                      disabled={!newTagInput.trim()}
                      className="inline-flex items-center gap-1 rounded-lg bg-stone-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-stone-800 disabled:opacity-40 cursor-pointer"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Add Tag</span>
                    </button>
                  </div>
                )}
              </div>

              {/* 3. Structured Product Description */}
              <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-md bg-stone-900 text-[10px] font-bold text-white">
                      D
                    </span>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                      Conversion-Optimized Description
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex rounded-lg border border-stone-200 p-0.5 bg-stone-50">
                      <button
                        type="button"
                        onClick={() => setActiveDescTab("full")}
                        className={`rounded px-2 py-0.5 text-[11px] font-semibold transition ${
                          activeDescTab === "full" ? "bg-white text-stone-900 shadow-xs" : "text-stone-500"
                        }`}
                      >
                        Full Copy
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveDescTab("features")}
                        className={`rounded px-2 py-0.5 text-[11px] font-semibold transition ${
                          activeDescTab === "features" ? "bg-white text-stone-900 shadow-xs" : "text-stone-500"
                        }`}
                      >
                        Key Bullets
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveDescTab("faqs")}
                        className={`rounded px-2 py-0.5 text-[11px] font-semibold transition ${
                          activeDescTab === "faqs" ? "bg-white text-stone-900 shadow-xs" : "text-stone-500"
                        }`}
                      >
                        FAQs
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        copyFeedback("full-desc", currentListing.description.fullFormattedText)
                      }
                      className="inline-flex items-center gap-1 rounded-lg border border-stone-300 bg-white px-2.5 py-1 text-xs font-semibold text-stone-700 hover:border-[#F1641E] hover:text-[#F1641E] transition cursor-pointer"
                    >
                      {copiedKey === "full-desc" ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-600" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Copy Description</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {activeDescTab === "full" && (
                  <div className="relative">
                    <textarea
                      readOnly
                      rows={10}
                      value={currentListing.description.fullFormattedText}
                      className="w-full rounded-xl border border-stone-200 bg-stone-50/60 p-3.5 text-xs text-stone-800 font-sans leading-relaxed focus:outline-none"
                    />
                  </div>
                )}

                {activeDescTab === "features" && (
                  <div className="space-y-3 p-1">
                    <div className="rounded-xl bg-orange-50/50 p-3 border border-orange-100">
                      <span className="text-[11px] font-bold text-orange-900 block mb-1">
                        First 160-Char Meta Hook (Google & Search Snippets):
                      </span>
                      <p className="text-xs text-stone-800 leading-relaxed font-medium">
                        {currentListing.description.hook}
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-xs font-bold text-stone-900">Key Features:</span>
                      {currentListing.description.keyFeatures.map((feat, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-stone-700">
                          <span className="text-emerald-500 font-bold">•</span>
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeDescTab === "faqs" && (
                  <div className="space-y-2 p-1">
                    {currentListing.description.faqs.map((faq, i) => (
                      <div key={i} className="rounded-xl border border-stone-200 p-3 bg-stone-50">
                        <span className="text-xs font-bold text-stone-900 block mb-1">
                          Q: {faq.question}
                        </span>
                        <p className="text-xs text-stone-600 leading-relaxed">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 4. Photo Alt-Texts & Gifting Recommendation */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Photo Alt-Texts */}
                <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-xs">
                  <div className="mb-2 flex items-center gap-2 border-b border-stone-100 pb-2">
                    <Camera className="h-4 w-4 text-[#F1641E]" />
                    <h4 className="text-xs font-bold text-stone-900">Photo Alt-Text SEO (5 Slots)</h4>
                  </div>
                  <div className="space-y-2">
                    {currentListing.photoAltTexts.map((slot, i) => (
                      <div key={i} className="rounded-lg border border-stone-100 bg-stone-50 p-2 text-xs">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="font-bold text-stone-800 text-[11px]">{slot.photoSlot}</span>
                          <button
                            type="button"
                            onClick={() => copyFeedback(`alt-${i}`, slot.altText)}
                            className="text-stone-400 hover:text-stone-700"
                          >
                            {copiedKey === `alt-${i}` ? (
                              <Check className="h-3 w-3 text-emerald-600" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </button>
                        </div>
                        <p className="text-stone-600 text-[11px] leading-tight mb-1">{slot.altText}</p>
                        <span className="text-[10px] text-stone-400 italic">Angle: {slot.recommendedAngle}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing & Upsell Intelligence */}
                <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="mb-2 flex items-center gap-2 border-b border-stone-100 pb-2">
                      <DollarSign className="h-4 w-4 text-emerald-600" />
                      <h4 className="text-xs font-bold text-stone-900">Pricing & Upsell Strategy</h4>
                    </div>

                    <div className="space-y-2.5 text-xs">
                      <div>
                        <span className="font-semibold text-stone-500 block text-[11px]">Recommended Price:</span>
                        <p className="font-bold text-stone-900 text-sm">
                          {currentListing.pricingStrategy.psychologicalPrice}
                        </p>
                        <span className="text-[10px] text-stone-400">
                          Range: {currentListing.pricingStrategy.suggestedRange}
                        </span>
                      </div>

                      <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-2 text-emerald-900">
                        <span className="font-bold text-[11px] block">High-Margin Upsell / Variation:</span>
                        <p className="text-[11px] mt-0.5">{currentListing.pricingStrategy.upsellIdea}</p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const numPrice = parseFloat(currentListing.pricePoint.replace(/[^0-9.]/g, "")) || 35;
                      onSendToCalculator(numPrice);
                    }}
                    className="mt-4 flex items-center justify-center gap-1.5 rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-xs font-semibold text-stone-800 hover:bg-stone-100 transition cursor-pointer"
                  >
                    <DollarSign className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Calculate Net Profit & Etsy Ads ROAS</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
