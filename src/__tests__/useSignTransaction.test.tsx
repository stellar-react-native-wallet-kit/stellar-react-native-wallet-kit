import { renderHook, act } from '@testing-library/react-native';
import React from 'react';
import { useSignTransaction } from '../hooks/useSignTransaction';
import { MockWalletProvider } from '../mock/MockWalletProvider';
import { Transaction, TransactionBuilder, Networks, Operation, Asset, Keypair, BASE_FEE, Account } from '@stellar/stellar-sdk';
import { StellarWalletError } from '../errors/StellarWalletError';

function createDummyTx(): Transaction {
  const sourceKey = Keypair.random();
  const account = new Account(sourceKey.publicKey(), '0');
  return new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(Operation.payment({
      destination: Keypair.random().publicKey(),
      asset: Asset.native(),
      amount: '10',
    }))
    .setTimeout(0)
    .build();
}

describe('useSignTransaction', () => {
  it('should successfully sign a transaction', async () => {
    const mockSignedXdr = 'AAAA_SIGNED_XDR_RESULT';
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <MockWalletProvider signResponse={mockSignedXdr}>
        {children}
      </MockWalletProvider>
    );

    const { result } = renderHook(() => useSignTransaction(), { wrapper });
    const dummyTx = createDummyTx();

    let signedResult: string = '';
    await act(async () => {
      signedResult = await result.current.sign(dummyTx);
    });

    expect(signedResult).toBe(mockSignedXdr);
    expect(result.current.signing).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle user rejection error', async () => {
    const mockRejectError = new StellarWalletError('W002', 'User rejected request');
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <MockWalletProvider signResponse={mockRejectError}>
        {children}
      </MockWalletProvider>
    );

    const { result } = renderHook(() => useSignTransaction(), { wrapper });
    const dummyTx = createDummyTx();

    await act(async () => {
      await expect(result.current.sign(dummyTx)).rejects.toThrow(StellarWalletError);
    });

    expect(result.current.error).not.toBeNull();
    expect(result.current.error?.code).toBe('W002');
  });
});
