import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  StellarWalletContext,
  WalletConnectionStatus,
  SDKEvent,
  StellarWalletContextType,
} from "./context";
import { WalletConnectManager } from "../session/WalletConnectManager";
import { SessionReconnectHandler } from "../session/reconnect";

/**
 * Props accepted by StellarWalletProvider.
 */
export interface StellarWalletProviderProps {
  /**
   * The WalletConnect Project ID from cloud.walletconnect.com
   */
  walletConnectProjectId: string;
  /**
   * Target network connection ('testnet' | 'mainnet')
   */
  network?: "testnet" | "mainnet";
  /**
   * Global event callback hook
   */
  onEvent?: (event: SDKEvent, payload: any) => void;
  /**
   * App content
   */
  children: React.ReactNode;
}

export const StellarWalletProvider: React.FC<StellarWalletProviderProps> = ({
  walletConnectProjectId,
  network = "testnet",
  onEvent,
  children,
}: StellarWalletProviderProps): JSX.Element => {
  const [status, setStatus] = useState<WalletConnectionStatus>("disconnected");
  const [publicKey, setPublicKey] = useState<string | null>(null);

  // Keep event listeners in a ref to persist across renders
  const listenersRef = useRef<Map<SDKEvent, Set<(payload: any) => void>>>(
    new Map(),
  );

  // Instantiate the WalletConnectManager
  const manager = useMemo(() => {
    return new WalletConnectManager({
      projectId: walletConnectProjectId,
      network: network as "testnet" | "mainnet",
      onSessionConnect: (session) => {
        // Expected Logic:
        // Extract public key address from session namespaces and update state
        console.log("StellarWalletProvider: Session connected", session);
        setStatus("connected");
        // const address = extractAddressFromSession(session);
        // setPublicKey(address);
        // emit('wallet:connected', { publicKey: address, network });
      },
      onSessionDisconnect: () => {
        console.log("StellarWalletProvider: Session disconnected");
        setStatus("disconnected");
        setPublicKey(null);
        // emit('wallet:disconnected', { reason: 'session_closed' });
      },
    });
  }, [walletConnectProjectId, network]);

  // Instantiate the AppState reconnect helper
  const reconnectHandler = useMemo(() => {
    return new SessionReconnectHandler(manager);
  }, [manager]);

  // Initialize SignClient and setup app resume listening
  useEffect(() => {
    const init = async () => {
      try {
        setStatus("connecting");
        await manager.initialize();
        reconnectHandler.startListening();

        // TODO: Update status based on restored active sessions
        const activeSession = manager.getSession();
        if (activeSession) {
          setStatus("connected");
          // setPublicKey(extractAddress(activeSession))
        } else {
          setStatus("disconnected");
        }
      } catch (error) {
        console.error("Failed to initialize WalletConnectManager:", error);
        setStatus("disconnected");
      }
    };

    init();

    return () => {
      reconnectHandler.stopListening();
    };
  }, [manager, reconnectHandler]);

  /**
   * Subscribe to SDK Events.
   */
  const on = (
    event: SDKEvent,
    callback: (payload: any) => void,
  ): (() => void) => {
    if (!listenersRef.current.has(event)) {
      listenersRef.current.set(event, new Set());
    }
    listenersRef.current.get(event)!.add(callback);

    // Return unsubscribe function
    return () => {
      const set = listenersRef.current.get(event);
      if (set) {
        set.delete(callback);
      }
    };
  };

  /**
   * Dispatch an SDK Event to all local subscribers and the global onEvent prop.
   */
  const emit = (event: SDKEvent, payload: any): void => {
    // 1. Dispatch to global callback prop if provided
    if (onEvent) {
      try {
        onEvent(event, payload);
      } catch (err) {
        console.error("Error in onEvent callback:", err);
      }
    }

    // 2. Dispatch to local hook subscribers
    const set = listenersRef.current.get(event);
    if (set) {
      set.forEach((cb: (payload: any) => void) => {
        try {
          cb(payload);
        } catch (err) {
          console.error(`Error in event listener for ${event}:`, err);
        }
      });
    }
  };

  /**
   * Action: Connect
   */
  const connect = async (): Promise<void> => {
    try {
      setStatus("connecting");
      await manager.connect();
    } catch (error) {
      setStatus("disconnected");
      throw error;
    }
  };

  /**
   * Action: Disconnect
   */
  const disconnect = async (): Promise<void> => {
    try {
      await manager.disconnect();
      setStatus("disconnected");
      setPublicKey(null);
    } catch (error) {
      console.error("Disconnect failed:", error);
    }
  };

  const contextValue = useMemo<StellarWalletContextType>(
    () => ({
      status,
      publicKey,
      network,
      connect,
      disconnect,
      manager,
      on,
      emit,
    }),
    [status, publicKey, network, manager],
  );

  return (
    <StellarWalletContext.Provider value={contextValue}>
      {children}
    </StellarWalletContext.Provider>
  );
};
