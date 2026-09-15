import type { Plan } from "@/types";
import { formatAssetAmount, formatInterval } from "@/lib/format";

export function planPriceLabel(plan: Pick<Plan, "price" | "asset" | "interval">): string {
  return `${formatAssetAmount(plan.price, plan.asset)} / ${formatInterval(plan.interval)}`;
}
