import Link from "next/link";
import { formatAmount, formatInterval } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { Plan } from "@/types";

interface PlanCardProps {
  plan: Plan;
  onSubscribe?: (plan: Plan) => void;
  onEdit?: (plan: Plan) => void;
  mode?: "user" | "merchant";
  href?: string;
}

export function PlanCard({ plan, onSubscribe, onEdit, mode = "user", href }: PlanCardProps) {
  return (
    <article className="flex flex-col border border-border bg-background/70 p-5 transition-colors hover:border-foreground/20">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-semibold">{plan.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
        </div>
        {!plan.isActive && (
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
            Inactive
          </span>
        )}
      </div>

      <div className="mt-6 flex items-baseline gap-1.5">
        <span className="font-display text-3xl font-semibold tabular-nums">
          {formatAmount(plan.price, plan.asset)}
        </span>
        <span className="text-sm text-muted-foreground">/ {formatInterval(plan.interval)}</span>
      </div>

      {plan.trialDays > 0 && (
        <p className="mt-2 text-xs text-sea">{plan.trialDays}-day trial</p>
      )}

      {mode === "merchant" && (
        <p className="mt-3 text-xs text-muted-foreground">
          {plan.subscriberCount} active subscribers
        </p>
      )}

      <div className="mt-auto pt-6">
        {mode === "user" ? (
          href ? (
            <Button asChild className="w-full" disabled={!plan.isActive}>
              <Link href={href}>Subscribe</Link>
            </Button>
          ) : (
            <Button
              className="w-full"
              onClick={() => onSubscribe?.(plan)}
              disabled={!plan.isActive}
            >
              Subscribe
            </Button>
          )
        ) : (
          <Button variant="outline" className="w-full" onClick={() => onEdit?.(plan)}>
            Edit plan
          </Button>
        )}
      </div>
    </article>
  );
}
