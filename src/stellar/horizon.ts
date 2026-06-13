import { Horizon } from '@stellar/stellar-sdk';

/**
 * Result returned from a transaction submission to Horizon.
 */
export interface HorizonSubmitResult {
  /**
   * Transaction hash
   */
  hash: string;
  /**
   * Ledger index where transaction was included
   */
  ledger: number;
  /**
   * Standard result code from Horizon
   */
  resultCode: string;
  /**
   * Raw Horizon submission response
   */
  rawResponse: any;
}

/**
 * Polled/fetched details for a Stellar account.
 */
export interface StellarAccountDetails {
  /**
   * Full G... public address
   */
  publicKey: string;
  /**
   * Current sequence number
   */
  sequence: string;
  /**
   * List of asset balances, including trustlines
   */
  balances: Array<{
    asset_type: string;
    asset_code?: string;
    asset_issuer?: string;
    balance: string;
  }>;
  /**
   * Full Horizon account record structure
   */
  rawAccount: Horizon.ServerApi.AccountRecord | null;
}

/**
 * Submits a signed XDR string to the Horizon network.
 * 
 * Expected Logic:
 * 1. Initialize Horizon Server with network URL.
 * 2. Parse XDR into a Transaction.
 * 3. Call server.submitTransaction(tx).
 * 4. Map success to HorizonSubmitResult.
 * 5. Handle submission errors (e.g. H001, H002, H003) and wrap them into StellarWalletError.
 */
export async function submitTransaction(
  signedXdr: string,
  network: 'testnet' | 'mainnet',
  _horizonUrl?: string
): Promise<HorizonSubmitResult> {
  console.log('submitTransaction: submitting to Horizon, network:', network);

  // TODO: Resolve Horizon Server
  // const url = horizonUrl || (network === 'testnet' 
  //   ? 'https://horizon-testnet.stellar.org' 
  //   : 'https://horizon.stellar.org');
  // const server = new Horizon.Server(url);
  // const tx = new Transaction(signedXdr, network === 'testnet' ? Networks.TESTNET : Networks.PUBLIC);
  // const response = await server.submitTransaction(tx);

  return {
    hash: 'tx_hash_placeholder',
    ledger: 0,
    resultCode: 'tx_success',
    rawResponse: {},
  };
}

/**
 * Fetches current on-chain details for an account.
 */
export async function fetchAccountDetails(
  address: string
): Promise<StellarAccountDetails> {
  console.log('fetchAccountDetails: loading account details for:', address);

  // TODO: server.loadAccount(address)

  return {
    publicKey: address,
    sequence: '0',
    balances: [],
    rawAccount: null,
  };
}

/**
 * Periodically polls an account's state, returning an unsubscribe handler.
 */
export function pollAccountState(
  address: string,
  network: 'testnet' | 'mainnet',
  intervalMs: number,
  onUpdate: (details: StellarAccountDetails) => void,
  onError: (error: Error) => void,
  _horizonUrl?: string
): () => void {
  console.log(`pollAccountState: start polling for ${address} every ${intervalMs}ms`);

  let active = true;
  let timerId: NodeJS.Timeout | null = null;

  const poll = async () => {
    if (!active) return;
    try {
      const details = await fetchAccountDetails(address);
      if (active) onUpdate(details);
    } catch (err) {
      if (active) onError(err as Error);
    } finally {
      if (active) {
        timerId = setTimeout(poll, intervalMs);
      }
    }
  };

  // Trigger initial poll
  poll();

  // Return unsubscribe cleanup function
  return () => {
    console.log(`pollAccountState: stop polling for ${address}`);
    active = false;
    if (timerId) clearTimeout(timerId);
  };
}
