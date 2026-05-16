import { ExternalLink } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { formatAmount, formatDate, shortenAddress } from "@/lib/utils";
import { getExplorerUrl } from "@/lib/stellar";
import type { Transaction } from "@/types";

interface BillingTableProps {
  transactions: Transaction[];
}

export function BillingTable({ transactions }: BillingTableProps) {
  if (transactions.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-muted-foreground">No transactions yet.</div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="px-4 py-3 text-left font-medium">Date</th>
            <th className="px-4 py-3 text-left font-medium">Amount</th>
            <th className="px-4 py-3 text-left font-medium">Tx Hash</th>
            <th className="px-4 py-3 text-left font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id} className="border-b last:border-0 hover:bg-muted/30">
              <td className="px-4 py-3 text-muted-foreground">{formatDate(tx.createdAt)}</td>
              <td className="px-4 py-3 font-medium">{formatAmount(tx.amount, tx.asset)}</td>
              <td className="px-4 py-3">
                <a
                  href={getExplorerUrl(tx.txHash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 font-mono text-primary hover:underline"
                >
                  {shortenAddress(tx.txHash, 6)}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={tx.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
