import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AuthLayout, AuthTabs } from "@/components/auth-layout";
import { Action, FieldError, inputClass } from "@/components/ui-kit";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/sign-in")({
  head: () => ({
    meta: [
      { title: "Sign in | SokoInsights" },
      {
        name: "description",
        content:
          "Sign in to your SokoInsights member account to access free research topics, your wallet and membership.",
      },
      { property: "og:title", content: "Sign in | SokoInsights" },
      {
        property: "og:description",
        content: "Access free research topics, your wallet and membership.",
      },
    ],
  }),
  component: SignIn,
});

function SignIn() {
  const navigate = useNavigate();
  const { state, signIn } = useStore();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!form.email.trim()) next.email = "Enter your email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = "Enter a valid email address.";
    if (!form.password) next.password = "Enter your password.";
    else if (form.password.length < 6) next.password = "Password must be at least 6 characters.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      const known = state.user;
      if (known && known.email.toLowerCase() !== form.email.trim().toLowerCase()) {
        setErrors({ form: "Invalid credentials. Check your email and password and try again." });
        toast.error("We couldn't sign you in. Please check your details.");
        return;
      }
      signIn(
        known ?? {
          name: form.email.split("@")[0] ?? "Member",
          email: form.email.trim(),
          phone: "",
        },
      );
      toast.success("Signed in", { description: "Welcome back to SokoInsights." });
      let target: string | null = null;
      try {
        target = sessionStorage.getItem("pollyakenya.redirect");
        sessionStorage.removeItem("pollyakenya.redirect");
      } catch {
        /* ignore */
      }
      navigate({ to: (target as "/app") ?? "/app" });
    }, 900);
  };

  return (
    <AuthLayout>
      <div className="rounded-3xl border border-border bg-card p-6 shadow-lift sm:p-8">
        <AuthTabs active="signin" />
        <form className="mt-6 space-y-4" onSubmit={submit} noValidate>
          {errors.form && (
            <p
              role="alert"
              className="rounded-xl bg-destructive/10 p-3 text-sm font-medium text-destructive"
            >
              {errors.form}
            </p>
          )}
          <div>
            <label htmlFor="email" className="text-sm font-semibold text-ink">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
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
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                placeholder="Your password"
                autoComplete="current-password"
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
            {loading ? "Signing in…" : "Sign in"}
          </Action>
          <p className="text-center text-xs leading-relaxed text-muted-foreground">
            This prototype uses simulated authentication stored on your device only.
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}
