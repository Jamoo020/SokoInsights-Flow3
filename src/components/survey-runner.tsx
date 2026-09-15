import { CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Action } from "@/components/ui-kit";
import { CATEGORY_LABELS, ksh, type Survey } from "@/lib/data";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function SurveyRunner({ survey, onClose }: { survey: Survey | null; onClose: () => void }) {
  const { state, completeSurvey, confirmQuestion } = useStore();
  const [step, setStep] = useState(0);
  const [answer, setAnswer] = useState<string[]>([]);
  const [confirmation, setConfirmation] = useState<{
    questionNumber: number;
    total: number;
  } | null>(null);
  const [taskComplete, setTaskComplete] = useState(false);

  const answeringLocked = state.confirmedEarnings >= 700 && state.membershipStatus !== "active";
  const attempt = survey ? state.surveyAttempts[survey.id] : null;
  const orderedQuestions =
    attempt && survey
      ? attempt.questionOrder
          .map((questionId) => survey.questionSet.find((candidate) => candidate.id === questionId))
          .filter((question): question is NonNullable<typeof question> => Boolean(question))
      : [];
  const total = orderedQuestions.length;
  const question = orderedQuestions[Math.min(step, Math.max(total - 1, 0))];
  const orderedOptions =
    question && attempt
      ? attempt.optionOrderByQuestion[question.id]
          .map((optionId) => question.options.find((option) => option.id === optionId))
          .filter((option): option is NonNullable<typeof option> => Boolean(option))
      : [];
  const totalReward = orderedQuestions.reduce(
    (totalAmount, currentQuestion) => totalAmount + currentQuestion.reward,
    0,
  );
  const questionReward = question?.reward ?? survey?.rewardPerQuestion ?? 20;

  useEffect(() => {
    if (!survey || !attempt) {
      setStep(0);
      setAnswer([]);
      setConfirmation(null);
      setTaskComplete(false);
      return;
    }
    setStep(Math.min(attempt.currentQuestionIndex, Math.max(total - 1, 0)));
    setAnswer(attempt.submittedAnswers[question?.id ?? ""] ?? []);
    setConfirmation(null);
    setTaskComplete(attempt.currentQuestionIndex >= total);
  }, [attempt?.attemptId, survey?.id, total]);

  const close = () => {
    setStep(0);
    setAnswer([]);
    setConfirmation(null);
    setTaskComplete(false);
    onClose();
  };

  if (!survey || !attempt || !question || total === 0) return null;

  if (answeringLocked) {
    return (
      <Dialog open onOpenChange={(o) => !o && close()}>
        <DialogContent className="max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold tracking-tight text-ink">
              Answering is currently locked
            </DialogTitle>
            <DialogDescription>
              You have reached Ksh 700 in accumulated earnings. Activate your Ksh 250 membership to
              continue answering questions.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 rounded-2xl bg-secondary p-4 text-sm text-muted-foreground">
            <p className="font-semibold text-ink">
              Questions remain visible, but additional answers are temporarily locked.
            </p>
            <p>Your accumulated earnings remain recorded and your progress is preserved.</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Action variant="outline" block onClick={close}>
              Close
            </Action>
            <Action block onClick={() => window.location.assign("/plans")}>
              Activate Membership — Ksh 250
            </Action>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const next = () => {
    if (answer.length === 0) return;
    confirmQuestion(survey, attempt.attemptId, question.id, answer);
    setConfirmation({ questionNumber: step + 1, total });
    toast.success("Reward confirmed", {
      description: `+${ksh(questionReward)} added to your earnings.`,
    });
  };

  const nextQuestion = () => {
    if (!confirmation) return;
    if (confirmation.questionNumber < total) {
      setStep(step + 1);
      setAnswer([]);
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
            {CATEGORY_LABELS[survey.category]} · Opinion research
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
              {ksh(totalReward)} confirmed
            </p>
            <p className="mt-2 text-sm font-semibold text-muted-foreground">Status: Processing</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Your {ksh(totalReward)} reward has been confirmed and added to your accumulated
              earnings.
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
              +{ksh(questionReward)}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">Added to your earnings.</p>
            <p className="mt-4 text-sm font-semibold text-ink">Status: Processing</p>
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
                There are no right or wrong answers. This completed opinion response confirms{" "}
                {ksh(questionReward)}.
              </p>
              <div className="mt-4 space-y-2">
                {orderedOptions.map((option) => (
                  <label
                    key={option.id}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-sm font-medium transition-colors",
                      answer.includes(option.id)
                        ? "border-primary bg-primary-soft text-ink"
                        : "border-border bg-card hover:bg-secondary",
                    )}
                  >
                    <input
                      type={question.questionType === "multi_select" ? "checkbox" : "radio"}
                      name={`q-${question.id}-${step}`}
                      value={option.id}
                      checked={answer.includes(option.id)}
                      onChange={() => {
                        if (question.questionType === "multi_select") {
                          setAnswer((current) =>
                            current.includes(option.id)
                              ? current.filter((id) => id !== option.id)
                              : [...current, option.id],
                          );
                        } else {
                          setAnswer([option.id]);
                        }
                      }}
                      className="size-4 accent-[oklch(0.36_0.072_156)]"
                    />
                    {option.label}
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
