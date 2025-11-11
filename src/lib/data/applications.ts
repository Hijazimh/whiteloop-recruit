import { randomUUID } from "crypto";

import type { Application, Match } from "@/lib/db/schema";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service-client";

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

export async function createApplication(values: {
  studyId: string;
  participantId: string;
  answers: unknown;
  score?: number;
  status?: string;
}): Promise<Application> {
  const supabase = createSupabaseServiceRoleClient();
  const { data, error } = await supabase
    .from("applications")
    .insert({
      id: randomUUID(),
      study_id: values.studyId,
      participant_id: values.participantId,
      answers: values.answers,
      score: values.score ?? 0,
      status: values.status ?? "pending",
      created_at: new Date().toISOString(),
    })
    .select("*")
    .single();
  if (error || !data) throw new Error(error?.message ?? "Failed to create application");
  return mapApplication(data as ApplicationRow);
}

export async function setApplicationStatus(
  applicationId: string,
  status: "approved" | "rejected" | "waitlist"
) {
  const supabase = createSupabaseServiceRoleClient();
  const { error } = await supabase
    .from("applications")
    .update({ status })
    .eq("id", applicationId);
  if (error) throw new Error(error.message);
}

export async function getApplicationById(
  applicationId: string
): Promise<Application | null> {
  const supabase = createSupabaseServiceRoleClient();
  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .eq("id", applicationId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? mapApplication(data as ApplicationRow) : null;
}

export async function createMatchForApplication(applicationId: string) {
  const supabase = createSupabaseServiceRoleClient();
  const { data, error } = await supabase
    .from("matches")
    .insert({
      id: randomUUID(),
      application_id: applicationId,
      status: "awaiting_schedule",
    })
    .select("*")
    .single();
  if (error || !data) throw new Error(error?.message ?? "Failed to create match");
  return mapMatch(data as MatchRow);
}

export async function scheduleMatch(
  matchId: string,
  when: Date,
  calcomEventId?: string
): Promise<Match> {
  const supabase = createSupabaseServiceRoleClient();
  const { data, error } = await supabase
    .from("matches")
    .update({
      scheduled_at: when.toISOString(),
      calcom_event_id: calcomEventId ?? null,
      status: "scheduled",
    })
    .eq("id", matchId)
    .select("*")
    .single();
  if (error || !data) throw new Error(error?.message ?? "Failed to schedule match");
  return mapMatch(data as MatchRow);
}

