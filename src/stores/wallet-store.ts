import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { WalletState } from "@/types";

interface WalletStore extends WalletState {
  setWallet: (wallet: WalletState) => void;
  clearWallet: () => void;
}

export const useWalletStore = create<WalletStore>()(
  persist(
    (set) => ({
      address: null,
      isConnected: false,
      network: null,
      setWallet: (wallet) => set(wallet),
      clearWallet: () => set({ address: null, isConnected: false, network: null }),
    }),
    { name: "substrata-wallet" }
  )
);
