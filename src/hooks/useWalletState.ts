import { useContext } from 'react';
import { StellarWalletContext } from '../provider/context';
import { StellarWalletError } from '../errors/StellarWalletError';

/**
 * Accesses current wallet connection state and control actions.
 * Throws a WalletNotConnected (W001) error if called outside StellarWalletProvider.
 * 
 * @example
 * const { status, publicKey, network, connect, disconnect } = useWalletState();
 */
export function useWalletState() {
  const context = useContext(StellarWalletContext);
  
  if (!context) {
    throw new StellarWalletError('W001', 'useWalletState must be used within a StellarWalletProvider');
  }

  const { status, publicKey, network, connect, disconnect } = context;

  return {
    /**
     * Connection status: 'disconnected' | 'connecting' | 'connected'
     */
    status,
    /**
     * Public G... address of the connected account.
     */
    publicKey,
    /**
     * Currently active Stellar network.
     */
    network,
    /**
     * Action to initialize pairing session.
     */
    connect,
    /**
     * Action to close pairing session and purge state.
     */
    disconnect,
  };
}
