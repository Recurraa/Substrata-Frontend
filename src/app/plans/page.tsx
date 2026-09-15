"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { PlanCard } from "@/components/plan-card";
import { LoadingState, ErrorState, EmptyState } from "@/components/states";
import { env } from "@/lib/env";
import { mapApiPlan, type ApiPlan } from "@/lib/plan-mapper";

async function fetchPublicPlans(): Promise<ApiPlan[]> {
  if (env.app.useMock) {
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
  const res = await fetch(`${env.app.apiUrl.replace(/\/$/, "")}/plans`);
  if (!res.ok) throw new Error("Failed to load plans");
  return res.json();
}

export default function PlansMarketplacePage() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["public-plans"],
    queryFn: fetchPublicPlans,
  });

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-10">
      <header className="mb-10 flex items-end justify-between gap-4">
        <div>
          <Link href="/" className="font-display text-sm font-semibold text-teal-700 dark:text-teal-300">
            Sorobill
          </Link>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">Explore plans</h1>
          <p className="mt-1 text-muted-foreground">
            Discover merchant subscription plans settling on Stellar.
          </p>
        </div>
      </header>

      {isLoading && <LoadingState label="Loading plans…" />}
      {error && (
        <ErrorState
          title="Could not load plans"
          message={error instanceof Error ? error.message : "Unknown error"}
          onRetry={() => refetch()}
        />
      )}
      {data && data.length === 0 && (
        <EmptyState title="No plans yet" description="Merchants have not published plans." />
      )}
      {data && data.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((raw) => {
            const plan = mapApiPlan(raw);
            return (
              <div key={plan.id} className="space-y-3">
                <PlanCard plan={plan} />
                <Link
                  href={`/pay/${plan.id}`}
                  className="block text-center text-sm font-medium text-teal-700 hover:underline dark:text-teal-300"
                >
                  Subscribe →
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
