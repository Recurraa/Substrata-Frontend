"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useQueryClient } from "@tanstack/react-query";
import { createPlan, syncPlanContract } from "@/lib/api";
import { invokeCreatePlan } from "@/lib/contract";
import { env } from "@/lib/env";
import { notify } from "@/stores/notification-store";
import { useWalletStore } from "@/stores/wallet-store";
import type { BillingInterval, SupportedAsset } from "@/types";

const ASSETS: SupportedAsset[] = ["USDC", "EURC", "XLM"];
const INTERVALS: BillingInterval[] = ["daily", "weekly", "monthly", "yearly"];

export function CreatePlanDialog({ merchantId }: { merchantId: string }) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    asset: "USDC" as SupportedAsset,
    interval: "monthly" as BillingInterval,
    trialDays: "0",
  });
  const address = useWalletStore((s) => s.address);
  const queryClient = useQueryClient();
  const effectiveMerchant = address || merchantId;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!effectiveMerchant) {
      notify("error", "Connect Freighter", "A merchant wallet is required to create a plan.");
      return;
    }

    setPending(true);
    const input = {
      name: form.name,
      description: form.description,
      price: form.price,
      asset: form.asset,
      interval: form.interval,
      trialDays: parseInt(form.trialDays, 10),
    };

    try {
      const plan = await createPlan(effectiveMerchant, input);

      if (!env.app.useMock && address && env.contracts.subscription && env.contracts.token) {
        notify("info", "Confirm in Freighter", "Creating the on-chain plan…");
        const { contractPlanId, hash } = await invokeCreatePlan(address, input);
        await syncPlanContract(plan.id, contractPlanId, env.contracts.token);
        notify(
          "success",
          "Plan created on-chain",
          `"${form.name}" → plan #${contractPlanId} (${hash.slice(0, 8)}…)`
        );
      } else {
        notify("success", "Plan created", `"${form.name}" is now live.`);
      }

      await queryClient.invalidateQueries({ queryKey: ["plans", effectiveMerchant] });
      setOpen(false);
      setForm({
        name: "",
        description: "",
        price: "",
        asset: "USDC",
        interval: "monthly",
        trialDays: "0",
      });
    } catch (err) {
      notify("error", "Failed to create plan", err instanceof Error ? err.message : "Error");
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" />
          New Plan
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Subscription Plan</DialogTitle>
        </DialogHeader>

        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Plan Name</Label>
            <Input
              id="name"
              placeholder="Pro"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="For growing teams"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                placeholder="9.99"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label>Asset</Label>
              <Select
                value={form.asset}
                onValueChange={(v) => setForm((f) => ({ ...f, asset: v as SupportedAsset }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ASSETS.map((a) => (
                    <SelectItem key={a} value={a}>
                      {a}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Billing Interval</Label>
              <Select
                value={form.interval}
                onValueChange={(v) => setForm((f) => ({ ...f, interval: v as BillingInterval }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {INTERVALS.map((i) => (
                    <SelectItem key={i} value={i} className="capitalize">
                      {i}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="trial">Trial Days</Label>
              <Input
                id="trial"
                type="number"
                min="0"
                value={form.trialDays}
                onChange={(e) => setForm((f) => ({ ...f, trialDays: e.target.value }))}
              />
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            {address
              ? "Will also submit create_plan via Freighter when contract IDs are configured."
              : "Connect Freighter to create the on-chain plan after the API row."}
          </p>

          <Button type="submit" className="w-full" disabled={pending}>
            {pending && <Loader2 className="h-4 w-4 animate-spin" />}
            {pending ? "Creating…" : "Create Plan"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
