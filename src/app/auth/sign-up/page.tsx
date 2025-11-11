import Link from "next/link";

import { SignUpForm } from "./sign-up-form";

export default function SignUpPage() {
  return (
    <div className="rounded-3xl border border-border bg-card p-8 shadow-lg">
      <div className="space-y-2 text-center">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          Whiteloop Recruit
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Create your account
        </h1>
        <p className="text-sm text-muted-foreground">
          Create your Whiteloop account and choose your role. You can always add
          more permissions later.
        </p>
      </div>

      <div className="mt-8">
        <SignUpForm />
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/auth/sign-in"
          className="font-semibold text-primary transition hover:underline"
        >
          Send me a sign-in link
        </Link>
      </p>
    </div>
  );
}

