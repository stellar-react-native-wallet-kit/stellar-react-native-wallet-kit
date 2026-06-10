## Project Context

stellar-react-native-wallet-kit is a React Native SDK for Stellar and Soroban mobile development.

The SDK abstracts WalletConnect v2, Freighter Mobile integration, Horizon APIs, and Soroban RPC interactions.

## Project Philosophy

### Security First

Private keys must never leave wallet software.

### Developer Experience

The SDK should feel intuitive to React Native developers.

### Type Safety

All public APIs should provide complete TypeScript support.

### Reliability

Wallet sessions and transaction signing flows must be resilient.

## Architecture Rules

Maintain clear separation between:

* React hooks
* Session management
* Stellar utilities
* Wallet transport layer

Avoid mixing concerns.

## Pull Requests

Every pull request should:

* Solve a clearly defined problem
* Include tests
* Include documentation updates
* Pass CI

## Testing Requirements

Required before merge:

```bash
yarn lint
yarn typecheck
yarn test
```

## Coding Standards

* Strict TypeScript
* Small focused modules
* Minimal dependencies
* Comprehensive error handling

## Future Priorities

1. Multi-wallet support
2. Better developer tooling
3. Improved testing infrastructure
4. Advanced Soroban features
5. Ecosystem integrations
