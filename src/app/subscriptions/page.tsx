"use client";

import { useState } from "react";
import { Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { LoadingSpinner, ErrorState, EmptyState } from "@/components/states";
import { useSubscriptions, useCancelSubscription } from "@/hooks/use-sorobill";
import { useWalletStore } from "@/stores/wallet-store";
import { notify } from "@/stores/notification-store";
import { formatAmount, formatDate, formatRelativeTime } from "@/lib/utils";
import { WalletButton } from "@/components/wallet-button";

const DEMO_ADDRESS = "GDEMO...ADDR1";

export default function SubscriptionsPage() {
  const { isConnected, address } = useWalletStore();
  const queryAddress = address ?? DEMO_ADDRESS;
  const { data: subs, isLoading, error, refetch } = useSubscriptions(queryAddress);
  const { mutate: cancel } = useCancelSubscription(queryAddress);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  function handleCancel(id: string) {
    setCancellingId(id);
    cancel(id, {
      onSuccess: () => {
        notify("info", "Subscription cancelled", "Your subscription has been cancelled.");
        setCancellingId(null);
      },
      onError: (err) => {
        notify("error", "Cancel failed", err.message);
        setCancellingId(null);
      },
    });
  }

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 px-4 py-16 text-center sm:py-24">
        <h2 className="font-display text-xl font-semibold sm:text-2xl">
          Connect your wallet to view subscriptions
        </h2>
        <p className="max-w-md text-sm text-muted-foreground">
          Sorobill uses Freighter so you stay in control of every recurring payment.
        </p>
        <WalletButton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
          My Subscriptions
        </h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          Manage your active subscriptions
        </p>
      </div>

      {isLoading && <LoadingSpinner text="Loading subscriptions…" />}
      {error && <ErrorState message="Failed to load subscriptions." onRetry={() => refetch()} />}
      {!isLoading && !error && subs?.length === 0 && (
        <EmptyState
          title="No subscriptions"
          description="Browse plans to subscribe to a service."
        />
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {subs?.map((sub) => (
          <Card key={sub.id}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="font-display text-lg">{sub.plan.name}</CardTitle>
                <StatusBadge status={sub.status} />
              </div>
              <p className="text-sm text-muted-foreground">{sub.plan.description}</p>
            </CardHeader>

            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between gap-2">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-medium">{formatAmount(sub.plan.price, sub.plan.asset)}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-muted-foreground">Started</span>
                <span>{formatDate(sub.startedAt)}</span>
              </div>
              {sub.status === "active" && (
                <div className="flex justify-between gap-2">
                  <span className="text-muted-foreground">Next billing</span>
                  <span className="font-medium text-primary">
                    {formatRelativeTime(sub.nextBillingAt)}
                  </span>
                </div>
              )}
            </CardContent>

            {sub.status === "active" && (
              <CardFooter>
                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full"
                  disabled={cancellingId === sub.id}
                  onClick={() => handleCancel(sub.id)}
                >
                  {cancellingId === sub.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                  Cancel Subscription
                </Button>
              </CardFooter>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
