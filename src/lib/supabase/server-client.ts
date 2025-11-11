"use server";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

import { getClientEnv } from "@/lib/env";

type MutableCookies = {
  set: (options: {
    name: string;
    value: string;
    path?: string;
    maxAge?: number;
    domain?: string;
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: "strict" | "lax" | "none";
  }) => void;
  delete: (options: { name: string; path?: string }) => void;
};

const isMutableCookies = (store: unknown): store is MutableCookies => {
  return (
    typeof store === "object" &&
    store !== null &&
    "set" in store &&
    typeof (store as { set: unknown }).set === "function" &&
    "delete" in store &&
    typeof (store as { delete: unknown }).delete === "function"
  );
};

export const createSupabaseServerClient = async () => {
  const clientEnv = getClientEnv();
  const maybeStore = cookies();
  const cookieStore =
    maybeStore instanceof Promise ? await maybeStore : maybeStore;

  return createServerClient(
    clientEnv.NEXT_PUBLIC_SUPABASE_URL,
    clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          if (isMutableCookies(cookieStore)) {
            cookieStore.set({
              name,
              value,
              ...options,
            });
          }
        },
        remove(name, options) {
          if (isMutableCookies(cookieStore)) {
            cookieStore.delete({
              name,
              ...options,
            });
          }
        },
      },
    }
  );
};

