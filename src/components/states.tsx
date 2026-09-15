import { Loader2, AlertCircle, Inbox } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

export function LoadingSpinner({ text = "Loading…" }: { text?: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 px-4 py-16 text-muted-foreground sm:py-20"
      role="status"
      aria-live="polite"
    >
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm">{text}</p>
    </div>
  );
}

/** Alias used by pay/plans pages (`label` preferred over `text`). */
export function LoadingState({
  label,
  text,
}: {
  label?: string;
  text?: string;
}) {
  return <LoadingSpinner text={label ?? text ?? "Loading…"} />;
}

export function ErrorState({
  title,
  message = "Something went wrong.",
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-4 py-16 text-center text-muted-foreground sm:py-20">
      <AlertCircle className="h-8 w-8 text-destructive" />
      {title && (
        <p className="font-display text-base font-semibold text-foreground">{title}</p>
      )}
      <p className="max-w-sm text-sm">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-4 py-16 text-center text-muted-foreground sm:py-20">
      <Inbox className="h-10 w-10 opacity-40" aria-hidden />
      <p className="font-display text-base font-semibold text-foreground">{title}</p>
      {description && <p className="max-w-sm text-sm">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
