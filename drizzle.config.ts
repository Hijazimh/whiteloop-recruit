import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({
  path: ".env.local",
});

if (!process.env.SUPABASE_DB_URL) {
  console.warn(
    "⚠️  SUPABASE_DB_URL is not set. Drizzle commands will fail until it is configured."
  );
}

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.SUPABASE_DB_URL ?? "",
  },
  verbose: true,
  strict: true,
});

