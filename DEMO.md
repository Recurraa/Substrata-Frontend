# Sorobill Frontend Demo

## Quick start (mock mode)

```bash
cp .env.example .env.local
# NEXT_PUBLIC_USE_MOCK=true
npm install
npm run dev
```

Open http://localhost:3000 — landing page, then Get started → onboarding.

## Live mode (backend + contract)

1. Run Sorobill-Backend on port 3001 (`docker compose up -d` + `npm run dev`).
2. Deploy Sorobill-Contract and set `NEXT_PUBLIC_SUBSCRIPTION_CONTRACT_ID`.
3. Set in `.env.local`:

```
NEXT_PUBLIC_USE_MOCK=false
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_SUBSCRIPTION_CONTRACT_ID=<from DEPLOYMENTS.md>
```

4. Install [Freighter](https://freighter.app), switch to Testnet, fund the account.
5. Merchant: `/onboarding` → create plan.
6. Subscriber: `/subscriptions` → approve + subscribe.
7. Backend scheduler triggers `execute_billing`.

## Sister repos

- [Sorobill-Contract](https://github.com/Sorobill/Sorobill-Contract)
- [Sorobill-Backend](https://github.com/Sorobill/Sorobill-Backend)
