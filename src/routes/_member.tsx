import { createFileRoute, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { AppShell } from "@/components/app-shell";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/_member")({
  component: MemberLayout,
});

function MemberLayout() {
  const { state, hydrated } = useStore();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (hydrated && !state.user) {
      try {
        sessionStorage.setItem("pollyakenya.redirect", pathname);
      } catch {
        /* ignore */
      }
      navigate({ to: "/sign-in" });
    }
  }, [hydrated, state.user, navigate, pathname]);

  if (!hydrated || !state.user) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <Loader2 className="size-6 animate-spin text-primary" aria-label="Loading" />
      </div>
    );
  }

  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
