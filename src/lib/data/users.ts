import type {
  ParticipantProfile,
  ResearcherProfile,
  User,
} from "@/lib/db/schema";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service-client";

export type UserWithProfile =
  | (User & { participantProfile: ParticipantProfile | null })
  | (User & { researcherProfile: ResearcherProfile | null })
  | User;

type UserRow = {
  id: string;
  created_at: string;
  role: "participant" | "researcher" | "admin";
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  country: string | null;
};

type ParticipantProfileRow = {
  user_id: string;
  dob: string | null;
  languages: string[] | null;
  demographics: unknown;
  expertise: string[] | null;
  interests: string[] | null;
  kyc_status: string;
  payout_account: unknown;
};

type ResearcherProfileRow = {
  user_id: string;
  company: string | null;
  website: string | null;
  plan_tier: string;
  credits: number;
};

const mapUser = (row: UserRow): User => ({
  id: row.id,
  createdAt: new Date(row.created_at),
  role: row.role,
  email: row.email,
  fullName: row.full_name,
  avatarUrl: row.avatar_url,
  country: row.country,
});

const mapParticipantProfile = (
  row: ParticipantProfileRow | null
): ParticipantProfile | null =>
  row
    ? {
        userId: row.user_id,
        dob: row.dob ? new Date(row.dob) : null,
        languages: row.languages ?? [],
        demographics: row.demographics ?? {},
        expertise: row.expertise ?? [],
        interests: row.interests ?? [],
        kycStatus: row.kyc_status ?? "unverified",
        payoutAccount: row.payout_account ?? null,
      }
    : null;

const mapResearcherProfile = (
  row: ResearcherProfileRow | null
) =>
  row
    ? {
        userId: row.user_id,
        company: row.company,
        website: row.website,
        planTier: row.plan_tier,
        credits: row.credits ?? 0,
      }
    : null;

export async function getUserById(userId: string): Promise<User | null> {
  const supabase = createSupabaseServiceRoleClient();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load user: ${error.message}`);
  }

  return data ? mapUser(data as UserRow) : null;
}

export async function getUserWithRoleProfile(
  userId: string
): Promise<UserWithProfile | null> {
  const user = await getUserById(userId);
  if (!user) return null;

  const supabase = createSupabaseServiceRoleClient();

  if (user.role === "researcher") {
    const { data, error } = await supabase
      .from("researcher_profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();
    if (error) {
      throw new Error(`Failed to load researcher profile: ${error.message}`);
    }
    return { ...user, researcherProfile: mapResearcherProfile(data as ResearcherProfileRow | null) };
  }

  if (user.role === "participant") {
    const { data, error } = await supabase
      .from("participant_profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();
    if (error) {
      throw new Error(`Failed to load participant profile: ${error.message}`);
    }
    return { ...user, participantProfile: mapParticipantProfile(data as ParticipantProfileRow | null) };
  }

  return user;
}

export async function upsertResearcherProfile(userId: string) {
  const supabase = createSupabaseServiceRoleClient();
  const { error } = await supabase
    .from("researcher_profiles")
    .upsert({ user_id: userId }, { onConflict: "user_id" });
  if (error) {
    throw new Error(`Failed to upsert researcher profile: ${error.message}`);
  }
}

export async function upsertParticipantProfile(userId: string) {
  const supabase = createSupabaseServiceRoleClient();
  const { error } = await supabase
    .from("participant_profiles")
    .upsert({ user_id: userId }, { onConflict: "user_id" });
  if (error) {
    throw new Error(`Failed to upsert participant profile: ${error.message}`);
  }
}

