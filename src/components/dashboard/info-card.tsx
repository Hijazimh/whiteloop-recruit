import { cn } from "@/lib/utils";

type InfoCardProps = {
  label: string;
  value: string;
  hint?: string;
  className?: string;
};

export function InfoCard({ label, value, hint, className }: InfoCardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-border bg-card p-6 shadow-sm transition hover:border-primary/40 hover:shadow-md",
        className
      )}
    >
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
        {value}
      </p>
      {hint ? (
        <p className="mt-3 text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

