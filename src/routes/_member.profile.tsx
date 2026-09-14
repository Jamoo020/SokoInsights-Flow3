import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, ClipboardList, LogOut, Lock, Mail, Settings, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Action, EmptyState, Panel, Pill } from "@/components/ui-kit";
import { ksh, SURVEYS } from "@/lib/data";
import { getRewardBalances, useStore } from "@/lib/store";

export const Route = createFileRoute("/_member/profile")({
  head: () => ({
    meta: [
      { title: "Profile | SokoInsights" },
      {
        name: "description",
        content: "Manage your SokoInsights membership, plan and account settings.",
      },
      { property: "og:title", content: "Profile | SokoInsights" },
      { property: "og:description", content: "Your membership, plan and account settings." },
    ],
  }),
  component: Profile,
});

type ModalKey = "achievements" | "privacy" | "settings" | null;

const MODAL_COPY: Record<Exclude<ModalKey, null>, { title: string; body: string }> = {
  achievements: {
    title: "Achievements",
    body: "Badges for survey streaks and category milestones are coming soon to SokoInsights.",
  },
  privacy: {
    title: "Privacy & security",
    body: "Your details are stored on this device only in this prototype. Member information would normally be used for account verification, survey eligibility and reward delivery. Your M-PESA PIN is never stored by this application.",
  },
  settings: {
    title: "Settings",
    body: "Notification preferences, language and payout defaults are coming soon.",
  },
};

function Profile() {
  const { state, signOut } = useStore();
  const balances = getRewardBalances(state);
  const navigate = useNavigate();
  const [modal, setModal] = useState<ModalKey>(null);

  const name = state.user?.name ?? "Member";
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const completed = SURVEYS.filter((s) => state.completedSurveys.includes(s.id));

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-3xl bg-primary p-6 text-primary-foreground shadow-lift sm:p-8">
        <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4 sm:flex sm:flex-wrap sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <span
              aria-hidden="true"
              className="grid size-16 shrink-0 place-items-center rounded-2xl bg-primary-foreground/15 text-xl font-extrabold"
            >
              {initials || "PK"}
            </span>
            <div className="min-w-0">
              <h1 className="truncate text-2xl font-extrabold tracking-tight sm:text-3xl">
                {name}
              </h1>
              <p className="truncate text-sm text-primary-foreground/80">
                {state.user?.phone || "Phone not set"}
              </p>
              <div className="mt-2">
                <Pill tone="inverted">Current plan: {state.plan}</Pill>
              </div>
            </div>
          </div>
          <div className="col-span-2 sm:col-auto">
            <Link to="/plans">
              <Action variant="accent" block>
                Manage plan
              </Action>
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Panel className="p-5">
          <p className="text-sm font-medium text-muted-foreground">Confirmed earnings</p>
          <p className="mt-1 text-2xl font-extrabold text-ink">{ksh(state.confirmedEarnings)}</p>
        </Panel>
        <Panel className="p-5">
          <p className="text-sm font-medium text-muted-foreground">Withdrawable balance</p>
          <p className="mt-1 text-2xl font-extrabold text-ink">{ksh(balances.withdrawable)}</p>
        </Panel>
        <Panel className="p-5">
          <p className="text-sm font-medium text-muted-foreground">Surveys completed</p>
          <p className="mt-1 text-2xl font-extrabold text-ink">
            {state.completedSurveys.length} / {SURVEYS.length}
          </p>
        </Panel>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <Panel className="sm:p-8">
          <h2 className="text-xl font-extrabold tracking-tight text-ink">Recent surveys</h2>
          <div className="mt-4">
            {completed.length === 0 ? (
              <EmptyState
                icon={<ClipboardList className="size-6" />}
                title="You haven't completed any surveys yet."
                action={
                  <Link to="/app">
                    <Action>
                      Start one now <ArrowRight className="size-4" aria-hidden="true" />
                    </Action>
                  </Link>
                }
              />
            ) : (
              <ul className="divide-y divide-border">
                {completed.map((s) => (
                  <li key={s.id} className="flex items-center justify-between gap-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-ink">{s.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {s.questions} questions · {s.minutes} min
                      </p>
                    </div>
                    <span className="shrink-0 text-sm font-bold text-primary">Completed</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Panel>

        <Panel className="p-2 sm:p-2">
          <ul className="divide-y divide-border">
            <li>
              <ActionRow
                icon={<Sparkles className="size-4" />}
                label="Achievements"
                hint="Coming soon"
                onClick={() => setModal("achievements")}
              />
            </li>
            <li className="flex items-center gap-3 p-4">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-secondary text-muted-foreground">
                <Mail className="size-4" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-bold text-ink">Account email</p>
                <p className="truncate text-xs text-muted-foreground">{state.user?.email}</p>
              </div>
            </li>
            <li>
              <ActionRow
                icon={<Lock className="size-4" />}
                label="Privacy & security"
                onClick={() => setModal("privacy")}
              />
            </li>
            <li>
              <ActionRow
                icon={<Settings className="size-4" />}
                label="Settings"
                onClick={() => setModal("settings")}
              />
            </li>
            <li>
              <button
                type="button"
                onClick={() => {
                  signOut();
                  toast.success("Signed out");
                  navigate({ to: "/sign-in" });
                }}
                className="flex w-full items-center gap-3 rounded-xl p-4 text-left text-destructive transition-colors hover:bg-destructive/10"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-destructive/10">
                  <LogOut className="size-4" aria-hidden="true" />
                </span>
                <span className="text-sm font-bold">Sign out</span>
              </button>
            </li>
          </ul>
        </Panel>
      </div>

      <Dialog open={modal !== null} onOpenChange={(o) => !o && setModal(null)}>
        <DialogContent className="max-w-md rounded-2xl">
          {modal && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-extrabold tracking-tight text-ink">
                  {MODAL_COPY[modal].title}
                </DialogTitle>
                <DialogDescription className="leading-relaxed">
                  {MODAL_COPY[modal].body}
                </DialogDescription>
              </DialogHeader>
              <Action block onClick={() => setModal(null)}>
                Close
              </Action>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ActionRow({
  icon,
  label,
  hint,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  hint?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl p-4 text-left transition-colors hover:bg-secondary"
    >
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-secondary text-muted-foreground">
        {icon}
      </span>
      <span className="min-w-0 flex-1 text-sm font-bold text-ink">{label}</span>
      {hint && <span className="shrink-0 text-xs font-semibold text-muted-foreground">{hint}</span>}
      <ArrowRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
    </button>
  );
}
