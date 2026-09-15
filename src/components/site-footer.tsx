import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";

export function SiteFooter({ tone = "light" }: { tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  return (
    <footer
      className={
        dark
          ? "border-t border-white/10 bg-[#0a1218] px-6 py-10 text-sm text-white/45"
          : "border-t border-border bg-background/80 px-6 py-10 text-sm text-muted-foreground"
      }
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          {dark ? (
            <BrandMark light className="text-lg sm:text-xl" />
          ) : (
            <BrandMark className="text-lg sm:text-xl" />
          )}
          <p className="max-w-sm text-[13px] leading-relaxed">
            Recurring global payments on Stellar Soroban. Open source. MIT licensed.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-2 text-[13px]">
          <Link href="/plans" className={dark ? "hover:text-white" : "hover:text-foreground"}>
            Plans
          </Link>
          <Link href="/dashboard" className={dark ? "hover:text-white" : "hover:text-foreground"}>
            Dashboard
          </Link>
          <Link href="/webhooks" className={dark ? "hover:text-white" : "hover:text-foreground"}>
            Webhooks
          </Link>
          <a
            href="https://github.com/Sorobill/Sorobill-App"
            className={dark ? "hover:text-white" : "hover:text-foreground"}
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
}
