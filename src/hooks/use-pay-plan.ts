"use client";

import { useQuery } from "@tanstack/react-query";
import { apiBase, useLiveApi } from "@/lib/api-defaults";
import type { ApiPlan } from "@/lib/plan-mapper";
import { queryKeys } from "@/lib/query-keys";

async function fetchPlan(id: string): Promise<ApiPlan> {
  const res = await fetch(`${apiBase()}/plans/${id}`);
  if (!res.ok) throw new Error("Plan not found");
  return res.json();
}

export function usePayPlan(planId: string) {
  return useQuery({
    queryKey: queryKeys.payPlan(planId),
    queryFn: () => fetchPlan(planId),
    enabled: Boolean(planId) && useLiveApi(),
  });
}
