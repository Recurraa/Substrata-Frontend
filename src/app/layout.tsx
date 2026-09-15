import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";
import "@fontsource/syne/600.css";
import "@fontsource/syne/700.css";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/600.css";
import "./globals.css";
import { Providers } from "./providers";
import { SkipLink } from "@/components/skip-link";

export const metadata: Metadata = {
  title: "Sorobill — Recurring payments on Stellar",
  description: "Stripe for recurring global payments — powered by Stellar Soroban",
  keywords: ["stellar", "soroban", "subscription", "billing", "crypto", "payments", "sorobill"],
};

const fontVars = {
  ["--font-display"]: '"Syne", ui-sans-serif, system-ui, sans-serif',
  ["--font-body"]: '"Manrope", ui-sans-serif, system-ui, sans-serif',
} as CSSProperties;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-body antialiased" style={fontVars}>
        <SkipLink />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
