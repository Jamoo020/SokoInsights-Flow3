import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Action } from "@/components/ui-kit";
import { CATEGORY_LABELS, ksh, type Survey } from "@/lib/data";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function SurveyRunner({ survey, onClose }: { survey: Survey | null; onClose: () => void }) {
  const { completeSurvey } = useStore();
  const [step, setStep] = useState(0);
  const [answer, setAnswer] = useState<string | null>(null);
  const [reward, setReward] = useState<number | null>(null);

  if (!survey) return null;

  const total = survey.questionSet.length;
  const done = reward !== null;
  const question = survey.questionSet[Math.min(step, total - 1)]!;

  const close = () => {
    setStep(0);
    setAnswer(null);
    setReward(null);
    onClose();
  };

  const next = () => {
    if (!answer) return;
    if (step + 1 < total) {
      setStep(step + 1);
      setAnswer(null);
      return;
    }
    const earned = Math.round((survey.maxReward * (0.55 + Math.random() * 0.45)) / 50) * 50;
    setReward(earned);
    completeSurvey(survey, earned);
    toast.success("Survey submitted", { description: `Eligible reward: ${ksh(earned)} added to your wallet.` });
  };

  return (
    <Dialog open onOpenChange={(o) => !o && close()}>
      <DialogContent className="max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-extrabold tracking-tight text-ink">{survey.title}</DialogTitle>
          <DialogDescription>
            {survey.brand} · {CATEGORY_LABELS[survey.category]}
          </DialogDescription>
        </DialogHeader>

        {done ? (
          <div className="text-center">
            <span className="mx-auto grid size-14 place-items-center rounded-full bg-primary-soft text-primary">
              <CheckCircle2 className="size-7" aria-hidden="true" />
            </span>
            <p className="mt-4 text-lg font-extrabold text-ink">Survey complete</p>
            <p className="mt-1 text-sm text-muted-foreground">
              You may receive up to {ksh(reward)} for this eligible completion, subject to verification.
            </p>
            <p className="mt-3 text-2xl font-extrabold text-accent-foreground">Eligible reward: {ksh(reward)}</p>
            <div className="mt-6">
              <Action block onClick={close}>
                Back to surveys
              </Action>
            </div>
          </div>
        ) : (
          <>
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                <span>
                  Question {step + 1} of {total}
                </span>
                <span>{Math.round(((step + 1) / total) * 100)}%</span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${((step + 1) / total) * 100}%` }}
                />
              </div>
            </div>

            <fieldset>
              <legend className="text-base font-bold text-ink">{question.prompt}</legend>
              <div className="mt-4 space-y-2">
                {question.options.map((opt) => (
                  <label
                    key={opt}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-sm font-medium transition-colors",
                      answer === opt
                        ? "border-primary bg-primary-soft text-ink"
                        : "border-border bg-card hover:bg-secondary",
                    )}
                  >
                    <input
                      type="radio"
                      name={`q-${question.id}-${step}`}
                      value={opt}
                      checked={answer === opt}
                      onChange={() => setAnswer(opt)}
                      className="size-4 accent-[oklch(0.36_0.072_156)]"
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Action variant="outline" block onClick={close}>
                Exit
              </Action>
              <Action block onClick={next} disabled={!answer}>
                {step + 1 === total ? "Submit survey" : "Next"}
              </Action>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
