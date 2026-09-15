import { Link } from "@tanstack/react-router";
import { ArrowLeft, Clock3, Layers3, WalletCards } from "lucide-react";
import type { ReactNode } from "react";
import { Logo } from "@/components/brand";
import { Pill } from "@/components/ui-kit";
import { ksh, QUESTION_REWARDS } from "@/lib/data";
import { cn } from "@/lib/utils";

const benefits = [
  { icon: Layers3, label: "Browse a growing library of topics" },
  { icon: Clock3, label: "Responses process within 48 hours" },
  { icon: WalletCards, label: "Withdraw eligible rewards to M-PESA" },
];

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen overflow-hidden bg-background">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(60%_50%_at_0%_0%,var(--accent-soft),transparent_60%),radial-gradient(60%_50%_at_100%_100%,var(--primary-soft),transparent_65%)]"
      />
      <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="flex items-center justify-between">
          <Logo />
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-semibold text-muted-foreground hover:text-ink"
          >
            <ArrowLeft className="size-4" aria-hidden="true" /> Back to home
          </Link>
        </div>

        <div className="mt-10 grid gap-10 pb-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(25rem,0.8fr)] lg:items-center lg:gap-20">
          <section className="order-2 lg:order-1">
            <Pill tone="accent">Kenyan consumer research</Pill>
            <h1 className="mt-5 max-w-xl text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-6xl">
              Share what you know.
              <span className="mt-1 block text-primary">Shape what comes next.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Join SokoInsights to explore everyday topics, answer opinion questions and keep track
              of confirmed rewards in one clear member space.
            </p>
            <div className="mt-8 grid max-w-xl grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
              <div className="rounded-2xl border border-border bg-card/80 p-3 shadow-soft sm:p-4">
                <p className="whitespace-nowrap text-xl font-extrabold tracking-tight text-ink sm:text-xl">
                  {ksh(QUESTION_REWARDS[0])}-{ksh(QUESTION_REWARDS[QUESTION_REWARDS.length - 1])}
                </p>
                <p className="mt-1 text-xs font-semibold leading-tight text-muted-foreground">per completed question</p>
              </div>
              <div className="rounded-2xl border border-border bg-card/80 p-3 shadow-soft sm:p-4">
                <p className="text-xl font-extrabold text-ink sm:text-2xl">48h</p>
                <p className="mt-1 text-xs font-semibold leading-tight text-muted-foreground">processing window</p>
              </div>
              <div className="rounded-2xl border border-border bg-card/80 p-3 shadow-soft sm:p-4">
                <p className="text-xl font-extrabold text-ink sm:text-2xl">M-PESA</p>
                <p className="mt-1 text-xs font-semibold leading-tight text-muted-foreground">eligible withdrawals</p>
              </div>
            </div>
            <ul className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {benefits.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2.5 text-sm font-semibold text-ink">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary-soft text-primary">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  {label}
                </li>
              ))}
            </ul>
            <p className="mt-8 max-w-xl border-l-2 border-accent pl-4 text-xs leading-relaxed text-muted-foreground">
              Topics and questions are free to access. Membership is only needed when you are ready
              to withdraw eligible rewards.
            </p>
          </section>

          <section className="order-1 lg:order-2">{children}</section>
        </div>
      </div>
    </div>
  );
}

export function AuthTabs({ active }: { active: "create" | "signin" }) {
  const base = "flex-1 rounded-lg px-4 py-2.5 text-sm font-bold transition-colors text-center";
  return (
    <div
      className="flex gap-1 rounded-xl bg-secondary p-1"
      role="tablist"
      aria-label="Authentication"
    >
      <Link
        to="/create-account"
        role="tab"
        aria-selected={active === "create"}
        className={cn(
          base,
          active === "create" ? "bg-card text-ink shadow-soft" : "text-muted-foreground",
        )}
      >
        Create account
      </Link>
      <Link
        to="/sign-in"
        role="tab"
        aria-selected={active === "signin"}
        className={cn(
          base,
          active === "signin" ? "bg-card text-ink shadow-soft" : "text-muted-foreground",
        )}
      >
        Sign in
      </Link>
    </div>
  );
}
