# Security Policy

## Supported versions

| Version | Supported |
|---------|-----------|
| 0.2.x   | Yes       |
| < 0.2   | No        |

## Reporting a vulnerability

Email the maintainers privately. Do not open a public issue for security reports.

Include:
- Affected component (frontend / backend / contract)
- Reproduction steps
- Impact assessment

## Notes

- Production deployments must set `NEXT_PUBLIC_USE_MOCK=false`
- Never commit Freighter secrets or treasury keys
- Verify contract IDs against [DEPLOYMENTS.md](https://github.com/Sorobill/Sorobill-Contract/blob/main/DEPLOYMENTS.md)
