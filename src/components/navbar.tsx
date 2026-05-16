"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CreditCard, Bell, Webhook, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { WalletButton } from "@/components/wallet-button";
import { NotificationBell } from "@/components/notification-bell";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/subscriptions", label: "Subscriptions", icon: CreditCard },
  { href: "/webhooks", label: "Webhooks", icon: Webhook },
];

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-primary">
          <span className="text-xl">⬡</span>
          <span>Substrata</span>
        </Link>

        {/* Nav links */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent",
                pathname.startsWith(href) ? "bg-accent text-accent-foreground" : "text-muted-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
          <NotificationBell />
          <WalletButton />
        </div>
      </div>
    </header>
  );
}
