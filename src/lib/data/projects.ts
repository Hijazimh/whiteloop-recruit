import { randomUUID } from "crypto";

import type { NewProject, Project } from "@/lib/db/schema";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service-client";

type ProjectRow = {
  id: string;
  researcher_id: string;
  title: string;
  description: string | null;
  domain: string | null;
  budget_cents: number;
  status: string;
  created_at: string;
};

const mapProject = (row: ProjectRow): Project => ({
  id: row.id,
  researcherId: row.researcher_id,
  title: row.title,
  description: row.description,
  domain: row.domain,
  budgetCents: row.budget_cents,
  status: row.status,
  createdAt: new Date(row.created_at),
});

export async function getProjectsForResearcher(
  researcherId: string
): Promise<Project[]> {
  const supabase = createSupabaseServiceRoleClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("researcher_id", researcherId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load projects: ${error.message}`);
  }

  const rows = (data as ProjectRow[] | null) ?? [];
  return rows.map(mapProject);
}

export async function getProjectById(
  projectId: string,
  researcherId: string
): Promise<Project | null> {
  const supabase = createSupabaseServiceRoleClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .eq("researcher_id", researcherId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load project: ${error.message}`);
  }

  return data ? mapProject(data as ProjectRow) : null;
}

export async function createProject(
  values: Omit<NewProject, "id" | "createdAt">
): Promise<Project> {
  const supabase = createSupabaseServiceRoleClient();
  const { data, error } = await supabase
    .from("projects")
    .insert({
      id: randomUUID(),
      researcher_id: values.researcherId,
      title: values.title,
      description: values.description ?? null,
      domain: values.domain ?? null,
      budget_cents: values.budgetCents,
      status: values.status,
    })
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(
      error?.message ?? "We couldn't create the project. Please try again."
    );
  }

  return mapProject(data as ProjectRow);
}

