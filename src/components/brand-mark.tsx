import Link from "next/link";
import { cn } from "@/lib/utils";

export function BrandMark({
  className,
  href = "/",
  light = false,
}: {
  className?: string;
  href?: string;
  light?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2.5 font-display text-xl font-semibold tracking-tight sm:text-2xl",
        light ? "text-white" : "text-foreground",
        className
      )}
    >
      <span
        className={cn(
          "relative flex h-8 w-8 items-center justify-center rounded-md",
          light ? "bg-white/15 ring-1 ring-white/25" : "bg-primary text-primary-foreground"
        )}
        aria-hidden
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="opacity-95">
          <path
            d="M3 4.5h7.5a2.5 2.5 0 0 1 0 5H6.5a1.5 1.5 0 0 0 0 3H13"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            className="animate-draw"
          />
        </svg>
      </span>
      <span className="transition-opacity group-hover:opacity-90">Sorobill</span>
    </Link>
  );
}
