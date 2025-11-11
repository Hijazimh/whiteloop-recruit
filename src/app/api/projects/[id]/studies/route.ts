import { NextResponse } from "next/server";
import { z } from "zod";

import { requireRole } from "@/lib/auth/session";
import { createStudy } from "@/lib/data/studies";

const schema = z.object({
  name: z.string().min(3),
  modality: z.string().min(3),
  durationMin: z.number().int().positive(),
  participantRewardCents: z.number().int().nonnegative(),
  timezone: z.string().min(2),
  maxParticipants: z.number().int().positive(),
  screenerId: z.string().uuid().optional(),
  status: z.enum(["recruiting", "scheduled", "completed"]).default("recruiting"),
});

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  await requireRole("researcher");
  const json = await request.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { id } = await context.params;

  const study = await createStudy({
    projectId: id,
    ...parsed.data,
  });

  return NextResponse.json(study, { status: 201 });
}

