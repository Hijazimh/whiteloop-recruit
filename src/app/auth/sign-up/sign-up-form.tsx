 "use client";

import { useFormState, useFormStatus } from "react-dom";

import { requestSignUp } from "@/app/auth/actions";

const initialState = undefined;

type FieldProps = {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
  hint?: string;
};

function Field({ label, htmlFor, children, hint }: FieldProps) {
  return (
    <label className="block text-left" htmlFor={htmlFor}>
      <span className="text-sm font-medium text-foreground">{label}</span>
      <div className="mt-1.5">{children}</div>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </label>
  );
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex w-full items-center justify-center rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? "Creating account..." : label}
    </button>
  );
}

export function SignUpForm() {
  const [state, formAction] = useFormState(requestSignUp, initialState);

  return (
    <form className="space-y-6" action={formAction}>
      <div className="space-y-4">
        <Field
          label="Work email"
          htmlFor="email"
          hint="Use your login email for Whiteloop."
        >
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@company.com"
            className="w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </Field>

        <Field
          label="Full name"
          htmlFor="fullName"
          hint="This appears on projects and session invites."
        >
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            placeholder="Whiteloop Researcher"
            className="w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </Field>

        <Field
          label="Password"
          htmlFor="password"
          hint="At least 8 characters. Supabase Auth stores it securely."
        >
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            placeholder="••••••••"
            className="w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </Field>

        <fieldset>
          <legend className="text-sm font-medium text-foreground">
            How will you use Whiteloop?
          </legend>
          <p className="mt-1 text-xs text-muted-foreground">
            Choose your primary role. You can request additional access later.
          </p>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border bg-card/80 px-4 py-4 transition hover:border-primary/40">
              <input
                type="radio"
                name="role"
                value="researcher"
                required
                className="mt-1 h-4 w-4 border border-border text-primary focus:ring-primary"
              />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Researcher
                </p>
                <p className="text-xs text-muted-foreground">
                  Create projects, screen applicants, schedule LiveKit sessions,
                  and manage payouts.
                </p>
              </div>
            </label>

            <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border bg-card/80 px-4 py-4 transition hover:border-primary/40">
              <input
                type="radio"
                name="role"
                value="participant"
                required
                className="mt-1 h-4 w-4 border border-border text-primary focus:ring-primary"
              />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Participant
                </p>
                <p className="text-xs text-muted-foreground">
                  Complete screeners, join paid sessions, and receive payouts via
                  Stripe Express.
                </p>
              </div>
            </label>
          </div>
        </fieldset>
      </div>

      {state?.error ? (
        <div className="rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {state.error}
        </div>
      ) : null}

      <SubmitButton label="Create account" />
    </form>
  );
}

