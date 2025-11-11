import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 pb-24 pt-32 sm:px-10">
        <div className="flex flex-col gap-6">
          <span className="w-fit rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Whiteloop Recruit
          </span>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Find perfectly-matched participants, run sessions, and capture
            insights in one flow.
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Launch studies with screened participants, automate scheduling via
            Cal.com, run moderated interviews on LiveKit, and transform
            transcripts into actionable insight units within minutes.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/researcher"
              className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              For Researchers
            </Link>
            <Link
              href="/participant"
              className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-muted/60"
            >
              For Participants
            </Link>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Smart Matching",
              description:
                "Build screeners with weighted rules and auto-approve eligible participants instantly.",
            },
            {
              title: "Live Sessions",
              description:
                "Run HD interviews with recording, transcription, and session notes captured automatically.",
            },
            {
              title: "Insight Engine",
              description:
                "Generate structured themes, quotes, and sentiment summaries per participant in minutes.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="space-y-3 rounded-3xl border border-border bg-card p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold text-foreground">
                {feature.title}
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
