import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Crown, LogOut, Menu, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Logo } from "@/components/brand";
import { Action } from "@/components/ui-kit";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/app", label: "Home" },
  { to: "/categories", label: "Categories" },
  { to: "/plans", label: "Plans" },
  { to: "/wallet", label: "Wallet" },
  { to: "/profile", label: "Profile" },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { signOut } = useStore();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const handleSignOut = () => {
    signOut();
    toast.success("Signed out");
    navigate({ to: "/sign-in" });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <Logo to="/app" />
          <nav aria-label="Member" className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                  pathname === item.to
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-ink",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/plans" className="hidden sm:block">
              <Action variant="accent" size="sm">
                <Crown className="size-4" aria-hidden="true" />
                Upgrade
              </Action>
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              aria-label="Sign out"
              className="hidden size-11 place-items-center rounded-full border border-border bg-card text-muted-foreground hover:text-destructive lg:grid"
            >
              <LogOut className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              className="grid size-11 place-items-center rounded-xl border border-border bg-card text-ink lg:hidden"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
        {open && (
          <div className="border-t border-border bg-background px-4 pb-5 pt-3 lg:hidden">
            <nav aria-label="Mobile member" className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-xl px-4 py-3 text-base font-semibold",
                    pathname === item.to ? "bg-primary text-primary-foreground" : "text-ink hover:bg-secondary",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-3 flex flex-col gap-2">
              <Link to="/plans" onClick={() => setOpen(false)}>
                <Action variant="accent" block>
                  <Crown className="size-4" aria-hidden="true" />
                  Upgrade
                </Action>
              </Link>
              <Action variant="destructive" block onClick={handleSignOut}>
                <LogOut className="size-4" aria-hidden="true" />
                Sign out
              </Action>
            </div>
          </div>
        )}
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-20 pt-8 sm:px-6">{children}</main>
      <footer className="border-t border-border bg-secondary/50 px-4 py-8 sm:px-6">
        <p className="mx-auto max-w-6xl text-xs leading-relaxed text-muted-foreground">
          Rewards are subject to eligibility, plan limits and survey availability and are not guaranteed. Payment and
          payout flows in this prototype are simulated. M-PESA is a trademark of Safaricom PLC. SokoInsights is an
          independent consumer research community and is not affiliated with the brands mentioned.
        </p>
      </footer>
    </div>
  );
}
