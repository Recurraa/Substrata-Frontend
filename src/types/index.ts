// ─── Billing ────────────────────────────────────────────────────────────────

export type BillingInterval = "daily" | "weekly" | "monthly" | "yearly";

export type TxStatus = "pending" | "success" | "failed";

export type SupportedAsset = "USDC" | "XLM" | "EURC" | string;

// ─── Plans ───────────────────────────────────────────────────────────────────

export interface Plan {
  id: string;
  merchantId: string;
  name: string;
  description: string;
  price: string; // stringified decimal
  asset: SupportedAsset;
  interval: BillingInterval;
  trialDays: number;
  isActive: boolean;
  createdAt: string;
  subscriberCount: number;
}

export interface CreatePlanInput {
  name: string;
  description: string;
  price: string;
  asset: SupportedAsset;
  interval: BillingInterval;
  trialDays?: number;
}

// ─── Subscriptions ───────────────────────────────────────────────────────────

export type SubscriptionStatus = "active" | "cancelled" | "paused" | "trial" | "expired";

export interface Subscription {
  id: string;
  planId: string;
  plan: Plan;
  subscriberAddress: string;
  merchantAddress: string;
  status: SubscriptionStatus;
  startedAt: string;
  nextBillingAt: string;
  cancelledAt?: string;
}

// ─── Transactions ────────────────────────────────────────────────────────────

export interface Transaction {
  id: string;
  subscriptionId: string;
  txHash: string;
  amount: string;
  asset: SupportedAsset;
  status: TxStatus;
  createdAt: string;
  ledger?: number;
}

// ─── Merchant ────────────────────────────────────────────────────────────────

export interface Merchant {
  address: string;
  name: string;
  logoUrl?: string;
  webhookUrl?: string;
  createdAt: string;
}

export interface MerchantStats {
  totalRevenue: string;
  activeSubscribers: number;
  mrr: string; // monthly recurring revenue
  churnRate: number;
}

// ─── Wallet ──────────────────────────────────────────────────────────────────

export interface WalletState {
  address: string | null;
  isConnected: boolean;
  network: "testnet" | "mainnet" | null;
}

// ─── Webhooks ────────────────────────────────────────────────────────────────

export type WebhookEventType =
  | "subscription.created"
  | "subscription.cancelled"
  | "payment.success"
  | "payment.failed"
  | "trial.ending";

export interface WebhookEvent {
  id: string;
  type: WebhookEventType;
  payload: Record<string, unknown>;
  timestamp: string;
  delivered: boolean;
  statusCode?: number;
}

// ─── Notifications ───────────────────────────────────────────────────────────

export type NotificationType = "success" | "error" | "warning" | "info";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

// ─── Analytics ───────────────────────────────────────────────────────────────

export interface RevenueDataPoint {
  date: string;
  revenue: number;
  subscribers: number;
}
