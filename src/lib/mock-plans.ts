import type { ApiPlan } from "@/lib/plan-mapper";

export function demoPlans(): ApiPlan[] {
  return [
    {
      id: "plan_demo_1",
      name: "Starter",
      description: "For indie merchants",
      amount: "5",
      assetCode: "USDC",
      interval: "MONTHLY",
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "plan_demo_2",
      name: "Growth",
      description: "Higher limits",
      amount: "25",
      assetCode: "USDC",
      interval: "MONTHLY",
      isActive: true,
      createdAt: new Date().toISOString(),
    },
  ];
}
