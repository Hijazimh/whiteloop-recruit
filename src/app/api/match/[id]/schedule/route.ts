import { NextResponse } from "next/server";
import { z } from "zod";

import { requireRole } from "@/lib/auth/session";
import { scheduleMatch } from "@/lib/data/applications";

const schema = z.object({
  scheduledAt: z.string().datetime(),
  calcomEventId: z.string().optional(),
});

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  await requireRole("researcher");
  const json = await request.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { id } = await context.params;
  const updated = await scheduleMatch(
    id,
    new Date(parsed.data.scheduledAt),
    parsed.data.calcomEventId
  );
  return NextResponse.json(updated);
}

