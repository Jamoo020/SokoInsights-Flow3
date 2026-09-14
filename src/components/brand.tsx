import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string | undefined }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-grid size-9 shrink-0 place-items-center rounded-full bg-primary",
        className,
      )}
    >
      <span className="block size-3 rounded-full bg-accent" />
    </span>
  );
}

export function Logo({
  to = "/",
  inverted = false,
  className,
}: {
  to?: "/" | "/app";
  inverted?: boolean;
  className?: string;
}) {
  return (
    <Link
      to={to}
      className={cn("flex items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring", className)}
      aria-label="SokoInsights home"
    >
      <LogoMark className={inverted ? "bg-primary-foreground" : undefined} />
      <span
        className={cn(
          "text-lg font-extrabold tracking-tight",
          inverted ? "text-primary-foreground" : "text-ink",
        )}
      >
        SokoInsights
      </span>
    </Link>
  );
}
