import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Lock } from "lucide-react";
import { toast } from "sonner";
import { Pill } from "@/components/ui-kit";
import {
  CATEGORY_IMAGES,
  CATEGORY_LABELS,
  isSurveyUnlocked,
  ksh,
  QUESTION_REWARD,
  SURVEYS,
  type CategoryId,
} from "@/lib/data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/_member/categories")({
  head: () => ({
    meta: [
      { title: "Survey Categories | SokoInsights" },
      {
        name: "description",
        content:
          "Browse SokoInsights research categories: telecom, banking, consumer research and premium studies.",
      },
      { property: "og:title", content: "Survey Categories | SokoInsights" },
      {
        property: "og:description",
        content: "Telecom, banking, research and premium survey categories.",
      },
    ],
  }),
  component: Categories,
});

const order: CategoryId[] = ["telecom", "banking", "research", "premium"];

function Categories() {
  const { state } = useStore();
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          Explore categories
        </h1>
        <p className="mt-2 max-w-2xl text-base text-muted-foreground">
          Every category is powered by verified Kenyan brands. Tap to see surveys inside.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        {order.map((cat) => {
          const surveys = SURVEYS.filter((s) => s.category === cat);
          return (
            <section
              key={cat}
              className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
              aria-labelledby={`cat-${cat}`}
            >
              <div className="relative aspect-[16/7] overflow-hidden bg-secondary">
                <img
                  src={CATEGORY_IMAGES[cat]}
                  alt={`${CATEGORY_LABELS[cat]} research`}
                  loading="lazy"
                  width={1024}
                  height={704}
                  className="size-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/85 to-primary/10" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <Pill tone="inverted">{surveys.length} surveys</Pill>
                  <h2
                    id={`cat-${cat}`}
                    className="mt-2 text-2xl font-extrabold text-primary-foreground"
                  >
                    {CATEGORY_LABELS[cat]}
                  </h2>
                  <p className="text-sm font-semibold text-primary-foreground/85">
                    {ksh(QUESTION_REWARD)} per completed question · eligible within 48 hours
                  </p>
                </div>
              </div>
              <ul className="divide-y divide-border">
                {surveys.map((s) => {
                  const unlocked = isSurveyUnlocked(s, state.plan);
                  return (
                    <li key={s.id}>
                      <button
                        type="button"
                        onClick={() => {
                          if (!unlocked) {
                            toast.info(`This survey requires the ${s.plan} plan.`);
                            navigate({ to: "/plans" });
                            return;
                          }
                          navigate({ to: "/app" });
                        }}
                        className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-secondary/60 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-ink">{s.title}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {s.questions} questions · {s.minutes} min · {s.plan} plan
                          </p>
                        </div>
                        <span className="shrink-0 text-sm font-bold text-accent-foreground">
                          {ksh(QUESTION_REWARD)} / question
                        </span>
                        {unlocked ? (
                          <ArrowRight
                            className="size-4 shrink-0 text-muted-foreground"
                            aria-hidden="true"
                          />
                        ) : (
                          <Lock
                            className="size-4 shrink-0 text-muted-foreground"
                            aria-hidden="true"
                          />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
