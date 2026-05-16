# Changelog

All notable changes to Substrata will be documented here.

This project adheres to [Semantic Versioning](https://semver.org/) and [Conventional Commits](https://www.conventionalcommits.org/).

---

## [Unreleased]

### Added
- Initial scaffold of the Substrata frontend
- Merchant dashboard (overview, plans, subscribers, analytics)
- User subscription management (list, cancel, billing history)
- Freighter wallet integration
- Multi-currency support (USDC, EURC, XLM)
- In-app notification system
- Webhook simulator UI
- Merchant onboarding wizard (4-step flow)
- Dark mode support
- Mock data layer for development without contracts
- Full TypeScript types for all domain entities
- React Query data hooks with loading/error states
- Zustand stores for wallet, notifications, and onboarding state

---

## Format

Each release entry follows this structure:

```markdown
## [x.y.z] - YYYY-MM-DD

### Added
- New features

### Changed
- Changes to existing functionality

### Deprecated
- Features that will be removed in a future release

### Removed
- Features removed in this release

### Fixed
- Bug fixes

### Security
- Security patches
```
