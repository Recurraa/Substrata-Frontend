# Demo script (reviewers)

Use this after contract redeploy + backend + app are running.

## Prerequisites

- Freighter on **Testnet**, funded
- `Sorobill-Backend`: `docker compose up -d`, `.env` with `SUBSCRIPTION_CONTRACT_ID` from DEPLOYMENTS.md, treasury = `sorobill-admin` secret
- `Sorobill-App`: `.env.local` with `NEXT_PUBLIC_USE_MOCK=false` and matching contract ID

## Walkthrough

1. Open app home — brand **Sorobill** is the hero.
2. `/onboarding` — connect wallet, create business profile.
3. Dashboard → Plans — create a plan (API + optional on-chain).
4. Copy share link → open `/pay/{planId}` as a second wallet.
5. Approve token allowance + subscribe.
6. Backend: `POST /api/v1/billing/run-inline` with the subscription id (after advancing period / using short custom interval on test).
7. Confirm payment in billing history + Stellar Expert link.

## Pass criteria

- No mock data in the happy path
- On-chain tx hash visible
- Sister repos linked from README
