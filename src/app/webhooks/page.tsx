"use client";

import { useCallback, useEffect, useState } from "react";
import { Send, CheckCircle2, XCircle, Clock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navbar } from "@/components/navbar";
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
    } catch (err) {
      notify("error", "Fire failed", err instanceof Error ? err.message : "Error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold">Webhooks</h1>
              <p className="mt-1 text-muted-foreground">
                {useMock
                  ? "Mock mode — registration and test fires stay local."
                  : "Register endpoints and fire test events against the billing API."}
              </p>
            </div>
            {!useMock && (
              <Button variant="outline" size="sm" onClick={() => void refresh()}>
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            )}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Register endpoint</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Endpoint URL</Label>
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
                <Button className="w-full" onClick={() => void registerEndpoint()} disabled={busy}>
                  Register
                </Button>
                {endpoints.length > 0 && (
                  <ul className="space-y-2 text-sm">
                    {endpoints.map((ep) => (
                      <li key={ep.id} className="rounded-md border px-3 py-2 font-mono text-xs">
                        {ep.url}
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Fire test event</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Event Type</Label>
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
                <Button className="w-full" onClick={() => void fireEvent()} disabled={busy}>
                  <Send className="h-4 w-4" />
                  {busy ? "Sending…" : "Send Event"}
                </Button>
                {selectedEvent && (
                  <pre className="overflow-x-auto rounded-md bg-muted p-3 text-xs">
                    {JSON.stringify(selectedEvent.payload, null, 2)}
                  </pre>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Event log</CardTitle>
            </CardHeader>
            <CardContent>
              {events.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  No webhook events yet. Register an endpoint and fire a test event.
                </p>
              ) : (
                <div className="overflow-x-auto rounded-lg border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="px-4 py-3 text-left font-medium">Event</th>
                        <th className="px-4 py-3 text-left font-medium">Deliveries</th>
                        <th className="px-4 py-3 text-left font-medium">Time</th>
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
                                <span className="flex items-center gap-1 text-green-600">
                                  <CheckCircle2 className="h-3.5 w-3.5" /> Delivered
                                </span>
                              ) : failed ? (
                                <span className="flex items-center gap-1 text-red-600">
                                  <XCircle className="h-3.5 w-3.5" /> Failed
                                </span>
                              ) : (
                                <Badge variant="secondary">Pending</Badge>
                              )}
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">
                              <span className="flex items-center gap-1">
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
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
