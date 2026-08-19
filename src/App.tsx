import React, { useState, useEffect } from "react";
import { Navbar, ActiveTab } from "./components/Navbar";
import { ListingGenerator } from "./components/ListingGenerator";
import { ListingAuditor } from "./components/ListingAuditor";
import { KeywordExplorer } from "./components/KeywordExplorer";
import { SocialMarketingHub } from "./components/SocialMarketingHub";
import { NicheTrendsRadar } from "./components/NicheTrendsRadar";
import { ProfitCalculator } from "./components/ProfitCalculator";
import { ReviewResponder } from "./components/ReviewResponder";
import { SavedWorkspace } from "./components/SavedWorkspace";
import { GeneratedListing } from "./types";
import { DEFAULT_LISTING } from "./data/mockData";
import { Sparkles, ShieldCheck, Heart, ExternalLink, Flame } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("generator");
  const [currentListing, setCurrentListing] = useState<GeneratedListing | null>(DEFAULT_LISTING);
  const [savedListings, setSavedListings] = useState<GeneratedListing[]>(() => {
    try {
      const saved = localStorage.getItem("et_pilot_saved_listings");
      return saved ? JSON.parse(saved) : [DEFAULT_LISTING];
    } catch {
      return [DEFAULT_LISTING];
    }
  });

  const [calculatorPrice, setCalculatorPrice] = useState<number>(34.99);

  useEffect(() => {
    try {
      localStorage.setItem("et_pilot_saved_listings", JSON.stringify(savedListings));
    } catch (e) {
      console.error(e);
    }
  }, [savedListings]);

  const handleSaveListing = (listing: GeneratedListing) => {
    setSavedListings((prev) => {
      const existsIndex = prev.findIndex((l) => l.id === listing.id);
      if (existsIndex >= 0) {
        const updated = [...prev];
        updated[existsIndex] = listing;
        return updated;
      }
      return [listing, ...prev];
    });
  };

  const handleDeleteListing = (id: string) => {
    setSavedListings((prev) => prev.filter((l) => l.id !== id));
  };

  const handleClearAll = () => {
    setSavedListings([]);
  };

  const handleSendToSocial = (listing: GeneratedListing) => {
    setCurrentListing(listing);
    setActiveTab("social");
  };

  const handleSendToCalculator = (price: number) => {
    setCalculatorPrice(price);
    setActiveTab("calculator");
  };

  const handleQuickNewListing = () => {
    setCurrentListing(null);
    setActiveTab("generator");
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-stone-900 font-sans antialiased flex flex-col justify-between">
      <div>
        {/* Top Navbar */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          savedCount={savedListings.length}
          onQuickNewListing={handleQuickNewListing}
        />

        {/* Main Content Area */}
        <main className="pb-16">
          {activeTab === "generator" && (
            <ListingGenerator
              currentListing={currentListing}
              setCurrentListing={setCurrentListing}
              onSaveListing={handleSaveListing}
              onSendToSocial={handleSendToSocial}
              onSendToCalculator={handleSendToCalculator}
            />
          )}

          {activeTab === "audit" && (
            <ListingAuditor
              onApplyFixedListing={(partial) => {
                setActiveTab("generator");
              }}
            />
          )}

          {activeTab === "keywords" && <KeywordExplorer />}

          {activeTab === "social" && (
            <SocialMarketingHub initialListing={currentListing} />
          )}

          {activeTab === "trends" && (
            <NicheTrendsRadar
              onUseTrendTags={(tags) => {
                setActiveTab("generator");
              }}
            />
          )}

          {activeTab === "calculator" && (
            <ProfitCalculator initialPrice={calculatorPrice} />
          )}

          {activeTab === "responder" && <ReviewResponder />}

          {activeTab === "workspace" && (
            <SavedWorkspace
              savedListings={savedListings}
              onLoadListing={(listing) => {
                setCurrentListing(listing);
                setActiveTab("generator");
              }}
              onDeleteListing={handleDeleteListing}
              onClearAll={handleClearAll}
            />
          )}
        </main>
      </div>

      {/* Global Footer */}
      <footer className="border-t border-stone-200 bg-white py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-900">
              ET <span className="text-[#F1641E]">Pilot</span>
            </span>
            <span>• Built for Etsy Sellers, Handmade Makers & Digital Artisans</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-emerald-700">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              100% Etsy Search Algorithm & 13-Tag Limit Compliant
            </span>
            <span className="text-stone-300">|</span>
            <span>Etsy is a trademark of Etsy, Inc. ET Pilot is an independent optimization tool.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
