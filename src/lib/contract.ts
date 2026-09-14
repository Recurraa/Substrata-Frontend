/**
 * Shared Soroban helpers: account lookup and signed invoke plumbing.
 */

import {
  Contract,
  TransactionBuilder,
  Account,
  Address,
  nativeToScVal,
  BASE_FEE,
  SorobanRpc,
  type xdr,
} from "@stellar/stellar-sdk";
import { signTransaction } from "@stellar/freighter-api";
import { env } from "@/lib/env";
import { NETWORK_PASSPHRASE, sorobanServer } from "@/lib/stellar";
import type { CreatePlanInput } from "@/types";

const INTERVAL_SECONDS: Record<CreatePlanInput["interval"], number> = {
  daily: 86_400,
  weekly: 604_800,
  monthly: 2_592_000,
  yearly: 31_536_000,
};

export function toI128Amount(amount: string, decimals = 7): xdr.ScVal {
  const [whole = "0", fraction = ""] = amount.split(".");
  const padded = (fraction + "0".repeat(decimals)).slice(0, decimals);
  const raw = BigInt(whole + padded);
  return nativeToScVal(raw, { type: "i128" });
}

export async function getSourceAccount(publicKey: string) {
  const account = await sorobanServer.getAccount(publicKey);
  return new Account(account.accountId(), account.sequenceNumber());
}

export async function prepareSignAndSend(
  publicKey: string,
  contractId: string,
  buildOp: (contract: Contract) => xdr.Operation
): Promise<{ hash: string; signedXdr: string }> {
  if (!contractId) {
    throw new Error("Soroban contract ID is not configured.");
  }

  const source = await getSourceAccount(publicKey);
  const contract = new Contract(contractId);
  const tx = new TransactionBuilder(source, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(buildOp(contract))
    .setTimeout(180)
    .build();

  const simulated = await sorobanServer.simulateTransaction(tx);
  if (SorobanRpc.isSimulationError(simulated)) {
    throw new Error(simulated.error ?? "Soroban simulation failed");
  }

  const prepared = await sorobanServer.prepareTransaction(tx);
  const signResult = await signTransaction(prepared.toXDR(), {
    networkPassphrase: NETWORK_PASSPHRASE,
    address: publicKey,
  });

  const signedXdr =
    typeof signResult === "string"
      ? signResult
      : (signResult as { signedTxXdr?: string }).signedTxXdr;

  if (!signedXdr) {
    const err = (signResult as { error?: string })?.error;
    throw new Error(err ?? "Freighter did not return signed XDR");
  }

  const sent = await sorobanServer.sendTransaction(
    TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE)
  );

  return { hash: sent.hash, signedXdr };
}

export function requireSubscriptionContractId(): string {
  const id = env.contracts.subscription;
  if (!id) throw new Error("NEXT_PUBLIC_SUBSCRIPTION_CONTRACT_ID is not configured.");
  return id;
}

export function requireTokenContractId(): string {
  const id = env.contracts.token;
  if (!id) throw new Error("NEXT_PUBLIC_TOKEN_CONTRACT_ID is not configured.");
  return id;
}

/** Invoke subscription contract `create_plan` via Freighter. */
export async function invokeCreatePlan(
  merchantPublicKey: string,
  input: CreatePlanInput
): Promise<{ hash: string }> {
  const contractId = requireSubscriptionContractId();
  const { hash } = await prepareSignAndSend(merchantPublicKey, contractId, (contract) =>
    contract.call(
      "create_plan",
      Address.fromString(merchantPublicKey).toScVal(),
      nativeToScVal(input.name, { type: "string" }),
      nativeToScVal(input.description, { type: "string" }),
      toI128Amount(input.price),
      nativeToScVal(input.asset, { type: "string" }),
      nativeToScVal(INTERVAL_SECONDS[input.interval], { type: "u64" }),
      nativeToScVal(input.trialDays ?? 0, { type: "u32" })
    )
  );
  return { hash };
}

/** Invoke subscription contract `subscribe` via Freighter. */
export async function invokeSubscribe(
  subscriberPublicKey: string,
  planId: string
): Promise<{ hash: string }> {
  const contractId = requireSubscriptionContractId();
  const { hash } = await prepareSignAndSend(subscriberPublicKey, contractId, (contract) =>
    contract.call(
      "subscribe",
      Address.fromString(subscriberPublicKey).toScVal(),
      nativeToScVal(planId, { type: "string" })
    )
  );
  return { hash };
}
