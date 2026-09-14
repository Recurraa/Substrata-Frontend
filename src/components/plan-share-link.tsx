"use client";

import { useState } from "react";
import { Link2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { env } from "@/lib/env";

export function PlanShareLink({ planId }: { planId: string }) {
  const [copied, setCopied] = useState(false);
  const url = `${env.app.url.replace(/\/$/, "")}/subscriptions?plan=${encodeURIComponent(planId)}`;

  async function copy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Button type="button" variant="outline" size="sm" onClick={copy} className="gap-2">
      {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
      {copied ? "Copied" : "Share plan"}
    </Button>
  );
}
