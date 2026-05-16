export const env = {
  stellar: {
    network: process.env.NEXT_PUBLIC_STELLAR_NETWORK as "testnet" | "mainnet",
    rpcUrl: process.env.NEXT_PUBLIC_STELLAR_RPC_URL!,
    horizonUrl: process.env.NEXT_PUBLIC_STELLAR_HORIZON_URL!,
    passphrase: process.env.NEXT_PUBLIC_STELLAR_PASSPHRASE!,
  },
  contracts: {
    subscription: process.env.NEXT_PUBLIC_SUBSCRIPTION_CONTRACT_ID ?? "",
    billing: process.env.NEXT_PUBLIC_BILLING_CONTRACT_ID ?? "",
    token: process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ID ?? "",
  },
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    name: process.env.NEXT_PUBLIC_APP_NAME ?? "Substrata",
  },
  webhookSecret: process.env.NEXT_PUBLIC_WEBHOOK_SECRET ?? "",
} as const;
