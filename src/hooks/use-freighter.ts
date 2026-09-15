"use client";

import { useState, useCallback, useEffect } from "react";
import {
  isConnected as freighterIsConnected,
  isAllowed,
  requestAccess,
  getPublicKey,
  getNetwork,
  signTransaction as freighterSignTransaction,
} from "@stellar/freighter-api";
import { useWalletStore } from "@/stores/wallet-store";

function mapNetwork(network: string): "testnet" | "mainnet" {
  return network.toLowerCase().includes("public") || network.toLowerCase().includes("main")
    ? "mainnet"
    : "testnet";
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
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
        const obj = asRecord(result);
        const available = obj ? Boolean(obj.isConnected) : Boolean(result);
        if (!cancelled) setIsAvailable(available);
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
      const connectedObj = asRecord(connected);
      const extensionPresent = connectedObj
        ? Boolean(connectedObj.isConnected)
        : Boolean(connected);
      if (!extensionPresent) {
        throw new Error("Freighter wallet not found. Install the Freighter browser extension.");
      }

      const allowed = await isAllowed();
      const allowedObj = asRecord(allowed);
      const hasAccess = allowedObj ? Boolean(allowedObj.isAllowed) : Boolean(allowed);
      if (!hasAccess) {
        const access = await requestAccess();
        const accessObj = asRecord(access);
        if (accessObj?.error) {
          throw new Error(String(accessObj.error));
        }
      }

      const addressResult = await getPublicKey();
      const address =
        typeof addressResult === "string"
          ? addressResult
          : String(asRecord(addressResult)?.publicKey ?? asRecord(addressResult)?.address ?? "");
      if (!address) {
        throw new Error("Could not read Freighter public key.");
      }

      const networkResult = await getNetwork();
      const networkObj = asRecord(networkResult);
      const network =
        typeof networkResult === "string"
          ? networkResult
          : String(networkObj?.network ?? networkObj?.networkPassphrase ?? "TESTNET");

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

  const signTransaction = useCallback(
    async (xdr: string, networkPassphrase?: string): Promise<string> => {
      const result = await freighterSignTransaction(xdr, { networkPassphrase });
      if (typeof result === "string") return result;
      const obj = asRecord(result);
      if (obj?.error) throw new Error(String(obj.error));
      const signed = obj?.signedTxXdr;
      if (typeof signed !== "string" || !signed) {
        throw new Error("Freighter did not return a signed transaction.");
      }
      return signed;
    },
    []
  );

  return { connect, disconnect, signTransaction, isConnecting, isAvailable, error };
}
