import type { Metadata } from "next";
import { Syne, Manrope } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

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
  title: "Substrata — Recurring payments on Stellar",
  description: "Stripe for recurring global payments — powered by Stellar Soroban",
  keywords: ["stellar", "soroban", "subscription", "billing", "crypto", "payments", "substrata"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${syne.variable} ${manrope.variable} font-body`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
