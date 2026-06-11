import React, { useState, useMemo, useRef } from 'react';
import { StellarWalletContext, WalletConnectionStatus, SDKEvent, StellarWalletContextType } from '../provider/context';
import { xdr } from '@stellar/stellar-sdk';

/**
 * Props accepted by MockWalletProvider.
 */
export interface MockWalletProviderProps {
  /**
   * Simulated connected Stellar address (G...)
   */
  publicKey?: string;
  /**
   * Simulated target network (default: 'testnet')
   */
  network?: 'testnet' | 'mainnet';
  /**
   * Preset value returned by useSignTransaction's sign() call.
   * If an instance of Error is passed, it throws instead.
   */
  signResponse?: string | Error;
  /**
   * Preset value returned by useSubmitTransaction's submit() call.
   * If an instance of Error is passed, it throws instead.
   */
  submitResponse?: any | Error;
  /**
   * Preset value returned by useContractCall's invoke() call.
   * If an instance of Error is passed, it throws instead.
   */
  contractResponse?: xdr.ScVal | Error;
  /**
   * Default starting connection status (default: 'connected')
   */
  initialStatus?: WalletConnectionStatus;
  /**
   * App content
   */
  children: React.ReactNode;
}

export const MockWalletProvider: React.FC<MockWalletProviderProps> = ({
  publicKey = 'GABC...TESTKEY',
  network = 'testnet',
  signResponse = 'signed_xdr_placeholder',
  submitResponse = { hash: 'tx_hash_mock', ledger: 100, resultCode: 'tx_success', rawResponse: {} },
  contractResponse = xdr.ScVal.scvVoid(),
  initialStatus = 'connected',
  children,
}) => {
  const [status, setStatus] = useState<WalletConnectionStatus>(initialStatus);
  const [currentPublicKey, setCurrentPublicKey] = useState<string | null>(
    initialStatus === 'connected' ? publicKey : null
  );

  const listenersRef = useRef<Map<SDKEvent, Set<(payload: any) => void>>>(new Map());

  // Stub functions for events
  const on = (event: SDKEvent, callback: (payload: any) => void): (() => void) => {
    if (!listenersRef.current.has(event)) {
      listenersRef.current.set(event, new Set());
    }
    listenersRef.current.get(event)!.add(callback);
    return () => {
      listenersRef.current.get(event)?.delete(callback);
    };
  };

  const emit = (event: SDKEvent, payload: any): void => {
    listenersRef.current.get(event)?.forEach((cb) => cb(payload));
  };

  const connect = async (): Promise<void> => {
    setStatus('connected');
    setCurrentPublicKey(publicKey);
    emit('wallet:connected', { publicKey, network });
  };

  const disconnect = async (): Promise<void> => {
    setStatus('disconnected');
    setCurrentPublicKey(null);
    emit('wallet:disconnected', { reason: 'user_disconnected' });
  };

  // Mocked version of WalletConnectManager to satisfy types
  const mockManager = useMemo(() => {
    return {
      initialize: async () => {},
      connect: async () => ({} as any),
      disconnect: async () => {},
      getSession: () => (status === 'connected' ? ({} as any) : null),
      signTransaction: async (xdrString: string) => {
        console.log('MockWalletProvider: Intercepted signTransaction request for XDR:', xdrString);
        if (signResponse instanceof Error) {
          throw signResponse;
        }
        return signResponse;
      },
      signMessage: async (msg: string) => {
        console.log('MockWalletProvider: Intercepted signMessage request for message:', msg);
        return 'mock_signature';
      },
    } as any;
  }, [status, signResponse]);

  const contextValue = useMemo<StellarWalletContextType>(() => ({
    status,
    publicKey: currentPublicKey,
    network,
    connect,
    disconnect,
    manager: mockManager,
    on,
    emit,
  }), [status, currentPublicKey, network, mockManager]);

  return (
    <StellarWalletContext.Provider value={contextValue}>
      {children}
    </StellarWalletContext.Provider>
  );
};
