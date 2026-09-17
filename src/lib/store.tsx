import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  MEMBERSHIP_ACTIVATION_PRICE,
  PROCESSING_FEE,
  QUESTION_REWARD,
  REWARD_PROCESSING_HOURS,
  SIGN_IN_BONUS,
  MIN_WITHDRAWAL,
  isAnsweringLocked,
  type MembershipStatus,
  type Survey,
} from "./data";
import { createSurveyPresentation, type SurveyPresentation } from "./survey-randomization";

export type MockUser = {
  name: string;
  email: string;
  phone: string;
};

export type Transaction = {
  id: string;
  label: string;
  amount: number;
  type: "reward" | "withdrawal" | "membership";
  date: string;
};

export type RewardRecord = {
  id: string;
  attemptId?: string;
  surveyId: string;
  questionId: string;
  amount: number;
  confirmedAt: string;
  eligibleAt: string;
};

export type WithdrawalRequest = {
  requestedAmount: number;
  processingFee: number;
  withdrawalAmount: number;
  status: "requested" | "processing";
  createdAt: string;
};

export type SurveyAttempt = SurveyPresentation & {
  attemptId: string;
  surveyId: string;
  currentQuestionIndex: number;
  answeredQuestionIds: string[];
  submittedAnswers: Record<string, string[]>;
};

export type AppState = {
  user: MockUser | null;
  account: MockUser | null;
  membershipActive: boolean;
  membershipStatus: MembershipStatus;
  balance: number;
  lifetimeEarned: number;
  withdrawn: number;
  completedSurveys: string[];
  transactions: Transaction[];
  confirmedEarnings: number;
  signInBonusAwarded: boolean;
  rewardRecords: RewardRecord[];
  surveyAttempts: Record<string, SurveyAttempt>;
  withdrawalRequest: WithdrawalRequest | null;
};

const STORAGE_KEY = "pollyakenya.state.v1";

const initialState: AppState = {
  user: null,
  account: null,
  membershipActive: false,
  membershipStatus: "inactive",
  balance: 0,
  lifetimeEarned: 0,
  withdrawn: 0,
  completedSurveys: [],
  transactions: [],
  confirmedEarnings: 0,
  signInBonusAwarded: false,
  rewardRecords: [],
  surveyAttempts: {},
  withdrawalRequest: null,
};

type Ctx = {
  state: AppState;
  hydrated: boolean;
  signUp: (user: MockUser) => void;
  signIn: (user: MockUser) => boolean;
  signOut: () => void;
  activateMembership: () => void;
  confirmQuestion: (
    survey: Survey,
    attemptId: string,
    questionId: string,
    selectedOptionIds: string[],
  ) => void;
  completeSurvey: (survey: Survey) => void;
  requestWithdrawal: (amount: number) => void;
  payWithdrawalProcessingFee: () => void;
  startSurveyAttempt: (survey: Survey) => SurveyAttempt;
};

export function getRewardBalances(state: AppState, now = Date.now()) {
  const accumulatedEarnings = Math.max(0, state.confirmedEarnings || state.balance || 0);
  const processing = state.rewardRecords
    .filter((reward) => new Date(reward.eligibleAt).getTime() > now)
    .reduce((total, reward) => total + reward.amount, 0);
  const eligible = Math.max(0, accumulatedEarnings - state.withdrawn);
  const withdrawable = state.membershipActive && !state.withdrawalRequest ? eligible : 0;
  return { processing, eligible, withdrawable, accumulatedEarnings };
}

function hydrateState(raw: Partial<AppState> & { plan?: string }): AppState {
  const rewardRecords = raw.rewardRecords ?? [];
  const stateWithoutLegacyPlan = { ...raw };
  delete stateWithoutLegacyPlan.plan;
  const membershipActive = raw.membershipActive ?? raw.plan !== "Free";
  const membershipStatus = raw.membershipStatus ?? (membershipActive ? "active" : "inactive");
  const confirmedEarnings = raw.confirmedEarnings ?? raw.balance ?? raw.lifetimeEarned ?? 0;
  const signInBonusAwarded =
    raw.signInBonusAwarded ?? rewardRecords.some((reward) => reward.id === "sign-in-bonus");
  const account = raw.account ?? raw.user ?? null;
  const normalized = {
    ...initialState,
    ...stateWithoutLegacyPlan,
    membershipActive,
    membershipStatus,
    confirmedEarnings,
    signInBonusAwarded,
    account,
    balance: raw.balance ?? confirmedEarnings,
    rewardRecords,
  };

  if (rewardRecords.length > 0 || !raw.balance) {
    return normalized;
  }

  const legacyReward: RewardRecord = {
    id: "legacy-balance",
    surveyId: "legacy",
    questionId: "legacy",
    amount: raw.balance,
    confirmedAt: new Date(0).toISOString(),
    eligibleAt: new Date(0).toISOString(),
  };
  return {
    ...normalized,
    rewardRecords: [legacyReward],
  };
}

const StoreContext = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState(hydrateState(JSON.parse(raw) as Partial<AppState>));
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, []);

  const persist = useCallback((next: AppState) => {
    setState(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable */
    }
  }, []);

  const update = useCallback((fn: (prev: AppState) => AppState) => {
    setState((prev) => {
      const next = fn(prev);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* storage unavailable */
      }
      return next;
    });
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      state,
      hydrated,
      signUp: (account) => persist({ ...initialState, account, user: null }),
      signIn: (user) => {
        const bonusClaimKey = `${STORAGE_KEY}.sign-in-bonus.${user.email.trim().toLowerCase()}`;
        let bonusClaimed = state.signInBonusAwarded;
        try {
          bonusClaimed = bonusClaimed || localStorage.getItem(bonusClaimKey) === "true";
          if (!bonusClaimed) localStorage.setItem(bonusClaimKey, "true");
        } catch {
          /* storage unavailable */
        }
        const shouldAwardBonus = !bonusClaimed;
        update((prev) => {
          const account = prev.account ?? prev.user ?? user;
          const signedInUser = { ...account, ...user };
          if (prev.signInBonusAwarded || !shouldAwardBonus) {
            return { ...prev, account, user: signedInUser };
          }
          const now = new Date();
          const reward: RewardRecord = {
            id: "sign-in-bonus",
            surveyId: "account",
            questionId: "sign-in-bonus",
            amount: SIGN_IN_BONUS,
            confirmedAt: now.toISOString(),
            eligibleAt: new Date(
              now.getTime() + REWARD_PROCESSING_HOURS * 60 * 60 * 1000,
            ).toISOString(),
          };
          const nextConfirmedEarnings = prev.confirmedEarnings + SIGN_IN_BONUS;
          return {
            ...prev,
            account,
            user: signedInUser,
            signInBonusAwarded: true,
            balance: Math.max(0, nextConfirmedEarnings - prev.withdrawn),
            confirmedEarnings: nextConfirmedEarnings,
            lifetimeEarned: prev.lifetimeEarned + SIGN_IN_BONUS,
            rewardRecords: [...prev.rewardRecords, reward],
            transactions: [
              {
                id: reward.id,
                label: "Welcome Bonus — First sign-in",
                amount: SIGN_IN_BONUS,
                type: "reward",
                date: reward.confirmedAt,
              },
              ...prev.transactions,
            ],
          };
        });
        return shouldAwardBonus;
      },
      signOut: () => update((prev) => ({ ...prev, user: null })),
      activateMembership: () =>
        update((prev) => {
          if (prev.membershipActive) return prev;
          return {
            ...prev,
            membershipActive: true,
            membershipStatus: "active",
            transactions: [
              {
                id: `membership-${Date.now()}`,
                label: "Membership Activation — Ksh 250",
                amount: -MEMBERSHIP_ACTIVATION_PRICE,
                type: "membership",
                date: new Date().toISOString(),
              },
              ...prev.transactions,
            ],
          };
        }),
      startSurveyAttempt: (survey) => {
        const existing = state.surveyAttempts[survey.id];
        if (existing) return existing;
        const attemptId = `attempt-${survey.id}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const attempt: SurveyAttempt = {
          ...createSurveyPresentation(survey, attemptId),
          attemptId,
          surveyId: survey.id,
          currentQuestionIndex: 0,
          answeredQuestionIds: [],
          submittedAnswers: {},
        };
        update((prev) => ({
          ...prev,
          surveyAttempts: { ...prev.surveyAttempts, [survey.id]: attempt },
        }));
        return attempt;
      },
      confirmQuestion: (survey, attemptId, questionId, selectedOptionIds) =>
        update((prev) => {
          const rewardId = `rw-${attemptId}-${questionId}`;
          if (prev.rewardRecords.some((reward) => reward.id === rewardId)) return prev;
          if (isAnsweringLocked(prev.confirmedEarnings, prev.membershipStatus)) return prev;

          const now = new Date();
          const reward: RewardRecord = {
            id: rewardId,
            attemptId,
            surveyId: survey.id,
            questionId,
            amount:
              survey.questionSet.find((question) => question.id === questionId)?.reward ??
              QUESTION_REWARD,
            confirmedAt: now.toISOString(),
            eligibleAt: new Date(
              now.getTime() + REWARD_PROCESSING_HOURS * 60 * 60 * 1000,
            ).toISOString(),
          };
          const nextConfirmedEarnings = prev.confirmedEarnings + reward.amount;
          const nextBalance = Math.max(0, nextConfirmedEarnings - prev.withdrawn);
          return {
            ...prev,
            balance: nextBalance,
            confirmedEarnings: nextConfirmedEarnings,
            lifetimeEarned: prev.lifetimeEarned + reward.amount,
            rewardRecords: [...prev.rewardRecords, reward],
            surveyAttempts: {
              ...prev.surveyAttempts,
              [survey.id]: {
                ...(prev.surveyAttempts[survey.id] ?? {}),
                currentQuestionIndex:
                  (prev.surveyAttempts[survey.id]?.currentQuestionIndex ?? 0) + 1,
                answeredQuestionIds: [
                  ...(prev.surveyAttempts[survey.id]?.answeredQuestionIds ?? []),
                  questionId,
                ],
                submittedAnswers: {
                  ...(prev.surveyAttempts[survey.id]?.submittedAnswers ?? {}),
                  [questionId]: selectedOptionIds,
                },
              },
            },
            transactions: [
              {
                id: rewardId,
                label: `${survey.title} — ${questionId} — reward confirmed`,
                amount: reward.amount,
                type: "reward",
                date: reward.confirmedAt,
              },
              ...prev.transactions,
            ],
          };
        }),
      completeSurvey: (survey) =>
        update((prev) => ({
          ...prev,
          completedSurveys: prev.completedSurveys.includes(survey.id)
            ? prev.completedSurveys
            : [...prev.completedSurveys, survey.id],
        })),
      requestWithdrawal: (amount) =>
        update((prev) => {
          const membershipStatus = prev.membershipActive ? "active" : "inactive";
          const belowMinimum = amount < MIN_WITHDRAWAL;
          const exceedsBalance = amount > Math.max(0, prev.confirmedEarnings - prev.withdrawn);
          if (
            !prev.membershipActive ||
            membershipStatus !== "active" ||
            belowMinimum ||
            exceedsBalance
          ) {
            return prev;
          }
          if (prev.withdrawalRequest && prev.withdrawalRequest.status === "processing") return prev;
          const now = new Date().toISOString();
          return {
            ...prev,
            withdrawalRequest: {
              requestedAmount: amount,
              processingFee: PROCESSING_FEE,
              withdrawalAmount: amount,
              status: "requested",
              createdAt: now,
            },
            transactions: [
              {
                id: `wd-request-${Date.now()}`,
                label: `Withdrawal request — ${amount === MIN_WITHDRAWAL ? "Ksh 2,500" : `Ksh ${amount}`}`,
                amount: 0,
                type: "withdrawal",
                date: now,
              },
              ...prev.transactions,
            ],
          };
        }),
      payWithdrawalProcessingFee: () =>
        update((prev) => {
          if (!prev.withdrawalRequest || prev.withdrawalRequest.status === "processing")
            return prev;
          const now = new Date().toISOString();
          return {
            ...prev,
            withdrawalRequest: {
              ...prev.withdrawalRequest,
              status: "processing",
              processingFee: PROCESSING_FEE,
            },
            transactions: [
              {
                id: `wd-fee-${Date.now()}`,
                label: "Withdrawal processing fee — Ksh 50",
                amount: -PROCESSING_FEE,
                type: "withdrawal",
                date: now,
              },
              ...prev.transactions,
            ],
          };
        }),
    }),
    [state, hydrated, persist, update],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
