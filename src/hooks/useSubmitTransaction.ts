import { useState, useContext } from 'react';
import { useWalletState } from './useWalletState';
import { StellarWalletContext } from '../provider/context';
import { StellarWalletError } from '../errors/StellarWalletError';
import { submitTransaction, HorizonSubmitResult } from '../stellar/horizon';

/**
 * Hook to submit a signed transaction envelope to the Horizon network.
 * 
 * @example
 * const { submit, submitting, result, error } = useSubmitTransaction();
 * const response = await submit(signedXdr);
 */
export function useSubmitTransaction() {
  const { network } = useWalletState();
  const context = useContext(StellarWalletContext);

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<HorizonSubmitResult | null>(null);
  const [error, setError] = useState<StellarWalletError | null>(null);

  const submit = async (signedXdr: string): Promise<HorizonSubmitResult> => {
    setSubmitting(true);
    setError(null);
    setResult(null);

    // TODO: Extract tx hash from signedXdr for tracking and event dispatching.
    const txHash = 'tx_hash_placeholder';

    try {
      const submitResult = await submitTransaction(signedXdr, network);

      setResult(submitResult);

      if (context) {
        context.emit('tx:submitted', {
          txHash: submitResult.hash,
          ledger: submitResult.ledger
        });
      }

      return submitResult;
    } catch (err: any) {
      // TODO: Map Horizon submission codes (e.g., H001, H002, H003)
      const finalError = err instanceof StellarWalletError
        ? err
        : new StellarWalletError('H001', 'Horizon submission failed.', err);

      setError(finalError);

      if (context) {
        context.emit('tx:failed', {
          txHash,
          resultCodes: err.resultCodes || []
        });
      }

      throw finalError;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    /**
     * Action to execute submission of the signed XDR envelope.
     */
    submit,
    /**
     * True during submission execution.
     */
    submitting,
    /**
     * Success result returned on ledger confirmation.
     */
    result,
    /**
     * Submission failure errors.
     */
    error,
  };
}
