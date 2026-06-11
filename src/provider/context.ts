import { createContext } from 'react';
import { WalletConnectManager } from '../session/WalletConnectManager';

/**
 * Valid connection status types.
 */
export type WalletConnectionStatus = 'disconnected' | 'connecting' | 'connected';

/**
 * Event names emitted by the SDK.
 */
export type SDKEvent =
  | 'wallet:connected'
  | 'wallet:disconnected'
  | 'tx:sign_requested'
  | 'tx:sign_approved'
  | 'tx:sign_rejected'
  | 'tx:submitted'
  | 'tx:failed'
  | 'contract:invoked';

/**
 * Context type representing the wallet state and action functions.
 */
export interface StellarWalletContextType {
  /**
   * Current connection status.
   */
  status: WalletConnectionStatus;
  /**
   * The connected G... address of the user's public key (null if disconnected).
   */
  publicKey: string | null;
  /**
   * The active Stellar network configuration ('testnet' or 'mainnet').
   */
  network: 'testnet' | 'mainnet';
  /**
   * Opens the WalletConnect modal / deep link pairing to establish a session.
   */
  connect: () => Promise<void>;
  /**
   * Ends the current WalletConnect session and clears local state.
   */
  disconnect: () => Promise<void>;
  /**
   * Internal reference to the WalletConnectManager instance.
   */
  manager: WalletConnectManager | null;
  /**
   * Subscribes to SDK events.
   * 
   * @param event The target event name.
   * @param callback Payload handler.
   * @returns Unsubscribe function.
   */
  on: (event: SDKEvent, callback: (payload: any) => void) => () => void;
  /**
   * Dispatches events to subscribers.
   */
  emit: (event: SDKEvent, payload: any) => void;
}

/**
 * The React Context instance.
 */
export const StellarWalletContext = createContext<StellarWalletContextType | null>(null);
