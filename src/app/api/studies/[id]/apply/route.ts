import { NextResponse } from "next/server";
import { z } from "zod";

import { requireRole } from "@/lib/auth/session";
import { createApplication } from "@/lib/data/applications";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service-client";
import { scoreApplicant, type Criteria } from "@/lib/matching";

const bodySchema = z.object({
  answers: z.any().default({}),
});

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const user = await requireRole("participant");
  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  // Fetch screener criteria to score
  const supabase = createSupabaseServiceRoleClient();
  const { id } = await context.params;

  const { data: study, error: studyErr } = await supabase
    .from("studies")
    .select("id, project_id, screener_id")
    .eq("id", id)
    .single();
  if (studyErr || !study) {
    return NextResponse.json({ error: "Study not found" }, { status: 404 });
  }

  let score = 0;
  if (study.screener_id) {
    const { data: screener } = await supabase
      .from("screeners")
      .select("criteria")
      .eq("id", study.screener_id)
      .single();
    if (screener?.criteria) {
      const { data: profile } = await supabase
        .from("participant_profiles")
        .select("languages, demographics, expertise, interests")
        .eq("user_id", user.id)
        .single();
      const result = scoreApplicant(
        screener.criteria as Criteria,
        profile ?? {},
        parsed.data.answers
      );
      score = result.score;
    }
  }

  const application = await createApplication({
    studyId: id,
    participantId: user.id,
    answers: parsed.data.answers,
    score,
    status: "pending",
  });

  return NextResponse.json(application, { status: 201 });
}

