import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, Clock, CreditCard, ShieldCheck, Smartphone, Wallet } from "lucide-react";
import heroImg from "@/assets/hero-kenya.jpg";
import { PublicHeader, SiteFooter } from "@/components/public-chrome";
import { Action, Panel, Pill, SectionHeading } from "@/components/ui-kit";
import { CATEGORY_LABELS, ksh, SURVEYS, surveyImage } from "@/lib/data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SokoInsights — Your voice. Better market insights." },
      {
        name: "description",
        content:
          "A subscription-based Kenyan consumer research community. Complete short multiple-choice surveys and receive eligible rewards through M-PESA.",
      },
      { property: "og:title", content: "SokoInsights — Your voice. Better market insights." },
      {
        property: "og:description",
        content: "Complete short surveys and receive eligible M-PESA rewards. Rewards vary and are not guaranteed.",
      },
    ],
  }),
  component: Landing,
});

const steps = [
  {
    n: "01",
    title: "Create an account",
    body: "Sign up with your name, email and phone number. Members are verified before accessing eligible surveys.",
  },
  {
    n: "02",
    title: "Choose a subscription",
    body: "Subscription tiers determine which survey categories you can access and how many surveys you may take each month.",
  },
  {
    n: "03",
    title: "Complete surveys, get rewarded",
    body: "Answer short multiple-choice surveys. Eligible completed surveys can generate rewards. Reward amounts vary.",
  },
];

const trust = [
  {
    icon: CreditCard,
    title: "Subscription based",
    body: "SokoInsights is a paid membership platform. There is no promise of income. Subscriptions are billed through M-PESA.",
    points: ["Monthly membership", "Cancel any time", "No income promises"],
  },
  {
    icon: Wallet,
    title: "Rewards vary",
    body: "Reward amounts depend on several factors and are never guaranteed.",
    points: ["Plan", "Survey length", "Eligibility", "Research demand", "Survey availability"],
  },
  {
    icon: ShieldCheck,
    title: "Your data",
    body: "Member information is collected for legitimate platform purposes only.",
    points: ["Account verification", "Survey eligibility", "Reward delivery"],
  },
];

function Landing() {
  const featured = SURVEYS.slice(0, 6);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PublicHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_10%_0%,var(--accent-soft),transparent_60%),radial-gradient(60%_60%_at_90%_10%,var(--primary-soft),transparent_65%)]"
          />
          <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-14 lg:py-20">
            <div>
              <Pill tone="accent">Paid market research for Kenyan consumers</Pill>
              <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-[3.4rem]">
                Share your opinion on the brands you already use.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                SokoInsights is a subscription-based consumer research community where members complete short
                multiple-choice surveys and can receive eligible rewards through M-PESA.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link to="/sign-in">
                  <Action size="lg" block>
                    Sign in to continue
                  </Action>
                </Link>
                <Link to="/create-account">
                  <Action size="lg" variant="outline" block>
                    Create an account
                  </Action>
                </Link>
              </div>
              <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-ink">
                {["Verified members only", "M-PESA rewards", "Subscription required"].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <BadgeCheck className="size-4 text-primary" aria-hidden="true" />
                    {t}
                  </li>
                ))}
              </ul>
              <p className="mt-6 max-w-xl rounded-xl border border-border bg-card/70 p-4 text-xs leading-relaxed text-muted-foreground">
                SokoInsights is not an investment, employment opportunity, or “get paid to click” scheme. Rewards depend
                on eligibility, plan, survey availability and completion and are not guaranteed.
              </p>
            </div>
            <div className="relative">
              <img
                src={heroImg}
                alt="Kenyan adults using their phones in a Nairobi street setting"
                width={1280}
                height={1024}
                className="aspect-[5/4] w-full rounded-3xl border border-border object-cover shadow-lift"
              />
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="scroll-mt-20 border-t border-border/70 py-16 lg:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionHeading
              eyebrow="How it works"
              title="A simple, transparent process."
              description="Three steps from signing up to completing your first eligible survey."
            />
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {steps.map((s) => (
                <Panel key={s.n} className="h-full">
                  <span className="text-sm font-extrabold tracking-[0.2em] text-accent-foreground">{s.n}</span>
                  <h3 className="mt-3 text-xl font-extrabold tracking-tight text-ink">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                </Panel>
              ))}
            </div>
          </div>
        </section>

        {/* Surveys */}
        <section id="surveys" className="scroll-mt-20 bg-secondary/40 py-16 lg:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionHeading
              eyebrow="Categories"
              title="Categories our members research."
              description="Survey availability depends on subscription tier, member profile and current research demand."
            />
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((survey) => (
                <article
                  key={survey.id}
                  className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
                >
                  <div className="aspect-[16/9] overflow-hidden bg-secondary">
                    <img
                      src={surveyImage(survey)}
                      alt={`${CATEGORY_LABELS[survey.category]} research`}
                      loading="lazy"
                      width={1024}
                      height={704}
                      className="size-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <Pill tone="accent" className="self-start">
                      {survey.plan} plan
                    </Pill>
                    <p className="mt-3 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                      {CATEGORY_LABELS[survey.category]}
                    </p>
                    <h3 className="mt-1 text-lg font-extrabold tracking-tight text-ink">{survey.title}</h3>
                    <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Clock className="size-4" aria-hidden="true" />
                      {survey.questions} questions · about {survey.minutes} minutes
                    </p>
                    <p className="mt-3 text-sm font-semibold text-ink">
                      Maximum possible reward: <span className="text-accent-foreground">{ksh(survey.maxReward)}</span>
                    </p>
                    <div className="mt-5 pt-1">
                      <Link to="/sign-in">
                        <Action block variant="outline">
                          Sign in <ArrowRight className="size-4" aria-hidden="true" />
                        </Action>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Trust */}
        <section id="trust" className="scroll-mt-20 py-16 lg:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionHeading eyebrow="Transparency" title="What membership really means." />
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {trust.map((t) => (
                <Panel key={t.title} className="h-full">
                  <span className="grid size-11 place-items-center rounded-xl bg-primary-soft text-primary">
                    <t.icon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-xl font-extrabold tracking-tight text-ink">{t.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.body}</p>
                  <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
                    {t.points.map((p) => (
                      <li key={p} className="flex items-start gap-2">
                        <BadgeCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </Panel>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing CTA */}
        <section id="plans" className="scroll-mt-20 px-4 pb-20 sm:px-6">
          <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-primary px-6 py-14 text-center shadow-lift sm:px-12 lg:py-20">
            <Pill tone="inverted">
              <Smartphone className="size-3.5" aria-hidden="true" /> Billed via M-PESA
            </Pill>
            <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-extrabold tracking-tight text-primary-foreground sm:text-4xl">
              Choose a subscription that fits you.
            </h2>
            <p className="mt-4 text-lg font-semibold text-primary-foreground/85">
              Plans start from Ksh 199 per month.
            </p>
            <div className="mt-8 flex justify-center">
              <Link to="/create-account">
                <Action size="lg" variant="inverted">
                  Compare plans
                </Action>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
