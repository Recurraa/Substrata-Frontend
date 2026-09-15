"use client";

import { useRouter } from "next/navigation";
import { CheckCircle2, Wallet, Building2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WalletButton } from "@/components/wallet-button";
import { CreatePlanDialog } from "@/components/create-plan-dialog";
import { BrandMark } from "@/components/brand-mark";
import { useOnboardingStore, type OnboardingStep } from "@/stores/onboarding-store";
import { useWalletStore } from "@/stores/wallet-store";
import { cn } from "@/lib/utils";

const STEPS: { id: OnboardingStep; label: string; icon: React.ElementType }[] = [
  { id: "connect", label: "Wallet", icon: Wallet },
  { id: "profile", label: "Profile", icon: Building2 },
  { id: "plan", label: "Plan", icon: Package },
  { id: "done", label: "Done", icon: CheckCircle2 },
];

function StepIndicator({ current }: { current: OnboardingStep }) {
  const currentIdx = STEPS.findIndex((s) => s.id === current);
  return (
    <ol className="flex items-center gap-2">
      {STEPS.map((step, i) => {
        const done = i < currentIdx;
        const active = i === currentIdx;
        return (
          <li key={step.id} className="flex items-center gap-2">
            <span
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-md text-[11px] font-semibold",
                done && "bg-primary text-primary-foreground",
                active && "border border-primary text-primary",
                !done && !active && "border border-border text-muted-foreground"
              )}
            >
              {i + 1}
            </span>
            <span
              className={cn(
                "hidden text-xs sm:inline",
                active ? "font-medium text-foreground" : "text-muted-foreground"
              )}
            >
              {step.label}
            </span>
            {i < STEPS.length - 1 && <span className="hidden h-px w-6 bg-border sm:block" />}
          </li>
        );
      })}
    </ol>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const { step, merchantName, webhookUrl, setStep, setProfile, complete } = useOnboardingStore();
  const { isConnected, address } = useWalletStore();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="mx-auto flex w-full max-w-lg items-center justify-between px-6 py-8">
        <BrandMark />
        <StepIndicator current={step} />
      </header>

      <main className="mx-auto w-full max-w-lg flex-1 px-6 pb-16">
        <div className="border border-border bg-background/80 p-6 sm:p-8">
          {step === "connect" && (
            <div className="space-y-5">
              <div>
                <h1 className="text-2xl font-semibold">Connect Freighter</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Your Stellar public key becomes your merchant identity. No email signup.
                </p>
              </div>
              <WalletButton />
              <Button className="w-full" disabled={!isConnected} onClick={() => setStep("profile")}>
                Continue
              </Button>
            </div>
          )}

          {step === "profile" && (
            <div className="space-y-5">
              <div>
                <h1 className="text-2xl font-semibold">Business profile</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Shown on checkout and webhook metadata.
                </p>
              </div>
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget);
                  setProfile(String(fd.get("name") ?? ""), String(fd.get("webhook") ?? ""));
                  setStep("plan");
                }}
              >
                <div className="space-y-1.5">
                  <Label htmlFor="name">Business name</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={merchantName}
                    placeholder="Northwind Labs"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="webhook">Webhook URL (optional)</Label>
                  <Input
                    id="webhook"
                    name="webhook"
                    type="url"
                    defaultValue={webhookUrl}
                    placeholder="https://yourapp.com/webhooks/sorobill"
                  />
                </div>
                <Button type="submit" className="w-full">
                  Continue
                </Button>
              </form>
            </div>
          )}

          {step === "plan" && (
            <div className="space-y-5">
              <div>
                <h1 className="text-2xl font-semibold">Create your first plan</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  {address
                    ? "You can publish on-chain after the API row when contracts are configured."
                    : "Connect Freighter to link plans to your wallet."}
                </p>
              </div>
              <CreatePlanDialog merchantId={address ?? ""} />
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  complete();
                  setStep("done");
                }}
              >
                Skip for now
              </Button>
            </div>
          )}

          {step === "done" && (
            <div className="space-y-5">
              <div>
                <h1 className="text-2xl font-semibold">You&apos;re ready</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Open the merchant console to manage plans, subscribers, and webhooks.
                </p>
              </div>
              <Button className="w-full" onClick={() => router.push("/dashboard")}>
                Go to dashboard
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
