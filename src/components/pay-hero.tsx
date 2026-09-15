"use client";

import Link from "next/link";

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
    <section className="border-b border-border pb-8 pt-2">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
        Checkout
      </p>
      <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        {planName}
      </h1>
      <p className="mt-3 flex flex-wrap items-baseline gap-2">
        <span className="font-display text-3xl font-semibold tabular-nums text-ink">
          {priceLabel}
        </span>
        <span className="text-sm text-muted-foreground">/ {intervalLabel}</span>
      </p>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
        Settles on Stellar Soroban. You approve a token allowance; recurring charges run
        on-chain without sharing your keys.
      </p>
      <Link
        href="#subscribe"
        className="mt-5 inline-block text-sm font-medium text-sea hover:underline"
      >
        Continue to approve →
      </Link>
    </section>
  );
}
