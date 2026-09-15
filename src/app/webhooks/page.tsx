"use client";

import { useCallback, useEffect, useState } from "react";
import { Send, CheckCircle2, XCircle, Clock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { env } from "@/lib/env";
import {
  BACKEND_WEBHOOK_EVENT_TYPES,
  createWebhookEndpoint,
  fireTestWebhook,
  listWebhookEndpoints,
  listWebhookEvents,
  type ApiWebhookEndpoint,
  type ApiWebhookEvent,
  type BackendWebhookEventType,
} from "@/lib/webhooks-api";
import { notify } from "@/stores/notification-store";
import { formatDate } from "@/lib/utils";

function randomSecret() {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const bytes = new Uint8Array(24);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  }
  return `dev_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export default function WebhooksPage() {
  const [endpoints, setEndpoints] = useState<ApiWebhookEndpoint[]>([]);
  const [events, setEvents] = useState<ApiWebhookEvent[]>([]);
  const [selectedType, setSelectedType] =
    useState<BackendWebhookEventType>("PAYMENT_SUCCESS");
  const [webhookUrl, setWebhookUrl] = useState("https://yourapp.com/webhooks/sorobill");
  const [secret, setSecret] = useState(randomSecret);
  const [busy, setBusy] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ApiWebhookEvent | null>(null);
  const useMock = env.app.useMock;

  const refresh = useCallback(async () => {
    if (useMock) return;
    const [eps, evs] = await Promise.all([listWebhookEndpoints(), listWebhookEvents()]);
    setEndpoints(eps);
    setEvents(evs);
  }, [useMock]);

  useEffect(() => {
    void refresh().catch((err) =>
      notify("error", "Failed to load webhooks", err instanceof Error ? err.message : "Error")
    );
  }, [refresh]);

  async function registerEndpoint() {
    setBusy(true);
    try {
      const ep = await createWebhookEndpoint({
        url: webhookUrl,
        secret,
        events: [...BACKEND_WEBHOOK_EVENT_TYPES],
      });
      setEndpoints((prev) => [ep, ...prev]);
      notify("success", "Endpoint registered", ep.url);
    } catch (err) {
      notify("error", "Register failed", err instanceof Error ? err.message : "Error");
    } finally {
      setBusy(false);
    }
  }

  async function fireEvent() {
    setBusy(true);
    try {
      await fireTestWebhook({
        type: selectedType,
        payload: { source: "webhook-ui", at: new Date().toISOString() },
      });
      notify("success", "Test event queued", selectedType);
      if (!useMock) await refresh();
      else {
        setEvents((prev) => [
          {
            id: `wh_${Date.now()}`,
            type: selectedType,
            payload: { source: "demo" },
            createdAt: new Date().toISOString(),
            deliveries: [{ status: "DELIVERED", attemptCount: 1 }],
          },
          ...prev,
        ]);
      }
    } catch (err) {
      notify("error", "Fire failed", err instanceof Error ? err.message : "Error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Integrations
          </p>
          <h1 className="mt-1 text-3xl font-semibold">Webhooks</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {useMock
              ? "Demo mode — register and fire events locally."
              : "Register endpoints and verify HMAC delivery against the billing API."}
          </p>
        </div>
        {!useMock && (
          <Button variant="outline" size="sm" onClick={() => void refresh()}>
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="space-y-4 border border-border p-5">
          <h2 className="text-lg font-semibold">Register endpoint</h2>
          <div className="space-y-1.5">
            <Label>URL</Label>
            <Input
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://yourapp.com/webhooks"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Signing secret</Label>
            <Input value={secret} onChange={(e) => setSecret(e.target.value)} />
          </div>
          <Button onClick={() => void registerEndpoint()} disabled={busy}>
            Register
          </Button>
          {endpoints.length > 0 && (
            <ul className="space-y-2 border-t border-border pt-4 text-xs">
              {endpoints.map((ep) => (
                <li key={ep.id} className="truncate font-mono text-muted-foreground">
                  {ep.url}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="space-y-4 border border-border p-5">
          <h2 className="text-lg font-semibold">Fire test event</h2>
          <div className="space-y-1.5">
            <Label>Type</Label>
            <Select
              value={selectedType}
              onValueChange={(v) => setSelectedType(v as BackendWebhookEventType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BACKEND_WEBHOOK_EVENT_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => void fireEvent()} disabled={busy}>
            <Send className="h-4 w-4" />
            {busy ? "Sending…" : "Send event"}
          </Button>
          {selectedEvent && (
            <pre className="overflow-x-auto bg-muted/50 p-3 text-xs">
              {JSON.stringify(selectedEvent.payload, null, 2)}
            </pre>
          )}
        </section>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Event log</h2>
        {events.length === 0 ? (
          <p className="border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
            No events yet. Register an endpoint and fire a test.
          </p>
        ) : (
          <div className="overflow-x-auto border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Event</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Time</th>
                </tr>
              </thead>
              <tbody>
                {events.map((ev) => {
                  const delivered = ev.deliveries?.some((d) => d.status === "DELIVERED");
                  const failed = ev.deliveries?.some((d) => d.status === "FAILED");
                  return (
                    <tr
                      key={ev.id}
                      className="cursor-pointer border-b last:border-0 hover:bg-muted/30"
                      onClick={() => setSelectedEvent(ev)}
                    >
                      <td className="px-4 py-3 font-mono text-xs">{ev.type}</td>
                      <td className="px-4 py-3">
                        {delivered ? (
                          <span className="inline-flex items-center gap-1 text-sea">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Delivered
                          </span>
                        ) : failed ? (
                          <span className="inline-flex items-center gap-1 text-destructive">
                            <XCircle className="h-3.5 w-3.5" /> Failed
                          </span>
                        ) : (
                          <span className="text-muted-foreground">Pending</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {formatDate(ev.createdAt)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
