# Security Policy

## Threat Model & Principles

### Private Key Custody
The SDK never gains access to, stores, or handles the user's private keys or seed phrases. All transaction and message signing is routed via WalletConnect JSON-RPC requests (`stellar_signXDR` and `stellar_signMessage`) to Freighter Mobile. The wallet itself manages key isolation, validation, and user approvals. The SDK only receives signed XDR envelopes or cryptographic signatures.

### WalletConnect Session Storage
By default, WalletConnect sessions are persisted in React Native's `AsyncStorage`. For highly secure applications, we recommend providing a custom secure storage adapter backed by Keychain (iOS) or Keystore (Android) (e.g., `react-native-keychain` or `expo-secure-store`).

### Network Mismatch Validation (W004)
To prevent cross-network attacks (e.g., accidentally signing and broadcasting a mainnet transaction on testnet), the SDK checks the active network parameter against the connection passphrase. If a mismatch is detected, the SDK throws `W004: NetworkMismatch` and intercepts the request before it is transmitted.

### Soroban Dry-Run Simulation (S001)
Before requesting a signature for Soroban smart contract invocations, the SDK automatically invokes a simulation pass via the Soroban RPC. If the simulation reports errors (such as execution revert, footprint failures, or out-of-gas conditions), the SDK aborts, surfacing the `S001: SimulationFailed` error without prompting the user.

## Vulnerability Disclosure
If you identify a security vulnerability within this repository, please do not open a public issue. Instead, report it through the security team contact info provided in our organization profiles.
