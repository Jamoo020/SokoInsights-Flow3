import { createFileRoute } from "@tanstack/react-router";
import { AlertCircle, CheckCircle2, Loader2, Receipt, ShieldCheck, Smartphone, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Action, EmptyState, FieldError, inputClass, Panel } from "@/components/ui-kit";
import { isKenyanPhone, ksh, MIN_WITHDRAWAL } from "@/lib/data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/_member/wallet")({
  head: () => ({
    meta: [
      { title: "Wallet | SokoInsights" },
      {
        name: "description",
        content: "Track your SokoInsights balance and request a simulated M-PESA withdrawal from Ksh 2,500.",
      },
      { property: "og:title", content: "Wallet | SokoInsights" },
      { property: "og:description", content: "Balance, lifetime rewards and M-PESA payout simulation." },
    ],
  }),
  component: WalletPage,
});

type Phase = "idle" | "loading" | "waiting" | "success" | "failed" | "cancelled";

function WalletPage() {
  const { state, withdraw } = useStore();
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState(state.user?.phone ?? "");
  const [errors, setErrors] = useState<{ amount?: string; phone?: string }>({});
  const [phase, setPhase] = useState<Phase>("idle");

  const belowThreshold = state.balance < MIN_WITHDRAWAL;
  const busy = phase === "loading" || phase === "waiting";

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = Number(amount);
    const next: typeof errors = {};
    if (!amount || Number.isNaN(value)) next.amount = "Enter an amount to withdraw.";
    else if (value < MIN_WITHDRAWAL) next.amount = `Minimum withdrawal is ${ksh(MIN_WITHDRAWAL)}.`;
    else if (value > state.balance) next.amount = "Amount cannot exceed your available balance.";
    if (!isKenyanPhone(phone)) next.phone = "Enter a valid Kenyan phone number, e.g. 0712 345 678.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setPhase("loading");
    window.setTimeout(() => setPhase("waiting"), 1200);
    window.setTimeout(() => {
      withdraw(value);
      setPhase("success");
      setAmount("");
      toast.success("Withdrawal request completed", { description: `${ksh(value)} sent to ${phone} (simulated).` });
    }, 3400);
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">Wallet</h1>
        <p className="mt-2 text-base text-muted-foreground">
          Rewards from eligible completed surveys appear here. Payouts are simulated in this prototype.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl bg-primary p-6 text-primary-foreground shadow-lift sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground/70">
            Available balance
          </p>
          <p className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">{ksh(state.balance)}</p>
          <p className="mt-2 text-sm text-primary-foreground/80">
            Minimum withdrawal: {ksh(MIN_WITHDRAWAL)} via M-PESA
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-primary-foreground/10 p-4">
              <p className="text-xs font-semibold text-primary-foreground/70">Lifetime earned</p>
              <p className="mt-1 text-xl font-extrabold">{ksh(state.lifetimeEarned)}</p>
            </div>
            <div className="rounded-2xl bg-primary-foreground/10 p-4">
              <p className="text-xs font-semibold text-primary-foreground/70">Withdrawn</p>
              <p className="mt-1 text-xl font-extrabold">{ksh(state.withdrawn)}</p>
            </div>
          </div>
        </section>

        <Panel className="sm:p-8">
          <h2 className="text-xl font-extrabold tracking-tight text-ink">Withdraw to M-PESA</h2>
          <p className="mt-1 text-sm text-muted-foreground">M-PESA payout simulation — no real transfer is made.</p>

          <form className="mt-6 space-y-4" onSubmit={submit} noValidate>
            <div>
              <label htmlFor="amount" className="text-sm font-semibold text-ink">
                Amount
              </label>
              <input
                id="amount"
                type="number"
                inputMode="numeric"
                min={MIN_WITHDRAWAL}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="2500"
                disabled={belowThreshold || busy}
                aria-invalid={Boolean(errors.amount)}
                aria-describedby={errors.amount ? "amount-error" : undefined}
                className={`${inputClass} mt-1.5`}
              />
              <FieldError id="amount-error">{errors.amount}</FieldError>
              <div className="mt-3 flex flex-wrap gap-2">
                {[2500, 5000, 10000].map((v) => (
                  <button
                    key={v}
                    type="button"
                    disabled={belowThreshold || busy}
                    onClick={() => setAmount(String(v))}
                    className="h-10 rounded-full border border-border bg-card px-4 text-sm font-semibold text-ink hover:bg-secondary disabled:opacity-50"
                  >
                    {ksh(v)}
                  </button>
                ))}
                <button
                  type="button"
                  disabled={belowThreshold || busy}
                  onClick={() => setAmount(String(state.balance))}
                  className="h-10 rounded-full border border-border bg-card px-4 text-sm font-semibold text-ink hover:bg-secondary disabled:opacity-50"
                >
                  Max
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="wallet-phone" className="text-sm font-semibold text-ink">
                M-PESA phone number
              </label>
              <input
                id="wallet-phone"
                type="tel"
                inputMode="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="07XX XXX XXX"
                disabled={belowThreshold || busy}
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={errors.phone ? "wallet-phone-error" : undefined}
                className={`${inputClass} mt-1.5`}
              />
              <FieldError id="wallet-phone-error">{errors.phone}</FieldError>
            </div>

            {phase === "loading" && (
              <Status icon={<Loader2 className="size-5 animate-spin" />} text="Sending payout request…" />
            )}
            {phase === "waiting" && (
              <Status icon={<Smartphone className="size-5" />} text="Check your phone and approve the M-PESA prompt." />
            )}
            {phase === "success" && (
              <Status tone="success" icon={<CheckCircle2 className="size-5" />} text="Payout completed (simulated)." />
            )}
            {phase === "failed" && (
              <Status tone="error" icon={<AlertCircle className="size-5" />} text="Payout could not be completed." />
            )}
            {phase === "cancelled" && (
              <Status tone="error" icon={<XCircle className="size-5" />} text="Payout cancelled." />
            )}

            <Action type="submit" size="lg" block disabled={belowThreshold} loading={busy}>
              {belowThreshold ? `Reach ${ksh(MIN_WITHDRAWAL)} to withdraw` : busy ? "Processing…" : "Withdraw to M-PESA"}
            </Action>
            {busy && (
              <Action
                type="button"
                variant="outline"
                block
                onClick={() => {
                  setPhase("cancelled");
                  toast.info("Payout cancelled");
                }}
              >
                Cancel payout
              </Action>
            )}
            <p className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              Your M-PESA PIN is never stored by this application.
            </p>
          </form>
        </Panel>
      </div>

      <section>
        <h2 className="text-2xl font-extrabold tracking-tight text-ink">Recent activity</h2>
        <div className="mt-4">
          {state.transactions.length === 0 ? (
            <EmptyState
              icon={<Receipt className="size-6" />}
              title="No activity yet"
              description="Complete a survey to see your first payout here."
            />
          ) : (
            <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
              {state.transactions.map((t) => (
                <li key={t.id} className="flex items-center justify-between gap-4 p-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-ink">{t.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(t.date).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 text-sm font-extrabold ${t.amount >= 0 ? "text-primary" : "text-muted-foreground"}`}
                  >
                    {t.amount >= 0 ? "+" : "−"}
                    {ksh(Math.abs(t.amount))}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}

function Status({
  icon,
  text,
  tone = "neutral",
}: {
  icon: React.ReactNode;
  text: string;
  tone?: "neutral" | "success" | "error";
}) {
  const tones = {
    neutral: "bg-secondary text-ink",
    success: "bg-primary-soft text-primary",
    error: "bg-destructive/10 text-destructive",
  } as const;
  return (
    <div role="status" className={`flex items-center gap-3 rounded-xl p-4 text-sm font-semibold ${tones[tone]}`}>
      <span aria-hidden="true">{icon}</span>
      {text}
    </div>
  );
}
