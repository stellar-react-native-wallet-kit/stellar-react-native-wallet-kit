/**
 * SDK Error Code Types
 */
export type StellarWalletErrorCode =
  // Wallet Connection / Session Errors
  | 'W001' // WalletNotConnected
  | 'W002' // UserRejected
  | 'W003' // SessionExpired
  | 'W004' // NetworkMismatch
  // Soroban Smart Contract / RPC Errors
  | 'S001' // SimulationFailed
  | 'S002' // InsufficientFee
  | 'S003' // ContractNotFound
  | 'S004' // EntryExpired
  // Horizon Transaction Submission Errors
  | 'H001' // SubmitFailed
  | 'H002' // AccountNotFound
  | 'H003'; // BadSequence

/**
 * Standardized mapping of codes to default human-readable messages.
 */
export const ErrorMessageMap: Record<StellarWalletErrorCode, string> = {
  W001: 'Hook or method called before wallet connection was established.',
  W002: 'User declined the signature or connection request in Freighter Mobile.',
  W003: 'WalletConnect session timed out or was terminated. Re-connection required.',
  W004: 'Connected Freighter network differs from the SDK\'s active configured network.',
  S001: 'Soroban contract invocation simulation failed.',
  S002: 'Transaction fee is too low after simulation.',
  S003: 'Specified contract ID was not found on the network.',
  S004: 'Soroban ledger entry TTL has expired.',
  H001: 'Horizon rejected the transaction. Check resultCodes for details.',
  H002: 'Source account does not exist on the network.',
  H003: 'Transaction sequence number mismatch.',
};

/**
 * Custom error class returned by all hooks and functions in the SDK.
 * 
 * @example
 * try {
 *   await sign(tx);
 * } catch (error) {
 *   if (error instanceof StellarWalletError) {
 *     console.error(`Error [${error.code}]: ${error.message}`);
 *     if (error.raw) console.error('Underlying details:', error.raw);
 *   }
 * }
 */
export class StellarWalletError extends Error {
  /**
   * The standardized error code.
   */
  public readonly code: StellarWalletErrorCode;

  /**
   * Optional underlying raw error details (e.g., from Horizon or WalletConnect).
   */
  public readonly raw?: any;

  constructor(code: StellarWalletErrorCode, customMessage?: string, raw?: any) {
    const message = customMessage || ErrorMessageMap[code];
    super(message);
    
    // Set the prototype explicitly to ensure instanceof works correctly
    Object.setPrototypeOf(this, StellarWalletError.prototype);
    
    this.name = 'StellarWalletError';
    this.code = code;
    this.raw = raw;

    // Capture stack trace if available
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, StellarWalletError);
    }
  }
}
