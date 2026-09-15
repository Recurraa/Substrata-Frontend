"use client";

import Link from "next/link";
import { RevenueChart } from "@/components/revenue-chart";
import { BillingTable } from "@/components/billing-table";
import { LoadingSpinner, ErrorState, EmptyState } from "@/components/states";
import { Button } from "@/components/ui/button";
import { useMerchantStats, useRevenueData, useTransactions } from "@/hooks/use-sorobill";
import { formatAmount, shortenAddress } from "@/lib/utils";
import { useWalletStore } from "@/stores/wallet-store";
import { env } from "@/lib/env";

export default function DashboardPage() {
  const address = useWalletStore((s) => s.address) ?? "";
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useMerchantStats(address);
  const { data: revenue, isLoading: revenueLoading, error: revenueError } = useRevenueData(address);
  const { data: transactions, isLoading: txLoading, error: txError } = useTransactions();

  if (!address) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <h1 className="text-2xl font-semibold">Merchant overview</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Connect Freighter to load revenue, subscribers, and recent settlements
          {env.app.useMock ? " (demo data enabled)." : "."}
        </p>
        <EmptyState
          title="Wallet required"
          description="Your Stellar public key is your merchant identity."
        />
      </div>
    );
  }

  if (statsLoading) return <LoadingSpinner text="Loading overview…" />;
  if (statsError) {
    return <ErrorState message="Failed to load dashboard data." onRetry={() => refetchStats()} />;
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Overview
          </p>
          <h1 className="mt-1 text-3xl font-semibold">Merchant console</h1>
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            {shortenAddress(address)}
            {env.app.useMock ? " · demo mode" : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/plans">Manage plans</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/dashboard/plans">New plan</Link>
          </Button>
        </div>
      </div>

      <div className="metric-strip sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Revenue</p>
          <p className="mt-2 font-display text-2xl font-semibold tabular-nums">
            {stats ? formatAmount(stats.totalRevenue, "USDC") : "—"}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Subscribers</p>
          <p className="mt-2 font-display text-2xl font-semibold tabular-nums">
            {stats?.activeSubscribers ?? "—"}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">MRR</p>
          <p className="mt-2 font-display text-2xl font-semibold tabular-nums">
            {stats ? formatAmount(stats.mrr, "USDC") : "—"}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Churn</p>
          <p className="mt-2 font-display text-2xl font-semibold tabular-nums">
            {stats ? `${stats.churnRate}%` : "—"}
          </p>
        </div>
      </div>

      <section className="space-y-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-semibold">Revenue</h2>
          <Link
            href="/dashboard/analytics"
            className="text-sm text-sea hover:underline"
          >
            Analytics
          </Link>
        </div>
        {revenueLoading ? (
          <LoadingSpinner text="Loading chart…" />
        ) : revenueError ? (
          <ErrorState message="Failed to load revenue chart." />
        ) : !revenue?.length ? (
          <EmptyState
            title="No revenue yet"
            description="Create a plan and get your first subscriber."
          />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border bg-background/60 p-2 sm:p-4">
            <RevenueChart data={revenue} />
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Recent settlements</h2>
        {txLoading ? (
          <LoadingSpinner text="Loading transactions…" />
        ) : txError ? (
          <ErrorState message="Failed to load transactions." />
        ) : !transactions?.length ? (
          <EmptyState
            title="No transactions"
            description="Payments appear here after billing runs."
          />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border">
            <BillingTable transactions={transactions} />
          </div>
        )}
      </section>
    </div>
  );
}
