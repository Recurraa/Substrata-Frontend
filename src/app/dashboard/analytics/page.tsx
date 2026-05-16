"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RevenueChart } from "@/components/revenue-chart";
import { LoadingSpinner, ErrorState } from "@/components/states";
import { useRevenueData, useMerchantStats } from "@/hooks/use-substrata";
import { formatAmount } from "@/lib/utils";

const MERCHANT_ID = "merchant_1";

export default function AnalyticsPage() {
  const { data: revenue, isLoading, error, refetch } = useRevenueData(MERCHANT_ID);
  const { data: stats } = useMerchantStats(MERCHANT_ID);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorState message="Failed to load analytics." onRetry={refetch} />;

  const totalSubs = revenue?.reduce((acc, d) => Math.max(acc, d.subscribers), 0) ?? 0;
  const peakRevenue = revenue ? Math.max(...revenue.map((d) => d.revenue)) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="mt-1 text-muted-foreground">Revenue and growth metrics</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">MRR</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats ? formatAmount(stats.mrr, "USDC") : "—"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Peak Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${peakRevenue.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Peak Subscribers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalSubs.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <RevenueChart data={revenue ?? []} />
        </CardContent>
      </Card>
    </div>
  );
}
