import { randomUUID } from "crypto";

import type {
  Application,
  Match,
  NewStudy,
  Study,
} from "@/lib/db/schema";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service-client";

type StudyRow = {
  id: string;
  project_id: string;
  name: string;
  modality: string;
  duration_min: number;
  participant_reward_cents: number;
  timezone: string;
  max_participants: number;
  screener_id: string | null;
  status: string;
  created_at: string;
};

type ApplicationRow = {
  id: string;
  study_id: string;
  participant_id: string;
  answers: unknown;
  score: number;
  status: string;
  created_at: string;
};

type MatchRow = {
  id: string;
  application_id: string;
  scheduled_at: string | null;
  calcom_event_id: string | null;
  livekit_room: string | null;
  status: string;
};

const mapStudy = (row: StudyRow): Study => ({
  id: row.id,
  projectId: row.project_id,
  name: row.name,
  modality: row.modality,
  durationMin: row.duration_min,
  participantRewardCents: row.participant_reward_cents,
  timezone: row.timezone,
  maxParticipants: row.max_participants,
  screenerId: row.screener_id ?? null,
  status: row.status,
  createdAt: new Date(row.created_at),
});

const mapApplication = (row: ApplicationRow): Application => ({
  id: row.id,
  studyId: row.study_id,
  participantId: row.participant_id,
  answers: row.answers ?? {},
  score: row.score ?? 0,
  status: row.status,
  createdAt: new Date(row.created_at),
});

const mapMatch = (row: MatchRow): Match => ({
  id: row.id,
  applicationId: row.application_id,
  scheduledAt: row.scheduled_at ? new Date(row.scheduled_at) : null,
  calcomEventId: row.calcom_event_id,
  livekitRoom: row.livekit_room,
  status: row.status,
});

export async function getStudiesForProject(
  projectId: string,
  researcherId: string
): Promise<Study[]> {
  const supabase = createSupabaseServiceRoleClient();
  const { data, error } = await supabase
    .from("studies")
    .select("*, projects!inner(researcher_id)")
    .eq("project_id", projectId)
    .eq("projects.researcher_id", researcherId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load studies: ${error.message}`);
  }

  const rows = (data as StudyRow[] | null) ?? [];
  return rows.map(mapStudy);
}

export async function getStudiesForResearcher(
  researcherId: string
): Promise<Study[]> {
  const supabase = createSupabaseServiceRoleClient();
  const { data, error } = await supabase
    .from("studies")
    .select("*, projects!inner(researcher_id)")
    .eq("projects.researcher_id", researcherId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load studies: ${error.message}`);
  }

  const rows = (data as StudyRow[] | null) ?? [];
  return rows.map(mapStudy);
}

export async function createStudy(values: Omit<NewStudy, "id">) {
  const supabase = createSupabaseServiceRoleClient();
  const { data, error } = await supabase
    .from("studies")
    .insert({
      id: randomUUID(),
      project_id: values.projectId,
      name: values.name,
      modality: values.modality,
      duration_min: values.durationMin,
      participant_reward_cents: values.participantRewardCents,
      timezone: values.timezone,
      max_participants: values.maxParticipants,
      screener_id: values.screenerId ?? null,
      status: values.status,
    })
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Failed to create study");
  }

  return mapStudy(data as StudyRow);
}

export async function getApplicationsForStudy(
  studyId: string
): Promise<Application[]> {
  const supabase = createSupabaseServiceRoleClient();
  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .eq("study_id", studyId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load applications: ${error.message}`);
  }

  const rows = (data as ApplicationRow[] | null) ?? [];
  return rows.map(mapApplication);
}

export async function getMatchesForStudy(studyId: string): Promise<Match[]> {
  const supabase = createSupabaseServiceRoleClient();
  const { data, error } = await supabase
    .from("matches")
    .select("*, applications!inner(study_id, created_at)")
    .eq("applications.study_id", studyId)
    .order("scheduled_at", { ascending: false })
    .order("applications.created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load matches: ${error.message}`);
  }

  const rows = (data as MatchRow[] | null) ?? [];
  return rows.map(mapMatch);
}

export async function listRecruitingStudies(): Promise<Study[]> {
  const supabase = createSupabaseServiceRoleClient();
  const { data, error } = await supabase
    .from("studies")
    .select("*")
    .eq("status", "recruiting")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load recruiting studies: ${error.message}`);
  }

  const rows = (data as StudyRow[] | null) ?? [];
  return rows.map(mapStudy);
}

