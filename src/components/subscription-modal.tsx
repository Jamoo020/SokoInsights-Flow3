import { AlertCircle, CheckCircle2, CreditCard, Loader2, Smartphone, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Action, FieldError, inputClass } from "@/components/ui-kit";
import { isKenyanPhone, ksh, MEMBERSHIP_ACTIVATION_PRICE } from "@/lib/data";
import { useStore } from "@/lib/store";

type PaymentMethod = "payor" | "mpesa";
type Phase = "idle" | "loading" | "waiting" | "success" | "failed" | "cancelled";

export function SubscriptionModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { state, activateMembership } = useStore();
  const [phone, setPhone] = useState(state.user?.phone ?? "");
  const [apiKey, setApiKey] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("payor");
  const [error, setError] = useState<string>();
  const [phase, setPhase] = useState<Phase>("idle");

  useEffect(() => {
    if (open) {
      setPhase("idle");
      setError(undefined);
      setPhone(state.user?.phone ?? "");
      setApiKey("");
      setSelectedMethod("payor");
    }
  }, [open, state.user?.phone]);

  if (!open) return null;

  const busy = phase === "loading" || phase === "waiting";
  const activeLabel = selectedMethod === "payor" ? "Payor" : "M-PESA";

  const start = () => {
    if (selectedMethod === "mpesa") {
      if (!isKenyanPhone(phone)) {
        setError("Enter a valid Kenyan phone number, e.g. 0712 345 678.");
        return;
      }
    } else if (!apiKey.trim()) {
      setError("Enter your Payor API key to use this as your payment method.");
      return;
    }

    setError(undefined);
    setPhase("loading");
    window.setTimeout(() => setPhase("waiting"), 1200);
    window.setTimeout(() => {
      setPhase("success");
      activateMembership();
      toast.success("Payment method set", {
        description: `Using ${activeLabel} for your membership activation.`,
      });
    }, 3400);
  };

  return (
    <Dialog open onOpenChange={(o) => !o && !busy && onClose()}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-extrabold tracking-tight text-ink">
            Choose payment method
          </DialogTitle>
          <DialogDescription>
            Use {activeLabel} as your payment method for the Ksh {MEMBERSHIP_ACTIVATION_PRICE} membership activation.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-2">
          {[
            { id: "payor", label: "Payor", icon: <CreditCard className="size-4" /> },
            { id: "mpesa", label: "M-PESA", icon: <Smartphone className="size-4" /> },
          ].map((method) => {
            const active = selectedMethod === method.id;
            return (
              <button
                key={method.id}
                type="button"
                onClick={() => setSelectedMethod(method.id as PaymentMethod)}
                className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                  active
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-secondary text-muted-foreground hover:bg-secondary/80"
                }`}
              >
                {method.icon}
                {method.label}
              </button>
            );
          })}
        </div>

        <div className="rounded-xl border border-border bg-secondary/50 p-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Purpose</span>
            <span className="font-bold text-ink">Unlock withdrawals</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-muted-foreground">Price</span>
            <span className="font-bold text-ink">{ksh(MEMBERSHIP_ACTIVATION_PRICE)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-muted-foreground">Payment</span>
            <span className="font-bold text-ink">{activeLabel}</span>
          </div>
        </div>

        {phase === "idle" && (
          <div>
            {selectedMethod === "payor" ? (
              <>
                <label htmlFor="payor-key" className="text-sm font-semibold text-ink">
                  Payor API key
                </label>
                <input
                  id="payor-key"
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your Payor API key"
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? "payor-key-error" : undefined}
                  className={`${inputClass} mt-1.5`}
                />
                <FieldError id="payor-key-error">{error}</FieldError>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        )}

        {phase === "loading" && (
          <StatusRow
            icon={<Loader2 className="size-5 animate-spin" />}
            title={selectedMethod === "payor" ? "Validating Payor key…" : "Sending STK prompt…"}
          />
        )}
        {phase === "waiting" && (
          <StatusRow
            icon={<Smartphone className="size-5" />}
            title={
              selectedMethod === "payor"
                ? "Payor authorization is ready. Confirm the payment method."
                : "Check your phone and approve the M-PESA prompt."
            }
            note="Simulated flow — nothing is charged."
          />
        )}
        {phase === "success" && (
          <StatusRow
            tone="success"
            icon={<CheckCircle2 className="size-5" />}
            title={`Payment successful with ${activeLabel}. Membership activated.`}
          />
        )}
        {phase === "failed" && (
          <StatusRow
            tone="error"
            icon={<AlertCircle className="size-5" />}
            title="Payment could not be completed."
          />
        )}
        {phase === "cancelled" && (
          <StatusRow
            tone="error"
            icon={<XCircle className="size-5" />}
            title="Payment cancelled."
          />
        )}

        <div className="flex flex-col gap-2 sm:flex-row">
          {phase === "idle" && (
            <>
              <Action variant="outline" block onClick={onClose}>
                Cancel
              </Action>
              <Action block onClick={start}>
                {selectedMethod === "payor" ? "Use Payor" : "Send STK Push"}
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
