import { createFileRoute } from "@tanstack/react-router";
import { BadgeCheck, Crown } from "lucide-react";
import { useState } from "react";
import { SubscriptionModal } from "@/components/subscription-modal";
import { Action, Pill } from "@/components/ui-kit";
import { ksh, PLANS, type Plan } from "@/lib/data";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_member/plans")({
  head: () => ({
    meta: [
      { title: "Plans | SokoInsights" },
      {
        name: "description",
        content: "Compare SokoInsights subscription plans from Ksh 199 per month. Reward ranges are maximums, not guarantees.",
      },
      { property: "og:title", content: "Plans | SokoInsights" },
      { property: "og:description", content: "Plans from Ksh 199 per month, billed by M-PESA." },
    ],
  }),
  component: Plans,
});

function Plans() {
  const { state } = useStore();
  const [selected, setSelected] = useState<Plan | null>(null);

  return (
    <div className="space-y-10">
      <section className="rounded-3xl bg-primary p-6 text-primary-foreground shadow-lift sm:p-10">
        <Pill tone="inverted">Choose a Subscription Plan</Pill>
        <h1 className="mt-4 max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">
          Unlock more surveys. Earn faster.
        </h1>
        <p className="mt-3 text-sm font-semibold text-primary-foreground/85">
          Pay by M-PESA STK Push. Your current plan: {state.plan}.
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {PLANS.map((plan) => {
          const current = state.plan === plan.id;
          return (
            <article
              key={plan.id}
              className={cn(
                "flex flex-col rounded-2xl border bg-card p-6 shadow-soft",
                plan.badge ? "border-accent" : "border-border",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-extrabold tracking-tight text-ink">{plan.name}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{plan.tagline}</p>
                </div>
                {plan.badge && (
                  <Pill tone="accent">
                    <Crown className="size-3.5" aria-hidden="true" />
                    {plan.badge}
                  </Pill>
                )}
              </div>
              <p className="mt-5 text-3xl font-extrabold tracking-tight text-ink">
                {ksh(plan.price)}
                <span className="text-base font-semibold text-muted-foreground">/month</span>
              </p>
              <ul className="mt-5 flex-1 space-y-2 text-sm text-muted-foreground">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <BadgeCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                    {f}
                  </li>
                ))}
                <li className="flex items-start gap-2">
                  <BadgeCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                  {plan.surveyLimit}
                </li>
                <li className="flex items-start gap-2">
                  <BadgeCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                  {plan.support}
                </li>
              </ul>
              <p className="mt-4 rounded-xl bg-secondary p-3 text-xs leading-relaxed text-muted-foreground">
                {plan.rewardRange}. Rewards vary and are subject to eligibility and survey availability.
              </p>
              <div className="mt-5">
                <Action block variant={current ? "outline" : "primary"} disabled={current} onClick={() => setSelected(plan)}>
                  {current ? "Current plan" : `Subscribe — ${ksh(plan.price)}`}
                </Action>
              </div>
            </article>
          );
        })}
      </section>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Payments in this prototype are simulated — no M-PESA transaction is initiated and no money is taken.
      </p>

      <SubscriptionModal plan={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
