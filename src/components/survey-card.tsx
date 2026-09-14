import { ArrowRight, CheckCircle2, Clock, Lock } from "lucide-react";
import { Action, Pill } from "@/components/ui-kit";
import { CATEGORY_LABELS, ksh, surveyImage, type Survey } from "@/lib/data";

export function SurveyCard({
  survey,
  locked,
  completed,
  ctaLabel,
  onAction,
}: {
  survey: Survey;
  locked?: boolean;
  completed?: boolean;
  ctaLabel: string;
  onAction: () => void;
}) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-shadow hover:shadow-lift">
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-secondary">
        <img
          src={surveyImage(survey)}
          alt={`${CATEGORY_LABELS[survey.category]} research`}
          loading="lazy"
          width={1024}
          height={704}
          className="size-full object-cover"
        />
        <span className="absolute left-3 top-3">
          <Pill tone="accent">{survey.plan} plan</Pill>
        </span>
        {completed && (
          <span className="absolute right-3 top-3">
            <Pill tone="primary">
              <CheckCircle2 className="size-3.5" aria-hidden="true" /> Completed
            </Pill>
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
          {CATEGORY_LABELS[survey.category]}
        </p>
        <h3 className="mt-1 text-lg font-extrabold tracking-tight text-ink">{survey.title}</h3>
        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="size-4 shrink-0" aria-hidden="true" />
          {survey.questions} questions · about {survey.minutes} minutes
        </p>
        <p className="mt-3 text-sm font-semibold text-ink">
          Eligible reward up to <span className="text-accent-foreground">{ksh(survey.maxReward)}</span>
        </p>
        {locked && (
          <p className="mt-2 flex items-start gap-1.5 text-sm text-muted-foreground">
            <Lock className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            This survey requires the {survey.plan} plan.
          </p>
        )}
        <div className="mt-5 pt-1">
          <Action
            block
            variant={locked ? "outline" : "primary"}
            onClick={onAction}
            disabled={completed}
            aria-label={`${ctaLabel} — ${survey.title}`}
          >
            {locked && <Lock className="size-4" aria-hidden="true" />}
            {completed ? "Completed" : ctaLabel}
            {!locked && !completed && <ArrowRight className="size-4" aria-hidden="true" />}
          </Action>
        </div>
      </div>
    </article>
  );
}
