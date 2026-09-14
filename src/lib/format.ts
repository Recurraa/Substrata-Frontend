export function formatAssetAmount(amount: string | number, assetCode = "XLM"): string {
  const n = typeof amount === "number" ? amount : parseFloat(amount);
  if (Number.isNaN(n)) return `${amount} ${assetCode}`;
  return `${n.toLocaleString(undefined, { maximumFractionDigits: 7 })} ${assetCode}`;
}

export function formatShortAddress(address: string, size = 4): string {
  if (address.length < size * 2 + 3) return address;
  return `${address.slice(0, size)}…${address.slice(-size)}`;
}

export function formatInterval(interval: string): string {
  const map: Record<string, string> = {
    DAILY: "Daily",
    WEEKLY: "Weekly",
    MONTHLY: "Monthly",
    YEARLY: "Yearly",
    daily: "Daily",
    weekly: "Weekly",
    monthly: "Monthly",
    yearly: "Yearly",
  };
  return map[interval] ?? interval;
}
