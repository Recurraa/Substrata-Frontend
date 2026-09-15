"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { WalletButton } from "@/components/wallet-button";

export function PayLayoutShell({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto min-h-screen max-w-3xl space-y-8 px-6 py-10">
      <header className="flex items-center justify-between">
        <Link href="/" className="font-display text-xl font-bold">
          Sorobill
        </Link>
        <WalletButton />
      </header>
      {children}
    </main>
  );
}
