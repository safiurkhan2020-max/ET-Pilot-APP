import React from "react";
import {
  Compass,
  FileText,
  Search,
  Sparkles,
  TrendingUp,
  Share2,
  Calculator,
  MessageSquare,
  Bookmark,
  CheckCircle2,
  Flame,
} from "lucide-react";

export type ActiveTab =
  | "generator"
  | "audit"
  | "keywords"
  | "social"
  | "trends"
  | "calculator"
  | "responder"
  | "workspace";

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  savedCount: number;
  onQuickNewListing: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  savedCount,
  onQuickNewListing,
}) => {
  const navItems = [
    { id: "generator" as const, label: "Listing Architect", icon: Sparkles, badge: "AI SEO" },
    { id: "audit" as const, label: "Listing Auditor", icon: Search, badge: "Score" },
    { id: "keywords" as const, label: "Keyword Explorer", icon: Compass, badge: "Longtail" },
    { id: "trends" as const, label: "Trend Radar", icon: TrendingUp, badge: "2026", isHot: true },
    { id: "social" as const, label: "Pinterest & Social", icon: Share2, badge: "Traffic" },
    { id: "calculator" as const, label: "Profit & Ads ROAS", icon: Calculator },
    { id: "responder" as const, label: "Review & Messages", icon: MessageSquare },
    { id: "workspace" as const, label: "Saved Drafts", icon: Bookmark, count: savedCount },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur-md">
      {/* Top Banner with Brand Identity */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6">
        <div className="flex items-center gap-3">
          <div
            id="brand-logo-container"
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl bg-gradient-to-br from-[#F1641E] to-[#D94F0C] text-white shadow-sm transition hover:scale-105"
            onClick={() => setActiveTab("generator")}
          >
            <Compass className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-stone-900">
                ET <span className="text-[#F1641E]">Pilot</span>
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2 py-0.5 text-xs font-semibold text-[#D94F0C] border border-orange-200/60">
                <Flame className="h-3 w-3 text-[#F1641E]" /> Etsy Marketing Suite
              </span>
            </div>
            <p className="hidden text-xs text-stone-500 sm:block">
              AI Listing SEO, 13-Tag Engine, Pinterest Traffic & Profit Simulator
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50/80 px-3 py-1 text-xs font-medium text-emerald-800 md:flex">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            <span>Star Seller SEO Algorithms Ready</span>
          </div>

          <button
            id="quick-new-listing-btn"
            onClick={() => {
              onQuickNewListing();
              setActiveTab("generator");
            }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#F1641E] px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#D94F0C] active:scale-95 cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Create Listing</span>
          </button>
        </div>
      </div>

      {/* Navigation Scrollable Bar */}
      <div className="mx-auto max-w-7xl overflow-x-auto px-4 scrollbar-none sm:px-6">
        <nav className="flex space-x-1 py-1.5" aria-label="Tabs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition cursor-pointer ${
                  isActive
                    ? "bg-stone-900 text-white shadow-sm"
                    : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-[#F1641E]" : "text-stone-400"}`} />
                <span>{item.label}</span>

                {item.badge && !isActive && (
                  <span
                    className={`rounded px-1.5 py-0.2 text-[10px] font-semibold ${
                      item.isHot
                        ? "bg-red-100 text-red-700"
                        : "bg-stone-100 text-stone-600"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}

                {item.count !== undefined && item.count > 0 && (
                  <span className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                    isActive ? "bg-orange-500 text-white" : "bg-stone-200 text-stone-800"
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
