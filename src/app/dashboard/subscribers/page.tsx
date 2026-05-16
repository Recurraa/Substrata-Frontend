"use client";

import { StatusBadge } from "@/components/status-badge";
import { LoadingSpinner, ErrorState, EmptyState } from "@/components/states";
import { useSubscriptions } from "@/hooks/use-substrata";
import { formatDate, formatRelativeTime, shortenAddress } from "@/lib/utils";

const MERCHANT_ADDRESS = "GMERCHANT...ADDR";

export default function SubscribersPage() {
  const { data: subs, isLoading, error, refetch } = useSubscriptions(MERCHANT_ADDRESS);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Subscribers</h1>
        <p className="mt-1 text-muted-foreground">All active and past subscribers</p>
      </div>

      {isLoading && <LoadingSpinner />}
      {error && <ErrorState message="Failed to load subscribers." onRetry={refetch} />}
      {!isLoading && subs?.length === 0 && (
        <EmptyState title="No subscribers yet" description="Share your plans to start getting subscribers." />
      )}

      {subs && subs.length > 0 && (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium">Address</th>
                <th className="px-4 py-3 text-left font-medium">Plan</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Started</th>
                <th className="px-4 py-3 text-left font-medium">Next Billing</th>
              </tr>
            </thead>
            <tbody>
              {subs.map((sub) => (
                <tr key={sub.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-mono">{shortenAddress(sub.subscriberAddress)}</td>
                  <td className="px-4 py-3">{sub.plan.name}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={sub.status} />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(sub.startedAt)}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatRelativeTime(sub.nextBillingAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
