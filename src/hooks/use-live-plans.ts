"use client";

import { useQuery } from "@tanstack/react-query";
import { apiBase, useLiveApi } from "@/lib/api-defaults";
import type { ApiPlan } from "@/lib/plan-mapper";

async function fetchPlans(): Promise<ApiPlan[]> {
  const res = await fetch(`${apiBase()}/plans`);
  if (!res.ok) throw new Error("Failed to load plans");
  return res.json();
}

export function useLivePlans(enabled = true) {
  return useQuery({
    queryKey: ["public-plans", useLiveApi()],
    queryFn: fetchPlans,
    enabled: enabled && useLiveApi(),
  });
}
