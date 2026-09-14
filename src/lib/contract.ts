/**
 * Shared Soroban helpers: account lookup and signed invoke plumbing.
 */

import {
  Contract,
  TransactionBuilder,
  Account,
  BASE_FEE,
  SorobanRpc,
  type xdr,
} from "@stellar/stellar-sdk";
import { signTransaction } from "@stellar/freighter-api";
import { env } from "@/lib/env";
import { NETWORK_PASSPHRASE, sorobanServer } from "@/lib/stellar";

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
