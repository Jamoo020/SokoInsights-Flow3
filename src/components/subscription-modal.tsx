import { AlertCircle, CheckCircle2, Loader2, Smartphone, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Action, FieldError, inputClass } from "@/components/ui-kit";
import { isKenyanPhone, ksh, type Plan } from "@/lib/data";
import { useStore } from "@/lib/store";

type Phase = "idle" | "loading" | "waiting" | "success" | "failed" | "cancelled";

export function SubscriptionModal({ plan, onClose }: { plan: Plan | null; onClose: () => void }) {
  const { state, activatePlan } = useStore();
  const [phone, setPhone] = useState(state.user?.phone ?? "");
  const [error, setError] = useState<string>();
  const [phase, setPhase] = useState<Phase>("idle");

  useEffect(() => {
    if (plan) {
      setPhase("idle");
      setError(undefined);
      setPhone(state.user?.phone ?? "");
    }
  }, [plan, state.user?.phone]);

  if (!plan) return null;

  const busy = phase === "loading" || phase === "waiting";

  const start = () => {
    if (!isKenyanPhone(phone)) {
      setError("Enter a valid Kenyan phone number, e.g. 0712 345 678.");
      return;
    }
    setError(undefined);
    setPhase("loading");
    window.setTimeout(() => setPhase("waiting"), 1200);
    window.setTimeout(() => {
      setPhase("success");
      activatePlan(plan.id, plan.price);
      toast.success("Plan activated successfully", { description: `${plan.name} is now your active plan.` });
    }, 3400);
  };

  return (
    <Dialog open onOpenChange={(o) => !o && !busy && onClose()}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-extrabold tracking-tight text-ink">
            Confirm your subscription
          </DialogTitle>
          <DialogDescription>
            An M-PESA payment prompt will be simulated for this prototype. No real payment is taken.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-xl border border-border bg-secondary/50 p-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Plan selected</span>
            <span className="font-bold text-ink">{plan.name}</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-muted-foreground">Price</span>
            <span className="font-bold text-ink">{ksh(plan.price)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-muted-foreground">Billing</span>
            <span className="font-bold text-ink">Monthly</span>
          </div>
        </div>

        {phase === "idle" && (
          <div>
            <label htmlFor="sub-phone" className="text-sm font-semibold text-ink">
              M-PESA phone number
            </label>
            <input
              id="sub-phone"
              type="tel"
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="07XX XXX XXX"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "sub-phone-error" : undefined}
              className={`${inputClass} mt-1.5`}
            />
            <FieldError id="sub-phone-error">{error}</FieldError>
          </div>
        )}

        {phase === "loading" && (
          <StatusRow icon={<Loader2 className="size-5 animate-spin" />} title="Sending STK prompt…" />
        )}
        {phase === "waiting" && (
          <StatusRow
            icon={<Smartphone className="size-5" />}
            title="Check your phone and approve the M-PESA prompt."
            note="Simulated prompt — nothing is charged."
          />
        )}
        {phase === "success" && (
          <StatusRow
            tone="success"
            icon={<CheckCircle2 className="size-5" />}
            title="Payment successful. Plan activated."
          />
        )}
        {phase === "failed" && (
          <StatusRow tone="error" icon={<AlertCircle className="size-5" />} title="Payment could not be completed." />
        )}
        {phase === "cancelled" && (
          <StatusRow tone="error" icon={<XCircle className="size-5" />} title="Payment cancelled." />
        )}

        <div className="flex flex-col gap-2 sm:flex-row">
          {phase === "idle" && (
            <>
              <Action variant="outline" block onClick={onClose}>
                Cancel
              </Action>
              <Action block onClick={start}>
                Send STK Push
              </Action>
            </>
          )}
          {busy && (
            <Action
              variant="outline"
              block
              onClick={() => {
                setPhase("cancelled");
                toast.info("Payment cancelled");
              }}
            >
              Cancel payment
            </Action>
          )}
          {(phase === "failed" || phase === "cancelled") && (
            <>
              <Action variant="outline" block onClick={onClose}>
                Close
              </Action>
              <Action block onClick={() => setPhase("idle")}>
                Try again
              </Action>
            </>
          )}
          {phase === "success" && (
            <Action block onClick={onClose}>
              Done
            </Action>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function StatusRow({
  icon,
  title,
  note,
  tone = "neutral",
}: {
  icon: React.ReactNode;
  title: string;
  note?: string;
  tone?: "neutral" | "success" | "error";
}) {
  const tones = {
    neutral: "bg-secondary text-ink",
    success: "bg-primary-soft text-primary",
    error: "bg-destructive/10 text-destructive",
  } as const;
  return (
    <div className={`flex items-start gap-3 rounded-xl p-4 ${tones[tone]}`} role="status">
      <span className="mt-0.5 shrink-0" aria-hidden="true">
        {icon}
      </span>
      <div>
        <p className="text-sm font-semibold">{title}</p>
        {note && <p className="mt-0.5 text-xs opacity-80">{note}</p>}
      </div>
    </div>
  );
}
