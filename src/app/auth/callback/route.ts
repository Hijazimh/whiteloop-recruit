import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

import { getClientEnv } from "@/lib/env";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service-client";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/";

  const clientEnv = getClientEnv();
  const fallbackUrl = new URL("/auth/sign-in", clientEnv.NEXT_PUBLIC_APP_URL);

  if (!code) {
    fallbackUrl.searchParams.set("error", "missing_code");
    return NextResponse.redirect(fallbackUrl);
  }

  const cookieStore = await cookies();
  const response = NextResponse.next();
  const supabase = createServerClient(
    clientEnv.NEXT_PUBLIC_SUPABASE_URL,
    clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name, options) {
          response.cookies.set({
            name,
            value: "",
            ...options,
            maxAge: 0,
          });
        },
      },
    }
  );
  const {
    data: { session },
    error,
  } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !session) {
    fallbackUrl.searchParams.set(
      "error",
      error?.message ?? "session_exchange_failed"
    );
    return NextResponse.redirect(fallbackUrl);
  }

  const {
    user,
    user: { id: userId, email },
  } = session;

  const role =
    (user.user_metadata?.role as "participant" | "researcher" | undefined) ??
    "participant";
  const fullName =
    (user.user_metadata?.full_name as string | undefined) ?? null;

  const supabaseService = createSupabaseServiceRoleClient();

  await supabaseService
    .from("users")
    .upsert(
      {
        id: userId,
        email,
        full_name: fullName,
        role,
      },
      { onConflict: "id" }
    );

  if (role === "participant") {
    await supabaseService
      .from("participant_profiles")
      .upsert(
        { user_id: userId },
        {
          onConflict: "user_id",
        }
      );
  } else if (role === "researcher") {
    await supabaseService
      .from("researcher_profiles")
      .upsert(
        { user_id: userId },
        {
          onConflict: "user_id",
        }
      );
  }

  const redirectUrl = new URL(
    role === "researcher" ? "/researcher" : "/participant",
    clientEnv.NEXT_PUBLIC_APP_URL
  );

  if (next) {
    redirectUrl.searchParams.set("from", next);
  }

  const redirectResponse = NextResponse.redirect(redirectUrl);
  for (const cookie of response.cookies.getAll()) {
    redirectResponse.cookies.set(cookie);
  }
  return redirectResponse;
}

