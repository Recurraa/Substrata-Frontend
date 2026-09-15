import { toCsv } from "@/lib/csv";
import type { ApiPlan } from "@/lib/plan-mapper";

export function plansToCsv(plans: ApiPlan[]): string {
  return toCsv(
    plans.map((p) => ({
      id: p.id,
      name: p.name,
      amount: p.amount,
      asset: p.assetCode,
      interval: p.interval,
      active: p.isActive ? "yes" : "no",
    }))
  );
}
