import { Link } from "@tanstack/react-router";
import { ArrowLeft, BadgeCheck } from "lucide-react";
import type { ReactNode } from "react";
import { Logo } from "@/components/brand";
import { Pill } from "@/components/ui-kit";
import { cn } from "@/lib/utils";

const benefits = [
  "Verified brand partners",
  "M-PESA STK push withdrawals",
  "Ksh 20 confirmed per question",
];

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(60%_50%_at_0%_0%,var(--accent-soft),transparent_60%),radial-gradient(60%_50%_at_100%_100%,var(--primary-soft),transparent_65%)]"
      />
      <div className="relative mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="flex items-center justify-between">
          <Logo />
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-semibold text-muted-foreground hover:text-ink"
          >
            <ArrowLeft className="size-4" aria-hidden="true" /> Back to home
          </Link>
        </div>

        <div className="mt-8 grid gap-10 pb-16 lg:grid-cols-2 lg:items-center lg:gap-16">
          <section className="order-2 lg:order-1">
            <Pill tone="accent">Join 42,000+ earners</Pill>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight text-ink sm:text-5xl">
              Your opinion is worth{" "}
              <span className="text-primary underline decoration-accent decoration-4 underline-offset-4">
                real shillings
              </span>
              .
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">
              Create your SokoInsights account to answer opinion questions, track confirmed earnings
              and withdraw eligible rewards to M-PESA after membership activation.
            </p>
            <ul className="mt-6 space-y-3">
              {benefits.map((b) => (
                <li key={b} className="flex items-start gap-2.5 text-sm font-semibold text-ink">
                  <BadgeCheck className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                  {b}
                </li>
              ))}
            </ul>
            <p className="mt-6 max-w-lg rounded-xl border border-border bg-card/70 p-4 text-xs leading-relaxed text-muted-foreground">
              Every completed opinion response confirms Ksh 20 immediately. Rewards are processed
              and become eligible within 48 hours before membership-gated withdrawal.
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
