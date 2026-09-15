/**
 * API abstraction layer.
 * Calls NEXT_PUBLIC_API_URL REST backend when NEXT_PUBLIC_USE_MOCK is not "true".
 * Falls back to in-memory mock data otherwise.
 */

import type {
  CreatePlanInput,
  Plan,
  Subscription,
  Transaction,
  MerchantStats,
  RevenueDataPoint,
} from "@/types";
import {
  MOCK_PLANS,
  MOCK_SUBSCRIPTIONS,
  MOCK_TRANSACTIONS,
  MOCK_STATS,
  MOCK_REVENUE_DATA,
} from "@/lib/mock-data";
import { env } from "@/lib/env";
import { mapApiPlan, type ApiPlan } from "@/lib/plan-mapper";

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
      message = body.message ?? (typeof body.error === "string" ? body.error : message);
    } catch {
      // ignore parse errors
    }
    throw new Error(message);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

function toBackendInterval(interval: CreatePlanInput["interval"]): string {
  return interval.toUpperCase();
}

function mapBackendStats(raw: {
  activePlans?: number;
  activeSubscribers?: number;
  revenueTotal?: string;
  successfulPayments?: number;
  totalRevenue?: string;
  mrr?: string;
  churnRate?: number;
}): MerchantStats {
  const totalRevenue = raw.totalRevenue ?? raw.revenueTotal ?? "0";
  return {
    totalRevenue,
    activeSubscribers: raw.activeSubscribers ?? 0,
    mrr: raw.mrr ?? totalRevenue,
    churnRate: raw.churnRate ?? 0,
  };
}

type ApiSubscription = {
  id: string;
  status: string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  cancelledAt?: string | null;
  createdAt?: string;
  wallet?: { address?: string };
  plan?: ApiPlan;
  planId?: string;
};

function mapApiSubscription(s: ApiSubscription): Subscription {
  const plan = s.plan
    ? mapApiPlan(s.plan)
    : ({
        id: s.planId ?? "",
        merchantId: "",
        name: "Plan",
        description: "",
        price: "0",
        asset: "XLM",
        interval: "monthly",
        trialDays: 0,
        isActive: true,
        createdAt: new Date().toISOString(),
        subscriberCount: 0,
      } satisfies Plan);

  const statusRaw = (s.status || "active").toLowerCase();
  const status =
    statusRaw === "cancelled" ||
    statusRaw === "paused" ||
    statusRaw === "expired" ||
    statusRaw === "trial" ||
    statusRaw === "active"
      ? statusRaw
      : statusRaw === "trialing"
        ? "trial"
        : statusRaw === "past_due"
          ? "active"
          : "active";

  return {
    id: s.id,
    planId: plan.id,
    plan,
    subscriberAddress: s.wallet?.address ?? "",
    merchantAddress: plan.merchantId,
    status,
    startedAt: s.currentPeriodStart ?? s.createdAt ?? new Date().toISOString(),
    nextBillingAt: s.currentPeriodEnd ?? new Date().toISOString(),
    cancelledAt: s.cancelledAt ?? undefined,
  };
}

type ApiPayment = {
  id: string;
  subscriptionId: string;
  stellarTxHash?: string | null;
  amount: string;
  assetCode: string;
  status: string;
  createdAt: string;
};

function mapApiPayment(p: ApiPayment): Transaction {
  const st = p.status.toLowerCase();
  return {
    id: p.id,
    subscriptionId: p.subscriptionId,
    txHash: p.stellarTxHash ?? "",
    amount: p.amount,
    asset: p.assetCode,
    status: st === "success" ? "success" : st === "failed" ? "failed" : "pending",
    createdAt: p.createdAt,
  };
}

// ─── Plans ───────────────────────────────────────────────────────────────────

export async function fetchPlans(merchantId: string): Promise<Plan[]> {
  if (!USE_MOCK) {
    const rows = await apiFetch<ApiPlan[]>(
      `/merchants/${encodeURIComponent(merchantId)}/plans`
    );
    return rows.map((p) => mapApiPlan(p));
  }
  await delay();
  return MOCK_PLANS.filter((p) => p.merchantId === merchantId);
}

export async function fetchPlan(planId: string): Promise<Plan> {
  if (!USE_MOCK) {
    const row = await apiFetch<ApiPlan>(`/plans/${encodeURIComponent(planId)}`);
    return mapApiPlan(row);
  }
  await delay();
  const plan = MOCK_PLANS.find((p) => p.id === planId);
  if (!plan) throw new Error(`Plan ${planId} not found`);
  return plan;
}

export async function createPlan(merchantId: string, input: CreatePlanInput): Promise<Plan> {
  if (!USE_MOCK) {
    const row = await apiFetch<ApiPlan>(`/merchants/${encodeURIComponent(merchantId)}/plans`, {
      method: "POST",
      body: JSON.stringify({
        name: input.name,
        description: input.description,
        amount: input.price,
        assetCode: input.asset,
        interval: toBackendInterval(input.interval),
        trialDays: input.trialDays ?? 0,
      }),
    });
    return mapApiPlan(row);
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
    if (!isActive) {
      await apiFetch<void>(`/plans/${encodeURIComponent(planId)}`, { method: "DELETE" });
      const existing = MOCK_PLANS.find((p) => p.id === planId);
      return {
        ...(existing ?? {
          id: planId,
          merchantId: "",
          name: "",
          description: "",
          price: "0",
          asset: "XLM",
          interval: "monthly" as const,
          trialDays: 0,
          createdAt: new Date().toISOString(),
          subscriberCount: 0,
        }),
        isActive: false,
      };
    }
    // Reactivation is not exposed as a dedicated route yet — keep local optimistic shape.
    const row = await apiFetch<ApiPlan>(`/plans/${encodeURIComponent(planId)}`);
    return { ...mapApiPlan(row), isActive: true };
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
    // Merchant dashboard: list subscribers to plans owned by this address.
    const rows = await apiFetch<ApiSubscription[]>(
      `/subscriptions?merchant=${encodeURIComponent(address)}`
    );
    return rows.map(mapApiSubscription);
  }
  await delay();
  return MOCK_SUBSCRIPTIONS.filter(
    (s) => s.subscriberAddress === address || s.merchantAddress === address
  );
}

export async function cancelSubscription(subscriptionId: string): Promise<Subscription> {
  if (!USE_MOCK) {
    const row = await apiFetch<ApiSubscription>(
      `/subscriptions/${encodeURIComponent(subscriptionId)}/cancel`,
      { method: "POST" }
    );
    return mapApiSubscription(row);
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
    const rows = await apiFetch<ApiPayment[]>(`/payments${query}`);
    return rows.map(mapApiPayment);
  }
  await delay();
  if (subscriptionId) return MOCK_TRANSACTIONS.filter((t) => t.subscriptionId === subscriptionId);
  return MOCK_TRANSACTIONS;
}

// ─── Merchant Analytics ───────────────────────────────────────────────────────

export async function fetchMerchantStats(merchantId: string): Promise<MerchantStats> {
  if (!USE_MOCK) {
    const raw = await apiFetch<Parameters<typeof mapBackendStats>[0]>(
      `/merchants/${encodeURIComponent(merchantId)}/stats`
    );
    return mapBackendStats(raw);
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
