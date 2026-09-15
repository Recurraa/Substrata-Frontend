"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function PlansEmptyCta() {
  return (
    <Button asChild variant="outline">
      <Link href="/onboarding">Create a plan</Link>
    </Button>
  );
}
