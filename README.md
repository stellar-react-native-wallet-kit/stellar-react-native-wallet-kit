# stellar-react-native-wallet-kit

React Native SDK for connecting Stellar wallets through WalletConnect v2 and interacting with Stellar and Soroban applications from mobile devices.

## Overview

stellar-react-native-wallet-kit provides a developer-friendly abstraction over WalletConnect v2, Freighter Mobile, Horizon, and Soroban RPC.

The goal is to make building Stellar mobile applications as simple as building Ethereum applications with wagmi.

Developers can:

* Connect wallets
* Sign Stellar transactions
* Invoke Soroban smart contracts
* Read account state
* Subscribe to wallet events
* Submit transactions
* Build mobile-first Stellar applications

without manually handling WalletConnect session management, XDR serialization, or Soroban transaction flows.

---

## Why This Exists

Building Stellar applications on mobile currently requires:

* WalletConnect session setup
* Deep-link handling
* Transaction serialization
* XDR management
* Soroban simulation logic
* Signing workflows
* Horizon integration

This SDK removes that complexity.

---

## Features

### Wallet Management

* WalletConnect v2 integration
* Freighter Mobile support
* Session persistence
* Auto-reconnect
* Network validation

### Transaction Support

* XLM payments
* Asset transfers
* Transaction signing
* Transaction submission
* Fee bump support

### Soroban Support

* Contract invocation
* Transaction simulation
* Auth entry signing
* Contract result decoding

### Developer Experience

* React Hooks API
* TypeScript support
* Mock wallet provider
* Event system
* Comprehensive testing

---

## Installation

```bash
npm install @stellar/react-native-wallet-kit
```

---

## Quick Start

```tsx
import '@walletconnect/react-native-compat';

import {
  StellarWalletProvider
} from '@stellar/react-native-wallet-kit';

export default function App() {
  return (
    <StellarWalletProvider
      walletConnectProjectId="YOUR_PROJECT_ID"
      network="testnet"
    >
      <AppRoutes />
    </StellarWalletProvider>
  );
}
```

---

## Architecture

React App
↓
React Hooks
↓
SDK Core
↓
WalletConnect v2
↓
Freighter Mobile
↓
Stellar Network

---

## Project Goals

* Simplify Stellar mobile development
* Improve developer onboarding
* Increase Soroban adoption
* Create a robust mobile ecosystem
* Encourage open-source contribution

---

## Roadmap

### Near Term

* Enhanced testing
* More hooks
* Better error reporting
* Additional examples

### Long Term

* Multi-wallet support
* Ledger support
* Transaction history APIs
* Event subscriptions
* Expo compatibility improvements

---

## Documentation

See:

* docs/ARCHITECTURE.md
* docs/CONTRIBUTING.md
* docs/SECURITY.md
* docs/ROADMAP.md

---

## Contributing

Contributions are welcome.

Please read docs/CONTRIBUTING.md before opening a pull request.

---

## License

MIT
