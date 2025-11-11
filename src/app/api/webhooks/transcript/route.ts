import { NextResponse } from "next/server";
import { z } from "zod";

import { createSupabaseServiceRoleClient } from "@/lib/supabase/service-client";

const schema = z.object({
  sessionId: z.string().uuid(),
  rawText: z.string(),
  segments: z.any().optional(),
});

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const supabase = createSupabaseServiceRoleClient();
  const { error } = await supabase.from("transcripts").insert({
    session_id: parsed.data.sessionId,
    raw_text: parsed.data.rawText,
    segments: parsed.data.segments ?? null,
  });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

