# Architecture

This document describes the technical design of the Substrata frontend.

---

## Overview

Substrata is a **pure frontend** application. It does not run a backend server. All state is either:

1. Read from Stellar Soroban smart contracts via the Soroban RPC
2. Submitted as signed transactions through the user's Freighter wallet
3. Stored locally in Zustand (wallet session, notifications, onboarding progress)

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                              │
│                                                             │
│  ┌──────────────┐   ┌──────────────┐   ┌────────────────┐  │
│  │  Next.js App │   │ Zustand Store│   │ React Query    │  │
│  │  (App Router)│◄──│ (wallet,     │   │ (server state) │  │
│  │              │   │  notifs,     │   │                │  │
│  └──────┬───────┘   │  onboarding) │   └───────┬────────┘  │
│         │           └──────────────┘           │           │
│         │                                      │           │
│  ┌──────▼───────────────────────────────────── ▼────────┐  │
│  │                  API Layer (src/lib/api.ts)           │  │
│  │  Mock data in dev · Soroban RPC calls in production   │  │
│  └──────────────────────────┬───────────────────────────┘  │
│                             │                               │
└─────────────────────────────┼───────────────────────────────┘
                              │
              ┌───────────────▼───────────────┐
              │       Stellar Network          │
              │                               │
              │  ┌─────────────────────────┐  │
              │  │  Soroban RPC            │  │
              │  │  (contract reads)       │  │
              │  └─────────────────────────┘  │
              │  ┌─────────────────────────┐  │
              │  │  Horizon API            │  │
              │  │  (tx history, accounts) │  │
              │  └─────────────────────────┘  │
              └───────────────────────────────┘
```

---

## Directory Structure

```
src/
├── app/          Next.js App Router — pages and layouts
├── components/   Reusable UI components
│   └── ui/       shadcn/ui primitives (Button, Card, Dialog…)
├── hooks/        React hooks (wallet, data fetching)
├── stores/       Zustand stores (client-only state)
├── lib/          Utilities, API layer, Stellar client
└── types/        Shared TypeScript types
```

---

## Data Flow

### Reading data

```
Page component
  → useQuery hook (use-substrata.ts)
    → API function (api.ts)
      → Mock data (dev) OR Soroban RPC call (prod)
        → Returns typed data
```

### Writing data (transactions)

```
User action (e.g. "Subscribe")
  → useMutation hook
    → API function builds Soroban transaction XDR
      → useFreighter.signTransaction(xdr)
        → Freighter extension prompts user
          → Signed XDR submitted to Soroban RPC
            → React Query cache invalidated
              → UI re-renders with new state
```

---

## Key Design Decisions

### API abstraction layer (`src/lib/api.ts`)

All data access goes through `src/lib/api.ts`. In development it returns mock data with simulated latency. To connect to real contracts, replace the function bodies — the hook signatures stay the same.

### Mock-first development

`src/lib/mock-data.ts` provides realistic seed data for every entity. This lets the UI be developed and tested without a deployed contract.

### Zustand for client state only

Zustand stores hold state that is:
- Not on-chain (wallet session, UI notifications, onboarding wizard progress)
- Needs to persist across page navigations (wallet address in `localStorage`)

Server/contract state is managed exclusively by React Query.

### shadcn/ui component strategy

UI primitives live in `src/components/ui/` and are copied directly (not installed as a package). This gives full control over styling and avoids version lock-in. Domain components (`PlanCard`, `BillingTable`, etc.) compose these primitives.

### Environment config (`src/lib/env.ts`)

All `NEXT_PUBLIC_*` variables are accessed through a single typed `env` object. This prevents scattered `process.env` calls and makes missing variables obvious at startup.

---

## Soroban Contract Integration

The app is designed to swap mock data for real contract calls with minimal changes.

### Expected contracts

| Contract | Purpose |
|----------|---------|
| `SubscriptionContract` | Create plans, subscribe, cancel |
| `BillingContract` | Execute recurring charges |
| `TokenContract` | USDC / EURC / custom token transfers |

### Integration pattern

```typescript
// Current (mock):
export async function fetchPlans(merchantId: string): Promise<Plan[]> {
  await delay();
  return MOCK_PLANS.filter(p => p.merchantId === merchantId);
}

// Production (Soroban):
export async function fetchPlans(merchantId: string): Promise<Plan[]> {
  const result = await sorobanServer.simulateTransaction(
    buildGetPlansTransaction(env.contracts.subscription, merchantId)
  );
  return decodePlansFromXdr(result);
}
```

---

## State Management

| State | Where | Why |
|-------|-------|-----|
| Wallet address / connection | Zustand + localStorage | Persists across refreshes |
| Subscription / plan data | React Query | Server state, needs cache + refetch |
| Notifications | Zustand | UI-only, ephemeral |
| Onboarding progress | Zustand + localStorage | Multi-step wizard, survives refresh |
| Theme (dark/light) | next-themes | CSS class on `<html>` |

---

## Authentication

There is no traditional auth. A user's **Stellar public key** is their identity. The wallet connection (Freighter) proves ownership of the key. Merchants are identified by the address that deployed/owns the subscription contract.

---

## Security Considerations

- No private keys are ever handled by the frontend
- All transactions are signed inside the Freighter extension
- Webhook payloads should be verified with HMAC-SHA256 using `NEXT_PUBLIC_WEBHOOK_SECRET`
- Contract IDs are read-only environment variables — never user-supplied

See [SECURITY.md](SECURITY.md) for the full security policy.
