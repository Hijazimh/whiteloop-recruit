"use client";

import { useFormState, useFormStatus } from "react-dom";

import { createProjectAction } from "./actions";

const initialState = undefined;

function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-left" htmlFor={htmlFor}>
      <span className="text-sm font-medium text-foreground">{label}</span>
      <div className="mt-1.5">{children}</div>
      {hint ? (
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </label>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? "Creating..." : "Create project"}
    </button>
  );
}

export function CreateProjectForm() {
  const [state, formAction] = useFormState(createProjectAction, initialState);

  return (
    <form className="space-y-5" action={formAction}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Project title"
          htmlFor="title"
          hint="Name it something that helps your team recognize the study."
        >
          <input
            id="title"
            name="title"
            required
            placeholder="E-commerce checkout revamp"
            className="w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </Field>
        <Field
          label="Research domain"
          htmlFor="domain"
          hint="e.g. Fintech, Health, Customer Support"
        >
          <input
            id="domain"
            name="domain"
            required
            placeholder="Fintech"
            className="w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </Field>
      </div>

      <Field
        label="Project description"
        htmlFor="description"
        hint="Tell potential participants what the study is about and what you’re trying to learn."
      >
        <textarea
          id="description"
          name="description"
          required
          rows={4}
          placeholder="We’re exploring how customers complete a cross-border payment in our app and where friction occurs."
          className="w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Budget (USD)"
          htmlFor="budget"
          hint="Total amount earmarked for this project. We’ll hold it in escrow once the study is published."
        >
          <input
            id="budget"
            name="budget"
            required
            type="number"
            step="0.01"
            min={0}
            placeholder="1500"
            className="w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </Field>
        <Field
          label="Status"
          htmlFor="status"
          hint="Draft projects stay private until you’re ready to publish."
        >
          <select
            id="status"
            name="status"
            defaultValue="draft"
            className="w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </Field>
      </div>

      {state?.error ? (
        <div className="rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {state.error}
        </div>
      ) : null}

      {state?.success ? (
        <div className="rounded-2xl border border-primary/40 bg-primary/10 px-4 py-3 text-sm text-primary">
          {state.success}
        </div>
      ) : null}

      <SubmitButton />
    </form>
  );
}

