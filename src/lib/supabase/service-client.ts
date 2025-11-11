import { createClient } from "@supabase/supabase-js";

import { getClientEnv } from "@/lib/env";
import { getServerEnv } from "@/lib/env.server";

export const createSupabaseServiceRoleClient = () => {
  const serverEnv = getServerEnv();

  if (!serverEnv.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is required to instantiate the service role client."
    );
  }

  const clientEnv = getClientEnv();

  if (!clientEnv.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL is required to instantiate the service role client."
    );
  }

  return createClient(
    clientEnv.NEXT_PUBLIC_SUPABASE_URL,
    serverEnv.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
};

