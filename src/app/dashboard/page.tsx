"use client";

import { DollarSign, Users, TrendingUp, Activity } from "lucide-react";
import { StatsCard } from "@/components/stats-card";
import { RevenueChart } from "@/components/revenue-chart";
import { BillingTable } from "@/components/billing-table";
import { LoadingSpinner, ErrorState, EmptyState } from "@/components/states";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMerchantStats, useRevenueData, useTransactions } from "@/hooks/use-sorobill";
import { formatAmount } from "@/lib/utils";

const MERCHANT_ID = "merchant_1";

export default function DashboardPage() {
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useMerchantStats(MERCHANT_ID);
  const { data: revenue, isLoading: revenueLoading, error: revenueError } = useRevenueData(MERCHANT_ID);
  const { data: transactions, isLoading: txLoading, error: txError } = useTransactions();

  if (statsLoading) return <LoadingSpinner text="Loading dashboard…" />;
  if (statsError) {
    return <ErrorState message="Failed to load dashboard data." onRetry={() => refetchStats()} />;
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          Your subscription business at a glance
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value={stats ? formatAmount(stats.totalRevenue, "USDC") : "—"}
          icon={DollarSign}
          trend={{ value: 12.5, label: "vs last month" }}
        />
        <StatsCard
          title="Active Subscribers"
          value={stats?.activeSubscribers.toString() ?? "—"}
          icon={Users}
          trend={{ value: 8.2, label: "vs last month" }}
        />
        <StatsCard
          title="MRR"
          value={stats ? formatAmount(stats.mrr, "USDC") : "—"}
          icon={TrendingUp}
          trend={{ value: 5.1, label: "vs last month" }}
        />
        <StatsCard
          title="Churn Rate"
          value={stats ? `${stats.churnRate}%` : "—"}
          icon={Activity}
          trend={{ value: -0.3, label: "vs last month" }}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-display">Revenue (12 months)</CardTitle>
        </CardHeader>
        <CardContent>
          {revenueLoading ? (
            <LoadingSpinner text="Loading chart…" />
          ) : revenueError ? (
            <ErrorState message="Failed to load revenue chart." />
          ) : !revenue?.length ? (
            <EmptyState title="No revenue yet" description="Create a plan and get your first subscriber." />
          ) : (
            <div className="w-full overflow-x-auto">
              <RevenueChart data={revenue} />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-display">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {txLoading ? (
            <LoadingSpinner text="Loading transactions…" />
          ) : txError ? (
            <ErrorState message="Failed to load transactions." />
          ) : !transactions?.length ? (
            <EmptyState title="No transactions" description="Payments will appear here once billing runs." />
          ) : (
            <div className="overflow-x-auto">
              <BillingTable transactions={transactions} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
