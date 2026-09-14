import { env } from "@/lib/env";

export function stellarExpertTxUrl(hash: string): string {
  const network = env.stellar.network === "mainnet" ? "public" : "testnet";
  return `https://stellar.expert/explorer/${network}/tx/${hash}`;
}

export function stellarExpertAccountUrl(address: string): string {
  const network = env.stellar.network === "mainnet" ? "public" : "testnet";
  return `https://stellar.expert/explorer/${network}/account/${address}`;
}

export function stellarExpertContractUrl(contractId: string): string {
  const network = env.stellar.network === "mainnet" ? "public" : "testnet";
  return `https://stellar.expert/explorer/${network}/contract/${contractId}`;
}
