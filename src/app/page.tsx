import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/brand-mark";
import { SiteFooter } from "@/components/site-footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* First viewport: one composition — brand + line + CTA + product visual */}
      <section className="relative min-h-[100svh] overflow-hidden text-white">
        <div className="hero-atmosphere absolute inset-0" aria-hidden />
        <div className="hero-grain absolute inset-0" aria-hidden />

        <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col px-6 py-7 sm:px-8">
          <header className="flex items-center justify-between animate-fade-up">
            <BrandMark light />
            <nav className="flex items-center gap-5 text-sm text-white/65">
              <Link href="/plans" className="transition-colors hover:text-white">
                Plans
              </Link>
              <Link href="/dashboard" className="transition-colors hover:text-white">
                Dashboard
              </Link>
            </nav>
          </header>

          <div className="grid flex-1 items-center gap-12 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-10">
            <div className="space-y-7">
              <p className="font-display text-5xl font-semibold tracking-tight sm:text-6xl md:text-7xl animate-fade-up">
                Sorobill
              </p>
              <h1 className="max-w-md font-display text-xl font-medium leading-snug text-white/90 animate-fade-up-delay sm:text-2xl">
                Recurring payments that settle on Stellar.
              </h1>
              <p className="max-w-md text-[15px] leading-relaxed text-white/55 animate-fade-up-delay">
                Merchants create on-chain plans. Subscribers approve once with Freighter.
                Billing runs on Soroban — USDC, EURC, or any SEP-41 asset.
              </p>
              <div className="flex flex-wrap gap-3 animate-fade-up-delay-2">
                <Button
                  asChild
                  size="lg"
                  className="bg-[#d8efe8] text-[#0a2a2e] hover:bg-white"
                >
                  <Link href="/onboarding">
                    Start as merchant
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
                >
                  <Link href="/plans">Browse plans</Link>
                </Button>
              </div>
            </div>

            {/* Product visual: checkout terminal — real visual anchor */}
            <div
              className="animate-rise rounded-xl border border-white/10 bg-[#0c1820]/80 p-5 shadow-2xl shadow-black/40 backdrop-blur-sm sm:p-6"
              aria-hidden
            >
              <div className="mb-5 flex items-center justify-between text-[11px] uppercase tracking-[0.14em] text-white/40">
                <span>Checkout</span>
                <span className="font-mono text-teal-200/70">testnet</span>
              </div>
              <p className="font-display text-2xl font-semibold text-white">Pro</p>
              <p className="mt-1 text-sm text-white/45">Billed monthly on Soroban</p>
              <div className="mt-6 flex items-baseline gap-1.5">
                <span className="font-display text-4xl font-semibold tabular-nums text-white">
                  29.99
                </span>
                <span className="text-sm text-white/50">USDC</span>
              </div>
              <div className="mt-8 space-y-2.5">
                <div className="h-10 rounded-md bg-white/10" />
                <div className="h-10 rounded-md bg-[#d8efe8] text-center text-sm font-medium leading-10 text-[#0a2a2e]">
                  Approve &amp; subscribe
                </div>
              </div>
              <p className="mt-4 font-mono text-[10px] text-white/30">
                Freighter · allowance · subscribe
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* One job: how it works */}
      <section className="mx-auto max-w-6xl px-6 py-20 sm:px-8 sm:py-28">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
          How it works
        </p>
        <h2 className="mt-3 max-w-lg text-3xl font-semibold text-ink sm:text-4xl">
          Three steps from plan to paid invoice.
        </h2>
        <ol className="mt-12 grid gap-10 sm:grid-cols-3 sm:gap-8">
          {[
            {
              n: "01",
              t: "Create a plan",
              d: "Set price, interval, and token. Optionally publish create_plan on-chain with Freighter.",
            },
            {
              n: "02",
              t: "Share checkout",
              d: "Send a /pay link. Subscribers connect Freighter and approve a SEP-41 allowance.",
            },
            {
              n: "03",
              t: "Bill on schedule",
              d: "Your backend calls execute_billing. Failures enter grace; webhooks notify your app.",
            },
          ].map((step) => (
            <li key={step.n} className="space-y-3 border-t border-border pt-5">
              <span className="font-mono text-xs text-sea">{step.n}</span>
              <h3 className="text-lg font-semibold">{step.t}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{step.d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* One job: trust / stack */}
      <section className="border-y border-border bg-sand/60">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 sm:px-8 md:grid-cols-2 md:items-center md:py-20">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Built on Stellar
            </p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
              Settlement you can verify on-chain.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              Sorobill is open-source protocol + API + UI. No custodial wallets. Payments move
              with standard token allowances on Soroban.
            </p>
          </div>
          <dl className="metric-strip">
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted-foreground">Protocol</dt>
              <dd className="mt-1 font-display text-lg font-semibold">Soroban contract</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted-foreground">Wallet</dt>
              <dd className="mt-1 font-display text-lg font-semibold">Freighter</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted-foreground">Assets</dt>
              <dd className="mt-1 font-display text-lg font-semibold">USDC · EURC · XLM</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted-foreground">License</dt>
              <dd className="mt-1 font-display text-lg font-semibold">MIT</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 text-center sm:px-8">
        <h2 className="text-3xl font-semibold sm:text-4xl">Open the merchant console</h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
          Connect Freighter on Testnet to explore plans, subscribers, and webhook delivery.
        </p>
        <Button asChild size="lg" className="mt-8">
          <Link href="/dashboard">
            Go to dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </section>

      <SiteFooter tone="dark" />
    </main>
  );
}
