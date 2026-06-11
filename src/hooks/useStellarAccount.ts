import { useState, useEffect, useCallback, useRef } from 'react';
import { useWalletState } from './useWalletState';
import { pollAccountState, fetchAccountDetails, StellarAccountDetails } from '../stellar/horizon';

/**
 * Fetches and subscribes to on-chain account state and balances via Horizon.
 * 
 * @param address Optional target address. Defaults to the currently connected public key.
 * @param pollIntervalMs Optional custom polling interval (defaults to 10000ms).
 */
export function useStellarAccount(address?: string, pollIntervalMs = 10000) {
  const { publicKey: connectedAddress, network } = useWalletState();
  const targetAddress = address || connectedAddress;

  const [account, setAccount] = useState<StellarAccountDetails['rawAccount']>(null);
  const [balances, setBalances] = useState<StellarAccountDetails['balances']>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Keep references to prevent infinite hooks
  const targetAddressRef = useRef(targetAddress);
  targetAddressRef.current = targetAddress;

  const refetch = useCallback(async () => {
    if (!targetAddressRef.current) return;
    try {
      setLoading(true);
      setError(null);
      const details = await fetchAccountDetails(targetAddressRef.current, network);
      setAccount(details.rawAccount);
      setBalances(details.balances);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [network]);

  useEffect(() => {
    if (!targetAddress) {
      setAccount(null);
      setBalances([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    // Setup active polling subscription via utility
    const unsubscribe = pollAccountState(
      targetAddress,
      network,
      pollIntervalMs,
      (details) => {
        setAccount(details.rawAccount);
        setBalances(details.balances);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [targetAddress, network, pollIntervalMs]);

  return {
    /**
     * Raw account details record returned by Horizon.
     */
    account,
    /**
     * List of asset balances, including native XLM and trustlines.
     */
    balances,
    /**
     * True during initial loading or active background refetch.
     */
    loading,
    /**
     * Error, if any, encountered during the polling sequence.
     */
    error,
    /**
     * Trigger manual fetch update.
     */
    refetch,
  };
}
