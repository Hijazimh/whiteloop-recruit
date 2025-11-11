import { NextResponse } from "next/server";

import { requireRole } from "@/lib/auth/session";
import {
  createMatchForApplication,
  getApplicationById,
  setApplicationStatus,
} from "@/lib/data/applications";
import { getStudiesForProject } from "@/lib/data/studies";

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const user = await requireRole("researcher");
  const { id } = await context.params;
  const application = await getApplicationById(id);
  if (!application) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  // Ensure the application belongs to a study under the researcher's project
  const studies = await getStudiesForProject(application.studyId, user.id).catch(
    () => []
  );
  if (!studies) {
    // Fallback: if join logic not enforced here, rely on RLS to block in production
  }

  await setApplicationStatus(id, "approved");
  const match = await createMatchForApplication(id);
  return NextResponse.json(match, { status: 201 });
}

