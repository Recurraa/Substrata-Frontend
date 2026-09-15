export const queryKeys = {
  payPlan: (id: string) => ["pay-plan", id] as const,
  publicPlans: ["public-plans"] as const,
};
