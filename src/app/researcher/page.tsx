import Link from "next/link";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { InfoCard } from "@/components/dashboard/info-card";
import { SectionHeading } from "@/components/dashboard/section-heading";
import { requireRole } from "@/lib/auth/session";
import { getProjectsForResearcher } from "@/lib/data/projects";

import { CreateProjectForm } from "./create-project-form";

function formatCurrencyCents(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value / 100);
}

export default async function ResearcherLanding() {
  const user = await requireRole("researcher");
  const projects = await getProjectsForResearcher(user.id);

  const totalBudget = projects.reduce((sum, project) => sum + project.budgetCents, 0);
  const publishedCount = projects.filter((project) => project.status === "published").length;
  const draftCount = projects.filter((project) => project.status === "draft").length;

  return (
    <main className="min-h-screen bg-background px-6 py-16 sm:px-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-16">
        <header className="flex flex-col gap-4 rounded-3xl border border-border bg-card/60 p-8 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Researcher Console
              </p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight text-foreground">
                Hi {user.email}, let&apos;s build your next study
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                Create projects, set budgets, and track recruiting in one place. Magic links keep your team signed in securely.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:items-end">
              <Link
                href="#create-project"
                className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                New project
              </Link>
              <SignOutButton />
            </div>
          </div>
        </header>

        <section>
          <SectionHeading
            title="Operational Pulse"
            description="Live metrics from your Supabase workspace."
          />
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <InfoCard
              label="Total projects"
              value={projects.length.toString()}
              hint="All projects you have created."
            />
            <InfoCard
              label="Published studies"
              value={publishedCount.toString()}
              hint="Visible to eligible participants."
            />
            <InfoCard
              label="Drafts"
              value={draftCount.toString()}
              hint="Finish setup and publish when ready."
            />
            <InfoCard
              label="Budget allocated"
              value={formatCurrencyCents(totalBudget)}
              hint="Across all projects in your workspace."
            />
          </div>
        </section>

        <section id="create-project" className="space-y-6">
          <SectionHeading
            title="Create a new project"
            description="Define the parent project before adding individual studies and screeners."
          />
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <CreateProjectForm />
          </div>
        </section>

        <section className="space-y-6">
          <SectionHeading
            title="Your projects"
            description="Click through to manage studies, applicants, scheduling, and insights."
          />

          {projects.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border bg-card/40 p-10 text-center text-sm text-muted-foreground">
              No projects yet. Create your first project to start recruiting participants.
            </div>
          ) : (
            <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
              <div className="grid grid-cols-12 border-b border-border/60 bg-muted/60 px-6 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <span className="col-span-4">Project</span>
                <span className="col-span-2">Domain</span>
                <span className="col-span-2">Status</span>
                <span className="col-span-2">Budget</span>
                <span className="col-span-2 text-right">Created</span>
              </div>
              <div className="divide-y divide-border/70">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="grid grid-cols-12 items-start px-6 py-4 hover:bg-muted/40"
                  >
                    <div className="col-span-4">
                      <p className="font-medium text-foreground">{project.title}</p>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                        {project.description}
                      </p>
                    </div>
                    <div className="col-span-2 text-sm text-muted-foreground">
                      {project.domain}
                    </div>
                    <div className="col-span-2">
                      <span
                        className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary capitalize"
                      >
                        {project.status}
                      </span>
                    </div>
                    <div className="col-span-2 text-sm font-semibold text-foreground">
                      {formatCurrencyCents(project.budgetCents)}
                    </div>
                    <div className="col-span-2 text-right text-sm text-muted-foreground">
                      {new Intl.DateTimeFormat("en-US", {
                        month: "short",
                        day: "numeric",
                      }).format(project.createdAt ?? new Date())}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
