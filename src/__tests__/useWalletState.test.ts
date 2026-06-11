import { renderHook, act } from '@testing-library/react-hooks';
import React from 'react';
import { useWalletState } from '../hooks/useWalletState';
import { MockWalletProvider } from '../mock/MockWalletProvider';

describe('useWalletState', () => {
  it('should initialize with disconnected state if specified', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <MockWalletProvider initialStatus="disconnected">
        {children}
      </MockWalletProvider>
    );

    const { result } = renderHook(() => useWalletState(), { wrapper });

    expect(result.current.status).toBe('disconnected');
    expect(result.current.publicKey).toBeNull();
  });

  it('should initialize with connected state by default', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <MockWalletProvider publicKey="GDXYZ...123">
        {children}
      </MockWalletProvider>
    );

    const { result } = renderHook(() => useWalletState(), { wrapper });

    expect(result.current.status).toBe('connected');
    expect(result.current.publicKey).toBe('GDXYZ...123');
  });

  it('should transition status when connect and disconnect are triggered', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <MockWalletProvider initialStatus="disconnected" publicKey="GDXYZ...CONNECT">
        {children}
      </MockWalletProvider>
    );

    const { result } = renderHook(() => useWalletState(), { wrapper });

    expect(result.current.status).toBe('disconnected');

    // Trigger connection
    await act(async () => {
      await result.current.connect();
    });

    expect(result.current.status).toBe('connected');
    expect(result.current.publicKey).toBe('GDXYZ...CONNECT');

    // Trigger disconnection
    await act(async () => {
      await result.current.disconnect();
    });

    expect(result.current.status).toBe('disconnected');
    expect(result.current.publicKey).toBeNull();
  });
});
