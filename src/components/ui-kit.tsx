import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export const actionVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-55 active:translate-y-px",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground shadow-soft hover:bg-primary/90",
        accent: "bg-accent text-accent-foreground shadow-soft hover:brightness-105",
        outline: "border border-border bg-card text-foreground hover:bg-secondary",
        ghost: "text-foreground hover:bg-secondary",
        inverted: "bg-primary-foreground text-primary hover:bg-primary-foreground/90",
        destructive: "bg-destructive/10 text-destructive hover:bg-destructive/15",
      },
      size: {
        sm: "h-10 px-4",
        md: "h-11 px-5",
        lg: "h-12 px-6 text-base",
        icon: "size-11",
      },
      block: { true: "w-full", false: "" },
    },
    defaultVariants: { variant: "primary", size: "md", block: false },
  },
);

type ActionProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof actionVariants> & { loading?: boolean };

export function Action({
  className,
  variant,
  size,
  block,
  loading,
  children,
  disabled,
  ...props
}: ActionProps) {
  return (
    <button
      className={cn(actionVariants({ variant, size, block }), className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
}

export function Panel({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("rounded-2xl border border-border bg-card p-6 shadow-soft", className)}>
      {children}
    </div>
  );
}

export function Pill({
  children,
  tone = "muted",
  className,
}: {
  children: ReactNode;
  tone?: "muted" | "accent" | "primary" | "inverted";
  className?: string;
}) {
  const tones = {
    muted: "bg-secondary text-secondary-foreground",
    accent: "bg-accent-soft text-accent-foreground",
    primary: "bg-primary-soft text-primary",
    inverted: "bg-primary-foreground/10 text-primary-foreground",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", className)}>
      {eyebrow && (
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent-foreground">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{title}</h2>
      {description && (
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">{description}</p>
      )}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-secondary/40 px-6 py-12 text-center">
      <span
        className="grid size-12 place-items-center rounded-full bg-primary-soft text-primary"
        aria-hidden="true"
      >
        {icon}
      </span>
      <p className="mt-4 text-base font-semibold text-ink">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function FieldError({ id, children }: { id: string; children?: string | undefined }) {
  if (!children) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-sm font-medium text-destructive">
      {children}
    </p>
  );
}

export const inputClass =
  "h-12 w-full rounded-xl border border-input bg-card px-4 text-base text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-2 focus:outline-offset-0 focus:outline-ring/40 aria-[invalid=true]:border-destructive";
