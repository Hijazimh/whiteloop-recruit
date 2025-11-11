import Link from "next/link";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { InfoCard } from "@/components/dashboard/info-card";
import { SectionHeading } from "@/components/dashboard/section-heading";
import { requireRole } from "@/lib/auth/session";
import { getUserWithRoleProfile } from "@/lib/data/users";

export default async function ParticipantLanding() {
  const user = await requireRole("participant");
  const userWithProfile = await getUserWithRoleProfile(user.id);

  const completionRate =
    userWithProfile &&
    "participantProfile" in userWithProfile &&
    userWithProfile.participantProfile?.kycStatus === "verified"
      ? 100
      : 0;

  return (
    <main className="min-h-screen bg-background px-6 py-16 sm:px-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-16">
        <header className="rounded-3xl border border-border bg-card/60 p-8 shadow-sm">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Participant Hub
              </p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight text-foreground">
                Welcome back, {user.email}
              </h1>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                Once you&apos;re approved for studies, they will appear here with LiveKit links, consent forms, and payouts.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  Supabase verified email
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                  Profile {userWithProfile && "participantProfile" in userWithProfile && userWithProfile.participantProfile ? "created" : "pending"}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:items-end">
              <p className="text-sm font-semibold text-foreground">Completion rate</p>
              <span className="text-3xl font-semibold text-primary">
                {completionRate}%
              </span>
              <p className="text-xs text-muted-foreground">
                Complete your first session to unlock higher-tier invites.
              </p>
              <SignOutButton />
            </div>
          </div>
        </header>

        <section>
          <SectionHeading
            title="Wallet overview"
            description="Track funds held in escrow and payouts released to you."
            action={
              <Link
                href="#"
                className="text-sm font-semibold text-primary transition hover:underline"
              >
                View ledger (coming soon)
              </Link>
            }
          />
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <InfoCard
              label="Available to cash out"
              value="$0"
              hint="Released funds appear here."
            />
            <InfoCard
              label="Pending after sessions"
              value="$0"
              hint="Shows once a LiveKit session is marked complete."
            />
            <InfoCard
              label="Lifetime earnings"
              value="$0"
              hint="You haven’t completed any sessions yet."
            />
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <SectionHeading
              title="Eligible studies"
              description="Screeners you pass will show up here automatically."
            />
            <div className="rounded-3xl border border-dashed border-border bg-card/40 p-8 text-sm text-muted-foreground">
              No studies yet. Complete your profile and stay tuned for invitations tailored to your background.
            </div>
          </div>

          <div className="space-y-6">
            <SectionHeading
              title="Upcoming sessions"
              description="Your confirmed LiveKit sessions appear here with join links."
            />
            <div className="rounded-3xl border border-dashed border-border bg-card/40 p-8 text-sm text-muted-foreground">
              Nothing scheduled. Once a researcher approves your application, we’ll drop the LiveKit room here.
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}



