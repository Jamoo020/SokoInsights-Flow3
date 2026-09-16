import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AuthLayout, AuthTabs } from "@/components/auth-layout";
import { Action, FieldError, inputClass } from "@/components/ui-kit";
import { isKenyanPhone, ksh, QUESTION_REWARDS } from "@/lib/data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/create-account")({
  head: () => ({
    meta: [
      { title: "Create account | SokoInsights" },
      {
        name: "description",
        content:
          "Join the SokoInsights consumer research community to unlock surveys and eligible M-PESA rewards.",
      },
      { property: "og:title", content: "Create account | SokoInsights" },
      {
        property: "og:description",
        content: `Answer opinion questions with rewards ranging from ${ksh(QUESTION_REWARDS[0])} to ${ksh(QUESTION_REWARDS[QUESTION_REWARDS.length - 1])} per response and continue with membership to unlock access.`,
      },
    ],
  }),
  component: CreateAccount,
});

type Errors = Partial<Record<"name" | "phone" | "email" | "password", string>>;

function CreateAccount() {
  const navigate = useNavigate();
  const { signUp } = useStore();
  const [form, setForm] = useState({ name: "", phone: "", email: "", password: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Errors = {};
    if (!form.name.trim()) next.name = "Enter your full name.";
    if (!form.phone.trim()) next.phone = "Enter your phone number.";
    else if (!isKenyanPhone(form.phone))
      next.phone = "Enter a valid Kenyan number, e.g. 0712 345 678.";
    if (!form.email.trim()) next.email = "Enter your email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = "Enter a valid email address.";
    if (form.password.length < 6) next.password = "Password must be at least 6 characters.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    window.setTimeout(() => {
      signUp({ name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim() });
      setLoading(false);
      toast.success("Account created", { description: "Welcome to SokoInsights." });
      navigate({ to: "/app" });
    }, 900);
  };

  return (
    <AuthLayout>
      <div className="rounded-3xl border border-border bg-card p-6 shadow-lift sm:p-8">
        <AuthTabs active="create" />
        <form className="mt-6 space-y-4" onSubmit={submit} noValidate>
          <div>
            <label htmlFor="name" className="text-sm font-semibold text-ink">
              Full name
            </label>
            <input
              id="name"
              value={form.name}
              onChange={set("name")}
              placeholder="e.g. Amani Wanjiru"
              autoComplete="name"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "name-error" : undefined}
              className={`${inputClass} mt-1.5`}
            />
            <FieldError id="name-error">{errors.name}</FieldError>
          </div>
          <div>
            <label htmlFor="phone" className="text-sm font-semibold text-ink">
              Phone number
            </label>
            <input
              id="phone"
              type="tel"
              inputMode="tel"
              value={form.phone}
              onChange={set("phone")}
              placeholder="07XX XXX XXX"
              autoComplete="tel"
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? "phone-error" : undefined}
              className={`${inputClass} mt-1.5`}
            />
            <FieldError id="phone-error">{errors.phone}</FieldError>
          </div>
          <div>
            <label htmlFor="email" className="text-sm font-semibold text-ink">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={set("email")}
              placeholder="you@email.com"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={`${inputClass} mt-1.5`}
            />
            <FieldError id="email-error">{errors.email}</FieldError>
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-semibold text-ink">
              Password
            </label>
            <div className="relative mt-1.5">
              <input
                id="password"
                type={show ? "text" : "password"}
                value={form.password}
                onChange={set("password")}
                placeholder="At least 6 characters"
                autoComplete="new-password"
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? "password-error" : undefined}
                className={`${inputClass} pr-12`}
              />
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                aria-label={show ? "Hide password" : "Show password"}
                className="absolute right-1 top-1 grid size-10 place-items-center rounded-lg text-muted-foreground hover:bg-secondary"
              >
                {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            <FieldError id="password-error">{errors.password}</FieldError>
          </div>

          <Action type="submit" size="lg" block loading={loading}>
            {loading ? "Creating account…" : "Create account"}
          </Action>
          <p className="text-center text-xs leading-relaxed text-muted-foreground">
            By creating an account you agree to the SokoInsights terms of membership and privacy
            notice. Topics and questions are free. Completed opinion responses confirm the displayed
            reward and continue accumulating throughout participation; membership activation unlocks
            continued access and withdrawal eligibility.
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}
