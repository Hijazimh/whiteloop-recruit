import Link from "next/link";

import { SignInForm } from "./sign-in-form";

export default function SignInPage() {
  return (
    <div className="rounded-3xl border border-border bg-card p-8 shadow-lg">
      <div className="space-y-2 text-center">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          Whiteloop Recruit
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Welcome back
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your email and password to access your researcher or participant
          workspace.
        </p>
      </div>

      <div className="mt-8">
        <SignInForm />
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        First time here?{" "}
        <Link
          href="/auth/sign-up"
          className="font-semibold text-primary transition hover:underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}

