import type { ApiPlan } from "@/lib/plan-mapper";

export function isActivePlan(p: ApiPlan): boolean {
  return Boolean(p.isActive);
}
