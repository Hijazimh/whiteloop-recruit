import { NextResponse } from "next/server";
import { z } from "zod";

import { createProject } from "@/lib/data/projects";
import { requireRole } from "@/lib/auth/session";

const bodySchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  domain: z.string().min(2),
  budgetCents: z.number().int().nonnegative(),
  status: z.enum(["draft", "published"]).default("draft"),
});

export async function POST(request: Request) {
  const user = await requireRole("researcher");
  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const { title, description, domain, budgetCents, status } = parsed.data;
  const project = await createProject({
    title,
    description,
    domain,
    budgetCents,
    status,
    researcherId: user.id,
  });
  return NextResponse.json(project, { status: 201 });
}

