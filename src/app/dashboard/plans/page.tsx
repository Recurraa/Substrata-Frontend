"use client";

import { PlanCard } from "@/components/plan-card";
import { CreatePlanDialog } from "@/components/create-plan-dialog";
import { LoadingSpinner, ErrorState, EmptyState } from "@/components/states";
import { usePlans } from "@/hooks/use-substrata";

const MERCHANT_ID = "merchant_1";

export default function PlansPage() {
  const { data: plans, isLoading, error, refetch } = usePlans(MERCHANT_ID);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Plans</h1>
          <p className="mt-1 text-muted-foreground">Manage your subscription offerings</p>
        </div>
        <CreatePlanDialog merchantId={MERCHANT_ID} />
      </div>

      {isLoading && <LoadingSpinner />}
      {error && <ErrorState message="Failed to load plans." onRetry={refetch} />}
      {!isLoading && plans?.length === 0 && (
        <EmptyState
          title="No plans yet"
          description="Create your first subscription plan to get started."
        />
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {plans?.map((plan) => (
          <PlanCard key={plan.id} plan={plan} mode="merchant" />
        ))}
      </div>
    </div>
  );
}
