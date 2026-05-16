"use client";

import { useState } from "react";
import { Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { LoadingSpinner, ErrorState, EmptyState } from "@/components/states";
import { useSubscriptions, useCancelSubscription } from "@/hooks/use-substrata";
import { useWalletStore } from "@/stores/wallet-store";
import { notify } from "@/stores/notification-store";
import { formatAmount, formatDate, formatRelativeTime } from "@/lib/utils";
import { WalletButton } from "@/components/wallet-button";

// Demo address — in production use wallet store address
const DEMO_ADDRESS = "GDEMO...ADDR1";

export default function SubscriptionsPage() {
  const { isConnected } = useWalletStore();
  const { data: subs, isLoading, error, refetch } = useSubscriptions(DEMO_ADDRESS);
  const { mutate: cancel } = useCancelSubscription(DEMO_ADDRESS);
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
      <div className="flex flex-col items-center justify-center gap-4 py-24">
        <h2 className="text-xl font-semibold">Connect your wallet to view subscriptions</h2>
        <WalletButton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Subscriptions</h1>
        <p className="mt-1 text-muted-foreground">Manage your active subscriptions</p>
      </div>

      {isLoading && <LoadingSpinner />}
      {error && <ErrorState message="Failed to load subscriptions." onRetry={refetch} />}
      {!isLoading && subs?.length === 0 && (
        <EmptyState title="No subscriptions" description="Browse plans to subscribe to a service." />
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {subs?.map((sub) => (
          <Card key={sub.id}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{sub.plan.name}</CardTitle>
                <StatusBadge status={sub.status} />
              </div>
              <p className="text-sm text-muted-foreground">{sub.plan.description}</p>
            </CardHeader>

            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-medium">{formatAmount(sub.plan.price, sub.plan.asset)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Started</span>
                <span>{formatDate(sub.startedAt)}</span>
              </div>
              {sub.status === "active" && (
                <div className="flex justify-between">
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
