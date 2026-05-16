"use client";

import { DollarSign, Users, TrendingUp, Activity } from "lucide-react";
import { StatsCard } from "@/components/stats-card";
import { RevenueChart } from "@/components/revenue-chart";
import { BillingTable } from "@/components/billing-table";
import { LoadingSpinner, ErrorState } from "@/components/states";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMerchantStats, useRevenueData, useTransactions } from "@/hooks/use-substrata";
import { formatAmount } from "@/lib/utils";

const MERCHANT_ID = "merchant_1"; // Replace with wallet address in production

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading, error: statsError } = useMerchantStats(MERCHANT_ID);
  const { data: revenue, isLoading: revenueLoading } = useRevenueData(MERCHANT_ID);
  const { data: transactions, isLoading: txLoading } = useTransactions();

  if (statsLoading) return <LoadingSpinner />;
  if (statsError) return <ErrorState message="Failed to load dashboard data." />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Your subscription business at a glance</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue (12 months)</CardTitle>
        </CardHeader>
        <CardContent>
          {revenueLoading ? (
            <LoadingSpinner text="Loading chart…" />
          ) : (
            <RevenueChart data={revenue ?? []} />
          )}
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {txLoading ? (
            <LoadingSpinner text="Loading transactions…" />
          ) : (
            <BillingTable transactions={transactions ?? []} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
