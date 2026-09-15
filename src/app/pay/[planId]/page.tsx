"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { PayHero } from "@/components/pay-hero";
import { WalletButton } from "@/components/wallet-button";
import { Button } from "@/components/ui/button";
import { LoadingState, ErrorState, EmptyState } from "@/components/states";
import { env } from "@/lib/env";
import { mapApiPlan, type ApiPlan } from "@/lib/plan-mapper";
import { formatAssetAmount, formatInterval } from "@/lib/format";
import { invokeApproveToken, invokeSubscribe } from "@/lib/contract";
import { useWalletStore } from "@/stores/wallet-store";

async function fetchPlan(id: string): Promise<ApiPlan> {
  if (env.app.useMock) {
    return {
      id,
      name: "Pro Plan",
      description: "Demo plan for Sorobill checkout",
      amount: "10",
      assetCode: "USDC",
      interval: "MONTHLY",
      isActive: true,
      merchantAddress: "GDEMO",
      contractPlanId: 1,
      createdAt: new Date().toISOString(),
    };
  }
  const res = await fetch(`${env.app.apiUrl.replace(/\/$/, "")}/plans/${id}`);
  if (!res.ok) throw new Error("Plan not found");
  return res.json();
}

export default function PayPlanPage({
  params,
}: {
  params: Promise<{ planId: string }>;
}) {
  const { planId } = use(params);
  const address = useWalletStore((s) => s.address);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["pay-plan", planId],
    queryFn: () => fetchPlan(planId),
  });

  async function handleSubscribe() {
    if (!address || !data) return;
    const onChainId = data.contractPlanId;
    if (onChainId == null) {
      setErrorMsg("This plan is not linked to an on-chain contractPlanId yet.");
      return;
    }

    setBusy(true);
    setErrorMsg(null);
    setStatus(null);
    try {
      if (env.app.useMock) {
        setStatus("Mock mode: subscription recorded locally.");
        return;
      }
      // Approve enough for several periods so Freighter is not needed every cycle.
      const approveAmount = String(Number(data.amount) * 12);
      setStatus("Approving token allowance…");
      await invokeApproveToken(address, approveAmount);
      setStatus("Signing subscribe…");
      const { hash } = await invokeSubscribe(address, onChainId);
      setStatus(`Subscribed. Tx ${hash.slice(0, 10)}…`);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Subscribe failed");
      setStatus(null);
    } finally {
      setBusy(false);
    }
  }

  if (isLoading) return <LoadingState label="Loading plan…" />;
  if (error) {
    return (
      <ErrorState
        title="Could not load plan"
        message={error instanceof Error ? error.message : "Unknown error"}
        onRetry={() => refetch()}
      />
    );
  }
  if (!data) {
    return <EmptyState title="Plan not found" description="Check the share link and try again." />;
  }

  const plan = mapApiPlan(data);

  return (
    <main className="mx-auto min-h-screen max-w-3xl space-y-8 px-6 py-10">
      <header className="flex items-center justify-between">
        <Link href="/" className="font-display text-xl font-bold">
          Sorobill
        </Link>
        <WalletButton />
      </header>

      <PayHero
        planName={plan.name}
        priceLabel={formatAssetAmount(plan.price, plan.asset)}
        intervalLabel={formatInterval(plan.interval)}
      />

      <section id="subscribe" className="space-y-4 rounded-xl border border-border p-6">
        <h2 className="font-display text-lg font-semibold">Subscribe</h2>
        <p className="text-sm text-muted-foreground">
          {plan.description || "Recurring payment settled on Stellar Soroban."}
        </p>
        {!address ? (
          <p className="text-sm text-amber-700 dark:text-amber-300">
            Connect Freighter on Testnet to continue.
          </p>
        ) : (
          <Button
            className="w-full sm:w-auto"
            aria-label={`Subscribe to ${plan.name}`}
            disabled={busy}
            onClick={() => void handleSubscribe()}
          >
            {busy ? "Confirm in Freighter…" : "Approve & subscribe"}
          </Button>
        )}
        {status && <p className="text-sm text-emerald-700 dark:text-emerald-300">{status}</p>}
        {errorMsg && <p className="text-sm text-destructive">{errorMsg}</p>}
        <p className="text-xs text-muted-foreground">
          Merchant:{" "}
          <span className="font-mono">{plan.merchantId || "—"}</span>
        </p>
      </section>
    </main>
  );
}
