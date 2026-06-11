import { xdr } from '@stellar/stellar-sdk';

/**
 * Decodes a raw Soroban ScVal (Smart Contract Value) into a native JavaScript representation.
 * 
 * Expected Logic:
 * 1. Read scVal.switch() to determine the data type (string, integer, boolean, map, vector, etc.).
 * 2. Map types:
 *    - scvBool: return boolean
 *    - scvString: return string (scVal.str().toString())
 *    - scvI32 / scvU32: return number
 *    - scvI64 / scvU64 / scvI128 / scvU128: return BigInt
 *    - scvVec: recursively map children
 *    - scvMap: recursively map key/value pairs to a JS object
 *    - scvAddress: return string representation of the Address
 * 3. Utilizes `scValToNative(scVal)` from @stellar/stellar-sdk as the base.
 * 
 * @param scVal The XDR-encoded ScVal returned from contract simulation or execution.
 * @returns Standard JavaScript representation (number, string, boolean, bigint, object, array, or null).
 */
export function decodeContractResult(scVal: xdr.ScVal): any {
  console.log('decodeContractResult: decoding ScVal of type:', scVal.switch().name);

  // TODO: Use scValToNative(scVal) or custom parser
  // return scValToNative(scVal);

  return null;
}
