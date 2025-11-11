import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { getServerEnv } from "@/lib/env.server";

import * as schema from "./schema";

declare global {
  var __whiteloopPool: Pool | undefined;
}

const createPool = () => {
  const serverEnv = getServerEnv();

  if (!serverEnv.SUPABASE_DB_URL) {
    throw new Error(
      "SUPABASE_DB_URL is not set. Cannot create database connection."
    );
  }

  return new Pool({
    connectionString: serverEnv.SUPABASE_DB_URL,
    max: 10,
    idleTimeoutMillis: 30_000,
    ssl: {
      rejectUnauthorized: false,
    },
  });
};

export const getPool = () => {
  if (!globalThis.__whiteloopPool) {
    globalThis.__whiteloopPool = createPool();
  }

  return globalThis.__whiteloopPool;
};

export const db = drizzle(getPool(), {
  schema,
});

