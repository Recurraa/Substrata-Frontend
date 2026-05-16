import { Check, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatAmount, formatInterval } from "@/lib/utils";
import type { Plan } from "@/types";

interface PlanCardProps {
  plan: Plan;
  onSubscribe?: (plan: Plan) => void;
  onEdit?: (plan: Plan) => void;
  mode?: "user" | "merchant";
}

export function PlanCard({ plan, onSubscribe, onEdit, mode = "user" }: PlanCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">{plan.name}</CardTitle>
            <CardDescription className="mt-1">{plan.description}</CardDescription>
          </div>
          {!plan.isActive && <Badge variant="outline">Inactive</Badge>}
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold">{formatAmount(plan.price, plan.asset)}</span>
          <span className="text-muted-foreground">/ {formatInterval(plan.interval)}</span>
        </div>

        {plan.trialDays > 0 && (
          <p className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
            <Check className="h-4 w-4" />
            {plan.trialDays}-day free trial
          </p>
        )}

        {mode === "merchant" && (
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            {plan.subscriberCount} active subscribers
          </p>
        )}
      </CardContent>

      <CardFooter>
        {mode === "user" ? (
          <Button className="w-full" onClick={() => onSubscribe?.(plan)} disabled={!plan.isActive}>
            Subscribe
          </Button>
        ) : (
          <Button variant="outline" className="w-full" onClick={() => onEdit?.(plan)}>
            Edit Plan
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
