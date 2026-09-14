import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Action } from "@/components/ui-kit";
import { CATEGORY_LABELS, ksh, QUESTION_REWARD, type Survey } from "@/lib/data";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function SurveyRunner({ survey, onClose }: { survey: Survey | null; onClose: () => void }) {
  const { completeSurvey, confirmQuestion } = useStore();
  const [step, setStep] = useState(0);
  const [answer, setAnswer] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<{
    questionNumber: number;
    total: number;
  } | null>(null);
  const [taskComplete, setTaskComplete] = useState(false);

  if (!survey) return null;

  const total = survey.questionSet.length;
  const question = survey.questionSet[Math.min(step, total - 1)]!;

  const close = () => {
    setStep(0);
    setAnswer(null);
    setConfirmation(null);
    setTaskComplete(false);
    onClose();
  };

  const next = () => {
    if (!answer) return;
    confirmQuestion(survey, question.id);
    setConfirmation({ questionNumber: step + 1, total });
    toast.success("Reward confirmed", {
      description: `+${ksh(QUESTION_REWARD)} added to your earnings.`,
    });
  };

  const nextQuestion = () => {
    if (!confirmation) return;
    if (confirmation.questionNumber < total) {
      setStep(step + 1);
      setAnswer(null);
      setConfirmation(null);
      return;
    }
    completeSurvey(survey);
    setTaskComplete(true);
  };

  return (
    <Dialog open onOpenChange={(o) => !o && close()}>
      <DialogContent className="max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-extrabold tracking-tight text-ink">
            {survey.title}
          </DialogTitle>
          <DialogDescription>
            {survey.brand} · {CATEGORY_LABELS[survey.category]}
          </DialogDescription>
        </DialogHeader>

        {taskComplete ? (
          <div className="text-center">
            <span className="mx-auto grid size-14 place-items-center rounded-full bg-primary-soft text-primary">
              <CheckCircle2 className="size-7" aria-hidden="true" />
            </span>
            <p className="mt-4 text-lg font-extrabold text-ink">Task completed</p>
            <p className="mt-1 text-sm text-muted-foreground">{total} questions answered</p>
            <p className="mt-3 text-2xl font-extrabold text-accent-foreground">
              {ksh(total * QUESTION_REWARD)} confirmed
            </p>
            <p className="mt-2 text-sm font-semibold text-muted-foreground">Status: Processing</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Your {ksh(total * QUESTION_REWARD)} reward has been confirmed and will become eligible
              within 48 hours.
            </p>
            <div className="mt-6">
              <Action block onClick={close}>
                Back to surveys
              </Action>
            </div>
          </div>
        ) : confirmation ? (
          <div className="text-center">
            <span className="mx-auto grid size-14 place-items-center rounded-full bg-primary-soft text-primary">
              <CheckCircle2 className="size-7" aria-hidden="true" />
            </span>
            <p className="mt-4 text-lg font-extrabold text-ink">Reward confirmed</p>
            <p className="mt-2 text-3xl font-extrabold text-accent-foreground">
              +{ksh(QUESTION_REWARD)}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">Added to your earnings.</p>
            <p className="mt-4 text-sm font-semibold text-ink">
              Processing — eligible within 48 hours
            </p>
            <div className="mt-6">
              <Action block onClick={nextQuestion}>
                {confirmation.questionNumber === total ? "Complete task" : "Next question"}
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
              <p className="mt-1 text-sm text-muted-foreground">
                There are no right or wrong answers. Every completed opinion response confirms Ksh
                20.
              </p>
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
                {step + 1 === total ? "Submit answer" : "Submit answer"}
              </Action>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
