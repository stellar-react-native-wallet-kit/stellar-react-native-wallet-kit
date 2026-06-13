import { useState, useContext } from 'react';
import { useWalletState } from './useWalletState';
import { StellarWalletContext } from '../provider/context';
import { StellarWalletError } from '../errors/StellarWalletError';

/**
 * Hook to request arbitrary message signing (SEP-53) via WalletConnect.
 * Useful for web3 login flows and identity confirmations.
 * 
 * @example
 * const { signMessage, signing, signature, error } = useSignMessage();
 * const sig = await signMessage('Sign this authentication request');
 */
export function useSignMessage() {
  const { status } = useWalletState();
  const context = useContext(StellarWalletContext);

  const [signing, setSigning] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);
  const [error, setError] = useState<StellarWalletError | null>(null);

  const signMessage = async (message: string): Promise<string> => {
    if (!context || !context.manager) {
      throw new StellarWalletError('W001');
    }
    if (status !== 'connected') {
      throw new StellarWalletError('W001', 'Cannot sign message: Wallet is not connected.');
    }

    setSigning(true);
    setError(null);
    setSignature(null);

    try {
      // Trigger stellar_signMessage call via WalletConnectManager
      const sigHex = await context.manager.signMessage(message);

      setSignature(sigHex);
      return sigHex;
    } catch (err: any) {
      const finalError = err instanceof StellarWalletError
        ? err
        : new StellarWalletError('W002', 'User rejected or failed to sign the message.', err);

      setError(finalError);
      throw finalError;
    } finally {
      setSigning(false);
    }
  };

  return {
    /**
     * Action to invoke message signature from the connected wallet.
     */
    signMessage,
    /**
     * True during signature request execution.
     */
    signing,
    /**
     * Base64/Hex signature returned from the wallet on success.
     */
    signature,
    /**
     * Rejection/execution error details.
     */
    error,
  };
}
