import React, { useState } from "react";
import {
  MessageSquare,
  Sparkles,
  Copy,
  Check,
  Star,
  RefreshCw,
  ShieldCheck,
  Heart,
  Truck,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { ReviewResponseResult } from "../types";
import { copyToClipboard, triggerConfetti } from "../utils/etsyHelpers";

export const ReviewResponder: React.FC = () => {
  const [scenarioType, setScenarioType] = useState("5-Star Review Reply");
  const [customerMessage, setCustomerMessage] = useState(
    "Obsessed with this birth flower necklace! The engraving is so dainty and it came in such beautiful packaging. My mom cried when she opened it!"
  );
  const [rating, setRating] = useState("5");
  const [orderDetails, setOrderDetails] = useState("Item: June Rose Gold Necklace, includes 10% repeat buyer coupon code THANKYOU10");
  const [tone, setTone] = useState("Warm, Gracious & Artisanal");

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ReviewResponseResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const scenarios = [
    { label: "5-Star Review Reply", icon: Star, desc: "Express gratitude and encourage repeat visits" },
    { label: "1-3 Star Critical Review Resolution", icon: AlertCircle, desc: "Diplomatic public reply protecting shop Star Seller badge" },
    { label: "Delayed Shipping / Tracking Check", icon: Truck, desc: "Reassure buyer regarding carrier delays" },
    { label: "Custom Request / Personalization Inquiry", icon: Sparkles, desc: "Quote custom variations and guide checkout" },
    { label: "Damaged / Broken on Arrival", icon: ShieldCheck, desc: "Instant replacement resolution with zero friction" },
  ];

  const copyFeedback = (key: string, text: string) => {
    copyToClipboard(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenarioType,
          customerMessage,
          rating,
          orderDetails,
          tone,
        }),
      });

      if (!response.ok) throw new Error("Failed to generate response");
      const data: ReviewResponseResult = await response.json();
      setResult(data);
      triggerConfetti();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to generate communication templates");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
          Etsy Star Seller Review & Message Copilot
        </h1>
        <p className="text-sm text-stone-600 mt-1">
          Maintain your 5-Star rating and 24-hour response metric with Etsy seller protection compliant messages and review replies.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Controls */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
            <div className="mb-4 flex items-center gap-2 border-b border-stone-100 pb-3">
              <MessageSquare className="h-4 w-4 text-[#F1641E]" />
              <h2 className="text-sm font-bold text-stone-900">Communication Scenario</h2>
            </div>

            <form onSubmit={handleGenerate} className="space-y-4 text-xs">
              {/* Scenario Picker */}
              <div>
                <label className="block font-semibold text-stone-800 mb-1.5">Select Scenario</label>
                <div className="space-y-1.5">
                  {scenarios.map((sc) => {
                    const Icon = sc.icon;
                    const isSelected = scenarioType === sc.label;
                    return (
                      <div
                        key={sc.label}
                        onClick={() => {
                          setScenarioType(sc.label);
                          if (sc.label.includes("1-3 Star")) {
                            setRating("2");
                            setCustomerMessage("The item arrived smaller than I expected from the photos and took 8 days to arrive.");
                          } else if (sc.label.includes("Delayed")) {
                            setRating("5");
                            setCustomerMessage("Hi! Tracking hasn't updated in 4 days. Is my order still on the way?");
                          } else if (sc.label.includes("Custom Request")) {
                            setRating("5");
                            setCustomerMessage("Hi, can you make this necklace with 3 birth flowers and silver metal?");
                          }
                        }}
                        className={`flex items-start gap-2.5 rounded-xl border p-2.5 transition cursor-pointer ${
                          isSelected
                            ? "border-[#F1641E] bg-orange-50/50 ring-1 ring-[#F1641E]"
                            : "border-stone-200 hover:border-stone-300 bg-white"
                        }`}
                      >
                        <Icon className={`h-4 w-4 shrink-0 mt-0.5 ${isSelected ? "text-[#F1641E]" : "text-stone-400"}`} />
                        <div>
                          <span className="font-bold text-stone-900 block text-xs">{sc.label}</span>
                          <span className="text-[10px] text-stone-500">{sc.desc}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Customer Message / Review */}
              <div>
                <label className="block font-semibold text-stone-800 mb-1">
                  Customer Message / Review Text
                </label>
                <textarea
                  rows={3}
                  value={customerMessage}
                  onChange={(e) => setCustomerMessage(e.target.value)}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-900 focus:border-[#F1641E] focus:outline-none"
                />
              </div>

              {/* Order Context & Tone */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-800 mb-1">Star Rating</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-stone-900 focus:border-[#F1641E] focus:outline-none"
                  >
                    <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
                    <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
                    <option value="3">⭐⭐⭐ (3 Stars)</option>
                    <option value="2">⭐⭐ (2 Stars)</option>
                    <option value="1">⭐ (1 Star)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-800 mb-1">Tone of Voice</label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-stone-900 focus:border-[#F1641E] focus:outline-none"
                  >
                    <option value="Warm, Gracious & Artisanal">Warm & Gracious</option>
                    <option value="Professional & Solution-Focused">Professional & Direct</option>
                    <option value="Luxury Boutique White-Glove">Luxury Boutique</option>
                  </select>
                </div>
              </div>

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                id="generate-responder-btn"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#F1641E] px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-[#D94F0C] active:scale-[0.99] disabled:opacity-50 transition cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Writing Star Seller Reply...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Generate Response Templates</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Output */}
        <div className="lg:col-span-7">
          {!result ? (
            <div className="flex h-96 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-stone-200 bg-stone-50/50 p-8 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-[#F1641E] mb-3">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-stone-900">
                Star Seller Response Generator
              </h3>
              <p className="max-w-md text-xs text-stone-500 mt-1 mb-4">
                Select your scenario on the left and click generate to craft polite, policy-safe responses that delight customers.
              </p>
              <button
                type="button"
                onClick={() => handleGenerate()}
                className="rounded-lg bg-stone-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-stone-800 cursor-pointer"
              >
                Generate 5-Star Review Reply Demo
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Star Seller Compliance Tip */}
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 mb-1">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>Star Seller Protocol Tip:</span>
                </div>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  {result.starSellerTip}
                </p>
              </div>

              {/* 3 Response Options */}
              <div className="space-y-4">
                {result.options.map((option, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs flex flex-col justify-between hover:border-orange-200 transition"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-stone-900 text-xs flex items-center gap-1.5">
                          <span className="flex h-5 w-5 items-center justify-center rounded-md bg-stone-900 text-white text-[10px]">
                            {idx + 1}
                          </span>
                          {option.title}
                        </span>

                        <button
                          type="button"
                          onClick={() => copyFeedback(`reply-${idx}`, option.replyText)}
                          className="inline-flex items-center gap-1 rounded-lg border border-stone-200 bg-stone-50 px-2.5 py-1 text-xs font-semibold text-stone-700 hover:border-[#F1641E] hover:text-[#F1641E] transition cursor-pointer"
                        >
                          {copiedKey === `reply-${idx}` ? (
                            <>
                              <Check className="h-3 w-3 text-emerald-600" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              <span>Copy Response</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="rounded-xl bg-stone-50 p-3.5 border border-stone-100 text-xs text-stone-800 leading-relaxed font-medium">
                        {option.replyText}
                      </div>
                    </div>

                    <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-stone-500">
                      <span className="font-bold text-stone-700">Recommended Action:</span>
                      <span>{option.suggestedNextStep}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
