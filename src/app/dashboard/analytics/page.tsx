"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RevenueChart } from "@/components/revenue-chart";
import { LoadingSpinner, ErrorState, EmptyState } from "@/components/states";
import { useRevenueData, useMerchantStats } from "@/hooks/use-substrata";
import { formatAmount } from "@/lib/utils";

const MERCHANT_ID = "merchant_1";

export default function AnalyticsPage() {
  const { data: revenue, isLoading, error, refetch } = useRevenueData(MERCHANT_ID);
  const { data: stats, isLoading: statsLoading } = useMerchantStats(MERCHANT_ID);

  if (isLoading || statsLoading) return <LoadingSpinner text="Loading analytics…" />;
  if (error) return <ErrorState message="Failed to load analytics." onRetry={() => refetch()} />;
  if (!revenue?.length) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">Analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            Revenue and growth metrics
          </p>
        </div>
        <EmptyState
          title="No analytics data yet"
          description="Revenue trends appear after your first successful billing cycle."
        />
      </div>
    );
  }

  const totalSubs = revenue.reduce((acc, d) => Math.max(acc, d.subscribers), 0);
  const peakRevenue = Math.max(...revenue.map((d) => d.revenue));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          Revenue and growth metrics
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">MRR</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display text-2xl font-bold">
              {stats ? formatAmount(stats.mrr, "USDC") : "—"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Peak Monthly Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display text-2xl font-bold">${peakRevenue.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Peak Subscribers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display text-2xl font-bold">{totalSubs.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-display">Revenue Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full overflow-x-auto">
            <RevenueChart data={revenue} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
