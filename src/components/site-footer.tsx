import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/80 px-6 py-8 text-sm text-teal-100/60">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p>
          <span className="font-display font-semibold text-teal-50">Sorobill</span>
          {" — "}Stripe for recurring global payments on Stellar.
        </p>
        <nav className="flex gap-4">
          <Link href="/dashboard" className="hover:text-white">
            Dashboard
          </Link>
          <Link href="/subscriptions" className="hover:text-white">
            Subscriptions
          </Link>
          <a
            href="https://github.com/Sorobill/Sorobill-App"
            className="hover:text-white"
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
