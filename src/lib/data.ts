export const QUESTION_REWARD = 50;
export const QUESTION_REWARDS = [50, 60, 70, 80, 90, 100] as const;
export const REWARD_PROCESSING_HOURS = 48;
export const MEMBERSHIP_ACTIVATION_PRICE = 250;
export const MEMBERSHIP_MILESTONE = 700;
export const PROCESSING_FEE = 50;
export const MINIMUM_WITHDRAWAL_AMOUNT = 2500;
export type MembershipStatus = "inactive" | "active";
export type CategoryId =
  | "telecom"
  | "banking"
  | "finance"
  | "shopping"
  | "food"
  | "technology"
  | "transport"
  | "automotive"
  | "healthcare"
  | "education"
  | "entertainment"
  | "travel"
  | "ecommerce"
  | "apps"
  | "consumer-products"
  | "agriculture"
  | "housing"
  | "insurance"
  | "energy"
  | "beauty"
  | "sports"
  | "media"
  | "employment"
  | "lifestyle"
  | "public-services"
  | "research"
  | "premium";

const imageUrl = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=72`;

export const CATEGORY_IMAGES: Record<CategoryId, string> = {
  telecom: imageUrl("photo-1516321318423-f06f85e504b3"),
  banking: imageUrl("photo-1542744173-8e7e53415bb0"),
  finance: imageUrl("photo-1450101499163-c8848c66ca85"),
  shopping: imageUrl("photo-1542838132-92c53300491e"),
  food: imageUrl("photo-1495474472287-4d71bcdd2085"),
  technology: imageUrl("photo-1519389950473-47ba0277781c"),
  transport: imageUrl("photo-1500534623283-312aade485b7"),
  automotive: imageUrl("photo-1497366754035-f200968a6e72"),
  healthcare: imageUrl("photo-1511818966892-d7d671e672a2"),
  education: imageUrl("photo-1517245386807-bb43f82c33c4"),
  entertainment: imageUrl("photo-1492684223066-81342ee5ff30"),
  travel: imageUrl("photo-1500530855697-b586d89ba3ee"),
  ecommerce: imageUrl("photo-1512909006721-3d6018887383"),
  apps: imageUrl("photo-1499750310107-5fef28a66643"),
  "consumer-products": imageUrl("photo-1512621776951-a57141f2eefd"),
  agriculture: imageUrl("photo-1464226184884-fa280b87c399"),
  housing: imageUrl("photo-1505693416388-ac5ce068fe85"),
  insurance: imageUrl("photo-1450101499163-c8848c66ca85"),
  energy: imageUrl("photo-1509391366360-2e959784a276"),
  beauty: imageUrl("photo-1498837167922-ddd27525d352"),
  sports: imageUrl("photo-1524250502761-1ac6f2e30d43"),
  media: imageUrl("photo-1481627834876-b7833e8f5570"),
  employment: imageUrl("photo-1521737711867-e3b97375f902"),
  lifestyle: imageUrl("photo-1500534623283-312aade485b7"),
  "public-services": imageUrl("photo-1515169067868-5387ec356754"),
  research: imageUrl("photo-1497215728101-856f4ea42174"),
  premium: imageUrl("photo-1556761175-b413da4baf72"),
};

const TOPIC_IMAGES: Array<[string[], string]> = [
  [["smartphone", "mobile app", "app usage"], imageUrl("photo-1499750310107-5fef28a66643")],
  [
    ["ai awareness", "cloud services", "cybersecurity", "online privacy"],
    imageUrl("photo-1519389950473-47ba0277781c"),
  ],
  [
    ["internet", "network coverage", "5g", "data usage"],
    imageUrl("photo-1516321318423-f06f85e504b3"),
  ],
  [
    ["restaurant", "fast food", "coffee", "food delivery", "food purchasing"],
    imageUrl("photo-1517248135467-4c7edcad34c4"),
  ],
  [
    ["supermarket", "shopping", "purchasing", "consumer promotions"],
    imageUrl("photo-1542838132-92c53300491e"),
  ],
  [["delivery", "online shopping"], imageUrl("photo-1512909006721-3d6018887383")],
  [
    ["bank", "banking", "savings", "loan", "credit card", "atm"],
    imageUrl("photo-1542744173-8e7e53415bb0"),
  ],
  [["farming", "agricultural", "agriculture"], imageUrl("photo-1464226184884-fa280b87c399")],
  [["housing", "home improvement", "rental"], imageUrl("photo-1505693416388-ac5ce068fe85")],
  [["insurance", "financial planning", "budgeting"], imageUrl("photo-1450101499163-c8848c66ca85")],
];

export const CATEGORY_LABELS: Record<CategoryId, string> = {
  telecom: "Telecom",
  banking: "Banking",
  finance: "Finance",
  shopping: "Shopping",
  food: "Food & Beverage",
  technology: "Technology",
  transport: "Transport",
  automotive: "Automotive",
  healthcare: "Healthcare",
  education: "Education",
  entertainment: "Entertainment",
  travel: "Travel",
  ecommerce: "E-commerce",
  apps: "Mobile Apps",
  "consumer-products": "Consumer Products",
  agriculture: "Agriculture",
  housing: "Housing",
  insurance: "Insurance",
  energy: "Energy",
  beauty: "Beauty & Personal Care",
  sports: "Sports",
  media: "Media",
  employment: "Employment & Careers",
  lifestyle: "Kenyan Lifestyle",
  "public-services": "Public Services",
  research: "Research",
  premium: "Premium",
};

export type QuestionOption = {
  id: string;
  label: string;
  randomizable?: boolean;
};

export type Question = {
  id: string;
  reward: number;
  prompt: string;
  questionType: "multiple_choice" | "likert" | "frequency" | "multi_select";
  optionOrder: "fixed" | "random";
  randomizable: boolean;
  section?: string;
  dependsOn?: string;
  options: QuestionOption[];
};

export type Topic = {
  id: string;
  title: string;
  category: CategoryId;
  description: string;
  sourceContext: string;
  status: "published";
  createdAt: string;
  questions: number;
  questionCount: number;
  minutes: number;
  maxReward: number;
  rewardPerQuestion: number;
  questionSet: Question[];
};

export type Survey = Topic;

function qs(topic: string, questionCount: number): Question[] {
  const base: Array<Omit<Question, "options" | "reward"> & { options: string[] }> = [
    {
      id: "q1",
      prompt: `How often do you engage with ${topic}?`,
      questionType: "frequency",
      optionOrder: "fixed",
      randomizable: true,
      options: ["Daily", "A few times a week", "A few times a month", "Rarely or never"],
    },
    {
      id: "q2",
      prompt: `Which part of ${topic} matters most to you?`,
      questionType: "multiple_choice",
      optionOrder: "random",
      randomizable: true,
      options: ["Cost", "Reliability", "Customer care", "Convenience"],
    },
    {
      id: "q3",
      prompt: `How would you describe your most recent ${topic} experience?`,
      questionType: "likert",
      optionOrder: "fixed",
      randomizable: true,
      options: ["Excellent", "Good", "Average", "Poor"],
    },
    {
      id: "q4",
      prompt: `How likely are you to recommend this kind of ${topic} experience?`,
      questionType: "likert",
      optionOrder: "fixed",
      randomizable: true,
      options: ["Definitely", "Probably", "Not sure", "No"],
    },
    {
      id: "q5",
      prompt: `Where do you usually learn about ${topic}?`,
      questionType: "multiple_choice",
      optionOrder: "random",
      randomizable: true,
      options: ["Social media", "Radio or TV", "Friends and family", "SMS or app notifications"],
    },
    {
      id: "q6",
      prompt: `What would make you engage with ${topic} more often?`,
      questionType: "multiple_choice",
      optionOrder: "random",
      randomizable: true,
      options: ["Lower charges", "Better app experience", "Faster support", "More rewards"],
    },
    {
      id: "q7",
      prompt: `How do you compare your current ${topic} options with alternatives?`,
      questionType: "likert",
      optionOrder: "fixed",
      randomizable: true,
      options: ["Much better", "Slightly better", "About the same", "Worse"],
    },
    {
      id: "q8",
      prompt: `Which channel do you prefer for decisions about ${topic}?`,
      questionType: "multiple_choice",
      optionOrder: "random",
      randomizable: true,
      options: ["In person", "Phone call", "App or chat", "Social media"],
    },
  ];
  return base.slice(0, questionCount).map((question, index) => {
    const rewardIndex =
      [...`${topic}:${question.id}`].reduce(
        (value, character) => (value * 31 + character.charCodeAt(0)) >>> 0,
        index + 11,
      ) % QUESTION_REWARDS.length;
    return {
      ...question,
      reward: QUESTION_REWARDS[rewardIndex]!,
      options: question.options.map((label, optionIndex) => ({
        id: `${question.id}-option-${optionIndex + 1}`,
        label,
      })),
    };
  });
}

function topicVariant(title: string) {
  const hash = [...title].reduce(
    (value, character) => (value * 31 + character.charCodeAt(0)) >>> 0,
    7,
  );
  return {
    questionCount: 5 + (hash % 4),
  };
}

const topicSeeds: Array<[string, CategoryId, number]> = [
  ["Mobile Data Usage in Kenya", "telecom", 7],
  ["Mobile Money Habits", "telecom", 7],
  ["M-PESA Usage Experience", "telecom", 6],
  ["Mobile Payment Preferences", "telecom", 6],
  ["Smartphone Brand Preferences", "telecom", 6],
  ["Network Coverage Experience", "telecom", 6],
  ["Mobile Internet Spending", "telecom", 6],
  ["Airtime Purchasing Habits", "telecom", 5],
  ["5G Awareness", "telecom", 5],
  ["Mobile App Usage", "telecom", 6],
  ["Customer Service Experience", "telecom", 6],
  ["SIM Card Usage", "telecom", 5],
  ["Kenyan Banking Preferences", "banking", 7],
  ["Mobile Banking Habits", "banking", 7],
  ["Bank App Experience", "banking", 6],
  ["Savings Habits", "banking", 6],
  ["Digital Banking Adoption", "banking", 6],
  ["ATM Usage", "banking", 5],
  ["Bank Customer Service", "banking", 6],
  ["Loan Product Awareness", "banking", 6],
  ["Credit Card Awareness", "banking", 5],
  ["Banking Security", "banking", 6],
  ["Personal Budgeting", "finance", 6],
  ["Digital Payments in Kenya", "finance", 7],
  ["Insurance Awareness", "insurance", 6],
  ["Household Financial Planning", "finance", 6],
  ["Supermarket Shopping Habits", "shopping", 7],
  ["Price Comparison Habits", "shopping", 6],
  ["Brand Loyalty", "consumer-products", 6],
  ["Household Purchasing Decisions", "shopping", 6],
  ["Consumer Promotions", "shopping", 5],
  ["Cash vs Digital Payments", "shopping", 6],
  ["Online Shopping in Kenya", "ecommerce", 7],
  ["Delivery Services", "ecommerce", 6],
  ["Restaurant Preferences", "food", 6],
  ["Soft Drink Preferences", "food", 5],
  ["Fast Food Habits", "food", 6],
  ["Kenyan Food Purchasing", "food", 7],
  ["Coffee Consumption", "food", 5],
  ["Food Delivery", "food", 6],
  ["Smartphone Usage", "technology", 7],
  ["AI Awareness", "technology", 6],
  ["Social Media Usage", "media", 7],
  ["Streaming Services", "entertainment", 6],
  ["Laptop Purchasing", "technology", 6],
  ["Cloud Services", "technology", 5],
  ["Online Privacy", "technology", 6],
  ["Cybersecurity Awareness", "technology", 6],
  ["Public Transport Experience", "transport", 7],
  ["Ride-Hailing Usage", "transport", 6],
  ["Fuel Purchasing Habits", "automotive", 5],
  ["Vehicle Ownership", "automotive", 6],
  ["Car Maintenance", "automotive", 6],
  ["Motorcycle Transport", "transport", 5],
  ["Nairobi Commuting", "transport", 7],
  ["Healthcare Access", "healthcare", 7],
  ["Pharmacy Shopping", "healthcare", 6],
  ["Fitness Habits", "healthcare", 5],
  ["Online Learning", "education", 6],
  ["Skills Development", "education", 6],
  ["Domestic Travel", "travel", 6],
  ["Kenyan Holiday Planning", "travel", 6],
  ["Rental Housing Experience", "housing", 7],
  ["Home Improvement", "housing", 6],
  ["Agricultural Input Purchasing", "agriculture", 6],
  ["Beauty Product Choices", "beauty", 6],
  ["Sports Participation", "sports", 5],
  ["News Consumption", "media", 6],
  ["Job Search Habits", "employment", 7],
  ["Workplace Benefits", "employment", 6],
  ["Kenyan Lifestyle Priorities", "lifestyle", 7],
  ["Public Service Digital Access", "public-services", 6],
];

export const SURVEYS: Survey[] = topicSeeds.map(([title, category, minutes], index) => {
  const variant = topicVariant(title);
  const questionSet = qs(title, variant.questionCount);
  return {
    id: `topic-${index + 1}`,
    title,
    category,
    description: `Share your experience, preferences and habits related to ${title.toLowerCase()}.`,
    sourceContext:
      "Original topic informed by broad Kenyan consumer research themes and public market signals.",
    status: "published",
    createdAt: "2026-09-01",
    questions: questionSet.length,
    questionCount: questionSet.length,
    minutes,
    maxReward: questionSet.reduce((total, question) => total + question.reward, 0),
    rewardPerQuestion: QUESTION_REWARD,
    questionSet,
  };
});

/* Legacy catalogue entries were intentionally replaced by free research topics. */
/*
export const LEGACY_SURVEYS: Survey[] = [
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
*/

export function surveyImage(survey: Survey) {
  const title = survey.title.toLowerCase();
  const topicImage = TOPIC_IMAGES.find(([keywords]) =>
    keywords.some((keyword) => title.includes(keyword)),
  );
  if (topicImage) return topicImage[1];
  return CATEGORY_IMAGES[survey.category];
}

export function surveyRewardRange(survey: Survey) {
  const rewards = survey.questionSet.map((question) => question.reward);
  return {
    min: Math.min(...rewards),
    max: Math.max(...rewards),
  };
}

export const MIN_WITHDRAWAL = MINIMUM_WITHDRAWAL_AMOUNT;

export function isAnsweringLocked(accumulatedEarnings: number, membershipStatus?: string) {
  return accumulatedEarnings >= MEMBERSHIP_MILESTONE && membershipStatus !== "active";
}

export function ksh(value: number) {
  return `Ksh ${value.toLocaleString("en-KE")}`;
}

export function isKenyanPhone(value: string) {
  const digits = value.replace(/[\s-]/g, "");
  return /^(?:\+?254|0)(?:7|1)\d{8}$/.test(digits);
}
