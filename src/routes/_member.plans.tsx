import { createFileRoute } from "@tanstack/react-router";
import { BadgeCheck, Wallet } from "lucide-react";
import { useState } from "react";
import { SubscriptionModal } from "@/components/subscription-modal";
import { Action, Pill } from "@/components/ui-kit";
import { ksh, MEMBERSHIP_ACTIVATION_PRICE } from "@/lib/data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/_member/plans")({
  head: () => ({
    meta: [
      { title: "Membership Activation | SokoInsights" },
      {
        name: "description",
        content:
          "Activate SokoInsights membership to unlock withdrawals from your eligible rewards.",
      },
      { property: "og:title", content: "Membership Activation | SokoInsights" },
      {
        property: "og:description",
        content: "Unlock withdrawals and continue answering after Ksh 700 for Ksh 250.",
      },
    ],
  }),
  component: Plans,
});

function Plans() {
  const { state } = useStore();
  const [selected, setSelected] = useState(false);

  return (
    <div className="space-y-10">
      <section className="rounded-3xl bg-primary p-6 text-primary-foreground shadow-lift sm:p-10">
        <Pill tone="inverted">Membership activation</Pill>
        <h1 className="mt-4 max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">
          Unlock withdrawals when you are ready.
        </h1>
        <p className="mt-3 text-sm font-semibold text-primary-foreground/85">
          Browse topics and answer questions while you build earnings. Membership unlocks continued
          access and withdrawal eligibility.
        </p>
      </section>

      <section className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8">
        <Wallet className="size-8 text-primary" aria-hidden="true" />
        <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-ink">
          SokoInsights Membership
        </h2>
        <p className="mt-2 text-4xl font-extrabold text-ink">{ksh(MEMBERSHIP_ACTIVATION_PRICE)}</p>
        <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
          {[
            "Browse every published topic for free",
            "Earn Ksh 50–100 for each completed question",
            "Unlock continued access and answering",
            "Continue accumulating to the Ksh 2,500 withdrawal threshold",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <BadgeCheck className="mt-0.5 size-4 shrink-0 text-primary" />
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-6 rounded-xl bg-secondary p-4 text-sm text-muted-foreground">
          Membership activation unlocks continued access and supports your withdrawal eligibility.
        </p>
        <div className="mt-6">
          <Action block disabled={state.membershipActive} onClick={() => setSelected(true)}>
            {state.membershipActive
              ? "Membership active"
              : `Activate Membership — ${ksh(MEMBERSHIP_ACTIVATION_PRICE)}`}
          </Action>
        </div>
      </section>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Payments are processed securely through Paylor. An M-PESA prompt will be sent to the phone
        number you confirm.
      </p>

      <SubscriptionModal open={selected} onClose={() => setSelected(false)} />
    </div>
  );
}
