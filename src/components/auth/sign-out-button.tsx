"use client";

import { useState, useTransition } from "react";

import { signOut } from "@/app/auth/actions";

export function SignOutButton({
  variant = "ghost",
}: {
  variant?: "ghost" | "solid";
}) {
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    setMessage(null);

    startTransition(async () => {
      const result = await signOut();
      if (result?.error) {
        setMessage(result.error);
        return;
      }
      window.location.href = "/auth/sign-in";
    });
  };

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        onClick={handleClick}
        disabled={isPending}
        className={
          variant === "solid"
            ? "inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
            : "inline-flex items-center rounded-full border border-border px-4 py-2 text-sm font-semibold text-muted-foreground transition hover:bg-muted/60 disabled:cursor-not-allowed disabled:opacity-70"
        }
      >
        {isPending ? "Signing out..." : "Sign out"}
      </button>
      {message ? (
        <p className="text-xs text-destructive">{message}</p>
      ) : null}
    </div>
  );
}

