"use client";

import { useRouter } from "next/navigation";
import { CheckCircle2, Wallet, Building2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WalletButton } from "@/components/wallet-button";
import { CreatePlanDialog } from "@/components/create-plan-dialog";
import { useOnboardingStore, type OnboardingStep } from "@/stores/onboarding-store";
import { useWalletStore } from "@/stores/wallet-store";
import { cn } from "@/lib/utils";

const STEPS: { id: OnboardingStep; label: string; icon: React.ElementType }[] = [
  { id: "connect", label: "Connect Wallet", icon: Wallet },
  { id: "profile", label: "Business Profile", icon: Building2 },
  { id: "plan", label: "Create Plan", icon: Package },
  { id: "done", label: "Done", icon: CheckCircle2 },
];

function StepIndicator({ current }: { current: OnboardingStep }) {
  const currentIdx = STEPS.findIndex((s) => s.id === current);
  return (
    <div className="flex items-center justify-center gap-2">
      {STEPS.map((step, i) => {
        const Icon = step.icon;
        const done = i < currentIdx;
        const active = i === currentIdx;
        return (
          <div key={step.id} className="flex items-center gap-2">
            <div
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors",
                done && "border-primary bg-primary text-primary-foreground",
                active && "border-primary text-primary",
                !done && !active && "border-muted text-muted-foreground"
              )}
            >
              {done ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
            </div>
            <span
              className={cn(
                "hidden text-sm sm:inline",
                active ? "font-medium text-foreground" : "text-muted-foreground"
              )}
            >
              {step.label}
            </span>
            {i < STEPS.length - 1 && <div className="h-px w-8 bg-border" />}
          </div>
        );
      })}
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const { step, merchantName, webhookUrl, setStep, setProfile, complete } = useOnboardingStore();
  const { isConnected } = useWalletStore();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-primary">⬡ Substrata</h1>
        <p className="mt-2 text-muted-foreground">Set up your merchant account in minutes</p>
      </div>

      <div className="mb-8 w-full max-w-2xl">
        <StepIndicator current={step} />
      </div>

      <Card className="w-full max-w-md">
        {/* Step 1: Connect Wallet */}
        {step === "connect" && (
          <>
            <CardHeader>
              <CardTitle>Connect your Stellar wallet</CardTitle>
              <CardDescription>
                Use Freighter to connect your wallet. Your public key becomes your merchant identity.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <WalletButton />
              <Button
                className="w-full"
                disabled={!isConnected}
                onClick={() => setStep("profile")}
              >
                Continue
              </Button>
            </CardContent>
          </>
        )}

        {/* Step 2: Business Profile */}
        {step === "profile" && (
          <>
            <CardHeader>
              <CardTitle>Business profile</CardTitle>
              <CardDescription>Tell subscribers who you are.</CardDescription>
            </CardHeader>
            <CardContent>
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget);
                  setProfile(fd.get("name") as string, fd.get("webhook") as string);
                  setStep("plan");
                }}
              >
                <div className="space-y-1.5">
                  <Label htmlFor="name">Business Name</Label>
                  <Input id="name" name="name" defaultValue={merchantName} placeholder="Acme Corp" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="webhook">Webhook URL (optional)</Label>
                  <Input
                    id="webhook"
                    name="webhook"
                    type="url"
                    defaultValue={webhookUrl}
                    placeholder="https://yourapp.com/webhooks/substrata"
                  />
                </div>
                <Button type="submit" className="w-full">Continue</Button>
              </form>
            </CardContent>
          </>
        )}

        {/* Step 3: Create first plan */}
        {step === "plan" && (
          <>
            <CardHeader>
              <CardTitle>Create your first plan</CardTitle>
              <CardDescription>
                Define a subscription plan for your customers. You can add more later.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <CreatePlanDialog merchantId="merchant_1" />
              <Button variant="outline" className="w-full" onClick={() => complete()}>
                Skip for now
              </Button>
            </CardContent>
          </>
        )}

        {/* Step 4: Done */}
        {step === "done" && (
          <>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                You&apos;re all set!
              </CardTitle>
              <CardDescription>
                Your merchant account is ready. Head to your dashboard to manage plans and subscribers.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => router.push("/dashboard")}>
                Go to Dashboard
              </Button>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}
