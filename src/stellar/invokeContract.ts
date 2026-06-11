import { Transaction, xdr } from '@stellar/stellar-sdk';

/**
 * Parameters for building a Soroban contract invocation transaction.
 */
export interface InvokeContractParams {
  /**
   * Soroban smart contract ID (C...)
   */
  contractId: string;
  /**
   * Function/method name to invoke
   */
  method: string;
  /**
   * Array of XDR-encoded ScVal arguments
   */
  args: xdr.ScVal[];
  /**
   * Source/signing account address (G...)
   */
  source: string;
  /**
   * Target network
   */
  network: 'testnet' | 'mainnet';
  /**
   * Optional base fee in stroops (default: 100)
   */
  fee?: number;
}

/**
 * Builds an unsigned Soroban contract invocation transaction.
 * 
 * Expected Logic:
 * 1. Fetch current sequence number for source account.
 * 2. Build the Operation.invokeHostFunction operation.
 * 3. Append the host function invoke to the transaction builder.
 * 4. Build and return the Transaction.
 */
export async function invokeContract(params: InvokeContractParams): Promise<Transaction> {
  console.log('invokeContract: building transaction with params:', params);

  // TODO: Fetch account sequence
  // TODO: Build Operation.invokeHostFunction:
  // Operation.invokeHostFunction({
  //   func: xdr.HostFunction.hostFunctionTypeInvokeContract(
  //     new xdr.InvokeContractArgs({
  //       contractAddress: Address.fromString(params.contractId).toScAddress(),
  //       functionName: xdr.Symbol.fromString(params.method),
  //       args: params.args,
  //     })
  //   ),
  //   auth: [],
  // })
  // TODO: Build and return unsigned Transaction

  return {} as Transaction;
}
