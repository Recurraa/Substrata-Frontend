"use client";

import { useState, useCallback, useEffect } from "react";
import {
  isConnected as freighterIsConnected,
  isAllowed,
  requestAccess,
  getAddress,
  getNetwork,
  signTransaction as freighterSignTransaction,
} from "@stellar/freighter-api";
import { useWalletStore } from "@/stores/wallet-store";

function mapNetwork(network: string): "testnet" | "mainnet" {
  return network.toLowerCase().includes("public") || network.toLowerCase().includes("main")
    ? "mainnet"
    : "testnet";
}

export function useFreighter() {
  const { setWallet, clearWallet } = useWalletStore();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const result = await freighterIsConnected();
        if (!cancelled) {
          setIsAvailable(Boolean(result?.isConnected || result === true));
        }
      } catch {
        if (!cancelled) setIsAvailable(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const connect = useCallback(async () => {
    setIsConnecting(true);
    setError(null);
    try {
      const connected = await freighterIsConnected();
      const extensionPresent = Boolean(
        (connected as { isConnected?: boolean })?.isConnected ?? connected
      );
      if (!extensionPresent) {
        throw new Error("Freighter wallet not found. Install the Freighter browser extension.");
      }

      const allowed = await isAllowed();
      const hasAccess = Boolean((allowed as { isAllowed?: boolean })?.isAllowed ?? allowed);
      if (!hasAccess) {
        const access = await requestAccess();
        if ((access as { error?: string })?.error) {
          throw new Error((access as { error: string }).error);
        }
      }

      const addressResult = await getAddress();
      const address =
        typeof addressResult === "string"
          ? addressResult
          : (addressResult as { address?: string }).address;
      if (!address) {
        throw new Error("Could not read Freighter public key.");
      }

      const networkResult = await getNetwork();
      const network =
        typeof networkResult === "string"
          ? networkResult
          : (networkResult as { network?: string; networkPassphrase?: string }).network ??
            (networkResult as { networkPassphrase?: string }).networkPassphrase ??
            "TESTNET";

      setIsAvailable(true);
      setWallet({
        address,
        isConnected: true,
        network: mapNetwork(network),
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
    setError(null);
  }, [clearWallet]);

  const signTransaction = useCallback(async (xdr: string, networkPassphrase?: string): Promise<string> => {
    const result = await freighterSignTransaction(xdr, {
      networkPassphrase,
    });
    if (typeof result === "string") return result;
    if ((result as { error?: string })?.error) {
      throw new Error((result as { error: string }).error);
    }
    const signed = (result as { signedTxXdr?: string }).signedTxXdr;
    if (!signed) throw new Error("Freighter did not return a signed transaction.");
    return signed;
  }, []);

  return { connect, disconnect, signTransaction, isConnecting, isAvailable, error };
}
