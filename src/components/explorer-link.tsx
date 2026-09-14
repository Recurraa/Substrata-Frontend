import { ExternalLink } from "lucide-react";
import { stellarExpertTxUrl, stellarExpertAccountUrl } from "@/lib/explorer";

export function TxExplorerLink({ hash }: { hash: string }) {
  return (
    <a
      href={stellarExpertTxUrl(hash)}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 text-teal-600 hover:underline dark:text-teal-300"
    >
      {hash.slice(0, 8)}…
      <ExternalLink className="h-3 w-3" />
    </a>
  );
}

export function AccountExplorerLink({ address }: { address: string }) {
  return (
    <a
      href={stellarExpertAccountUrl(address)}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 font-mono text-sm text-teal-600 hover:underline dark:text-teal-300"
    >
      {address.slice(0, 4)}…{address.slice(-4)}
      <ExternalLink className="h-3 w-3" />
    </a>
  );
}
