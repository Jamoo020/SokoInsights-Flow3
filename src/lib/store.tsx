import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { PlanTier, Survey } from "./data";

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

export type AppState = {
  user: MockUser | null;
  plan: PlanTier;
  balance: number;
  lifetimeEarned: number;
  withdrawn: number;
  completedSurveys: string[];
  transactions: Transaction[];
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
};

type Ctx = {
  state: AppState;
  hydrated: boolean;
  signUp: (user: MockUser) => void;
  signIn: (user: MockUser) => void;
  signOut: () => void;
  activatePlan: (plan: PlanTier, price: number) => void;
  completeSurvey: (survey: Survey, reward: number) => void;
  withdraw: (amount: number) => void;
};

const StoreContext = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...initialState, ...(JSON.parse(raw) as AppState) });
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

  const update = useCallback(
    (fn: (prev: AppState) => AppState) => {
      setState((prev) => {
        const next = fn(prev);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          /* storage unavailable */
        }
        return next;
      });
    },
    [],
  );

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
      completeSurvey: (survey, reward) =>
        update((prev) => ({
          ...prev,
          balance: prev.balance + reward,
          lifetimeEarned: prev.lifetimeEarned + reward,
          completedSurveys: prev.completedSurveys.includes(survey.id)
            ? prev.completedSurveys
            : [...prev.completedSurveys, survey.id],
          transactions: [
            {
              id: `rw-${survey.id}-${Date.now()}`,
              label: `${survey.title} — eligible reward`,
              amount: reward,
              type: "reward",
              date: new Date().toISOString(),
            },
            ...prev.transactions,
          ],
        })),
      withdraw: (amount) =>
        update((prev) => ({
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
        })),
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
