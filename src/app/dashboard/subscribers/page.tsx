"use client";

import { StatusBadge } from "@/components/status-badge";
import { LoadingSpinner, ErrorState, EmptyState } from "@/components/states";
import { useSubscriptions } from "@/hooks/use-sorobill";
import { formatDate, formatRelativeTime, shortenAddress } from "@/lib/utils";

const MERCHANT_ADDRESS = "GMERCHANT...ADDR";

export default function SubscribersPage() {
  const { data: subs, isLoading, error, refetch } = useSubscriptions(MERCHANT_ADDRESS);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">Subscribers</h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          All active and past subscribers
        </p>
      </div>

      {isLoading && <LoadingSpinner text="Loading subscribers…" />}
      {error && <ErrorState message="Failed to load subscribers." onRetry={() => refetch()} />}
      {!isLoading && !error && subs?.length === 0 && (
        <EmptyState
          title="No subscribers yet"
          description="Share your plans to start getting subscribers."
        />
      )}

      {subs && subs.length > 0 && (
        <>
          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {subs.map((sub) => (
              <div key={sub.id} className="rounded-lg border p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-mono text-sm">{shortenAddress(sub.subscriberAddress)}</p>
                  <StatusBadge status={sub.status} />
                </div>
                <p className="text-sm font-medium">{sub.plan.name}</p>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Started {formatDate(sub.startedAt)}</span>
                  <span>Next {formatRelativeTime(sub.nextBillingAt)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden overflow-x-auto rounded-lg border md:block">
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
        </>
      )}
    </div>
  );
}
