import type { Metadata } from "next";
import { Syne, Manrope } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { SkipLink } from "@/components/skip-link";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sorobill — Recurring payments on Stellar",
  description: "Stripe for recurring global payments — powered by Stellar Soroban",
  keywords: ["stellar", "soroban", "subscription", "billing", "crypto", "payments", "sorobill"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${syne.variable} ${manrope.variable} font-body`}>
        <SkipLink />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
