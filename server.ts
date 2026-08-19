import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize GoogleGenAI with server-side API key
function getAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// API Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "ET Pilot Etsy Marketing Server" });
});

// 1. Generate Etsy Listing
app.post("/api/generate-listing", async (req, res) => {
  try {
    const {
      productName,
      category,
      materials,
      targetAudience,
      uniqueSellingPoints,
      pricePoint,
      listingType, // 'physical' | 'digital' | 'custom'
      occasion,
      styleVibe,
    } = req.body;

    if (!productName) {
      return res.status(400).json({ error: "Product name is required" });
    }

    const ai = getAI();

    const prompt = `You are the world's #1 Etsy SEO and Marketing algorithm expert. Generate an ultra-high-converting, algorithm-optimized Etsy listing for the following item:
Product Name / Concept: ${productName}
Etsy Category: ${category || "General Handmade / Craft"}
Type: ${listingType || "physical"}
Materials / Medium: ${materials || "Not specified"}
Target Audience / Recipient: ${targetAudience || "Gift buyers, stylish shoppers"}
Key Features / USPs: ${uniqueSellingPoints || "Handmade, high quality"}
Price Point: ${pricePoint || "$25"}
Special Occasion: ${occasion || "Everyday / Gift"}
Style / Aesthetic: ${styleVibe || "Modern, Artisanal"}

CRITICAL ETSY SEO RULES:
1. Etsy Titles: Must frontload the most searched 2-3 keywords in the first 40 characters (as mobile truncates after that). Max 140 characters. Provide 3 distinct title variations (Classic Search Optimized with delimiters, Natural Flow, and Ultra-Targeted Gifting).
2. Etsy Tags: MUST PROVIDE EXACTLY 13 TAGS. Each tag MUST be 20 characters or fewer (strict Etsy limit). Multi-word phrases are best (e.g., "gift for mom", "custom wood sign"). No single generic words if multi-word fits.
3. Description: Structured with:
   - Compelling emotional hook / one-liner
   - Highlight bullets (Why buyers love it)
   - Specifications, Dimensions & Materials
   - How to Order / Personalization Instructions (if applicable)
   - Processing, Shipping & Packaging notes
   - FAQs (3 top buyer questions)
4. Alt-Text for 5 photos: Keyword-rich, descriptive accessibility captions for Google Image & Etsy Visual Search.
5. Primary Keywords & Search Intent Breakdown.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            titles: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  style: { type: Type.STRING, description: "e.g. 'Search Optimized', 'Editorial Flow', 'Gift Buyer Focus'" },
                  title: { type: Type.STRING, description: "Etsy listing title, max 140 chars" },
                  charCount: { type: Type.INTEGER },
                  frontloadedKeywords: { type: Type.STRING },
                },
                required: ["style", "title", "charCount", "frontloadedKeywords"],
              },
            },
            tags: {
              type: Type.ARRAY,
              description: "Strictly 13 tags, each max 20 chars",
              items: {
                type: Type.OBJECT,
                properties: {
                  tag: { type: Type.STRING, description: "Tag text max 20 chars" },
                  charCount: { type: Type.INTEGER },
                  searchIntent: { type: Type.STRING, description: "e.g. 'Gift Intent', 'Style Identifier', 'Product Type', 'Occasion'" },
                  competitionEstimate: { type: Type.STRING, description: "'Low', 'Medium', 'High'" },
                },
                required: ["tag", "charCount", "searchIntent", "competitionEstimate"],
              },
            },
            description: {
              type: Type.OBJECT,
              properties: {
                hook: { type: Type.STRING },
                keyFeatures: { type: Type.ARRAY, items: { type: Type.STRING } },
                specifications: { type: Type.STRING },
                howToOrder: { type: Type.STRING },
                shippingAndPackaging: { type: Type.STRING },
                faqs: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      question: { type: Type.STRING },
                      answer: { type: Type.STRING },
                    },
                    required: ["question", "answer"],
                  },
                },
                fullFormattedText: { type: Type.STRING, description: "Full copy-paste ready description" },
              },
              required: ["hook", "keyFeatures", "specifications", "howToOrder", "shippingAndPackaging", "faqs", "fullFormattedText"],
            },
            photoAltTexts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  photoSlot: { type: Type.STRING, description: "e.g. 'Photo 1 (Hero/Thumbnail)', 'Photo 2 (Detail/Texture)'" },
                  altText: { type: Type.STRING },
                  recommendedAngle: { type: Type.STRING },
                },
                required: ["photoSlot", "altText", "recommendedAngle"],
              },
            },
            pricingStrategy: {
              type: Type.OBJECT,
              properties: {
                suggestedRange: { type: Type.STRING },
                psychologicalPrice: { type: Type.STRING },
                upsellIdea: { type: Type.STRING },
              },
              required: ["suggestedRange", "psychologicalPrice", "upsellIdea"],
            },
            seoScore: { type: Type.INTEGER, description: "Score from 85-99" },
            targetKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["titles", "tags", "description", "photoAltTexts", "pricingStrategy", "seoScore", "targetKeywords"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Generate listing error:", error);
    res.status(500).json({ error: error.message || "Failed to generate Etsy listing" });
  }
});

// 2. Audit & Optimize Existing Listing
app.post("/api/audit-listing", async (req, res) => {
  try {
    const { title, tags, description, price, category } = req.body;

    if (!title && !description && !tags) {
      return res.status(400).json({ error: "Please provide listing title, tags, or description to audit" });
    }

    const ai = getAI();

    const prompt = `You are a senior Etsy SEO Auditor and algorithm specialist. Audit the following Etsy listing against current Etsy Search Rank guidelines:
Title: "${title || ""}"
Tags provided (${Array.isArray(tags) ? tags.length : 0}): ${JSON.stringify(tags || [])}
Price: "${price || "Not specified"}"
Category: "${category || "Handmade"}"
Description: """${(description || "").slice(0, 1500)}"""

Perform a ruthless, thorough audit on:
1. Title SEO (Character utilization out of 140, keyword repetition, frontloading effectiveness, mobile preview check).
2. Tag Quality & Quantity (Did they use all 13 tags? Are tags under 20 chars? Are there wasted single-word tags or duplicate tags with the title?).
3. Description Conversion (First 160 chars hook for Google meta, readability, clarity of dimensions, sizing, ordering instructions).
4. Missing High-Volume Opportunity Keywords.
5. Overall Listing Health Score (0-100) and letter grade (A+, A, B, C, D, F).
6. Provide an INSTANTLY OPTIMIZED 1-Click fixed version of the title, 13 perfect tags, and optimized hook.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallScore: { type: Type.INTEGER },
            grade: { type: Type.STRING },
            summary: { type: Type.STRING },
            metrics: {
              type: Type.OBJECT,
              properties: {
                titleStrength: { type: Type.INTEGER },
                tagCoverage: { type: Type.INTEGER },
                keywordDiversity: { type: Type.INTEGER },
                conversionReadability: { type: Type.INTEGER },
              },
              required: ["titleStrength", "tagCoverage", "keywordDiversity", "conversionReadability"],
            },
            criticalIssues: { type: Type.ARRAY, items: { type: Type.STRING } },
            goodPractices: { type: Type.ARRAY, items: { type: Type.STRING } },
            missingKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            optimizedFixes: {
              type: Type.OBJECT,
              properties: {
                recommendedTitle: { type: Type.STRING },
                titleImprovementReason: { type: Type.STRING },
                recommended13Tags: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      tag: { type: Type.STRING },
                      charCount: { type: Type.INTEGER },
                      reason: { type: Type.STRING },
                    },
                    required: ["tag", "charCount", "reason"],
                  },
                },
                improvedDescriptionHook: { type: Type.STRING },
              },
              required: ["recommendedTitle", "titleImprovementReason", "recommended13Tags", "improvedDescriptionHook"],
            },
          },
          required: ["overallScore", "grade", "summary", "metrics", "criticalIssues", "goodPractices", "missingKeywords", "optimizedFixes"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Audit listing error:", error);
    res.status(500).json({ error: error.message || "Failed to audit listing" });
  }
});

// 3. Keyword Explorer & Niche Trends
app.post("/api/keyword-ideas", async (req, res) => {
  try {
    const { keyword, category, targetSeason } = req.body;

    if (!keyword) {
      return res.status(400).json({ error: "Seed keyword is required" });
    }

    const ai = getAI();

    const prompt = `Act as Etsy Keyword Research tool (like eRank/Marmalead). Analyze seed keyword: "${keyword}" in category "${category || "All Etsy"}".
Target Season/Occasion context: "${targetSeason || "Year-round / Current Season"}".

Generate:
1. 10 High-Opportunity Long-Tail Keywords with estimated search volume level, competition rank (Low, Med, High), Etsy click-through rate potential, and seasonal momentum.
2. 5 Gift Buyer Specific Search Terms (e.g. "gift for bride", "housewarming gift new home").
3. 5 Emerging Micro-Trends / Aesthetic Keywords related to this niche.
4. Strategic advice for ranking in Etsy's top 10 search results for this seed.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            seedKeyword: { type: Type.STRING },
            opportunityScore: { type: Type.INTEGER, description: "1-100 overall niche opportunity" },
            nicheOverview: { type: Type.STRING },
            keywords: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  term: { type: Type.STRING },
                  charCount: { type: Type.INTEGER },
                  searchVolumeTier: { type: Type.STRING, description: "e.g. 'Very High (15k+)', 'High (8k-15k)', 'Moderate (3k-8k)', 'Niche Longtail (1k-3k)'" },
                  competitionLevel: { type: Type.STRING, description: "'Low', 'Medium', 'High', 'Very High'" },
                  opportunityTier: { type: Type.STRING, description: "'Golden Nugget ⭐', 'Great', 'Moderate', 'Competitive'" },
                  buyerIntent: { type: Type.STRING, description: "e.g. 'High Purchasing Intent', 'Gift Search', 'Design Inspo'" },
                  fitsInEtsyTag: { type: Type.BOOLEAN, description: "True if 20 chars or fewer" },
                },
                required: ["term", "charCount", "searchVolumeTier", "competitionLevel", "opportunityTier", "buyerIntent", "fitsInEtsyTag"],
              },
            },
            giftingKeywords: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  term: { type: Type.STRING },
                  recipient: { type: Type.STRING },
                  seasonality: { type: Type.STRING },
                },
                required: ["term", "recipient", "seasonality"],
              },
            },
            emergingAestheticTrends: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  trendName: { type: Type.STRING },
                  description: { type: Type.STRING },
                  tagsToPair: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ["trendName", "description", "tagsToPair"],
              },
            },
            rankingStrategy: { type: Type.STRING },
          },
          required: ["seedKeyword", "opportunityScore", "nicheOverview", "keywords", "giftingKeywords", "emergingAestheticTrends", "rankingStrategy"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Keyword ideas error:", error);
    res.status(500).json({ error: error.message || "Failed to fetch keyword insights" });
  }
});

// 4. Social & Multi-Channel Marketing Generator
app.post("/api/generate-social", async (req, res) => {
  try {
    const { productName, keyFeatures, price, shopName, targetNiche, promoGoal } = req.body;

    if (!productName) {
      return res.status(400).json({ error: "Product name is required" });
    }

    const ai = getAI();

    const prompt = `You are a high-performance eCommerce social media marketing strategist specializing in driving external viral traffic to Etsy shops.
Product: "${productName}"
Shop Name: "${shopName || "Our Etsy Shop"}"
Key Features / Vibe: "${keyFeatures || "Handmade, unique, artisan quality"}"
Price: "${price || "$25"}"
Target Niche / Audience: "${targetNiche || "Aesthetic lifestyle, gift shoppers"}"
Campaign Goal: "${promoGoal || "Drive Etsy sales & Pinterest saves"}"

Generate high-converting marketing assets:
1. 3 Pinterest Pins (Pinterest is Etsy's #1 traffic channel! Generate Pin Title, 350-word SEO Description packed with natural search keywords, Best Board Ideas, Pin Overlay Text graphic prompt).
2. 2 Instagram/TikTok Reel/TikTok Video Scripts (Hook in 3 seconds, Visual concept, On-screen text, Voiceover/Music suggestion, Caption with Hashtags & Link in Bio CTA).
3. 1 Etsy Shop Announcement / Update Banner Copy (Max 250 chars).
4. 1 Email Newsletter copy (Subject lines, Preview text, Body, CTA button to Etsy listing).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            pinterestPins: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  angle: { type: Type.STRING, description: "e.g. 'Gift Guide Angle', 'Aesthetic Decor Angle', 'Problem-Solution Angle'" },
                  pinTitle: { type: Type.STRING },
                  pinDescription: { type: Type.STRING },
                  recommendedBoards: { type: Type.ARRAY, items: { type: Type.STRING } },
                  graphicTextOverlay: { type: Type.STRING },
                  hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ["angle", "pinTitle", "pinDescription", "recommendedBoards", "graphicTextOverlay", "hashtags"],
              },
            },
            shortVideoScripts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  platform: { type: Type.STRING, description: "'TikTok / Instagram Reels'" },
                  hook3Seconds: { type: Type.STRING },
                  visualSceneDirections: { type: Type.STRING },
                  onScreenText: { type: Type.STRING },
                  caption: { type: Type.STRING },
                  hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ["platform", "hook3Seconds", "visualSceneDirections", "onScreenText", "caption", "hashtags"],
              },
            },
            etsyShopAnnouncement: {
              type: Type.OBJECT,
              properties: {
                seasonalAnnouncement: { type: Type.STRING },
                saleAnnouncement: { type: Type.STRING },
              },
              required: ["seasonalAnnouncement", "saleAnnouncement"],
            },
            emailCampaign: {
              type: Type.OBJECT,
              properties: {
                subjectLines: { type: Type.ARRAY, items: { type: Type.STRING } },
                previewSnippet: { type: Type.STRING },
                bodyCopy: { type: Type.STRING },
                callToAction: { type: Type.STRING },
              },
              required: ["subjectLines", "previewSnippet", "bodyCopy", "callToAction"],
            },
          },
          required: ["pinterestPins", "shortVideoScripts", "etsyShopAnnouncement", "emailCampaign"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Generate social error:", error);
    res.status(500).json({ error: error.message || "Failed to generate social media campaigns" });
  }
});

// 5. Customer Service & Review Responder
app.post("/api/generate-response", async (req, res) => {
  try {
    const { scenarioType, customerMessage, rating, orderDetails, tone } = req.body;

    const ai = getAI();

    const prompt = `You are a 5-Star Etsy Star Seller Customer Experience Manager. Draft professional, friendly, Etsy seller protection compliant responses for:
Scenario: ${scenarioType} (e.g. '5-Star Review Reply', '1-3 Star Review Resolution', 'Delayed Shipping Inquiry', 'Custom Request Quote', 'Damaged Item on Delivery', 'Cancellation Request')
Customer Review / Message: "${customerMessage || "None provided"}"
Star Rating: ${rating || "5"}
Order Details / Shop Policy context: "${orderDetails || "Handmade with care, standard 3-5 day processing"}"
Tone: "${tone || "Warm, Professional, Gracious"}"

Provide 3 distinct options (Concise & Warm, Detailed & Supportive, Proactive with Special Offer/VIP Touch).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            scenario: { type: Type.STRING },
            starSellerTip: { type: Type.STRING },
            options: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  replyText: { type: Type.STRING },
                  suggestedNextStep: { type: Type.STRING },
                },
                required: ["title", "replyText", "suggestedNextStep"],
              },
            },
          },
          required: ["scenario", "starSellerTip", "options"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Generate response error:", error);
    res.status(500).json({ error: error.message || "Failed to generate response" });
  }
});

// 6. Seasonal Trends & Niche Radar
app.post("/api/niche-trends", async (req, res) => {
  try {
    const { categoryFilter } = req.body;
    const ai = getAI();

    const prompt = `You are the lead Etsy trend forecaster. Provide current seasonal trends, high-demand gifting occasions, breakout buyer aesthetics, and trending tag bundles on Etsy across major categories (Home & Living, Jewelry, Apparel, Digital Downloads, Paper & Party, Craft Supplies, Weddings).
Filter / focus if specified: "${categoryFilter || "All Top Categories"}".`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            currentSeasonHeadline: { type: Type.STRING },
            marketTrendSummary: { type: Type.STRING },
            trendingNiches: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  nicheName: { type: Type.STRING },
                  category: { type: Type.STRING },
                  growthRate: { type: Type.STRING, description: "e.g. '+48% YoY', 'Breakout 🚀', '+120% Search Volume'" },
                  buyerPersona: { type: Type.STRING },
                  winningProductIdeas: { type: Type.ARRAY, items: { type: Type.STRING } },
                  suggested13TagsPreview: { type: Type.ARRAY, items: { type: Type.STRING } },
                  averagePriceRange: { type: Type.STRING },
                },
                required: ["nicheName", "category", "growthRate", "buyerPersona", "winningProductIdeas", "suggested13TagsPreview", "averagePriceRange"],
              },
            },
            seasonalGiftingCalendar: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  occasion: { type: Type.STRING },
                  timing: { type: Type.STRING },
                  keyProducts: { type: Type.STRING },
                  marketingTip: { type: Type.STRING },
                },
                required: ["occasion", "timing", "keyProducts", "marketingTip"],
              },
            },
          },
          required: ["currentSeasonHeadline", "marketTrendSummary", "trendingNiches", "seasonalGiftingCalendar"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Niche trends error:", error);
    res.status(500).json({ error: error.message || "Failed to fetch niche trends" });
  }
});

// Vite middleware for development vs static build
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ET Pilot Etsy Marketing Server running on http://localhost:${PORT}`);
  });
}

start();
