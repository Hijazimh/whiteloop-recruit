import { redirect } from "next/navigation";
import type { Session, User } from "@supabase/supabase-js";

import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service-client";
import {
  upsertParticipantProfile,
  upsertResearcherProfile,
} from "@/lib/data/users";

type UserRole = "participant" | "researcher";

async function syncUserRecord(user: User, role: UserRole) {
  const service = createSupabaseServiceRoleClient();
  await service
    .from("users")
    .upsert({
      id: user.id,
      email: user.email,
      role,
      full_name:
        (user.user_metadata?.full_name as string | undefined) ?? null,
      avatar_url:
        (user.user_metadata?.avatar_url as string | undefined) ?? null,
      country: (user.user_metadata?.country as string | undefined) ?? null,
    })
    .throwOnError();

  if (role === "researcher") {
    await upsertResearcherProfile(user.id);
  } else {
    await upsertParticipantProfile(user.id);
  }
}

export async function getSession(): Promise<Session | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    return null;
  }
  return data.session ?? null;
}

export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    return null;
  }
  return data.user ?? null;
}

export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  return user;
}

export async function requireRole(role: "participant" | "researcher") {
  const user = await requireUser();
  const userRole =
    (user.user_metadata?.role as "participant" | "researcher" | undefined) ??
    "participant";

  await syncUserRecord(user, userRole);

  if (userRole !== role) {
    redirect(role === "researcher" ? "/participant" : "/researcher");
  }

  return user;
}

