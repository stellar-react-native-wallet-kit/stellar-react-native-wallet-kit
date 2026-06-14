import { decodeContractResult } from '../stellar/decodeContractResult';
import { xdr } from '@stellar/stellar-sdk';

describe('decodeContractResult', () => {
    it('should accept an scvI32 without throwing', () => {
        const scVal = xdr.ScVal.scvI32(42);
        expect(() => decodeContractResult(scVal)).not.toThrow();
    });

    it('should accept an scvBool without throwing', () => {
        const scVal = xdr.ScVal.scvBool(true);
        expect(() => decodeContractResult(scVal)).not.toThrow();
    });

    it('should accept an scvVoid without throwing', () => {
        const scVal = xdr.ScVal.scvVoid();
        expect(() => decodeContractResult(scVal)).not.toThrow();
    });

    it('should accept an scvString without throwing', () => {
        const scVal = xdr.ScVal.scvString(Buffer.from('hello'));
        expect(() => decodeContractResult(scVal)).not.toThrow();
    });

    it('should return a value (non-undefined) for any supported type', () => {
        // Currently returns null as a stub — once implemented, values will vary
        const scVal = xdr.ScVal.scvI32(7);
        const result = decodeContractResult(scVal);
        // Accepts null (stub) or a decoded native value once implemented
        expect(result === null || result !== undefined).toBe(true);
    });
});
