import { NextResponse } from "next/server";
import { z } from "zod";

import { createSupabaseServiceRoleClient } from "@/lib/supabase/service-client";

const schema = z.object({
  studyId: z.string().uuid(),
  participantId: z.string().uuid(),
  sessionId: z.string().uuid(),
  transcriptId: z.string().uuid().optional(),
});

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const supabase = createSupabaseServiceRoleClient();

  // Minimal heuristic: generate a single neutral insight stub if no LLM configured
  const { data: transcript } = await supabase
    .from("transcripts")
    .select("raw_text")
    .eq("session_id", parsed.data.sessionId)
    .maybeSingle();

  const text = transcript?.raw_text ?? "";
  const theme = text.slice(0, 80) || "General sentiment";

  const { error } = await supabase.from("insight_units").insert({
    study_id: parsed.data.studyId,
    participant_id: parsed.data.participantId,
    session_id: parsed.data.sessionId,
    theme,
    why: "Initial automated heuristic. Replace with LLM extraction.",
    evidence: text ? { quotes: [text.slice(0, 160)] } : null,
    sentiment: "neutral",
    tags: [],
  });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

