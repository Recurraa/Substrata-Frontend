"use client";

import { Wallet, LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWalletStore } from "@/stores/wallet-store";
import { useFreighter } from "@/hooks/use-freighter";
import { shortenAddress } from "@/lib/utils";

export function WalletButton() {
  const { address, isConnected } = useWalletStore();
  const { connect, disconnect, isConnecting } = useFreighter();

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <span className="hidden rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200 sm:inline">
          {shortenAddress(address)}
        </span>
        <Button variant="outline" size="sm" onClick={disconnect}>
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Disconnect</span>
        </Button>
      </div>
    );
  }

  return (
    <Button size="sm" onClick={connect} disabled={isConnecting}>
      {isConnecting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Wallet className="h-4 w-4" />
      )}
      {isConnecting ? "Connecting…" : "Connect Wallet"}
    </Button>
  );
}
