import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { QUESTION_REWARD, REWARD_PROCESSING_HOURS, type PlanTier, type Survey } from "./data";

export type MockUser = {
  name: string;
  email: string;
  phone: string;
};

export type Transaction = {
  id: string;
  label: string;
  amount: number;
  type: "reward" | "withdrawal" | "subscription";
  date: string;
};

export type RewardRecord = {
  id: string;
  surveyId: string;
  questionId: string;
  amount: number;
  confirmedAt: string;
  eligibleAt: string;
};

export type AppState = {
  user: MockUser | null;
  plan: PlanTier;
  balance: number;
  lifetimeEarned: number;
  withdrawn: number;
  completedSurveys: string[];
  transactions: Transaction[];
  confirmedEarnings: number;
  rewardRecords: RewardRecord[];
};

const STORAGE_KEY = "pollyakenya.state.v1";

const initialState: AppState = {
  user: null,
  plan: "Free",
  balance: 0,
  lifetimeEarned: 0,
  withdrawn: 0,
  completedSurveys: [],
  transactions: [],
  confirmedEarnings: 0,
  rewardRecords: [],
};

type Ctx = {
  state: AppState;
  hydrated: boolean;
  signUp: (user: MockUser) => void;
  signIn: (user: MockUser) => void;
  signOut: () => void;
  activatePlan: (plan: PlanTier, price: number) => void;
  confirmQuestion: (survey: Survey, questionId: string) => void;
  completeSurvey: (survey: Survey) => void;
  withdraw: (amount: number) => void;
};

export function getRewardBalances(state: AppState, now = Date.now()) {
  const processing = state.rewardRecords
    .filter((reward) => new Date(reward.eligibleAt).getTime() > now)
    .reduce((total, reward) => total + reward.amount, 0);
  const eligible = Math.max(
    0,
    state.rewardRecords
      .filter((reward) => new Date(reward.eligibleAt).getTime() <= now)
      .reduce((total, reward) => total + reward.amount, 0) - state.withdrawn,
  );
  const withdrawable = state.plan === "Free" ? 0 : eligible;
  return { processing, eligible, withdrawable };
}

function hydrateState(raw: Partial<AppState>): AppState {
  const rewardRecords = raw.rewardRecords ?? [];
  if (rewardRecords.length > 0 || !raw.balance) {
    return { ...initialState, ...raw, rewardRecords };
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
    ...initialState,
    ...raw,
    confirmedEarnings: raw.confirmedEarnings ?? raw.lifetimeEarned ?? raw.balance,
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
      signUp: (user) => persist({ ...initialState, user }),
      signIn: (user) => update((prev) => ({ ...prev, user: { ...prev.user, ...user } })),
      signOut: () => update((prev) => ({ ...prev, user: null })),
      activatePlan: (plan, price) =>
        update((prev) => ({
          ...prev,
          plan,
          transactions: [
            {
              id: `sub-${Date.now()}`,
              label: `${plan} subscription`,
              amount: -price,
              type: "subscription",
              date: new Date().toISOString(),
            },
            ...prev.transactions,
          ],
        })),
      confirmQuestion: (survey, questionId) =>
        update((prev) => {
          const rewardId = `rw-${survey.id}-${questionId}`;
          if (prev.rewardRecords.some((reward) => reward.id === rewardId)) return prev;
          const now = new Date();
          const reward: RewardRecord = {
            id: rewardId,
            surveyId: survey.id,
            questionId,
            amount: QUESTION_REWARD,
            confirmedAt: now.toISOString(),
            eligibleAt: new Date(
              now.getTime() + REWARD_PROCESSING_HOURS * 60 * 60 * 1000,
            ).toISOString(),
          };
          return {
            ...prev,
            balance: prev.balance + reward.amount,
            confirmedEarnings: prev.confirmedEarnings + reward.amount,
            lifetimeEarned: prev.lifetimeEarned + reward.amount,
            rewardRecords: [...prev.rewardRecords, reward],
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
      withdraw: (amount) =>
        update((prev) => {
          const { withdrawable } = getRewardBalances(prev);
          if (prev.plan === "Free" || amount <= 0 || amount > withdrawable) return prev;
          return {
            ...prev,
            balance: Math.max(0, prev.balance - amount),
            withdrawn: prev.withdrawn + amount,
            transactions: [
              {
                id: `wd-${Date.now()}`,
                label: "Withdrawal to M-PESA (simulated)",
                amount: -amount,
                type: "withdrawal",
                date: new Date().toISOString(),
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
