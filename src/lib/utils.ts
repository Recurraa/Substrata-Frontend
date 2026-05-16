import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { BillingInterval, SupportedAsset } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAmount(amount: string, asset: SupportedAsset): string {
  const num = parseFloat(amount);
  return `${num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 7 })} ${asset}`;
}

export function formatInterval(interval: BillingInterval): string {
  const map: Record<BillingInterval, string> = {
    daily: "day",
    weekly: "week",
    monthly: "month",
    yearly: "year",
  };
  return map[interval];
}

export function shortenAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatRelativeTime(iso: string): string {
  const diff = new Date(iso).getTime() - Date.now();
  const days = Math.ceil(diff / 86_400_000);
  if (days < 0) return "Overdue";
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  return `In ${days} days`;
}
