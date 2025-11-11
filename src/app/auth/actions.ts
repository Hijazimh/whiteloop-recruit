 "use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service-client";
import {
  upsertParticipantProfile,
  upsertResearcherProfile,
} from "@/lib/data/users";

const signUpSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters long")
    .max(120, "Full name must be 120 characters or less"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(72, "Password must be 72 characters or less"),
  role: z.enum(["participant", "researcher"]),
});

const signInSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type ActionResult = {
  error?: string;
};

export async function requestSignUp(
  _prevState: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const supabaseAdmin = createSupabaseServiceRoleClient();

  const parsed = signUpSchema.safeParse({
    email: formData.get("email"),
    fullName: formData.get("fullName"),
    password: formData.get("password"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    const firstError = parsed.error.issues.at(0);
    return {
      error: firstError?.message ?? "Invalid input. Please check the form.",
    };
  }

  const { email, fullName, password, role } = parsed.data;

  const createResult = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      role,
      full_name: fullName,
    },
  });

  if (createResult.error) {
    return {
      error:
        createResult.error.message?.includes("already registered")
          ? "An account with this email already exists."
          : createResult.error.message ??
            "We couldn't create your account. Please try again.",
    };
  }

  const createdUser = createResult.data.user;
  if (createdUser) {
    const service = createSupabaseServiceRoleClient();
    const roleValue = role ?? "participant";
    await service
      .from("users")
      .upsert({
        id: createdUser.id,
        email,
        role: roleValue,
        full_name: fullName,
      })
      .throwOnError();

    if (roleValue === "researcher") {
      await upsertResearcherProfile(createdUser.id);
    } else {
      await upsertParticipantProfile(createdUser.id);
    }
  }

  const supabase = await createSupabaseServerClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    return {
      error:
        signInError.message ??
        "Account created, but we couldn't sign you in. Try logging in manually.",
    };
  }

  redirect(role === "researcher" ? "/researcher" : "/participant");
}

export async function requestSignIn(
  _prevState: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createSupabaseServerClient();

  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    const firstError = parsed.error.issues.at(0);
    return {
      error: firstError?.message ?? "Enter a valid email address.",
    };
  }

  const { email, password } = parsed.data;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      error: error.message ?? "Invalid email or password.",
    };
  }

  const role =
    (data.user.user_metadata?.role as "participant" | "researcher" | undefined) ??
    "participant";
  redirect(role === "researcher" ? "/researcher" : "/participant");
}

export async function signOut(): Promise<ActionResult> {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    return {
      error: error.message ?? "Unable to sign out. Try again in a moment.",
    };
  }

  return {};
}

