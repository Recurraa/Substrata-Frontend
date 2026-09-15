import { env } from "@/lib/env";

export function networkLabel(): string {
  return env.stellar.network === "mainnet" ? "Mainnet" : "Testnet";
}
