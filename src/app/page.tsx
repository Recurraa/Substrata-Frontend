import Link from "next/link";
import { ArrowRight, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/site-footer";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      <div className="hero-atmosphere absolute inset-0" aria-hidden />
      <div className="hero-grid absolute inset-0" aria-hidden />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-8 sm:px-8">
        <header className="flex items-center justify-between animate-fade-up">
          <Link href="/" className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            Sorobill
          </Link>
          <Link
            href="/dashboard"
            className="text-sm text-white/70 transition-colors hover:text-white"
          >
            Dashboard
          </Link>
        </header>

        <section className="flex flex-1 flex-col items-start justify-center gap-8 py-16 sm:py-24">
          <div className="relative animate-float-soft">
            <span
              className="absolute -inset-4 rounded-full border border-teal-300/30 animate-pulse-ring"
              aria-hidden
            />
            <p className="font-display text-5xl font-bold tracking-tight sm:text-7xl md:text-8xl">
              Sorobill
            </p>
          </div>

          <h1 className="max-w-2xl font-display text-2xl font-semibold leading-tight text-teal-50/95 animate-fade-up-delay sm:text-3xl md:text-4xl">
            Recurring global payments that settle on Stellar.
          </h1>

          <p className="max-w-lg text-base leading-relaxed text-teal-100/70 animate-fade-up-delay sm:text-lg">
            Create on-chain subscription plans and collect USDC, EURC, or XLM without banks,
            borders, or intermediaries.
          </p>

          <div className="flex flex-col gap-3 animate-fade-up-delay-2 sm:flex-row sm:items-center">
            <Button asChild size="lg" className="bg-teal-400 text-slate-950 hover:bg-teal-300">
              <Link href="/onboarding">
                Get started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/25 bg-white/5 text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/subscriptions">
                <Wallet className="h-4 w-4" />
                Connect wallet
              </Link>
            </Button>
          </div>
        </section>
      </div>
      <div className="relative z-10">
        <SiteFooter />
      </div>
    </main>
  );
}
