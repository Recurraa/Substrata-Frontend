"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BillingTable } from "@/components/billing-table";
import { LoadingSpinner, ErrorState } from "@/components/states";
import { useSubscriptions, useTransactions } from "@/hooks/use-substrata";
import { formatAmount, formatDate, formatRelativeTime } from "@/lib/utils";
import { StatusBadge } from "@/components/status-badge";

const DEMO_ADDRESS = "GDEMO...ADDR1";

export default function BillingPage() {
  const { data: subs, isLoading: subsLoading } = useSubscriptions(DEMO_ADDRESS);
  const { data: transactions, isLoading: txLoading, error, refetch } = useTransactions();

  if (subsLoading || txLoading) return <LoadingSpinner />;
  if (error) return <ErrorState message="Failed to load billing data." onRetry={refetch} />;

  // Build upcoming charges from active subscriptions
  const upcoming = (subs ?? []).filter((s) => s.status === "active");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Billing</h1>
        <p className="mt-1 text-muted-foreground">Upcoming charges and payment history</p>
      </div>

      {/* Upcoming charges */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Charges</CardTitle>
        </CardHeader>
        <CardContent>
          {upcoming.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No upcoming charges.</p>
          ) : (
            <div className="space-y-3">
              {upcoming.map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <p className="font-medium">{sub.plan.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Due {formatDate(sub.nextBillingAt)} · {formatRelativeTime(sub.nextBillingAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">
                      {formatAmount(sub.plan.price, sub.plan.asset)}
                    </span>
                    <StatusBadge status={sub.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment history */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <BillingTable transactions={transactions ?? []} />
        </CardContent>
      </Card>
    </div>
  );
}
