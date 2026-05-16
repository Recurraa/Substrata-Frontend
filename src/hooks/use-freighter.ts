"use client";

import { useState, useCallback } from "react";
import { useWalletStore } from "@/stores/wallet-store";

declare global {
  interface Window {
    freighter?: {
      isConnected: () => Promise<boolean>;
      getPublicKey: () => Promise<string>;
      getNetwork: () => Promise<string>;
      signTransaction: (xdr: string, opts?: { network?: string }) => Promise<string>;
    };
  }
}

export function useFreighter() {
  const { setWallet, clearWallet } = useWalletStore();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(async () => {
    setIsConnecting(true);
    setError(null);
    try {
      if (!window.freighter) {
        throw new Error("Freighter wallet not found. Please install the extension.");
      }
      const connected = await window.freighter.isConnected();
      if (!connected) throw new Error("Freighter is not connected.");

      const [address, network] = await Promise.all([
        window.freighter.getPublicKey(),
        window.freighter.getNetwork(),
      ]);

      setWallet({
        address,
        isConnected: true,
        network: network.toLowerCase().includes("main") ? "mainnet" : "testnet",
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to connect wallet";
      setError(msg);
    } finally {
      setIsConnecting(false);
    }
  }, [setWallet]);

  const disconnect = useCallback(() => {
    clearWallet();
  }, [clearWallet]);

  const signTransaction = useCallback(async (xdr: string): Promise<string> => {
    if (!window.freighter) throw new Error("Freighter not available");
    return window.freighter.signTransaction(xdr);
  }, []);

  return { connect, disconnect, signTransaction, isConnecting, error };
}
