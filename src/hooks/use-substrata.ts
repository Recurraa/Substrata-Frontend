import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchPlans,
  fetchPlan,
  createPlan,
  togglePlan,
  fetchSubscriptions,
  cancelSubscription,
  fetchTransactions,
  fetchMerchantStats,
  fetchRevenueData,
} from "@/lib/api";
import type { CreatePlanInput } from "@/types";

// ─── Plans ───────────────────────────────────────────────────────────────────

export const planKeys = {
  all: ["plans"] as const,
  byMerchant: (id: string) => ["plans", id] as const,
  detail: (id: string) => ["plans", "detail", id] as const,
};

export function usePlans(merchantId: string) {
  return useQuery({
    queryKey: planKeys.byMerchant(merchantId),
    queryFn: () => fetchPlans(merchantId),
    enabled: !!merchantId,
  });
}

export function usePlan(planId: string) {
  return useQuery({
    queryKey: planKeys.detail(planId),
    queryFn: () => fetchPlan(planId),
    enabled: !!planId,
  });
}

export function useCreatePlan(merchantId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreatePlanInput) => createPlan(merchantId, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: planKeys.byMerchant(merchantId) }),
  });
}

export function useTogglePlan(merchantId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ planId, isActive }: { planId: string; isActive: boolean }) =>
      togglePlan(planId, isActive),
    onSuccess: () => qc.invalidateQueries({ queryKey: planKeys.byMerchant(merchantId) }),
  });
}

// ─── Subscriptions ───────────────────────────────────────────────────────────

export const subKeys = {
  byAddress: (addr: string) => ["subscriptions", addr] as const,
};

export function useSubscriptions(address: string) {
  return useQuery({
    queryKey: subKeys.byAddress(address),
    queryFn: () => fetchSubscriptions(address),
    enabled: !!address,
  });
}

export function useCancelSubscription(address: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (subscriptionId: string) => cancelSubscription(subscriptionId),
    onSuccess: () => qc.invalidateQueries({ queryKey: subKeys.byAddress(address) }),
  });
}

// ─── Transactions ─────────────────────────────────────────────────────────────

export const txKeys = {
  all: ["transactions"] as const,
  bySub: (id: string) => ["transactions", id] as const,
};

export function useTransactions(subscriptionId?: string) {
  return useQuery({
    queryKey: subscriptionId ? txKeys.bySub(subscriptionId) : txKeys.all,
    queryFn: () => fetchTransactions(subscriptionId),
  });
}

// ─── Analytics ───────────────────────────────────────────────────────────────

export function useMerchantStats(merchantId: string) {
  return useQuery({
    queryKey: ["stats", merchantId],
    queryFn: () => fetchMerchantStats(merchantId),
    enabled: !!merchantId,
  });
}

export function useRevenueData(merchantId: string) {
  return useQuery({
    queryKey: ["revenue", merchantId],
    queryFn: () => fetchRevenueData(merchantId),
    enabled: !!merchantId,
  });
}
