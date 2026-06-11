import { useState, useContext } from 'react';
import { useWalletState } from './useWalletState';
import { StellarWalletContext } from '../provider/context';
import { StellarWalletError } from '../errors/StellarWalletError';
import { Transaction, FeeBumpTransaction } from '@stellar/stellar-sdk';

/**
 * Hook to request transaction signing from Freighter Mobile via WalletConnect.
 * 
 * @example
 * const { sign, signing, error } = useSignTransaction();
 * const signedXdr = await sign(tx);
 */
export function useSignTransaction() {
  const { status, network } = useWalletState();
  const context = useContext(StellarWalletContext);
  
  const [signing, setSigning] = useState(false);
  const [error, setError] = useState<StellarWalletError | null>(null);

  const sign = async (tx: Transaction | FeeBumpTransaction): Promise<string> => {
    if (!context || !context.manager) {
      throw new StellarWalletError('W001');
    }
    if (status !== 'connected') {
      throw new StellarWalletError('W001', 'Cannot sign: Wallet is not connected.');
    }

    // TODO: Verify if transaction network matches active SDK network (W004 NetworkMismatch)
    // const txNetwork = tx.networkPassphrase;
    // const expectedNetwork = network === 'testnet' ? Networks.TESTNET : Networks.PUBLIC;
    // if (txNetwork !== expectedNetwork) {
    //   const err = new StellarWalletError('W004');
    //   setError(err);
    //   throw err;
    // }

    setSigning(true);
    setError(null);

    const txHash = tx.hash().toString('hex');
    context.emit('tx:sign_requested', { txHash });

    try {
      // Convert Transaction instance to XDR string
      const xdrString = tx.toEnvelope().toXDR('base64');
      
      // Request signature from Freighter Mobile through WalletConnect manager
      const signedXdr = await context.manager.signTransaction(xdrString);
      
      context.emit('tx:sign_approved', { txHash, signedXdr });
      return signedXdr;
    } catch (err: any) {
      // TODO: Parse WalletConnect / Freighter exception into W002 (UserRejected) or standard errors
      let finalError = err instanceof StellarWalletError 
        ? err 
        : new StellarWalletError('W002', 'User rejected signature request.', err);

      setError(finalError);
      context.emit('tx:sign_rejected', { txHash });
      throw finalError;
    } finally {
      setSigning(false);
    }
  };

  return {
    /**
     * Triggers wallet signing. Accepts Transaction or FeeBumpTransaction.
     */
    sign,
    /**
     * True while waiting for wallet confirmation.
     */
    signing,
    /**
     * Active error, if signature request failed or was rejected.
     */
    error,
  };
}
