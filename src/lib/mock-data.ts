import type {
  Plan,
  Subscription,
  Transaction,
  MerchantStats,
  RevenueDataPoint,
  WebhookEvent,
  AppNotification,
} from "@/types";

// ─── Mock Plans ──────────────────────────────────────────────────────────────

export const MOCK_PLANS: Plan[] = [
  {
    id: "plan_1",
    merchantId: "merchant_1",
    name: "Starter",
    description: "Perfect for small teams getting started",
    price: "9.99",
    asset: "USDC",
    interval: "monthly",
    trialDays: 14,
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    subscriberCount: 42,
  },
  {
    id: "plan_2",
    merchantId: "merchant_1",
    name: "Pro",
    description: "For growing businesses with advanced needs",
    price: "29.99",
    asset: "USDC",
    interval: "monthly",
    trialDays: 7,
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    subscriberCount: 128,
  },
  {
    id: "plan_3",
    merchantId: "merchant_1",
    name: "Enterprise",
    description: "Custom solutions for large organizations",
    price: "99.99",
    asset: "USDC",
    interval: "monthly",
    trialDays: 0,
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    subscriberCount: 17,
  },
];

// ─── Mock Subscriptions ──────────────────────────────────────────────────────

export const MOCK_SUBSCRIPTIONS: Subscription[] = [
  {
    id: "sub_1",
    planId: "plan_2",
    plan: MOCK_PLANS[1],
    subscriberAddress: "GDEMO...ADDR1",
    merchantAddress: "GMERCHANT...ADDR",
    status: "active",
    startedAt: "2024-03-01T00:00:00Z",
    nextBillingAt: new Date(Date.now() + 5 * 86_400_000).toISOString(),
  },
  {
    id: "sub_2",
    planId: "plan_1",
    plan: MOCK_PLANS[0],
    subscriberAddress: "GDEMO...ADDR1",
    merchantAddress: "GMERCHANT...ADDR2",
    status: "active",
    startedAt: "2024-02-15T00:00:00Z",
    nextBillingAt: new Date(Date.now() + 12 * 86_400_000).toISOString(),
  },
];

// ─── Mock Transactions ───────────────────────────────────────────────────────

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "tx_1",
    subscriptionId: "sub_1",
    txHash: "abc123def456",
    amount: "29.99",
    asset: "USDC",
    status: "success",
    createdAt: new Date(Date.now() - 30 * 86_400_000).toISOString(),
    ledger: 48291034,
  },
  {
    id: "tx_2",
    subscriptionId: "sub_1",
    txHash: "def456ghi789",
    amount: "29.99",
    asset: "USDC",
    status: "success",
    createdAt: new Date(Date.now() - 60 * 86_400_000).toISOString(),
    ledger: 47891034,
  },
  {
    id: "tx_3",
    subscriptionId: "sub_2",
    txHash: "ghi789jkl012",
    amount: "9.99",
    asset: "USDC",
    status: "failed",
    createdAt: new Date(Date.now() - 15 * 86_400_000).toISOString(),
  },
];

// ─── Mock Stats ──────────────────────────────────────────────────────────────

export const MOCK_STATS: MerchantStats = {
  totalRevenue: "18420.50",
  activeSubscribers: 187,
  mrr: "5621.13",
  churnRate: 2.4,
};

// ─── Mock Revenue Chart Data ─────────────────────────────────────────────────

export const MOCK_REVENUE_DATA: RevenueDataPoint[] = Array.from({ length: 12 }, (_, i) => {
  const date = new Date();
  date.setMonth(date.getMonth() - (11 - i));
  return {
    date: date.toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
    revenue: Math.floor(3000 + Math.random() * 3000),
    subscribers: Math.floor(100 + i * 8 + Math.random() * 20),
  };
});

// ─── Mock Webhook Events ─────────────────────────────────────────────────────

export const MOCK_WEBHOOK_EVENTS: WebhookEvent[] = [
  {
    id: "wh_1",
    type: "payment.success",
    payload: { subscriptionId: "sub_1", amount: "29.99", asset: "USDC" },
    timestamp: new Date(Date.now() - 3600_000).toISOString(),
    delivered: true,
    statusCode: 200,
  },
  {
    id: "wh_2",
    type: "subscription.created",
    payload: { subscriptionId: "sub_2", planId: "plan_1" },
    timestamp: new Date(Date.now() - 7200_000).toISOString(),
    delivered: true,
    statusCode: 200,
  },
  {
    id: "wh_3",
    type: "payment.failed",
    payload: { subscriptionId: "sub_2", reason: "insufficient_balance" },
    timestamp: new Date(Date.now() - 86_400_000).toISOString(),
    delivered: false,
    statusCode: 500,
  },
];

// ─── Mock Notifications ──────────────────────────────────────────────────────

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: "notif_1",
    type: "success",
    title: "Payment received",
    message: "29.99 USDC received from GDEMO...ADDR1",
    read: false,
    createdAt: new Date(Date.now() - 3600_000).toISOString(),
  },
  {
    id: "notif_2",
    type: "error",
    title: "Payment failed",
    message: "Billing attempt for sub_2 failed — insufficient balance",
    read: false,
    createdAt: new Date(Date.now() - 86_400_000).toISOString(),
  },
  {
    id: "notif_3",
    type: "info",
    title: "New subscriber",
    message: "GDEMO...ADDR3 subscribed to your Pro plan",
    read: true,
    createdAt: new Date(Date.now() - 2 * 86_400_000).toISOString(),
  },
];
