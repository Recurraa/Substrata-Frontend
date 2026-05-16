/**
 * API abstraction layer.
 * Currently uses mock data; swap fetch calls for real Soroban contract
 * invocations or a backend API by replacing the implementations below.
 */

import type { CreatePlanInput, Plan, Subscription, Transaction, MerchantStats, RevenueDataPoint } from "@/types";
import {
  MOCK_PLANS,
  MOCK_SUBSCRIPTIONS,
  MOCK_TRANSACTIONS,
  MOCK_STATS,
  MOCK_REVENUE_DATA,
} from "@/lib/mock-data";

const delay = (ms = 600) => new Promise((r) => setTimeout(r, ms));

// ─── Plans ───────────────────────────────────────────────────────────────────

export async function fetchPlans(merchantId: string): Promise<Plan[]> {
  await delay();
  return MOCK_PLANS.filter((p) => p.merchantId === merchantId);
}

export async function fetchPlan(planId: string): Promise<Plan> {
  await delay();
  const plan = MOCK_PLANS.find((p) => p.id === planId);
  if (!plan) throw new Error(`Plan ${planId} not found`);
  return plan;
}

export async function createPlan(merchantId: string, input: CreatePlanInput): Promise<Plan> {
  await delay(1000);
  const plan: Plan = {
    id: `plan_${Date.now()}`,
    merchantId,
    ...input,
    trialDays: input.trialDays ?? 0,
    isActive: true,
    createdAt: new Date().toISOString(),
    subscriberCount: 0,
  };
  MOCK_PLANS.push(plan);
  return plan;
}

export async function togglePlan(planId: string, isActive: boolean): Promise<Plan> {
  await delay();
  const plan = MOCK_PLANS.find((p) => p.id === planId);
  if (!plan) throw new Error(`Plan ${planId} not found`);
  plan.isActive = isActive;
  return plan;
}

// ─── Subscriptions ───────────────────────────────────────────────────────────

export async function fetchSubscriptions(address: string): Promise<Subscription[]> {
  await delay();
  return MOCK_SUBSCRIPTIONS.filter((s) => s.subscriberAddress === address || s.merchantAddress === address);
}

export async function cancelSubscription(subscriptionId: string): Promise<Subscription> {
  await delay(1000);
  const sub = MOCK_SUBSCRIPTIONS.find((s) => s.id === subscriptionId);
  if (!sub) throw new Error(`Subscription ${subscriptionId} not found`);
  sub.status = "cancelled";
  sub.cancelledAt = new Date().toISOString();
  return sub;
}

// ─── Transactions ─────────────────────────────────────────────────────────────

export async function fetchTransactions(subscriptionId?: string): Promise<Transaction[]> {
  await delay();
  if (subscriptionId) return MOCK_TRANSACTIONS.filter((t) => t.subscriptionId === subscriptionId);
  return MOCK_TRANSACTIONS;
}

// ─── Merchant Analytics ───────────────────────────────────────────────────────

export async function fetchMerchantStats(_merchantId: string): Promise<MerchantStats> {
  await delay();
  return MOCK_STATS;
}

export async function fetchRevenueData(_merchantId: string): Promise<RevenueDataPoint[]> {
  await delay();
  return MOCK_REVENUE_DATA;
}
