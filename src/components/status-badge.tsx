import { Badge } from "@/components/ui/badge";
import type { TxStatus, SubscriptionStatus } from "@/types";

type Status = TxStatus | SubscriptionStatus;

const CONFIG: Record<Status, { label: string; variant: "success" | "destructive" | "warning" | "secondary" | "outline" }> = {
  success: { label: "Success", variant: "success" },
  failed: { label: "Failed", variant: "destructive" },
  pending: { label: "Pending", variant: "warning" },
  active: { label: "Active", variant: "success" },
  cancelled: { label: "Cancelled", variant: "destructive" },
  paused: { label: "Paused", variant: "warning" },
  trial: { label: "Trial", variant: "secondary" },
  expired: { label: "Expired", variant: "outline" },
};

export function StatusBadge({ status }: { status: Status }) {
  const { label, variant } = CONFIG[status] ?? { label: status, variant: "outline" };
  return <Badge variant={variant}>{label}</Badge>;
}
