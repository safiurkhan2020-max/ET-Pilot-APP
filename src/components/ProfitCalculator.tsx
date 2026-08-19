import React, { useState, useEffect } from "react";
import {
  Calculator,
  DollarSign,
  TrendingUp,
  Percent,
  ShieldCheck,
  HelpCircle,
  Sparkles,
  PieChart,
} from "lucide-react";
import { calculateEtsyFees, EtsyFeeCalculation } from "../utils/etsyHelpers";

interface ProfitCalculatorProps {
  initialPrice?: number;
}

export const ProfitCalculator: React.FC<ProfitCalculatorProps> = ({ initialPrice = 34.99 }) => {
  const [price, setPrice] = useState<number>(initialPrice);
  const [shippingCharge, setShippingCharge] = useState<number>(0); // 0 = Free Shipping
  const [itemCost, setItemCost] = useState<number>(6.5); // Raw materials / COGS
  const [shippingCost, setShippingCost] = useState<number>(4.2); // Packaging + postage
  const [offsiteAdsRate, setOffsiteAdsRate] = useState<number>(0); // 0, 0.12, 0.15
  const [dailyAdBudget, setDailyAdBudget] = useState<number>(5.0);
  const [ordersPerDay, setOrdersPerDay] = useState<number>(2);

  const [calculation, setCalculation] = useState<EtsyFeeCalculation>(() =>
    calculateEtsyFees({
      price: initialPrice,
      shippingCharge: 0,
      itemCost: 6.5,
      shippingCost: 4.2,
      offsiteAdsRate: 0,
      dailyAdBudget: 5.0,
      estimatedOrdersPerDay: 2,
    })
  );

  useEffect(() => {
    const res = calculateEtsyFees({
      price,
      shippingCharge,
      itemCost,
      shippingCost,
      offsiteAdsRate,
      dailyAdBudget,
      estimatedOrdersPerDay: ordersPerDay,
    });
    setCalculation(res);
  }, [price, shippingCharge, itemCost, shippingCost, offsiteAdsRate, dailyAdBudget, ordersPerDay]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
          Etsy Profit & Ads ROAS Simulator
        </h1>
        <p className="text-sm text-stone-600 mt-1">
          Calculate your exact net profit, true Etsy fee deduction (6.5% transaction, $0.20 listing, 3%+$0.25 payment, offsite ads), and your break-even Etsy Ads ROAS.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Form: Inputs */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-4 border-b border-stone-100 pb-3">
              <Calculator className="h-4 w-4 text-[#F1641E]" />
              <h2 className="text-sm font-bold text-stone-900">Pricing & Cost Structure</h2>
            </div>

            <div className="space-y-4 text-xs">
              {/* Selling Price */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-semibold text-stone-800">
                    Listing Price ($)
                  </label>
                  <span className="font-mono font-bold text-[#F1641E]">${price.toFixed(2)}</span>
                </div>
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  value={price}
                  onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-[#F1641E] focus:outline-none"
                />
                {/* Price Slider */}
                <input
                  type="range"
                  min="5"
                  max="150"
                  step="1"
                  value={price}
                  onChange={(e) => setPrice(parseFloat(e.target.value))}
                  className="w-full mt-2 accent-[#F1641E]"
                />
              </div>

              {/* Shipping Charged to Buyer */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-800 mb-1">
                    Shipping Charged to Buyer ($)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    placeholder="0.00 (Free Shipping)"
                    value={shippingCharge}
                    onChange={(e) => setShippingCharge(parseFloat(e.target.value) || 0)}
                    className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-900 focus:border-[#F1641E] focus:outline-none"
                  />
                  <span className="text-[10px] text-stone-400 mt-0.5 block">
                    {shippingCharge === 0 ? "Free Shipping (Etsy Preferred)" : "Paid Shipping"}
                  </span>
                </div>

                <div>
                  <label className="block font-semibold text-stone-800 mb-1">
                    Product Item Cost (COGS) ($)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={itemCost}
                    onChange={(e) => setItemCost(parseFloat(e.target.value) || 0)}
                    className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-900 focus:border-[#F1641E] focus:outline-none"
                  />
                  <span className="text-[10px] text-stone-400 mt-0.5 block">
                    Raw materials, blank, or packaging
                  </span>
                </div>
              </div>

              {/* Shipping Postage Cost */}
              <div>
                <label className="block font-semibold text-stone-800 mb-1">
                  Actual Postage / Shipping Label Cost ($)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={shippingCost}
                  onChange={(e) => setShippingCost(parseFloat(e.target.value) || 0)}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-900 focus:border-[#F1641E] focus:outline-none"
                />
              </div>

              {/* Offsite Ads Setting */}
              <div>
                <label className="block font-semibold text-stone-800 mb-1">
                  Etsy Offsite Ads Fee
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setOffsiteAdsRate(0)}
                    className={`rounded-lg border p-2 text-center transition cursor-pointer ${
                      offsiteAdsRate === 0
                        ? "border-[#F1641E] bg-orange-50 text-[#F1641E] font-bold"
                        : "border-stone-200 text-stone-600 hover:bg-stone-50"
                    }`}
                  >
                    0% (Opted Out / Organic)
                  </button>
                  <button
                    type="button"
                    onClick={() => setOffsiteAdsRate(0.15)}
                    className={`rounded-lg border p-2 text-center transition cursor-pointer ${
                      offsiteAdsRate === 0.15
                        ? "border-[#F1641E] bg-orange-50 text-[#F1641E] font-bold"
                        : "border-stone-200 text-stone-600 hover:bg-stone-50"
                    }`}
                  >
                    15% (Under $10k Sales)
                  </button>
                  <button
                    type="button"
                    onClick={() => setOffsiteAdsRate(0.12)}
                    className={`rounded-lg border p-2 text-center transition cursor-pointer ${
                      offsiteAdsRate === 0.12
                        ? "border-[#F1641E] bg-orange-50 text-[#F1641E] font-bold"
                        : "border-stone-200 text-stone-600 hover:bg-stone-50"
                    }`}
                  >
                    12% (Over $10k Sales)
                  </button>
                </div>
              </div>

              {/* Etsy Onsite Ads Budget */}
              <div className="pt-2 border-t border-stone-100">
                <span className="font-bold text-stone-900 block mb-2">Etsy Onsite PPC Ads Budget</span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Daily Ad Budget ($)
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      value={dailyAdBudget}
                      onChange={(e) => setDailyAdBudget(parseFloat(e.target.value) || 0)}
                      className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-900 focus:border-[#F1641E] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Avg Daily Orders Generated
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="1"
                      value={ordersPerDay}
                      onChange={(e) => setOrdersPerDay(parseInt(e.target.value) || 1)}
                      className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-900 focus:border-[#F1641E] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Output: Fee Breakdown & ROAS */}
        <div className="lg:col-span-6 space-y-6">
          {/* Main Profit Card */}
          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4 mb-4">
              <div>
                <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                  Net Profit Per Sale
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <h3
                    className={`text-3xl font-bold ${
                      calculation.netProfit >= 0 ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    ${calculation.netProfit.toFixed(2)}
                  </h3>
                  <span className="text-sm font-semibold text-stone-500">
                    ({calculation.profitMargin.toFixed(1)}% Margin)
                  </span>
                </div>
              </div>

              <div
                className={`rounded-2xl px-4 py-2.5 text-center font-bold text-xs ${
                  calculation.profitMargin >= 40
                    ? "bg-emerald-100 text-emerald-800"
                    : calculation.profitMargin >= 20
                    ? "bg-blue-100 text-blue-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                <span>
                  {calculation.profitMargin >= 40
                    ? "🔥 High Profit"
                    : calculation.profitMargin >= 20
                    ? "✨ Healthy Margin"
                    : "⚠️ Low Margin"}
                </span>
              </div>
            </div>

            {/* Detailed Fee List */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-stone-50">
                <span className="text-stone-600">Total Customer Paid (Gross):</span>
                <span className="font-bold text-stone-900">${calculation.totalRevenue.toFixed(2)}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-stone-50 text-stone-600">
                <span>Etsy Listing Fee:</span>
                <span className="font-mono text-stone-800">-${calculation.listingFee.toFixed(2)}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-stone-50 text-stone-600">
                <span>Etsy Transaction Fee (6.5%):</span>
                <span className="font-mono text-stone-800">-${calculation.transactionFee.toFixed(2)}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-stone-50 text-stone-600">
                <span>Payment Processing Fee (3% + $0.25):</span>
                <span className="font-mono text-stone-800">-${calculation.paymentFee.toFixed(2)}</span>
              </div>

              {calculation.offsiteAdsFee > 0 && (
                <div className="flex justify-between py-1 border-b border-stone-50 text-amber-700">
                  <span>Offsite Ads Fee ({(offsiteAdsRate * 100).toFixed(0)}%):</span>
                  <span className="font-mono font-bold">-${calculation.offsiteAdsFee.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between py-1 border-b border-stone-50 text-stone-600">
                <span>Product Item Cost (COGS):</span>
                <span className="font-mono text-stone-800">-${calculation.itemCost.toFixed(2)}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-stone-50 text-stone-600">
                <span>Actual Postage / Shipping Label:</span>
                <span className="font-mono text-stone-800">-${calculation.shippingCost.toFixed(2)}</span>
              </div>

              {dailyAdBudget > 0 && (
                <div className="flex justify-between py-1 border-b border-stone-50 text-indigo-700">
                  <span>Ad Spend Allocated Per Sale:</span>
                  <span className="font-mono font-bold">-${calculation.adSpendPerSale.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between pt-2 text-stone-900 font-bold">
                <span>Total Etsy Fee Cut:</span>
                <span className="text-[#F1641E]">
                  ${calculation.totalFees.toFixed(2)} (
                  {((calculation.totalFees / calculation.totalRevenue) * 100).toFixed(1)}% of price)
                </span>
              </div>
            </div>
          </div>

          {/* Etsy Ads Break-Even ROAS Target Card */}
          <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-2 text-indigo-900 font-bold text-sm">
              <TrendingUp className="h-4 w-4 text-indigo-600" />
              <span>Etsy Ads Break-Even ROAS Target</span>
            </div>

            <p className="text-xs text-stone-600 mb-3">
              To not lose money when running Etsy Onsite Search Ads on this item, your minimum Return on Ad Spend (ROAS) must be:
            </p>

            <div className="flex items-center justify-between rounded-xl bg-white border border-indigo-100 p-3.5 shadow-2xs">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                  Minimum Break-Even ROAS
                </span>
                <p className="text-2xl font-bold text-indigo-700">
                  {calculation.breakEvenRoas > 50 ? "N/A" : `${calculation.breakEvenRoas.toFixed(2)}x`}
                </p>
              </div>

              <div className="text-right text-xs text-stone-500">
                <span className="font-semibold text-stone-800 block">Max Cost Per Acquisition:</span>
                <span className="font-bold text-emerald-600 text-sm">
                  ${(calculation.totalRevenue - (calculation.itemCost + calculation.shippingCost + calculation.totalFees)).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
