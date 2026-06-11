// Root Provider & Context exports
export {
  StellarWalletProvider,
  type StellarWalletProviderProps,
} from './provider/StellarWalletProvider';
export {
  StellarWalletContext,
  type StellarWalletContextType,
  type WalletConnectionStatus,
  type SDKEvent,
} from './provider/context';

// React Hooks exports
export { useWalletState } from './hooks/useWalletState';
export { useStellarAccount } from './hooks/useStellarAccount';
export { useSignTransaction } from './hooks/useSignTransaction';
export { useSubmitTransaction } from './hooks/useSubmitTransaction';
export { useContractCall, type InvokeParams } from './hooks/useContractCall';
export { useSignMessage } from './hooks/useSignMessage';
export { useStellarEvents } from './hooks/useStellarEvents';

// Session Transport & Manager exports
export {
  WalletConnectManager,
  type WalletConnectManagerConfig,
} from './session/WalletConnectManager';
export { FreighterDeepLink } from './session/deeplink';
export { SessionReconnectHandler } from './session/reconnect';

// Stellar / Soroban Helper exports
export {
  buildPaymentTransaction,
  type BuildPaymentParams,
} from './stellar/buildPaymentTransaction';
export {
  invokeContract,
  type InvokeContractParams,
} from './stellar/invokeContract';
export { decodeContractResult } from './stellar/decodeContractResult';
export {
  simulateContractCall,
  type SimulateParams,
  type SimulationResult,
} from './stellar/simulate';
export {
  submitTransaction,
  fetchAccountDetails,
  pollAccountState,
  type HorizonSubmitResult,
  type StellarAccountDetails,
} from './stellar/horizon';

// Custom Error definitions exports
export {
  StellarWalletError,
  ErrorMessageMap,
  type StellarWalletErrorCode,
} from './errors/StellarWalletError';
