import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Pill } from "@/components/ui-kit";
import {
  CATEGORY_IMAGES,
  CATEGORY_LABELS,
  ksh,
  SURVEYS,
  surveyRewardRange,
  type CategoryId,
} from "@/lib/data";

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

const order: CategoryId[] = Object.keys(CATEGORY_LABELS) as CategoryId[];

function Categories() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          Explore categories
        </h1>
        <p className="mt-2 max-w-2xl text-base text-muted-foreground">
          Browse free research topics by category and start answering immediately.
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
                    Browse topics freely and share your perspective
                  </p>
                </div>
              </div>
              <ul className="divide-y divide-border">
                {surveys.map((s) => {
                  const rewardRange = surveyRewardRange(s);
                  return (
                    <li key={s.id}>
                      <button
                        type="button"
                        onClick={() => navigate({ to: "/app" })}
                        className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-secondary/60 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-ink">{s.title}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {s.questions} questions · about {s.minutes} minutes ·{" "}
                            {ksh(rewardRange.min)}-{ksh(rewardRange.max)} per question
                          </p>
                        </div>
                        <span className="shrink-0 text-sm font-bold text-primary">Explore</span>
                        <ArrowRight
                          className="size-4 shrink-0 text-muted-foreground"
                          aria-hidden="true"
                        />
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
