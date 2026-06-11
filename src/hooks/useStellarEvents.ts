import { useContext } from 'react';
import { StellarWalletContext } from '../provider/context';
import { StellarWalletError } from '../errors/StellarWalletError';

/**
 * Accesses the SDK's event subscription channel.
 * Allows components to react to connection state updates, signature responses,
 * and transaction submission results.
 * 
 * @example
 * const { on } = useStellarEvents();
 * 
 * useEffect(() => {
 *   const unsubscribe = on('tx:submitted', ({ txHash, ledger }) => {
 *     console.log(`Transaction ${txHash} confirmed in ledger ${ledger}`);
 *   });
 *   return unsubscribe;
 * }, [on]);
 */
export function useStellarEvents() {
  const context = useContext(StellarWalletContext);

  if (!context) {
    throw new StellarWalletError('W001', 'useStellarEvents must be used within a StellarWalletProvider');
  }

  return {
    /**
     * Subscribe to SDK Events. Returns an unsubscribe callback.
     */
    on: context.on,
  };
}
