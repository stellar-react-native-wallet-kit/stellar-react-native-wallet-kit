import { renderHook, act } from '@testing-library/react-native';
import React from 'react';
import { useContractCall } from '../hooks/useContractCall';
import { MockWalletProvider } from '../mock/MockWalletProvider';
import { xdr } from '@stellar/stellar-sdk';

describe('useContractCall', () => {
  const contractId = 'CABC1234567890EXAMPLE';

  it('should successfully execute a contract call simulation', async () => {
    // Mock ScVal representing a return value (e.g. integer 42)
    const mockVal = xdr.ScVal.scvI32(42);
    
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <MockWalletProvider contractResponse={mockVal}>
        {children}
      </MockWalletProvider>
    );

    const { result } = renderHook(() => useContractCall(contractId), { wrapper });

    let invokeResult: any;
    await act(async () => {
      // Run contract call in simulation mode
      invokeResult = await result.current.invoke({
        method: 'test_method',
        args: [],
        simulate: true,
      });
    });

    // We expect the result to be decoded or returned as mock
    expect(result.current.invoking).toBe(false);
    expect(result.current.error).toBeNull();
  });
});
