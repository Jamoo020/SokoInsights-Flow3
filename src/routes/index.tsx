import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, CreditCard, ShieldCheck, Smartphone, Wallet } from "lucide-react";
import heroImg from "@/assets/hero-kenya.jpg";
import { PublicHeader, SiteFooter } from "@/components/public-chrome";
import { Action, Panel, Pill, SectionHeading } from "@/components/ui-kit";
import { CATEGORY_IMAGES, CATEGORY_LABELS, SURVEYS, type CategoryId } from "@/lib/data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SokoInsights — Your voice. Better market insights." },
      {
        name: "description",
        content:
          "A Kenyan consumer research community where each completed opinion response earns Ksh 50–100 and members can continue through a membership-driven experience.",
      },
      { property: "og:title", content: "SokoInsights — Your voice. Better market insights." },
      {
        property: "og:description",
        content:
          "Complete short surveys for Ksh 50–100 per question and unlock answering again with Ksh 250 membership.",
      },
    ],
  }),
  component: Landing,
});

const steps = [
  {
    n: "01",
    title: "Create an account",
    body: "Explore research topics by category and choose one that interests you.",
  },
  {
    n: "02",
    title: "Choose",
    body: "Open any available topic and start answering questions for free.",
  },
  {
    n: "03",
    title: "Answer and get confirmation",
    body: "Share your opinion freely. Completed responses confirm the displayed reward immediately and continue accumulating as you participate.",
  },
];

const trust = [
  {
    icon: CreditCard,
    title: "Free research topics",
    body: "Browse categories, open topics and share opinions without paying to participate.",
    points: ["Free topic discovery", "Free answers", "Original consumer research"],
  },
  {
    icon: Wallet,
    title: "Clear reward process",
    body: "Completed opinion questions receive the configured reward immediately, then move through processing.",
    points: [
      "Ksh 50–100 per question",
      "Confirmed immediately",
      "Membership unlocks continued access",
      "Withdrawal threshold is Ksh 2,500",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Your data",
    body: "Member information is collected for legitimate platform purposes only.",
    points: ["Account verification", "Topic access", "Reward delivery"],
  },
];

const categoryDescriptions: Record<CategoryId, string> = {
  telecom: "Mobile connectivity, data habits and everyday communication.",
  banking: "Banking services, saving habits and digital financial tools.",
  finance: "Household money decisions, planning and financial priorities.",
  shopping: "How people compare, choose and purchase everyday goods.",
  food: "Food, drinks, dining preferences and everyday consumption.",
  technology: "Devices, digital tools and technology choices in daily life.",
  transport: "Commuting, public transport and mobility experiences.",
  automotive: "Vehicle ownership, maintenance and driving-related habits.",
  healthcare: "Healthcare access, wellness routines and pharmacy experiences.",
  education: "Learning, skills development and education experiences.",
  entertainment: "Streaming, leisure and the ways people spend free time.",
  travel: "Travel planning, local trips and holiday preferences.",
  ecommerce: "Online shopping, deliveries and digital buying experiences.",
  apps: "Mobile applications, digital services and app experiences.",
  "consumer-products": "Brands, household products and purchase decisions.",
  agriculture: "Agricultural products, inputs and rural consumer needs.",
  housing: "Renting, home improvement and household living experiences.",
  insurance: "Insurance awareness, protection and financial confidence.",
  energy: "Energy access, household usage and service experiences.",
  beauty: "Beauty, personal care and product preferences.",
  sports: "Sports participation, fitness and active lifestyles.",
  media: "News, social platforms and everyday media habits.",
  employment: "Work, careers, workplace benefits and job-search experiences.",
  lifestyle: "Kenyan routines, priorities and changing everyday lifestyles.",
  "public-services": "Public services, access and digital government experiences.",
  research: "Research participation, opinions and community perspectives.",
  premium: "Focused research on high-interest products and services.",
};

function Landing() {
  const categories = (Object.keys(CATEGORY_LABELS) as CategoryId[]).map((category) => ({
    category,
    topicCount: SURVEYS.filter((survey) => survey.category === category).length,
  }));

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
                Explore research topics, share your opinions and receive confirmation for each
                completed response. Rewards become eligible after the processing period.
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
                {["Free topics", "Opinion-led research", "Membership unlocks withdrawals"].map(
                  (t) => (
                    <li key={t} className="flex items-center gap-2">
                      <BadgeCheck className="size-4 text-primary" aria-hidden="true" />
                      {t}
                    </li>
                  ),
                )}
              </ul>
              <p className="mt-6 max-w-xl rounded-xl border border-border bg-card/70 p-4 text-xs leading-relaxed text-muted-foreground">
                SokoInsights is not an investment, employment opportunity, or “get paid to click”
                scheme. Each completed opinion question confirms its configured reward, with
                membership activation supports continued access and withdrawal eligibility.
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
        <section
          id="how-it-works"
          className="scroll-mt-20 border-t border-border/70 py-16 lg:py-20"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionHeading
              eyebrow="How it works"
              title="A simple, transparent process."
              description="Three steps from signing up to completing your first research topic."
            />
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {steps.map((s) => (
                <Panel key={s.n} className="h-full">
                  <span className="text-sm font-extrabold tracking-[0.2em] text-accent-foreground">
                    {s.n}
                  </span>
                  <h3 className="mt-3 text-xl font-extrabold tracking-tight text-ink">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                </Panel>
              ))}
            </div>
          </div>
        </section>

        {/* Research topics */}
        <section id="surveys" className="scroll-mt-20 bg-secondary/40 py-16 lg:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionHeading
              eyebrow="Research topics"
              title="Explore Research Topics"
              description="Share your opinions across the topics, brands, products and services that matter to everyday life in Kenya."
            />
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map(({ category, topicCount }) => (
                <Link
                  key={category}
                  to="/sign-in"
                  className="group flex min-h-72 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-shadow hover:shadow-lift focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
                >
                  <div className="relative aspect-[16/9] overflow-hidden bg-secondary">
                    <img
                      src={CATEGORY_IMAGES[category]}
                      alt={`${CATEGORY_LABELS[category]} research topics`}
                      loading="lazy"
                      width={1024}
                      height={704}
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/75 to-transparent" />
                    <Pill tone="inverted" className="absolute bottom-4 left-4">
                      {topicCount} {topicCount === 1 ? "topic" : "topics"}
                    </Pill>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                      Research category
                    </p>
                    <h3 className="mt-1 text-xl font-extrabold tracking-tight text-ink">
                      {CATEGORY_LABELS[category]}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {categoryDescriptions[category]}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary">
                      Explore topics <ArrowRight className="size-4" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
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
                        <BadgeCheck
                          className="mt-0.5 size-4 shrink-0 text-primary"
                          aria-hidden="true"
                        />
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
              Activate membership when you are ready to continue answering.
            </h2>
            <p className="mt-4 text-lg font-semibold text-primary-foreground/85">
              Membership activation costs Ksh 250 and unlocks continued answering.
            </p>
            <div className="mt-8 flex justify-center">
              <Link to="/create-account">
                <Action size="lg" variant="inverted">
                  View membership
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
