import React, { useState } from "react";
import {
  Share2,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  Video,
  Mail,
  Megaphone,
  Pin,
  ExternalLink,
} from "lucide-react";
import { GeneratedListing, SocialCampaignResult } from "../types";
import { copyToClipboard, triggerConfetti } from "../utils/etsyHelpers";

interface SocialMarketingHubProps {
  initialListing?: GeneratedListing | null;
}

export const SocialMarketingHub: React.FC<SocialMarketingHubProps> = ({ initialListing }) => {
  const [productName, setProductName] = useState(
    initialListing?.productName || "Personalized Birth Flower Name Necklace"
  );
  const [shopName, setShopName] = useState("ArtisanBotanica Studio");
  const [keyFeatures, setKeyFeatures] = useState(
    initialListing?.description?.hook || "Handmade 18k gold plated birth flower botanical necklace"
  );
  const [price, setPrice] = useState(initialListing?.pricePoint || "$34.99");
  const [targetNiche, setTargetNiche] = useState("Mothers day gifts, bridesmaid proposals, aesthetic jewelry");
  const [promoGoal, setPromoGoal] = useState("Drive viral external Etsy sales & Pinterest saves");

  const [isLoading, setIsLoading] = useState(false);
  const [campaign, setCampaign] = useState<SocialCampaignResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyFeedback = (key: string, text: string) => {
    copyToClipboard(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleGenerateCampaign = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!productName.trim()) {
      setError("Please provide a product name.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate-social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName,
          shopName,
          keyFeatures,
          price,
          targetNiche,
          promoGoal,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate marketing campaign");
      }

      const data: SocialCampaignResult = await response.json();
      setCampaign(data);
      triggerConfetti();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to generate campaign assets");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
          Etsy External Traffic & Pinterest Marketing Hub
        </h1>
        <p className="text-sm text-stone-600 mt-1">
          Etsy rewards shops that drive external traffic. Generate viral Pinterest Rich Pins, TikTok/Reels hooks, shop announcements, and email campaigns.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Form */}
        <div className="lg:col-span-4">
          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
            <div className="mb-4 flex items-center gap-2 border-b border-stone-100 pb-3">
              <Share2 className="h-4 w-4 text-[#F1641E]" />
              <h2 className="text-sm font-bold text-stone-900">Campaign Parameters</h2>
            </div>

            <form onSubmit={handleGenerateCampaign} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-800 mb-1">
                  Product / Collection Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-900 focus:border-[#F1641E] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-stone-800 mb-1">Shop Name</label>
                  <input
                    type="text"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-900 focus:border-[#F1641E] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-800 mb-1">Price Point</label>
                  <input
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-900 focus:border-[#F1641E] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-800 mb-1">Target Niche & Audience</label>
                <input
                  type="text"
                  value={targetNiche}
                  onChange={(e) => setTargetNiche(e.target.value)}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-900 focus:border-[#F1641E] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-800 mb-1">Key Selling Points / Hook</label>
                <textarea
                  rows={3}
                  value={keyFeatures}
                  onChange={(e) => setKeyFeatures(e.target.value)}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-900 focus:border-[#F1641E] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-800 mb-1">Marketing Goal</label>
                <select
                  value={promoGoal}
                  onChange={(e) => setPromoGoal(e.target.value)}
                  className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-stone-900 focus:border-[#F1641E] focus:outline-none"
                >
                  <option value="Drive viral external Etsy sales & Pinterest saves">
                    Drive Pinterest Saves & External Etsy Traffic
                  </option>
                  <option value="Promote seasonal holiday / Mother's Day sale">
                    Seasonal Sale / Gifting Promotion
                  </option>
                  <option value="Launch a new product collection">New Product Launch Hype</option>
                  <option value="Re-engage previous shop favorites & repeat buyers">
                    Repeat Buyer Engagement
                  </option>
                </select>
              </div>

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                id="generate-social-submit-btn"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#E60023] px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-[#b8001c] active:scale-[0.99] disabled:opacity-50 transition cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Writing Campaigns...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Generate Multi-Channel Campaign</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Output */}
        <div className="lg:col-span-8 space-y-6">
          {!campaign ? (
            <div className="flex h-96 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-stone-200 bg-stone-50/50 p-8 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-[#E60023] mb-3">
                <Pin className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-stone-900">
                Pinterest & Multi-Channel Marketing Generator
              </h3>
              <p className="max-w-md text-xs text-stone-500 mt-1 mb-4">
                Click generate on the left to write 3 high-converting Pinterest Rich Pins, TikTok video scripts, shop announcements, and newsletter copy.
              </p>
              <button
                type="button"
                onClick={() => handleGenerateCampaign()}
                className="rounded-lg bg-[#E60023] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#b8001c] cursor-pointer"
              >
                Generate Demo Campaign Now
              </button>
            </div>
          ) : (
            <>
              {/* 1. Pinterest Rich Pins (3 Concepts) */}
              <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between mb-4 border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#E60023] text-white text-xs font-bold">
                      P
                    </span>
                    <h3 className="text-sm font-bold text-stone-900">
                      Pinterest Rich Pins SEO ({campaign.pinterestPins.length} Angles)
                    </h3>
                  </div>
                  <span className="text-[11px] text-stone-400 font-medium">
                    #1 External Traffic Driver for Etsy
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {campaign.pinterestPins.map((pin, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col justify-between rounded-xl border border-stone-200 bg-stone-50/50 p-4 hover:border-red-300 transition"
                    >
                      <div>
                        {/* Mock Visual Overlay Tag */}
                        <div className="mb-2.5 rounded-lg bg-gradient-to-br from-stone-900 to-stone-800 p-3 text-white shadow-xs">
                          <span className="text-[9px] uppercase tracking-wider text-orange-400 font-bold block mb-1">
                            Graphic Overlay Copy:
                          </span>
                          <p className="text-xs font-bold leading-tight">"{pin.graphicTextOverlay}"</p>
                        </div>

                        <div className="mb-2">
                          <span className="text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 rounded px-1.5 py-0.2">
                            {pin.angle}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-stone-900 line-clamp-2 mb-1.5">
                          {pin.pinTitle}
                        </h4>

                        <p className="text-[11px] text-stone-600 leading-relaxed line-clamp-4 mb-2">
                          {pin.pinDescription}
                        </p>

                        <div className="text-[10px] text-stone-500 mb-2">
                          <span className="font-semibold text-stone-700">Boards: </span>
                          {pin.recommendedBoards.join(" • ")}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const fullPin = `TITLE: ${pin.pinTitle}\n\nDESCRIPTION:\n${pin.pinDescription}\n\nBOARDS: ${pin.recommendedBoards.join(", ")}\n\nHASHTAGS: ${pin.hashtags.join(" ")}`;
                          copyFeedback(`pin-${idx}`, fullPin);
                        }}
                        className="mt-3 w-full flex items-center justify-center gap-1.5 rounded-lg border border-stone-300 bg-white py-1.5 text-xs font-semibold text-stone-800 hover:border-[#E60023] hover:text-[#E60023] shadow-2xs transition cursor-pointer"
                      >
                        {copiedKey === `pin-${idx}` ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                            <span>Copied Pin!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            <span>Copy Pin SEO</span>
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. TikTok / Instagram Reels Video Scripts */}
              <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
                <div className="flex items-center gap-2 mb-4 border-b border-stone-100 pb-3">
                  <Video className="h-5 w-5 text-indigo-600" />
                  <h3 className="text-sm font-bold text-stone-900">
                    TikTok & Instagram Reels Video Hooks & Scripts
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {campaign.shortVideoScripts.map((script, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-xs space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-indigo-900 bg-indigo-50 border border-indigo-200 rounded px-2 py-0.5 text-[10px]">
                          Concept #{idx + 1} • {script.platform}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const text = `3-SEC HOOK: ${script.hook3Seconds}\n\nVISUALS: ${script.visualSceneDirections}\n\nON-SCREEN TEXT: ${script.onScreenText}\n\nCAPTION: ${script.caption}\n\nHASHTAGS: ${script.hashtags.join(" ")}`;
                            copyFeedback(`script-${idx}`, text);
                          }}
                          className="text-stone-400 hover:text-stone-700"
                        >
                          {copiedKey === `script-${idx}` ? (
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>

                      <div className="rounded-lg bg-white border border-stone-200 p-2.5">
                        <span className="text-[10px] font-bold text-stone-500 uppercase block mb-0.5">
                          ⚡ 3-Second Viral Hook:
                        </span>
                        <p className="font-bold text-stone-900 text-xs">"{script.hook3Seconds}"</p>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-stone-500 uppercase block">
                          Visual Scene Directions:
                        </span>
                        <p className="text-stone-700 text-[11px] leading-relaxed mt-0.5">
                          {script.visualSceneDirections}
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-stone-500 uppercase block">
                          Caption & Hashtags:
                        </span>
                        <p className="text-stone-700 text-[11px] leading-relaxed mt-0.5">
                          {script.caption}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1 text-[10px] text-indigo-600 font-medium">
                          {script.hashtags.map((h, i) => (
                            <span key={i}>{h}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Etsy Shop Announcement & Email Newsletter Copy */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Shop Announcements */}
                <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3 border-b border-stone-100 pb-2">
                      <Megaphone className="h-4 w-4 text-[#F1641E]" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                        Etsy Shop Announcement Copy
                      </h4>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div className="rounded-xl border border-stone-100 bg-stone-50 p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-stone-800 text-[11px]">Seasonal Announcement</span>
                          <button
                            type="button"
                            onClick={() =>
                              copyFeedback(
                                "shop-ann-1",
                                campaign.etsyShopAnnouncement.seasonalAnnouncement
                              )
                            }
                            className="text-stone-400 hover:text-stone-700"
                          >
                            {copiedKey === "shop-ann-1" ? (
                              <Check className="h-3.5 w-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                        <p className="text-stone-600 text-[11px] leading-relaxed">
                          {campaign.etsyShopAnnouncement.seasonalAnnouncement}
                        </p>
                      </div>

                      <div className="rounded-xl border border-stone-100 bg-stone-50 p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-stone-800 text-[11px]">Flash Sale Banner</span>
                          <button
                            type="button"
                            onClick={() =>
                              copyFeedback("shop-ann-2", campaign.etsyShopAnnouncement.saleAnnouncement)
                            }
                            className="text-stone-400 hover:text-stone-700"
                          >
                            {copiedKey === "shop-ann-2" ? (
                              <Check className="h-3.5 w-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                        <p className="text-stone-600 text-[11px] leading-relaxed">
                          {campaign.etsyShopAnnouncement.saleAnnouncement}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Email Newsletter Campaign */}
                <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3 border-b border-stone-100 pb-2">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-emerald-600" />
                        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                          Shop VIP Email Campaign
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const fullEmail = `SUBJECTS: ${campaign.emailCampaign.subjectLines.join(" OR ")}\n\nPREVIEW: ${campaign.emailCampaign.previewSnippet}\n\nBODY:\n${campaign.emailCampaign.bodyCopy}\n\nCTA: ${campaign.emailCampaign.callToAction}`;
                          copyFeedback("email-full", fullEmail);
                        }}
                        className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                      >
                        {copiedKey === "email-full" ? (
                          <Check className="h-3.5 w-3.5" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                        <span>Copy Email</span>
                      </button>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="font-semibold text-stone-500 block text-[10px]">Subject Lines:</span>
                        <div className="space-y-0.5 mt-0.5">
                          {campaign.emailCampaign.subjectLines.map((subj, i) => (
                            <p key={i} className="font-bold text-stone-800 text-[11px]">
                              • {subj}
                            </p>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-lg bg-stone-50 p-2.5 border border-stone-100">
                        <span className="font-semibold text-stone-500 block text-[10px]">Body Snippet:</span>
                        <p className="text-stone-700 text-[11px] leading-relaxed line-clamp-4 mt-0.5">
                          {campaign.emailCampaign.bodyCopy}
                        </p>
                      </div>

                      <div className="rounded bg-emerald-50 border border-emerald-200 p-2 text-center text-emerald-900 font-bold text-xs">
                        CTA Button: "{campaign.emailCampaign.callToAction}"
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
