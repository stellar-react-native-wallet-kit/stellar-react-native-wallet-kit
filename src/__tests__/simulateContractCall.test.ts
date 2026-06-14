import { simulateContractCall } from '../stellar/simulate';
import { xdr } from '@stellar/stellar-sdk';

const baseParams = {
    contractId: 'CABC1234567890EXAMPLECONTRACT',
    method: 'transfer',
    args: [] as xdr.ScVal[],
    source: 'GABC1234STELLARADDRESS',
    network: 'testnet' as const,
};

describe('simulateContractCall', () => {
    it('should return a simulation result without throwing', async () => {
        const result = await simulateContractCall(baseParams);
        expect(result).toBeDefined();
    });

    it('should return the expected result shape', async () => {
        const result = await simulateContractCall(baseParams);
        expect(result).toMatchObject({
            success: expect.any(Boolean),
            estimatedFee: expect.any(Number),
            rawResponse: expect.anything(),
        });
    });

    it('should work with a custom rpcUrl', async () => {
        const result = await simulateContractCall({
            ...baseParams,
            rpcUrl: 'https://custom-rpc.example.com',
        });
        expect(result).toBeDefined();
    });

    it('should work on mainnet', async () => {
        const result = await simulateContractCall({ ...baseParams, network: 'mainnet' });
        expect(result.success).toBeDefined();
    });

    it('should pass args through without throwing', async () => {
        const args = [xdr.ScVal.scvI32(1), xdr.ScVal.scvBool(true)];
        const result = await simulateContractCall({ ...baseParams, args });
        expect(result).toBeDefined();
    });
});
