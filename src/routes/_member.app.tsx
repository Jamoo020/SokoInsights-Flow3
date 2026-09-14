import { createFileRoute, Link } from "@tanstack/react-router";
import { BarChart3, CalendarCheck, Clock, Coins, Wallet } from "lucide-react";
import { useMemo, useState } from "react";
import { SurveyCard } from "@/components/survey-card";
import { SurveyRunner } from "@/components/survey-runner";
import { Action, Panel, Pill } from "@/components/ui-kit";
import {
  ksh,
  MEMBERSHIP_ACTIVATION_PRICE,
  SURVEYS,
  type Survey,
} from "@/lib/data";
import { getRewardBalances, useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_member/app")({
  head: () => ({
    meta: [
      { title: "Dashboard | SokoInsights" },
      {
        name: "description",
        content: "Your SokoInsights member home: wallet balance, plan and available surveys.",
      },
      { property: "og:title", content: "Dashboard | SokoInsights" },
      { property: "og:description", content: "Wallet balance, plan and available surveys." },
    ],
  }),
  component: MemberHome,
});

const filters = ["All", ...Object.values(CATEGORY_LABELS)] as const;

function MemberHome() {
  const { state } = useStore();
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [search, setSearch] = useState("");
  const [active, setActive] = useState<Survey | null>(null);

  const firstName = state.user?.name?.split(" ")[0] ?? "jamaa";
  const balances = getRewardBalances(state);

  const visible = useMemo(
    () => SURVEYS.filter((topic) => {
      const matchesCategory = filter === "All" || CATEGORY_LABELS[topic.category] === filter;
      const query = search.trim().toLowerCase();
      return matchesCategory && (!query || `${topic.title} ${topic.description}`.toLowerCase().includes(query));
    }),
    [filter, search],
  );

  const metrics = [
    { icon: BarChart3, label: "Surveys done", value: String(state.completedSurveys.length) },
    { icon: CalendarCheck, label: "Available today", value: "10" },
    { icon: Coins, label: "Average reward", value: ksh(4600) },
    { icon: Clock, label: "Average time", value: "10 min" },
  ];

  return (
    <div className="space-y-10">
      <section className="overflow-hidden rounded-3xl bg-primary p-6 text-primary-foreground shadow-lift sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div className="min-w-0">
            <Pill tone="inverted">Member dashboard</Pill>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Hujambo, {firstName}
            </h1>
            <div className="mt-6 flex flex-wrap items-end gap-x-10 gap-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground/70">
                  Confirmed earnings
                </p>
                <p className="text-3xl font-extrabold sm:text-4xl">
                  {ksh(state.confirmedEarnings)}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground/70">
                  Membership
                </p>
                <p className="text-2xl font-extrabold">{state.membershipActive ? "Active" : "Inactive"}</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-primary-foreground/80">
              Rewards process for 48 hours before becoming eligible.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Link to="/wallet">
              <Action variant="inverted" block>
                <Wallet className="size-4" aria-hidden="true" /> Withdraw
              </Action>
            </Link>
            <Link to="/plans">
              <Action variant="accent" block>
                {state.membershipActive
                  ? "Membership active"
                  : `Activate membership — Ksh ${MEMBERSHIP_ACTIVATION_PRICE}`}
              </Action>
            </Link>
          </div>
        </div>
      </section>

      <section aria-label="Reward balances" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <BalancePanel label="Confirmed earnings" value={state.confirmedEarnings} />
        <BalancePanel
          label="Processing"
          value={balances.processing}
          note="Eligible within 48 hours"
        />
        <BalancePanel label="Eligible balance" value={balances.eligible} />
        <BalancePanel
          label="Withdrawable"
          value={balances.withdrawable}
          note={state.membershipActive ? "Membership active" : "Activate membership to withdraw"}
        />
      </section>

      <section aria-label="Your statistics" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {metrics.map((m) => (
          <Panel key={m.label} className="p-5">
            <span className="grid size-10 place-items-center rounded-xl bg-primary-soft text-primary">
              <m.icon className="size-5" aria-hidden="true" />
            </span>
            <p className="mt-3 text-sm font-medium text-muted-foreground">{m.label}</p>
            <p className="mt-1 text-2xl font-extrabold tracking-tight text-ink">{m.value}</p>
          </Panel>
        ))}
      </section>

      <section>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
              Available topics
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Browse research freely, then answer any topic that interests you.
            </p>
          </div>
        </div>

        <div
          role="tablist"
          aria-label="Filter topics by category"
          className="mt-5 flex flex-wrap gap-2"
        >
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              role="tab"
              aria-selected={filter === f}
              onClick={() => setFilter(f)}
              className={cn(
                "h-10 rounded-full px-4 text-sm font-semibold transition-colors",
                filter === f
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-card text-muted-foreground hover:text-ink",
              )}
            >
              {f}
            </button>
          ))}
        </div>

        <label className="relative mt-4 block max-w-xl">
          <span className="sr-only">Search topics</span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search topics, for example M-PESA"
            className="h-11 w-full rounded-xl border border-border bg-card px-4 text-sm text-ink outline-none focus:border-primary"
          />
        </label>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((survey) => {
            const completed = state.completedSurveys.includes(survey.id);
            return (
              <SurveyCard
                key={survey.id}
                survey={survey}
                locked={false}
                completed={completed}
                ctaLabel="Answer questions"
                onAction={() => setActive(survey)}
              />
            );
          })}
        </div>
      </section>

      <SurveyRunner survey={active} onClose={() => setActive(null)} />
    </div>
  );
}

function BalancePanel({ label, value, note }: { label: string; value: number; note?: string }) {
  return (
    <Panel className="p-5">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-extrabold tracking-tight text-ink">{ksh(value)}</p>
      {note && <p className="mt-1 text-xs text-muted-foreground">{note}</p>}
    </Panel>
  );
}
