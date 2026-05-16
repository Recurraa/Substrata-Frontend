import { Networks, SorobanRpc } from "@stellar/stellar-sdk";
import { env } from "@/lib/env";

export const NETWORK_PASSPHRASE =
  env.stellar.network === "mainnet" ? Networks.PUBLIC : Networks.TESTNET;

export const sorobanServer = new SorobanRpc.Server(env.stellar.rpcUrl, {
  allowHttp: env.stellar.network === "testnet",
});

export function getExplorerUrl(txHash: string): string {
  const base =
    env.stellar.network === "mainnet"
      ? "https://stellar.expert/explorer/public"
      : "https://stellar.expert/explorer/testnet";
  return `${base}/tx/${txHash}`;
}
