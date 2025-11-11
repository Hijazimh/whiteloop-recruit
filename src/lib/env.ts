import { z } from "zod";

const clientSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().min(1),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z
    .string()
    .default("http://localhost:3000")
    .optional(),
});

type ClientSchema = z.infer<typeof clientSchema>;

let cachedEnv: ClientSchema | null = null;

const buildClientEnv = (): ClientSchema => {
  const parsed = clientSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  });

  if (!parsed.success) {
    const message = parsed.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join(", ");

    if (process.env.NODE_ENV === "production") {
      throw new Error(`Invalid public environment variables: ${message}`);
    } else {
      console.warn(`[env] Invalid public environment variables: ${message}`);
    }

    return {
      NEXT_PUBLIC_SUPABASE_URL:
        process.env.NEXT_PUBLIC_SUPABASE_URL ?? "http://localhost:54321",
      NEXT_PUBLIC_SUPABASE_ANON_KEY:
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "supabase-anon-key",
      NEXT_PUBLIC_APP_URL:
        process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    };
  }

  return {
    NEXT_PUBLIC_SUPABASE_URL: parsed.data.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: parsed.data.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_APP_URL:
      parsed.data.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  };
};

export const getClientEnv = () => {
  if (!cachedEnv) {
    cachedEnv = buildClientEnv();
  }

  return cachedEnv;
};

export type ClientEnv = ReturnType<typeof getClientEnv>;

