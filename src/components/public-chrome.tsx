import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Logo, LogoMark } from "@/components/brand";
import { Action } from "@/components/ui-kit";

const navItems = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Topics", href: "#surveys" },
  { label: "Membership", href: "#plans" },
];

export function PublicHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />
        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-ink"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <Link
            to="/sign-in"
            className={"rounded-xl px-4 py-2 text-sm font-semibold text-ink hover:bg-secondary"}
          >
            Sign in
          </Link>
          <Link to="/create-account">
            <Action size="sm">Create account</Action>
          </Link>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="grid size-11 place-items-center rounded-xl border border-border bg-card text-ink md:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-border bg-background px-4 pb-5 pt-3 md:hidden">
          <nav aria-label="Mobile" className="flex flex-col">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3 text-base font-semibold text-ink hover:bg-secondary"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="mt-3 flex flex-col gap-2">
            <Link to="/sign-in" onClick={() => setOpen(false)}>
              <Action variant="outline" block>
                Sign in
              </Action>
            </Link>
            <Link to="/create-account" onClick={() => setOpen(false)}>
              <Action block>Create account</Action>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary/50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <LogoMark />
              <span className="text-lg font-extrabold tracking-tight text-ink">SokoInsights</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Your voice. Better market insights.
            </p>
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm">
            <a className="text-muted-foreground hover:text-ink" href="/#how-it-works">
              How it works
            </a>
            <Link className="text-muted-foreground hover:text-ink" to="/sign-in">
              Sign in
            </Link>
            <a className="text-muted-foreground hover:text-ink" href="/#surveys">
              Surveys
            </a>
            <Link className="text-muted-foreground hover:text-ink" to="/create-account">
              Create account
            </Link>
            <a className="text-muted-foreground hover:text-ink" href="/#plans">
              Membership
            </a>
            <a className="text-muted-foreground hover:text-ink" href="/#trust">
              Transparency
            </a>
          </nav>
        </div>
        <div className="mt-10 space-y-2 border-t border-border pt-6 text-xs leading-relaxed text-muted-foreground">
          <p>
            SokoInsights is an independent consumer research platform and is not affiliated with,
            endorsed by or sponsored by the brands mentioned on the platform.
          </p>
          <p>M-PESA is a trademark of Safaricom PLC.</p>
          <p>
            Every completed opinion response confirms Ksh 20. Rewards are processed for 48 hours
            before becoming eligible.
          </p>
          <p className="pt-2 font-medium text-ink">
            © {new Date().getFullYear()} SokoInsights. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
