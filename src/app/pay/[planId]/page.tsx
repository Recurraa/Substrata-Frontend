"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { PayHero } from "@/components/pay-hero";
import { WalletButton } from "@/components/wallet-button";
import { BrandMark } from "@/components/brand-mark";
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
      name: id.includes("2") ? "Pro" : "Starter",
      description: "Recurring payment settled on Stellar Soroban.",
      amount: id.includes("2") ? "29.99" : "9.99",
      assetCode: "USDC",
      interval: "MONTHLY",
      isActive: true,
      merchantAddress: "GDEMO_MERCHANT",
      contractPlanId: id.includes("2") ? 2 : 1,
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
        setStatus("Demo mode: subscription recorded. Connect contracts for live Freighter flow.");
        return;
      }
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
    return (
      <EmptyState title="Plan not found" description="Check the share link and try again." />
    );
  }

  const plan = mapApiPlan(data);

  return (
    <main className="checkout-rail min-h-screen">
      <div className="mx-auto max-w-lg px-6 py-8 sm:py-12">
        <header className="mb-10 flex items-center justify-between">
          <BrandMark />
          <WalletButton />
        </header>

        <PayHero
          planName={plan.name}
          priceLabel={formatAssetAmount(plan.price, plan.asset)}
          intervalLabel={formatInterval(plan.interval)}
        />

        <section id="subscribe" className="mt-8 space-y-5">
          <h2 className="text-lg font-semibold">Subscribe</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {plan.description || "Recurring payment settled on Stellar Soroban."}
          </p>

          <div className="space-y-3 border border-border bg-background p-5">
            {!address ? (
              <p className="text-sm text-amber-800 dark:text-amber-200">
                Connect Freighter on Testnet to continue.
              </p>
            ) : (
              <Button
                className="w-full"
                size="lg"
                aria-label={`Subscribe to ${plan.name}`}
                disabled={busy}
                onClick={() => void handleSubscribe()}
              >
                {busy ? "Confirm in Freighter…" : "Approve & subscribe"}
              </Button>
            )}
            {status && (
              <p className="text-sm text-sea">{status}</p>
            )}
            {errorMsg && <p className="text-sm text-destructive">{errorMsg}</p>}
          </div>

          <p className="text-xs text-muted-foreground">
            Merchant{" "}
            <span className="font-mono">{plan.merchantId || "—"}</span>
            {" · "}
            <Link href="/plans" className="text-sea hover:underline">
              All plans
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
