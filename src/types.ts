export interface EtsyTitle {
  style: string;
  title: string;
  charCount: number;
  frontloadedKeywords: string;
}

export interface EtsyTag {
  tag: string;
  charCount: number;
  searchIntent?: string;
  competitionEstimate?: string;
  reason?: string;
}

export interface EtsyFaq {
  question: string;
  answer: string;
}

export interface EtsyDescription {
  hook: string;
  keyFeatures: string[];
  specifications: string;
  howToOrder: string;
  shippingAndPackaging: string;
  faqs: EtsyFaq[];
  fullFormattedText: string;
}

export interface PhotoAltText {
  photoSlot: string;
  altText: string;
  recommendedAngle: string;
}

export interface PricingStrategy {
  suggestedRange: string;
  psychologicalPrice: string;
  upsellIdea: string;
}

export interface GeneratedListing {
  id: string;
  createdAt: string;
  productName: string;
  category: string;
  listingType: "physical" | "digital" | "custom";
  pricePoint: string;
  seoScore: number;
  targetKeywords: string[];
  titles: EtsyTitle[];
  selectedTitleIndex: number;
  tags: EtsyTag[];
  description: EtsyDescription;
  photoAltTexts: PhotoAltText[];
  pricingStrategy: PricingStrategy;
}

export interface AuditMetrics {
  titleStrength: number;
  tagCoverage: number;
  keywordDiversity: number;
  conversionReadability: number;
}

export interface AuditResult {
  overallScore: number;
  grade: string;
  summary: string;
  metrics: AuditMetrics;
  criticalIssues: string[];
  goodPractices: string[];
  missingKeywords: string[];
  optimizedFixes: {
    recommendedTitle: string;
    titleImprovementReason: string;
    recommended13Tags: EtsyTag[];
    improvedDescriptionHook: string;
  };
}

export interface KeywordInsight {
  term: string;
  charCount: number;
  searchVolumeTier: string;
  competitionLevel: "Low" | "Medium" | "High" | "Very High" | string;
  opportunityTier: string;
  buyerIntent: string;
  fitsInEtsyTag: boolean;
}

export interface GiftingKeyword {
  term: string;
  recipient: string;
  seasonality: string;
}

export interface AestheticTrend {
  trendName: string;
  description: string;
  tagsToPair: string[];
}

export interface KeywordResearchResult {
  seedKeyword: string;
  opportunityScore: number;
  nicheOverview: string;
  keywords: KeywordInsight[];
  giftingKeywords: GiftingKeyword[];
  emergingAestheticTrends: AestheticTrend[];
  rankingStrategy: string;
}

export interface PinterestPin {
  angle: string;
  pinTitle: string;
  pinDescription: string;
  recommendedBoards: string[];
  graphicTextOverlay: string;
  hashtags: string[];
}

export interface ShortVideoScript {
  platform: string;
  hook3Seconds: string;
  visualSceneDirections: string;
  onScreenText: string;
  caption: string;
  hashtags: string[];
}

export interface EmailCampaign {
  subjectLines: string[];
  previewSnippet: string;
  bodyCopy: string;
  callToAction: string;
}

export interface SocialCampaignResult {
  pinterestPins: PinterestPin[];
  shortVideoScripts: ShortVideoScript[];
  etsyShopAnnouncement: {
    seasonalAnnouncement: string;
    saleAnnouncement: string;
  };
  emailCampaign: EmailCampaign;
}

export interface ReviewResponseOption {
  title: string;
  replyText: string;
  suggestedNextStep: string;
}

export interface ReviewResponseResult {
  scenario: string;
  starSellerTip: string;
  options: ReviewResponseOption[];
}

export interface TrendingNiche {
  nicheName: string;
  category: string;
  growthRate: string;
  buyerPersona: string;
  winningProductIdeas: string[];
  suggested13TagsPreview: string[];
  averagePriceRange: string;
}

export interface SeasonalOccasion {
  occasion: string;
  timing: string;
  keyProducts: string;
  marketingTip: string;
}

export interface NicheTrendsResult {
  currentSeasonHeadline: string;
  marketTrendSummary: string;
  trendingNiches: TrendingNiche[];
  seasonalGiftingCalendar: SeasonalOccasion[];
}
