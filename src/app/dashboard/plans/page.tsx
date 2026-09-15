"use client";

import { PlanCard } from "@/components/plan-card";
import { CreatePlanDialog } from "@/components/create-plan-dialog";
import { LoadingSpinner, ErrorState, EmptyState } from "@/components/states";
import { usePlans } from "@/hooks/use-sorobill";
import { useWalletStore } from "@/stores/wallet-store";

export default function PlansPage() {
  const address = useWalletStore((s) => s.address);
  const merchantId = address ?? "";
  const { data: plans, isLoading, error, refetch } = usePlans(merchantId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">Plans</h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            Manage your subscription offerings
          </p>
        </div>
        {address && <CreatePlanDialog merchantId={address} />}
      </div>

      {!address && (
        <EmptyState
          title="Connect your merchant wallet"
          description="Freighter is required to load and create plans."
        />
      )}

      {address && isLoading && <LoadingSpinner text="Loading plans…" />}
      {address && error && (
        <ErrorState message="Failed to load plans." onRetry={() => refetch()} />
      )}
      {address && !isLoading && !error && plans?.length === 0 && (
        <EmptyState
          title="No plans yet"
          description="Create your first subscription plan to get started."
          action={<CreatePlanDialog merchantId={address} />}
        />
      )}

      {address && !isLoading && !error && !!plans?.length && (
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} mode="merchant" />
          ))}
        </div>
      )}
    </div>
  );
}
