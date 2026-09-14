"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BillingTable } from "@/components/billing-table";
import { LoadingSpinner, ErrorState, EmptyState } from "@/components/states";
import { useSubscriptions, useTransactions } from "@/hooks/use-substrata";
import { formatAmount, formatDate, formatRelativeTime } from "@/lib/utils";
import { StatusBadge } from "@/components/status-badge";
import { useWalletStore } from "@/stores/wallet-store";

const DEMO_ADDRESS = "GDEMO...ADDR1";

export default function BillingPage() {
  const { address } = useWalletStore();
  const queryAddress = address ?? DEMO_ADDRESS;
  const { data: subs, isLoading: subsLoading, error: subsError, refetch: refetchSubs } =
    useSubscriptions(queryAddress);
  const { data: transactions, isLoading: txLoading, error, refetch } = useTransactions();

  if (subsLoading || txLoading) return <LoadingSpinner text="Loading billing…" />;
  if (subsError || error) {
    return (
      <ErrorState
        message="Failed to load billing data."
        onRetry={() => {
          void refetchSubs();
          void refetch();
        }}
      />
    );
  }

  const upcoming = (subs ?? []).filter((s) => s.status === "active");

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">Billing</h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          Upcoming charges and payment history
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-display">Upcoming Charges</CardTitle>
        </CardHeader>
        <CardContent>
          {upcoming.length === 0 ? (
            <EmptyState title="No upcoming charges" description="Active subscriptions will list next payments here." />
          ) : (
            <div className="space-y-3">
              {upcoming.map((sub) => (
                <div
                  key={sub.id}
                  className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
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

      <Card>
        <CardHeader>
          <CardTitle className="font-display">Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          {!transactions?.length ? (
            <EmptyState title="No payments yet" description="Successful charges show up in this history." />
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
