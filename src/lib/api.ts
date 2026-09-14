/**
 * API abstraction layer.
 * Calls NEXT_PUBLIC_API_URL REST backend when NEXT_PUBLIC_USE_MOCK is not "true".
 * Falls back to in-memory mock data otherwise.
 */

import type { CreatePlanInput, Plan, Subscription, Transaction, MerchantStats, RevenueDataPoint } from "@/types";
import {
  MOCK_PLANS,
  MOCK_SUBSCRIPTIONS,
  MOCK_TRANSACTIONS,
  MOCK_STATS,
  MOCK_REVENUE_DATA,
} from "@/lib/mock-data";
import { env } from "@/lib/env";

const delay = (ms = 600) => new Promise((r) => setTimeout(r, ms));

const USE_MOCK = env.app.useMock;
const API_BASE = env.app.apiUrl.replace(/\/$/, "");

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    let message = `API error ${res.status}`;
    try {
      const body = (await res.json()) as { message?: string; error?: string };
      message = body.message ?? body.error ?? message;
    } catch {
      // ignore parse errors
    }
    throw new Error(message);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

// ─── Plans ───────────────────────────────────────────────────────────────────

export async function fetchPlans(merchantId: string): Promise<Plan[]> {
  if (!USE_MOCK) {
    return apiFetch<Plan[]>(`/merchants/${encodeURIComponent(merchantId)}/plans`);
  }
  await delay();
  return MOCK_PLANS.filter((p) => p.merchantId === merchantId);
}

export async function fetchPlan(planId: string): Promise<Plan> {
  if (!USE_MOCK) {
    return apiFetch<Plan>(`/plans/${encodeURIComponent(planId)}`);
  }
  await delay();
  const plan = MOCK_PLANS.find((p) => p.id === planId);
  if (!plan) throw new Error(`Plan ${planId} not found`);
  return plan;
}

export async function createPlan(merchantId: string, input: CreatePlanInput): Promise<Plan> {
  if (!USE_MOCK) {
    return apiFetch<Plan>(`/merchants/${encodeURIComponent(merchantId)}/plans`, {
      method: "POST",
      body: JSON.stringify(input),
    });
  }
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
  if (!USE_MOCK) {
    return apiFetch<Plan>(`/plans/${encodeURIComponent(planId)}`, {
      method: "PATCH",
      body: JSON.stringify({ isActive }),
    });
  }
  await delay();
  const plan = MOCK_PLANS.find((p) => p.id === planId);
  if (!plan) throw new Error(`Plan ${planId} not found`);
  plan.isActive = isActive;
  return plan;
}

// ─── Subscriptions ───────────────────────────────────────────────────────────

export async function fetchSubscriptions(address: string): Promise<Subscription[]> {
  if (!USE_MOCK) {
    return apiFetch<Subscription[]>(`/subscriptions?address=${encodeURIComponent(address)}`);
  }
  await delay();
  return MOCK_SUBSCRIPTIONS.filter((s) => s.subscriberAddress === address || s.merchantAddress === address);
}

export async function cancelSubscription(subscriptionId: string): Promise<Subscription> {
  if (!USE_MOCK) {
    return apiFetch<Subscription>(`/subscriptions/${encodeURIComponent(subscriptionId)}/cancel`, {
      method: "POST",
    });
  }
  await delay(1000);
  const sub = MOCK_SUBSCRIPTIONS.find((s) => s.id === subscriptionId);
  if (!sub) throw new Error(`Subscription ${subscriptionId} not found`);
  sub.status = "cancelled";
  sub.cancelledAt = new Date().toISOString();
  return sub;
}

// ─── Transactions ─────────────────────────────────────────────────────────────

export async function fetchTransactions(subscriptionId?: string): Promise<Transaction[]> {
  if (!USE_MOCK) {
    const query = subscriptionId ? `?subscriptionId=${encodeURIComponent(subscriptionId)}` : "";
    return apiFetch<Transaction[]>(`/transactions${query}`);
  }
  await delay();
  if (subscriptionId) return MOCK_TRANSACTIONS.filter((t) => t.subscriptionId === subscriptionId);
  return MOCK_TRANSACTIONS;
}

// ─── Merchant Analytics ───────────────────────────────────────────────────────

export async function fetchMerchantStats(merchantId: string): Promise<MerchantStats> {
  if (!USE_MOCK) {
    return apiFetch<MerchantStats>(`/merchants/${encodeURIComponent(merchantId)}/stats`);
  }
  await delay();
  return MOCK_STATS;
}

export async function fetchRevenueData(merchantId: string): Promise<RevenueDataPoint[]> {
  if (!USE_MOCK) {
    return apiFetch<RevenueDataPoint[]>(`/merchants/${encodeURIComponent(merchantId)}/revenue`);
  }
  await delay();
  return MOCK_REVENUE_DATA;
}
