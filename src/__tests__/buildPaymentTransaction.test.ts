import { buildPaymentTransaction } from '../stellar/buildPaymentTransaction';
import { Asset } from '@stellar/stellar-sdk';

describe('buildPaymentTransaction', () => {
  it('should compile the build request without crashing', async () => {
    const params = {
      from: 'GDXYZ...SENDER',
      to: 'GDXYZ...RECIPIENT',
      asset: Asset.native(),
      amount: '50.0',
      network: 'testnet' as const,
      memo: 'invoice-123',
    };

    const tx = await buildPaymentTransaction(params);
    expect(tx).toBeDefined();
    // Since it's a skeletal mock right now, it will return an empty object {}
  });
});
