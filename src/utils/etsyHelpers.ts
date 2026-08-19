import confetti from "canvas-confetti";
import { EtsyTag, GeneratedListing } from "../types";

export interface TagValidationResult {
  isValid: boolean;
  count: number;
  remainingSlots: number;
  invalidTags: { tag: string; reason: string }[];
  duplicates: string[];
  totalCharacters: number;
}

export function validateEtsyTags(tags: (string | EtsyTag)[]): TagValidationResult {
  const tagStrings = tags.map((t) => (typeof t === "string" ? t.trim() : t.tag.trim())).filter(Boolean);
  const count = tagStrings.length;
  const invalidTags: { tag: string; reason: string }[] = [];
  const duplicates: string[] = [];
  const seen = new Set<string>();

  tagStrings.forEach((tag) => {
    const lower = tag.toLowerCase();
    if (seen.has(lower)) {
      duplicates.push(tag);
    } else {
      seen.add(lower);
    }

    if (tag.length > 20) {
      invalidTags.push({ tag, reason: `Exceeds 20 characters (${tag.length}/20)` });
    }
    if (/[!@#$%^&*()_+=\[\]{};':"\\|,.<>\/?]/.test(tag)) {
      invalidTags.push({ tag, reason: "Contains special characters not recommended on Etsy" });
    }
  });

  return {
    isValid: count <= 13 && invalidTags.length === 0 && duplicates.length === 0,
    count,
    remainingSlots: Math.max(0, 13 - count),
    invalidTags,
    duplicates,
    totalCharacters: tagStrings.reduce((acc, t) => acc + t.length, 0),
  };
}

export function triggerConfetti() {
  confetti({
    particleCount: 50,
    spread: 60,
    origin: { y: 0.8 },
    colors: ["#F1641E", "#059669", "#6366F1", "#F59E0B"],
  });
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // fallback
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    const success = document.execCommand("copy");
    document.body.removeChild(textArea);
    return success;
  }
}

export function exportListingToCSV(listing: GeneratedListing) {
  const activeTitle = listing.titles[listing.selectedTitleIndex]?.title || listing.titles[0]?.title || "";
  const tagList = listing.tags.map((t) => t.tag).join(",");

  const headers = ["Title", "Description", "Price", "Tags", "Category", "Item Type", "SEO Score"];
  const row = [
    `"${activeTitle.replace(/"/g, '""')}"`,
    `"${listing.description.fullFormattedText.replace(/"/g, '""')}"`,
    `"${listing.pricePoint.replace(/"/g, '""')}"`,
    `"${tagList.replace(/"/g, '""')}"`,
    `"${listing.category.replace(/"/g, '""')}"`,
    `"${listing.listingType}"`,
    `"${listing.seoScore}"`,
  ];

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), row.join(",")].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `Etsy_Listing_${listing.productName.replace(/[^a-zA-Z0-9]/g, "_")}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export interface EtsyFeeCalculation {
  listingPrice: number;
  shippingCharged: number;
  totalRevenue: number;
  itemCost: number;
  shippingCost: number;
  listingFee: number; // $0.20
  transactionFee: number; // 6.5% of total revenue
  paymentFee: number; // 3% + $0.25 (US standard)
  offsiteAdsFee: number; // 0%, 12%, or 15%
  adSpendPerSale: number; // Estimated Etsy Ads cost
  totalFees: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
  breakEvenRoas: number;
}

export function calculateEtsyFees({
  price,
  shippingCharge = 0,
  itemCost = 0,
  shippingCost = 0,
  offsiteAdsRate = 0, // 0, 0.12, 0.15
  dailyAdBudget = 0,
  estimatedOrdersPerDay = 1,
}: {
  price: number;
  shippingCharge?: number;
  itemCost?: number;
  shippingCost?: number;
  offsiteAdsRate?: number;
  dailyAdBudget?: number;
  estimatedOrdersPerDay?: number;
}): EtsyFeeCalculation {
  const totalRevenue = price + shippingCharge;
  const listingFee = 0.20;
  const transactionFee = totalRevenue * 0.065;
  const paymentFee = totalRevenue * 0.03 + 0.25;
  const offsiteAdsFee = totalRevenue * offsiteAdsRate;
  const adSpendPerSale = estimatedOrdersPerDay > 0 ? dailyAdBudget / estimatedOrdersPerDay : 0;

  const totalFees = listingFee + transactionFee + paymentFee + offsiteAdsFee;
  const totalExpenses = itemCost + shippingCost + totalFees + adSpendPerSale;
  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

  // Break-even ROAS = Total Revenue / (Total Revenue - (Fees + COGS))
  const directCostsWithoutAds = itemCost + shippingCost + totalFees;
  const marginBeforeAds = totalRevenue - directCostsWithoutAds;
  const breakEvenRoas = marginBeforeAds > 0 ? totalRevenue / marginBeforeAds : 999;

  return {
    listingPrice: price,
    shippingCharged: shippingCharge,
    totalRevenue,
    itemCost,
    shippingCost,
    listingFee,
    transactionFee,
    paymentFee,
    offsiteAdsFee,
    adSpendPerSale,
    totalFees,
    totalExpenses,
    netProfit,
    profitMargin,
    breakEvenRoas,
  };
}
