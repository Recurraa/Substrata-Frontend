# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| `main` branch | ✅ |
| Older releases | ❌ |

---

## Reporting a Vulnerability

**Please do not open a public GitHub issue for security vulnerabilities.**

Email **security@substrata.dev** with:

- A description of the vulnerability
- Steps to reproduce
- Potential impact
- Any suggested mitigations

You will receive an acknowledgement within **48 hours** and a resolution timeline within **7 days**.

We follow [responsible disclosure](https://en.wikipedia.org/wiki/Responsible_disclosure) — we ask that you give us reasonable time to patch before public disclosure.

---

## Security Model

### No private keys

Substrata never handles, stores, or transmits private keys. All transaction signing happens inside the user's Freighter wallet extension. The app only receives the signed XDR.

### Wallet identity

A user's Stellar public key is their identity. There is no username/password system. Wallet connection is scoped to the browser session (Zustand + localStorage stores only the public key).

### Environment variables

All `NEXT_PUBLIC_*` variables are embedded at build time and visible in the browser bundle. **Never put secrets in `NEXT_PUBLIC_` variables.** The `NEXT_PUBLIC_WEBHOOK_SECRET` is used only for HMAC verification on the client side (webhook simulator) — it is not a server secret.

### Webhook verification

Webhook payloads from Substrata are signed with HMAC-SHA256. Receiving servers should verify the `X-Substrata-Signature` header:

```typescript
import { createHmac } from "crypto";

function verifyWebhook(payload: string, signature: string, secret: string): boolean {
  const expected = createHmac("sha256", secret).update(payload).digest("hex");
  return `sha256=${expected}` === signature;
}
```

### Content Security Policy

When deploying to production, configure a strict CSP header. At minimum:

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-eval';
  connect-src 'self' https://soroban-testnet.stellar.org https://horizon-testnet.stellar.org;
  img-src 'self' data: https:;
```

### Dependency security

- Dependencies are pinned to exact versions in `package.json`.
- Run `npm audit` regularly and update vulnerable packages promptly.
- Dependabot is configured to open PRs for security updates.

---

## Known Limitations

- The app currently runs on **mock data** by default. Real contract integration requires audited Soroban contracts.
- The webhook simulator fires events client-side — it does not use a real server. Production webhook delivery should be handled server-side.
