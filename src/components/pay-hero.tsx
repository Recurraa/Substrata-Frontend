"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PayHero({
  planName,
  priceLabel,
  intervalLabel,
}: {
  planName: string;
  priceLabel: string;
  intervalLabel: string;
}) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-teal-400/20 bg-slate-950 px-6 py-12 text-white sm:px-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(45,212,191,0.18),_transparent_55%)]" />
      <div className="relative z-10 max-w-xl space-y-4">
        <p className="font-display text-sm font-semibold tracking-wide text-teal-300/90">
          Sorobill Checkout
        </p>
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          {planName}
        </h1>
        <p className="text-lg text-teal-50/80">
          <span className="font-semibold text-white">{priceLabel}</span>
          <span className="text-teal-100/60"> / {intervalLabel}</span>
        </p>
        <p className="text-sm text-teal-100/60">
          Settles on Stellar. You approve an allowance; billing runs on-chain.
        </p>
        <Button asChild className="bg-teal-400 text-slate-950 hover:bg-teal-300">
          <Link href="#subscribe">
            Continue
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
