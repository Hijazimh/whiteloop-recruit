import { NextResponse } from "next/server";

import { requireRole } from "@/lib/auth/session";
import { getApplicationById, setApplicationStatus } from "@/lib/data/applications";

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  await requireRole("researcher");
  const { id } = await context.params;
  const application = await getApplicationById(id);
  if (!application) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }
  await setApplicationStatus(id, "rejected");
  return NextResponse.json({ ok: true });
}

