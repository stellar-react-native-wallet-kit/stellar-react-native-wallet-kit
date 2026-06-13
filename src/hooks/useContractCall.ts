import { useState, useContext } from 'react';
import { useWalletState } from './useWalletState';
import { useSignTransaction } from './useSignTransaction';
import { useSubmitTransaction } from './useSubmitTransaction';
import { StellarWalletContext } from '../provider/context';
import { StellarWalletError } from '../errors/StellarWalletError';
import { simulateContractCall } from '../stellar/simulate';
import { decodeContractResult } from '../stellar/decodeContractResult';
import { xdr } from '@stellar/stellar-sdk';

/**
 * Parameters for invoking a contract method.
 */
export interface InvokeParams {
  /**
   * The contract method/function name.
   */
  method: string;
  /**
   * Raw XDR-encoded ScVal parameters.
   */
  args: xdr.ScVal[];
  /**
   * Optional base fee override.
   */
  fee?: number;
  /**
   * If true, runs simulation only. Does not sign or submit transaction.
   */
  simulate?: boolean;
}

/**
 * High-level React hook for invoking methods on Soroban smart contracts.
 * Coordinates simulation, fee adjustment, signing request, and Horizon submission.
 * 
 * @param contractId The C... target smart contract address.
 */
export function useContractCall(contractId: string) {
  const { publicKey, network } = useWalletState();
  const { sign } = useSignTransaction();
  const { submit } = useSubmitTransaction();

  const context = useContext(StellarWalletContext);

  const [invoking, setInvoking] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<StellarWalletError | null>(null);

  const invoke = async (params: InvokeParams): Promise<any> => {
    if (!publicKey) {
      throw new StellarWalletError('W001');
    }

    setInvoking(true);
    setError(null);
    setResult(null);

    try {
      // Step 1: Run Simulation (vias simulateContractCall)
      const simResult = await simulateContractCall({
        contractId,
        method: params.method,
        args: params.args,
        source: publicKey,
        network,
      });

      if (!simResult.success) {
        throw new StellarWalletError('S001', 'Soroban simulation failed. Transaction was not sent to Freighter.');
      }

      // Step 2: If dry-run (simulate: true), return decoded result immediately
      if (params.simulate) {
        const decodedResult = simResult.result ? decodeContractResult(simResult.result) : null;
        setResult(decodedResult);
        return decodedResult;
      }

      if (!simResult.transaction) {
        throw new StellarWalletError('S001', 'Simulation completed but no transaction envelope was returned.');
      }

      // Step 3: Prompt user to sign the transaction via Freighter Mobile
      const signedXdr = await sign(simResult.transaction);

      // Step 4: Submit signed transaction to Horizon
      await submit(signedXdr);

      // Step 5: Extract return value from transaction metadata and decode it
      // TODO: Extract result ScVal from Horizon submitResult (e.g. from txMeta)
      const mockResultScVal = simResult.result || xdr.ScVal.scvVoid();
      const decodedVal = decodeContractResult(mockResultScVal);

      setResult(decodedVal);

      if (context) {
        context.emit('contract:invoked', {
          contractId,
          method: params.method,
          result: decodedVal,
        });
      }

      return decodedVal;
    } catch (err: any) {
      const finalError = err instanceof StellarWalletError
        ? err
        : new StellarWalletError('S001', 'Soroban contract invocation failed.', err);

      setError(finalError);
      throw finalError;
    } finally {
      setInvoking(false);
    }
  };

  return {
    /**
     * Executes the Soroban invocation lifecycle (simulate -> sign -> submit -> decode).
     */
    invoke,
    /**
     * True during the execution lifecycle.
     */
    invoking,
    /**
     * Decoded return value of the contract call.
     */
    result,
    /**
     * Active error, if invocation failed.
     */
    error,
  };
}
