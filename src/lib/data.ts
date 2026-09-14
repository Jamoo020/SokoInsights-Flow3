import telecomImg from "@/assets/cat-telecom.jpg";
import bankingImg from "@/assets/cat-banking.jpg";
import researchImg from "@/assets/cat-research.jpg";
import premiumImg from "@/assets/cat-premium.jpg";

export type PlanTier = "Free" | "Basic" | "Standard" | "Standard Plus" | "Premium" | "Premium Plus" | "Platinum";

export const PLAN_ORDER: PlanTier[] = [
  "Free",
  "Basic",
  "Standard",
  "Standard Plus",
  "Premium",
  "Premium Plus",
  "Platinum",
];

export function planRank(plan: PlanTier) {
  return PLAN_ORDER.indexOf(plan);
}

export type PlanBadge = "Basic" | "Standard" | "Premium";

export type Plan = {
  id: PlanTier;
  name: string;
  price: number;
  tagline: string;
  features: string[];
  surveyLimit: string;
  support: string;
  rewardRange: string;
  badge?: "Best Value" | "Best Deal";
};

export const PLANS: Plan[] = [
  {
    id: "Basic",
    name: "Basic",
    price: 199,
    tagline: "Start with entry-level research",
    features: ["Access to Basic survey category", "Profile verification", "M-PESA payouts from Ksh 2,500"],
    surveyLimit: "Up to 10 eligible surveys / month",
    support: "Email support",
    rewardRange: "Maximum possible reward range: Ksh 1,200 – 8,000 / month",
  },
  {
    id: "Standard",
    name: "Standard",
    price: 399,
    tagline: "More categories, more research demand",
    features: ["Basic + Standard categories", "Priority survey matching", "Weekly payout windows"],
    surveyLimit: "Up to 25 eligible surveys / month",
    support: "Email + WhatsApp support",
    rewardRange: "Maximum possible reward range: Ksh 3,000 – 18,000 / month",
  },
  {
    id: "Standard Plus",
    name: "Standard Plus",
    price: 499,
    tagline: "The balance most members choose",
    features: ["Basic + Standard categories", "Extra banking research", "Faster payout processing"],
    surveyLimit: "Up to 35 eligible surveys / month",
    support: "Priority email + WhatsApp",
    rewardRange: "Maximum possible reward range: Ksh 4,000 – 24,000 / month",
    badge: "Best Value",
  },
  {
    id: "Premium",
    name: "Premium",
    price: 799,
    tagline: "Full category access",
    features: ["All survey categories", "Premium brand studies", "Same-day payout review"],
    surveyLimit: "Up to 50 eligible surveys / month",
    support: "Dedicated support line",
    rewardRange: "Maximum possible reward range: Ksh 8,000 – 40,000 / month",
  },
  {
    id: "Premium Plus",
    name: "Premium Plus",
    price: 999,
    tagline: "Higher limits for active members",
    features: ["All categories", "Longer high-value studies", "Early access to new research"],
    surveyLimit: "Up to 70 eligible surveys / month",
    support: "Dedicated support line",
    rewardRange: "Maximum possible reward range: Ksh 10,000 – 52,000 / month",
  },
  {
    id: "Platinum",
    name: "Platinum",
    price: 1499,
    tagline: "Maximum access and limits",
    features: ["All categories", "Invite-only panels", "Fastest payout review"],
    surveyLimit: "Unlimited eligible surveys",
    support: "Account manager",
    rewardRange: "Maximum possible reward range: Ksh 15,000 – 76,000 / month",
    badge: "Best Deal",
  },
];

export type CategoryId = "telecom" | "banking" | "research" | "premium";

export const CATEGORY_IMAGES: Record<CategoryId, string> = {
  telecom: telecomImg,
  banking: bankingImg,
  research: researchImg,
  premium: premiumImg,
};

export const CATEGORY_LABELS: Record<CategoryId, string> = {
  telecom: "Telecom",
  banking: "Banking",
  research: "Research",
  premium: "Premium",
};

export type Question = {
  id: string;
  prompt: string;
  options: string[];
};

export type Survey = {
  id: string;
  title: string;
  brand: string;
  category: CategoryId;
  plan: PlanBadge;
  questions: number;
  minutes: number;
  maxReward: number;
  questionSet: Question[];
};

function qs(brand: string, topic: string, count: number): Question[] {
  const base: Question[] = [
    {
      id: "q1",
      prompt: `How often do you use ${brand} services?`,
      options: ["Daily", "A few times a week", "A few times a month", "Rarely or never"],
    },
    {
      id: "q2",
      prompt: `Which ${topic} matters most to you?`,
      options: ["Cost", "Reliability", "Customer care", "Convenience"],
    },
    {
      id: "q3",
      prompt: `How would you rate your last experience with ${brand}?`,
      options: ["Excellent", "Good", "Average", "Poor"],
    },
    {
      id: "q4",
      prompt: `Would you recommend ${brand} to a friend or family member?`,
      options: ["Definitely", "Probably", "Not sure", "No"],
    },
    {
      id: "q5",
      prompt: `Where do you usually hear about ${brand} offers?`,
      options: ["Social media", "Radio or TV", "Friends and family", "SMS or app notifications"],
    },
    {
      id: "q6",
      prompt: `What would make you use ${brand} more often?`,
      options: ["Lower charges", "Better app experience", "Faster support", "More rewards"],
    },
    {
      id: "q7",
      prompt: `How do you compare ${brand} with alternatives you have tried?`,
      options: ["Much better", "Slightly better", "About the same", "Worse"],
    },
    {
      id: "q8",
      prompt: `Which channel do you prefer when contacting ${brand}?`,
      options: ["In person", "Phone call", "App or chat", "Social media"],
    },
  ];
  return base.slice(0, count);
}

export const SURVEYS: Survey[] = [
  {
    id: "surveysplus-welcome",
    title: "SurveysPlus Welcome",
    brand: "SokoInsights",
    category: "research",
    plan: "Basic",
    questions: 5,
    minutes: 11,
    maxReward: 1200,
    questionSet: qs("SokoInsights", "research experience factor", 5),
  },
  {
    id: "safaricom-mpesa",
    title: "Safaricom M-PESA",
    brand: "Safaricom",
    category: "telecom",
    plan: "Basic",
    questions: 6,
    minutes: 9,
    maxReward: 2400,
    questionSet: qs("Safaricom M-PESA", "mobile money feature", 6),
  },
  {
    id: "consumer-market-research",
    title: "Consumer Market Research",
    brand: "SokoInsights Panel",
    category: "research",
    plan: "Basic",
    questions: 5,
    minutes: 8,
    maxReward: 1800,
    questionSet: qs("everyday consumer brands", "shopping factor", 5),
  },
  {
    id: "equity-bank",
    title: "Equity Bank",
    brand: "Equity",
    category: "banking",
    plan: "Standard",
    questions: 7,
    minutes: 12,
    maxReward: 3800,
    questionSet: qs("Equity Bank", "banking factor", 7),
  },
  {
    id: "kcb-bank",
    title: "KCB Bank",
    brand: "KCB",
    category: "banking",
    plan: "Standard",
    questions: 6,
    minutes: 10,
    maxReward: 3600,
    questionSet: qs("KCB Bank", "banking factor", 6),
  },
  {
    id: "co-operative-bank",
    title: "Co-operative Bank",
    brand: "Co-op",
    category: "banking",
    plan: "Standard",
    questions: 6,
    minutes: 10,
    maxReward: 3400,
    questionSet: qs("Co-operative Bank", "banking factor", 6),
  },
  {
    id: "airtel-kenya",
    title: "Airtel Kenya",
    brand: "Airtel",
    category: "telecom",
    plan: "Standard",
    questions: 6,
    minutes: 9,
    maxReward: 3200,
    questionSet: qs("Airtel Kenya", "network factor", 6),
  },
  {
    id: "ncba-bank",
    title: "NCBA Bank",
    brand: "NCBA",
    category: "banking",
    plan: "Premium",
    questions: 8,
    minutes: 14,
    maxReward: 5600,
    questionSet: qs("NCBA Bank", "banking factor", 8),
  },
  {
    id: "im-bank",
    title: "I&M Bank",
    brand: "I&M",
    category: "banking",
    plan: "Premium",
    questions: 7,
    minutes: 13,
    maxReward: 6200,
    questionSet: qs("I&M Bank", "banking factor", 7),
  },
  {
    id: "absa-private",
    title: "Absa Private Banking",
    brand: "Absa",
    category: "premium",
    plan: "Premium",
    questions: 8,
    minutes: 15,
    maxReward: 7600,
    questionSet: qs("Absa Private Banking", "premium banking factor", 8),
  },
];

export const PLAN_BADGE_REQUIREMENT: Record<PlanBadge, PlanTier> = {
  Basic: "Basic",
  Standard: "Standard",
  Premium: "Premium",
};

export function isSurveyUnlocked(survey: Survey, plan: PlanTier) {
  return planRank(plan) >= planRank(PLAN_BADGE_REQUIREMENT[survey.plan]);
}

export function surveyImage(survey: Survey) {
  return CATEGORY_IMAGES[survey.category];
}

export const MIN_WITHDRAWAL = 2500;

export function ksh(value: number) {
  return `Ksh ${value.toLocaleString("en-KE")}`;
}

export function isKenyanPhone(value: string) {
  const digits = value.replace(/[\s-]/g, "");
  return /^(?:\+?254|0)(?:7|1)\d{8}$/.test(digits);
}
