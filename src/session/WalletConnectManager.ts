import SignClient from '@walletconnect/sign-client';
import { SessionTypes } from '@walletconnect/types';

/**
 * Configuration options for WalletConnectManager
 */
export interface WalletConnectManagerConfig {
  projectId: string;
  metadata?: {
    name: string;
    description: string;
    url: string;
    icons: string[];
  };
  network: 'testnet' | 'mainnet';
  onSessionConnect?: (session: SessionTypes.Struct) => void;
  onSessionDisconnect?: () => void;
  onSessionUpdate?: (session: SessionTypes.Struct) => void;
  onSessionEvent?: (event: any) => void;
}

/**
 * Manages the WalletConnect v2 session lifecycle, pairings, and JSON-RPC signing commands.
 * Under the hood, this integrates with @walletconnect/sign-client.
 */
export class WalletConnectManager {
  private client: SignClient | null = null;
  private activeSession: SessionTypes.Struct | null = null;

  constructor(_config: WalletConnectManagerConfig) {
    // Config will be used once implementation is complete
  }

  /**
   * Initializes the SignClient instance and checks for existing sessions.
   * 
   * Expected Logic:
   * 1. Call SignClient.init() with projectId and metadata.
   * 2. Listen to Client events: session_event, session_update, session_delete.
   * 3. Find existing active sessions in client.session.values() and restore the latest one if matching network/namespace.
   */
  public async initialize(): Promise<void> {
    // TODO: Initialize SignClient
    // this.client = await SignClient.init({ projectId: this.config.projectId, metadata: this.config.metadata });
    // TODO: Register listeners:
    // this.client.on("session_event", ...)
    // this.client.on("session_update", ...)
    // this.client.on("session_delete", ...)
    // TODO: Restore existing session if present and valid
    console.log('WalletConnectManager: initialize called');
  }

  /**
   * Triggers a new connection pairing.
   * 
   * Expected Logic:
   * 1. Call client.connect() requesting the Stellar namespace (e.g. 'stellar' namespace with methods: ['stellar_signXDR', 'stellar_signMessage']).
   * 2. If a uri is returned, trigger the QR modal or deep link logic to redirect user to Freighter.
   * 3. Await approval and store the established session.
   */
  public async connect(): Promise<SessionTypes.Struct> {
    if (!this.client) {
      throw new Error('WalletConnectManager not initialized. Call initialize() first.');
    }
    // TODO: Request connection using stellar namespace
    // const { uri, approval } = await this.client.connect({
    //   requiredNamespaces: {
    //     stellar: {
    //       methods: ['stellar_signXDR', 'stellar_signMessage'],
    //       chains: [`stellar:${this.config.network}`],
    //       events: []
    //     }
    //   }
    // });
    // TODO: Handle deep-link redirection if URI is generated
    // TODO: Await approval and return session
    console.log('WalletConnectManager: connect called');
    return {} as SessionTypes.Struct;
  }

  /**
   * Disconnects the active session.
   * 
   * Expected Logic:
   * 1. Disconnect the session from SignClient.
   * 2. Clean up local session states and pairings.
   */
  public async disconnect(): Promise<void> {
    if (!this.client || !this.activeSession) return;
    // TODO: client.disconnect({ topic: activeSession.topic, reason: ... })
    this.activeSession = null;
    console.log('WalletConnectManager: disconnect called');
  }

  /**
   * Sends a transaction signing request to Freighter via WalletConnect.
   * 
   * Expected Logic:
   * 1. Build a JSON-RPC request for 'stellar_signXDR'.
   * 2. Send the request via client.request().
   * 3. Handle errors (e.g., user rejected W002).
   * 4. Return the signed XDR string.
   */
  public async signTransaction(xdr: string): Promise<string> {
    if (!this.client || !this.activeSession) {
      throw new Error('No active WalletConnect session');
    }
    // TODO: send client.request({
    //   topic: this.activeSession.topic,
    //   chainId: `stellar:${this.config.network}`,
    //   request: {
    //     method: 'stellar_signXDR',
    //     params: { xdr }
    //   }
    // })
    console.log('WalletConnectManager: signTransaction called with XDR:', xdr);
    return 'signed_xdr_placeholder';
  }

  /**
   * Sends an arbitrary message signing request (SEP-53) to Freighter.
   * 
   * Expected Logic:
   * 1. Build a JSON-RPC request for 'stellar_signMessage'.
   * 2. Send request via client.request() and receive signature.
   */
  public async signMessage(message: string): Promise<string> {
    if (!this.client || !this.activeSession) {
      throw new Error('No active WalletConnect session');
    }
    // TODO: send client.request({
    //   topic: this.activeSession.topic,
    //   chainId: `stellar:${this.config.network}`,
    //   request: {
    //     method: 'stellar_signMessage',
    //     params: { message }
    //   }
    // })
    console.log('WalletConnectManager: signMessage called with message:', message);
    return 'signature_placeholder';
  }

  /**
   * Gets the active session, if any.
   */
  public getSession(): SessionTypes.Struct | null {
    return this.activeSession;
  }
}
