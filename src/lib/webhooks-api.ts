/**
 * Webhook API helpers for live endpoint registration and event logs.
 */

import { env } from "@/lib/env";

const API_BASE = env.app.apiUrl.replace(/\/$/, "");
const USE_MOCK = env.app.useMock;

export type BackendWebhookEventType =
  | "PAYMENT_SUCCESS"
  | "PAYMENT_FAILED"
  | "SUBSCRIPTION_CREATED"
  | "SUBSCRIPTION_UPDATED"
  | "SUBSCRIPTION_CANCELLED";

export const BACKEND_WEBHOOK_EVENT_TYPES: BackendWebhookEventType[] = [
  "PAYMENT_SUCCESS",
  "PAYMENT_FAILED",
  "SUBSCRIPTION_CREATED",
  "SUBSCRIPTION_UPDATED",
  "SUBSCRIPTION_CANCELLED",
];

export interface ApiWebhookEndpoint {
  id: string;
  url: string;
  secret: string;
  events: BackendWebhookEventType[];
  isActive: boolean;
  createdAt: string;
}

export interface ApiWebhookEvent {
  id: string;
  type: BackendWebhookEventType;
  payload: Record<string, unknown>;
  createdAt: string;
  deliveries?: { status: string; attemptCount: number }[];
}

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
      // ignore
    }
    throw new Error(message);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export async function listWebhookEndpoints(): Promise<ApiWebhookEndpoint[]> {
  if (USE_MOCK) return [];
  return apiFetch<ApiWebhookEndpoint[]>("/webhooks/endpoints");
}

export async function createWebhookEndpoint(input: {
  url: string;
  secret: string;
  events: BackendWebhookEventType[];
}): Promise<ApiWebhookEndpoint> {
  if (USE_MOCK) {
    return {
      id: `ep_${Date.now()}`,
      ...input,
      isActive: true,
      createdAt: new Date().toISOString(),
    };
  }
  return apiFetch<ApiWebhookEndpoint>("/webhooks/endpoints", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function listWebhookEvents(): Promise<ApiWebhookEvent[]> {
  if (USE_MOCK) return [];
  return apiFetch<ApiWebhookEvent[]>("/webhooks/events");
}

export async function fireTestWebhook(input: {
  type: BackendWebhookEventType;
  payload?: Record<string, unknown>;
}): Promise<{ queued: boolean; type: BackendWebhookEventType }> {
  if (USE_MOCK) {
    return { queued: true, type: input.type };
  }
  return apiFetch("/webhooks/test", {
    method: "POST",
    body: JSON.stringify({
      type: input.type,
      payload: input.payload ?? { source: "sorobill-app-test" },
    }),
  });
}
