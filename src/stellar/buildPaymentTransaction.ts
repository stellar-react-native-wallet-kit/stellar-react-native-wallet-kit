import { Transaction, Asset } from '@stellar/stellar-sdk';

/**
 * Parameters for building a Stellar payment transaction.
 */
export interface BuildPaymentParams {
  /**
   * Source Stellar account address (G...)
   */
  from: string;
  /**
   * Destination Stellar account address (G...)
   */
  to: string;
  /**
   * Stellar Asset (e.g. Asset.native() for XLM, or trustline Asset)
   */
  asset: Asset;
  /**
   * Amount to send as a string representation
   */
  amount: string;
  /**
   * Target Stellar network
   */
  network: 'testnet' | 'mainnet';
  /**
   * Optional text memo
   */
  memo?: string;
  /**
   * Optional base fee in stroops (default: 100)
   */
  fee?: number;
}

/**
 * Builds a payment transaction for XLM or a custom token.
 * 
 * Expected Logic:
 * 1. Fetch current sequence number for source account (e.g., via Horizon).
 * 2. Initialize StellarSdk.TransactionBuilder with source account details, network passphrase, and base fee.
 * 3. Append payment operation (StellarSdk.Operation.payment).
 * 4. Add memo if present (StellarSdk.Memo.text).
 * 5. Build and return the unsigned Transaction instance.
 */
export async function buildPaymentTransaction(params: BuildPaymentParams): Promise<Transaction> {
  console.log('buildPaymentTransaction: building with params:', params);
  
  // TODO: Fetch account from Horizon to get sequence number, or simulate it.
  // const horizonUrl = params.network === 'testnet' 
  //   ? 'https://horizon-testnet.stellar.org' 
  //   : 'https://horizon.stellar.org';
  // const server = new Horizon.Server(horizonUrl);
  // const account = await server.loadAccount(params.from);
  
  // TODO: Build transaction:
  // const tx = new TransactionBuilder(account, {
  //   fee: (params.fee || 100).toString(),
  //   networkPassphrase: params.network === 'testnet' ? Networks.TESTNET : Networks.PUBLIC,
  // })
  // .addOperation(Operation.payment({
  //   destination: params.to,
  //   asset: params.asset,
  //   amount: params.amount,
  // }))
  // .addMemo(params.memo ? Memo.text(params.memo) : Memo.none())
  // .setTimeout(TimeoutInfinite)
  // .build();
  
  // Return typed stub
  return {} as Transaction;
}
