import type { BillingInterval, Plan, SupportedAsset } from "@/types";

/** Backend plan row (Prisma / API). */
export interface ApiPlan {
  id: string;
  name: string;
  description?: string | null;
  amount: string;
  assetCode: string;
  assetIssuer?: string | null;
  interval: string;
  intervalCount?: number;
  trialDays?: number;
  isActive: boolean;
  merchantAddress?: string | null;
  contractPlanId?: number | null;
  createdAt: string;
  updatedAt?: string;
}

function mapInterval(raw: string): BillingInterval {
  const v = raw.toLowerCase();
  if (v === "daily" || v === "weekly" || v === "monthly" || v === "yearly") {
    return v;
  }
  return "monthly";
}

export function mapApiPlan(p: ApiPlan, subscriberCount = 0): Plan {
  return {
    id: p.id,
    merchantId: p.merchantAddress ?? "",
    name: p.name,
    description: p.description ?? "",
    price: p.amount,
    asset: (p.assetCode || "XLM") as SupportedAsset,
    interval: mapInterval(p.interval),
    trialDays: p.trialDays ?? 0,
    isActive: p.isActive,
    createdAt: p.createdAt,
    subscriberCount,
  };
}
