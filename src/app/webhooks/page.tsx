"use client";

import { useState } from "react";
import { Send, CheckCircle2, XCircle, Clock } from "lucide-react";
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
import { MOCK_WEBHOOK_EVENTS } from "@/lib/mock-data";
import { notify } from "@/stores/notification-store";
import { formatDate } from "@/lib/utils";
import type { WebhookEvent, WebhookEventType } from "@/types";

const EVENT_TYPES: WebhookEventType[] = [
  "subscription.created",
  "subscription.cancelled",
  "payment.success",
  "payment.failed",
  "trial.ending",
];

const EVENT_PAYLOADS: Record<WebhookEventType, Record<string, unknown>> = {
  "subscription.created": { subscriptionId: "sub_demo", planId: "plan_1", address: "GDEMO...ADDR" },
  "subscription.cancelled": { subscriptionId: "sub_demo", reason: "user_requested" },
  "payment.success": { subscriptionId: "sub_demo", amount: "29.99", asset: "USDC", txHash: "abc123" },
  "payment.failed": { subscriptionId: "sub_demo", reason: "insufficient_balance" },
  "trial.ending": { subscriptionId: "sub_demo", trialEndsAt: new Date(Date.now() + 86_400_000 * 3).toISOString() },
};

export default function WebhooksPage() {
  const [events, setEvents] = useState<WebhookEvent[]>(MOCK_WEBHOOK_EVENTS);
  const [selectedType, setSelectedType] = useState<WebhookEventType>("payment.success");
  const [webhookUrl, setWebhookUrl] = useState("https://yourapp.com/webhooks/substrata");
  const [isFiring, setIsFiring] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<WebhookEvent | null>(null);

  async function fireEvent() {
    setIsFiring(true);
    // Simulate network delay + random success/failure
    await new Promise((r) => setTimeout(r, 1200));
    const success = Math.random() > 0.2;

    const newEvent: WebhookEvent = {
      id: `wh_${Date.now()}`,
      type: selectedType,
      payload: EVENT_PAYLOADS[selectedType],
      timestamp: new Date().toISOString(),
      delivered: success,
      statusCode: success ? 200 : 500,
    };

    setEvents((prev) => [newEvent, ...prev]);
    setSelectedEvent(newEvent);

    if (success) {
      notify("success", "Webhook delivered", `${selectedType} → 200 OK`);
    } else {
      notify("error", "Webhook failed", `${selectedType} → 500 Internal Server Error`);
    }

    setIsFiring(false);
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Webhook Simulator</h1>
            <p className="mt-1 text-muted-foreground">
              Test your webhook endpoint by firing simulated Substrata events.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Fire panel */}
            <Card>
              <CardHeader>
                <CardTitle>Fire Event</CardTitle>
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
                  <Label>Event Type</Label>
                  <Select
                    value={selectedType}
                    onValueChange={(v) => setSelectedType(v as WebhookEventType)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {EVENT_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label>Payload Preview</Label>
                  <pre className="overflow-x-auto rounded-md bg-muted p-3 text-xs">
                    {JSON.stringify(EVENT_PAYLOADS[selectedType], null, 2)}
                  </pre>
                </div>

                <Button className="w-full" onClick={fireEvent} disabled={isFiring}>
                  <Send className="h-4 w-4" />
                  {isFiring ? "Sending…" : "Send Event"}
                </Button>
              </CardContent>
            </Card>

            {/* Event detail */}
            <Card>
              <CardHeader>
                <CardTitle>Response</CardTitle>
              </CardHeader>
              <CardContent>
                {!selectedEvent ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    Fire an event to see the response here.
                  </p>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      {selectedEvent.delivered ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <span className="font-medium">
                        {selectedEvent.delivered ? "Delivered" : "Failed"}
                      </span>
                      <Badge variant={selectedEvent.delivered ? "success" : "destructive"}>
                        {selectedEvent.statusCode}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm">
                      <p className="text-muted-foreground">Event ID: <span className="font-mono text-foreground">{selectedEvent.id}</span></p>
                      <p className="text-muted-foreground">Type: <span className="font-medium text-foreground">{selectedEvent.type}</span></p>
                      <p className="text-muted-foreground">Sent: {formatDate(selectedEvent.timestamp)}</p>
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-sm font-medium">Payload</p>
                      <pre className="overflow-x-auto rounded-md bg-muted p-3 text-xs">
                        {JSON.stringify(selectedEvent.payload, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Event log */}
          <Card>
            <CardHeader>
              <CardTitle>Event Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-4 py-3 text-left font-medium">Event</th>
                      <th className="px-4 py-3 text-left font-medium">Status</th>
                      <th className="px-4 py-3 text-left font-medium">Code</th>
                      <th className="px-4 py-3 text-left font-medium">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((ev) => (
                      <tr
                        key={ev.id}
                        className="cursor-pointer border-b last:border-0 hover:bg-muted/30"
                        onClick={() => setSelectedEvent(ev)}
                      >
                        <td className="px-4 py-3 font-mono text-xs">{ev.type}</td>
                        <td className="px-4 py-3">
                          {ev.delivered ? (
                            <span className="flex items-center gap-1 text-green-600">
                              <CheckCircle2 className="h-3.5 w-3.5" /> Delivered
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-red-600">
                              <XCircle className="h-3.5 w-3.5" /> Failed
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={ev.delivered ? "success" : "destructive"}>
                            {ev.statusCode ?? "—"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {formatDate(ev.timestamp)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
