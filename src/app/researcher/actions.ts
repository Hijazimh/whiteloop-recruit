"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireRole } from "@/lib/auth/session";
import { createProject } from "@/lib/data/projects";

const projectSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long")
    .max(200, "Keep the title under 200 characters"),
  description: z
    .string()
    .min(10, "Add a few more words to your description")
    .max(2000, "Description is too long"),
  domain: z
    .string()
    .min(2, "Domain must be at least 2 characters"),
  budget: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Enter a valid amount, e.g. 500 or 499.99"),
  status: z.enum(["draft", "published"]).default("draft"),
});

type ActionResult = {
  error?: string;
  success?: string;
};

export async function createProjectAction(
  _prevState: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const user = await requireRole("researcher");

  const parsed = projectSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    domain: formData.get("domain"),
    budget: formData.get("budget"),
    status: formData.get("status") ?? "draft",
  });

  if (!parsed.success) {
    const firstError = parsed.error.issues.at(0);
    return {
      error: firstError?.message ?? "Please review the highlighted fields.",
    };
  }

  const { title, description, domain, budget, status } = parsed.data;

  const budgetCents = Math.round(parseFloat(budget) * 100);

  try {
    await createProject({
      title,
      description,
      domain,
      budgetCents,
      status,
      researcherId: user.id,
    });

    revalidatePath("/researcher");

    return {
      success: "Project created successfully.",
    };
  } catch (error) {
    console.error("Failed to create project", error);
    return {
      error:
        error instanceof Error
          ? error.message
          : "We couldn't save the project. Please try again.",
    };
  }
}

