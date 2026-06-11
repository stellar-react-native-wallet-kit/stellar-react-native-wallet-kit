# Contributing Guidelines

Thank you for choosing to contribute to `stellar-react-native-wallet-kit`!

## Code Quality Standards

We require strict type safety, modular structures, and comprehensive test coverage. Before submitting a pull request, ensure all validations pass:

### Linting
Review code style using ESLint:
```bash
yarn lint
```

### Type Checking
Ensure TypeScript builds compile cleanly without emitting errors:
```bash
yarn typecheck
```

### Unit Tests
Verify all hooks, helpers, and mocks pass the test suites:
```bash
yarn test
```

## Pull Request Submission Checklist

When opening a Pull Request:
1. Include detailed descriptions of changes.
2. Link any relevant GitHub issues.
3. Ensure unit tests are added or updated to cover the modifications.
4. Verify tests and lint checks pass in CI.

## Directory Layout Structure

- `/src`: Package source code.
  - `/provider`: Context provider.
  - `/hooks`: React Hooks.
  - `/session`: WalletConnect connection and AppState reconnect logic.
  - `/stellar`: SDK interaction layers for Horizon and Soroban RPC.
  - `/mock`: Mock providers for client-side testing.
  - `/__tests__`: Hook and utility tests.
- `/docs`: Markdown specification papers.
