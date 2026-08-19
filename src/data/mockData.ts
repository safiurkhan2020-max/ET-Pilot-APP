import { GeneratedListing, NicheTrendsResult } from "../types";

export const SAMPLE_PRESETS = [
  {
    name: "Personalized Birth Flower Name Necklace",
    category: "Jewelry / Necklaces / Pendants",
    type: "physical" as const,
    materials: "18K Gold Plated Stainless Steel, Sterling Silver, Rose Gold",
    targetAudience: "Bridesmaids, mothers, best friends, birthday gift seekers",
    usp: "Custom stamped floral botanical art with personalized cursive name, waterproof, anti-tarnish, gift-ready velvet pouch",
    price: "$34.99",
    occasion: "Mother's Day / Birthday / Wedding Bridal Party",
    style: "Minimalist Dainty Boho Elegance",
  },
  {
    name: "ADHD Daily Digital Planner for Goodnotes",
    category: "Digital / Planners & Templates",
    type: "digital" as const,
    materials: "Hyperlinked PDF, 500+ Digital Stickers, GoodNotes & Notability compatible",
    targetAudience: "Students, neurodivergent professionals, remote workers",
    usp: "Dopamine-friendly color scheme, hyperlinked tabs, brain dump section, habit tracker, instant automatic download",
    price: "$14.50",
    occasion: "New Year / Back to School / Self-Care",
    style: "Calm Pastel Minimalist Modern",
  },
  {
    name: "Custom Hand-Painted Pet Portrait Sweatshirt",
    category: "Clothing / Unisex Sweatshirts & Hoodies",
    type: "custom" as const,
    materials: "80% Organic Cotton 20% Polyester Heavy Fleece, Non-fade embroidery thread",
    targetAudience: "Dog & cat owners, pet memorial gift buyers, animal lovers",
    usp: "Hand-digitized from customer photo, custom pet ear outline & pet name on sleeve, ultra soft cozy fit",
    price: "$48.00",
    occasion: "Christmas Gift / Pet Loss Memorial / Birthday",
    style: "Cozy Aesthetic Line Art Streetwear",
  },
  {
    name: "Rustic Reclaimed Wood Floating Shelves (Set of 2)",
    category: "Home & Living / Storage & Organization / Shelves",
    type: "physical" as const,
    materials: "Solid American Walnut / Pine, Heavy-duty concealed metal brackets",
    targetAudience: "Homeowners, modern farmhouse decorators, bathroom remodelers",
    usp: "Includes drywall anchors & drill guide, supports up to 45 lbs, eco-friendly zero-VOC organic wax finish",
    price: "$68.00",
    occasion: "Housewarming / Home Decor",
    style: "Modern Farmhouse Industrial Warm Wood",
  },
];

export const INITIAL_TRENDS: NicheTrendsResult = {
  currentSeasonHeadline: "Etsy Q2/Q3 2026 Trend Forecast: Personalization, Textured Craft & Calm Aesthetics",
  marketTrendSummary:
    "Etsy shoppers are increasingly prioritizing tangible craftsmanship, bespoke micro-personalization (birth flowers, pet outlines, custom handwriting), tactile home goods, and dopamine-boosting organization tools.",
  trendingNiches: [
    {
      nicheName: "Botanical Birth Flower Keepsakes",
      category: "Jewelry & Personalized Gifts",
      growthRate: "+78% YoY 🚀",
      buyerPersona: "Milestone gifters, bridal party planners, daughters buying for moms",
      winningProductIdeas: [
        "Pressed real flower resin rings",
        "Laser engraved dainty wildflower keychains",
        "Embroidered floral linen tote bags",
      ],
      suggested13TagsPreview: [
        "birth flower necklace",
        "custom floral jewelry",
        "mothers day gift",
        "bridesmaid proposal",
        "dainty gold pendant",
      ],
      averagePriceRange: "$28 - $65",
    },
    {
      nicheName: "Tactile Organic Textured Wall Art",
      category: "Home & Living / Art",
      growthRate: "+115% Search Surge 🔥",
      buyerPersona: "New apartment renters, interior designers, minimalist aesthetic lovers",
      winningProductIdeas: [
        "Plaster arch framed canvases",
        "Woven chunky macrame fiber wall hangings",
        "Earthy terracotta ceramic wall bells",
      ],
      suggested13TagsPreview: [
        "textured wall art",
        "plaster canvas decor",
        "minimalist home decor",
        "large abstract canvas",
        "neutral living room",
      ],
      averagePriceRange: "$85 - $240",
    },
    {
      nicheName: "Hyper-Niche Digital Life Planners",
      category: "Digital Downloads",
      growthRate: "+92% YoY 📈",
      buyerPersona: "iPad users, college students, self-employed creatives",
      winningProductIdeas: [
        "ADHD visual routine planner",
        "Wedding budget & vendor master tracker",
        "Crochet project organizer journal",
      ],
      suggested13TagsPreview: [
        "goodnotes planner",
        "adhd daily organizer",
        "ipad digital planner",
        "hyperlinked template",
        "undated weekly agenda",
      ],
      averagePriceRange: "$9 - $22",
    },
    {
      nicheName: "Custom Pet Ear & Paw Embroidered Goods",
      category: "Clothing & Accessories",
      growthRate: "+64% Steady Demand ⭐",
      buyerPersona: "Dog moms, cat dads, sentimental pet memorial gifters",
      winningProductIdeas: [
        "Minimal line art pet sweatshirt",
        "Custom leather dog collar with phone engraving",
        "Ceramic handmade food bowl with raised pet name",
      ],
      suggested13TagsPreview: [
        "custom pet portrait",
        "dog mom sweatshirt",
        "pet loss memorial",
        "embroidered dog ears",
        "personalized cat gift",
      ],
      averagePriceRange: "$35 - $75",
    },
  ],
  seasonalGiftingCalendar: [
    {
      occasion: "Mother's Day & Spring Gifting",
      timing: "Peak Search: March - Early May",
      keyProducts: "Personalized necklaces, custom mama apparel, handmade soaps, garden markers",
      marketingTip: "Start running Pinterest pins 60 days in advance to capture early gift planners.",
    },
    {
      occasion: "Wedding & Bridal Season",
      timing: "Peak Search: April - September",
      keyProducts: "Bridesmaid gifts, acrylic wedding signage, personalized guestbooks, vow books",
      marketingTip: "Bundle items in sets of 4-8 with tiered discounts to boost Etsy Average Order Value (AOV).",
    },
    {
      occasion: "Back to School & Fall Organization",
      timing: "Peak Search: July - September",
      keyProducts: "Teacher appreciation mugs, student digital planners, desk organizers, cozy knit scarves",
      marketingTip: "Focus on instant digital downloads and fast dispatch physical items.",
    },
    {
      occasion: "Holiday & Q4 Christmas Rush",
      timing: "Peak Search: October - December 15",
      keyProducts: "Personalized ornaments, family matching outfits, unique handmade secret Santa gifts",
      marketingTip: "Offer gift wrapping as an Etsy listing variation upgrade to command an extra $4-6 margin.",
    },
  ],
};

export const SAMPLE_AUDIT_DATA = {
  title: "Necklace for women gold jewelry gift cute handmade pendant birthday present dainty chain mom",
  tags: ["necklace", "jewelry", "gold", "gift", "handmade", "mom", "birthday", "pendant", "cute"],
  price: "29.99",
  category: "Jewelry / Necklaces",
  description: "Nice gold necklace for sale. Looks very pretty and comes in a small box. Please contact me if you have any questions.",
};

export const DEFAULT_LISTING: GeneratedListing = {
  id: "demo-listing-1",
  createdAt: new Date().toISOString(),
  productName: "Personalized Birth Flower Name Necklace",
  category: "Jewelry / Necklaces / Pendants",
  listingType: "physical",
  pricePoint: "$34.99",
  seoScore: 97,
  targetKeywords: [
    "personalized birth flower necklace",
    "custom name jewelry",
    "mothers day gift",
    "dainty gold floral pendant",
    "bridesmaid proposal gift",
  ],
  selectedTitleIndex: 0,
  titles: [
    {
      style: "Search Optimized (Top Ranking)",
      title: "Personalized Birth Flower Name Necklace, Dainty Custom Floral Pendant, 18K Gold Botanical Jewelry, Gift for Mom, Bridesmaid Gifts",
      charCount: 138,
      frontloadedKeywords: "Personalized Birth Flower Name Necklace, Dainty Custom Floral Pendant",
    },
    {
      style: "Editorial & Gift Flow",
      title: "Custom Birth Flower Necklace with Name • Dainty Floral Pendant in 18K Gold or Silver • Sentimental Birthday & Mother's Day Gift",
      charCount: 133,
      frontloadedKeywords: "Custom Birth Flower Necklace with Name",
    },
    {
      style: "High-Intent Gifting Focus",
      title: "Birth Flower Name Necklace, Gift for Mom from Daughter, Personalized Bridesmaid Jewelry, Minimalist Dainty Botanical Pendant Choker",
      charCount: 139,
      frontloadedKeywords: "Birth Flower Name Necklace, Gift for Mom",
    },
  ],
  tags: [
    { tag: "birth flower necklace", charCount: 20, searchIntent: "Primary Product", competitionEstimate: "Medium" },
    { tag: "custom name pendant", charCount: 19, searchIntent: "Customization", competitionEstimate: "Medium" },
    { tag: "gift for mom necklace", charCount: 20, searchIntent: "Gift Intent", competitionEstimate: "High" },
    { tag: "bridesmaid jewelry", charCount: 18, searchIntent: "Occasion", competitionEstimate: "High" },
    { tag: "dainty gold floral", charCount: 18, searchIntent: "Aesthetic", competitionEstimate: "Low" },
    { tag: "personalized floral", charCount: 19, searchIntent: "Product Type", competitionEstimate: "Low" },
    { tag: "botanical pendant", charCount: 17, searchIntent: "Style", competitionEstimate: "Low" },
    { tag: "mothers day gift", charCount: 16, searchIntent: "Seasonal", competitionEstimate: "High" },
    { tag: "best friend birthday", charCount: 20, searchIntent: "Recipient", competitionEstimate: "Medium" },
    { tag: "18k gold necklace", charCount: 17, searchIntent: "Material", competitionEstimate: "Medium" },
    { tag: "minimalist jewelry", charCount: 18, searchIntent: "Style", competitionEstimate: "High" },
    { tag: "engraved name tag", charCount: 17, searchIntent: "Feature", competitionEstimate: "Low" },
    { tag: "sentimental keepsake", charCount: 20, searchIntent: "Gift Emotional", competitionEstimate: "Low" },
  ],
  description: {
    hook: "✨ Celebrate the people you cherish most with a timeless, custom-engraved Birth Flower Name Necklace. Each piece combines delicate hand-drawn botanical blooms with bespoke typography, creating an unforgettable everyday keepsake.",
    keyFeatures: [
      "🌿 Custom Engraved: Choose any birth flower (Jan-Dec) paired with your custom name, initials, or meaningful word",
      "💎 Premium Durability: Dipped in genuine 18K Gold or Sterling Silver over medical-grade 316L stainless steel — 100% waterproof, sweatproof, and tarnish-resistant",
      "📏 Adjustable Comfort: 16-inch chain with a 2-inch extender for versatile layering",
      "🎁 Luxury Gift Ready: Packaged in an embossed velvet jewelry box with an illustrated flower meaning card",
    ],
    specifications: "• Disc Diameter: 15mm (0.6 in)\n• Chain Length: 16\" + 2\" extender\n• Finishes: 18K Yellow Gold, Rose Gold, Classic Polished Silver\n• Hypoallergenic & Nickel-Free",
    howToOrder: "1. Select your preferred finish (Gold, Silver, Rose Gold).\n2. Choose your necklace chain length.\n3. In the Personalization Box, enter: Month/Flower (e.g. June/Rose) + Name (e.g. Sophia).",
    shippingAndPackaging: "• Handmade to order within 2–4 business days\n• Free US Tracked Shipping via USPS First Class (3–5 business days)\n• Expedited Priority Shipping upgrade available at checkout",
    faqs: [
      {
        question: "Can I wear this in the shower or gym?",
        answer: "Yes! Our 18K gold and silver plating uses physical vapor deposition (PVD) over 316L stainless steel, meaning it will not tarnish or turn your skin green.",
      },
      {
        question: "Can I put two flowers on one disc?",
        answer: "Yes, we can fit up to 2 birth flowers and 2 short names on a single pendant disc upon request!",
      },
      {
        question: "Is gift wrapping available?",
        answer: "Every piece arrives in our signature velvet pouch, and you can add our premium gift box and handwritten gift note during checkout.",
      },
    ],
    fullFormattedText: `✨ Celebrate the people you cherish most with a timeless, custom-engraved Birth Flower Name Necklace. Each piece combines delicate hand-drawn botanical blooms with bespoke typography, creating an unforgettable everyday keepsake.

WHY YOU'LL LOVE IT:
• 🌿 Custom Engraved: Choose any birth flower (Jan-Dec) paired with your custom name, initials, or meaningful word
• 💎 Premium Durability: Dipped in genuine 18K Gold or Sterling Silver over medical-grade 316L stainless steel — 100% waterproof, sweatproof, and tarnish-resistant
• 📏 Adjustable Comfort: 16-inch chain with a 2-inch extender for versatile layering
• 🎁 Luxury Gift Ready: Packaged in an embossed velvet jewelry box with an illustrated flower meaning card

ITEM SPECIFICATIONS:
• Disc Diameter: 15mm (0.6 in)
• Chain Length: 16" + 2" extender
• Finishes: 18K Yellow Gold, Rose Gold, Classic Polished Silver
• Hypoallergenic, Lead-free, and Nickel-Free

HOW TO PERSONALIZE:
1. Select your preferred Metal Finish from the dropdown.
2. Choose your chain length.
3. In the "Add your personalization" box, provide:
   - Month & Flower (e.g., May - Lily of the Valley)
   - Name / Text to engrave (Max 10 characters)
   - Font Style (Script or Clean Serif)

PROCESSING & SHIPPING:
• Handcrafted with love in 2–4 business days
• Fast tracked shipping across the US & Worldwide
• Carefully packaged to arrive in pristine gifting condition

FREQUENTLY ASKED QUESTIONS:
Q: Will it fade or tarnish?
A: No! We use high-grade PVD plating over hypoallergenic stainless steel designed for daily wear.

Q: Can you include a gift note?
A: Absolutely! Mark as gift at checkout and we'll print your personal message on our botanical card.

Thank you for supporting our small handmade workshop! 🤍`,
  },
  photoAltTexts: [
    {
      photoSlot: "Photo 1 (Hero/Thumbnail)",
      altText: "Personalized birth flower necklace in 18k gold displayed on linen background with delicate dried flowers",
      recommendedAngle: "45-degree angle top-down close-up with soft natural lighting and clear engraved name detail",
    },
    {
      photoSlot: "Photo 2 (On Model / Scale)",
      altText: "Dainty custom floral pendant necklace worn on female collarbone showing realistic scale and chain drape",
      recommendedAngle: "Lifestyle chest shot wearing a neutral knitted top for warmth and relatable buyer context",
    },
    {
      photoSlot: "Photo 3 (Flower Chart / Customization)",
      altText: "All 12 birth flowers January to December illustrated with names and symbol meanings chart",
      recommendedAngle: "Crisp high-resolution infographic graphic aiding instant buyer selection",
    },
    {
      photoSlot: "Photo 4 (Packaging / Unboxing)",
      altText: "Open velvet gift box with personalized gold necklace and floral meaning card ready for gift giving",
      recommendedAngle: "Overhead flat lay highlighting luxury presentation",
    },
    {
      photoSlot: "Photo 5 (Material & Water Test)",
      altText: "Water droplets on tarnish-proof gold pendant highlighting waterproof and sweatproof durability",
      recommendedAngle: "Macro close-up showing polished mirror shine and clean laser engraving edges",
    },
  ],
  pricingStrategy: {
    suggestedRange: "$32.00 - $42.00",
    psychologicalPrice: "$34.99 (Anchor against $50 department store jewelry)",
    upsellIdea: "Add a matching birth flower bracelet variation or 2nd engraved disc for +$14.00",
  },
};
