import { submitTransaction, fetchAccountDetails, pollAccountState } from '../stellar/horizon';

describe('submitTransaction', () => {
    it('should return a placeholder result without throwing', async () => {
        const result = await submitTransaction('FAKE_XDR', 'testnet');
        expect(result).toBeDefined();
        expect(result.hash).toBeDefined();
        expect(result.ledger).toBeDefined();
        expect(result.resultCode).toBeDefined();
    });

    it('should return a result with the expected shape', async () => {
        const result = await submitTransaction('FAKE_XDR');
        expect(result).toMatchObject({
            hash: expect.any(String),
            ledger: expect.any(Number),
            resultCode: expect.any(String),
            rawResponse: expect.anything(),
        });
    });
});

describe('fetchAccountDetails', () => {
    const address = 'GABC1234STELLARADDRESS';

    it('should return account details for a given address', async () => {
        const details = await fetchAccountDetails(address, 'testnet');
        expect(details.publicKey).toBe(address);
        expect(details.sequence).toBeDefined();
        expect(Array.isArray(details.balances)).toBe(true);
    });

    it('should return a valid StellarAccountDetails shape', async () => {
        const details = await fetchAccountDetails(address);
        expect(details).toMatchObject({
            publicKey: address,
            sequence: expect.any(String),
            balances: expect.any(Array),
        });
    });
});

describe('pollAccountState', () => {
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => jest.useRealTimers());

    it('should call onUpdate with account details on initial poll', async () => {
        const onUpdate = jest.fn();
        const address = 'GPOLL_ACCOUNT';

        const stop = pollAccountState(address, 'testnet', 5000, onUpdate);

        // Flush the initial async poll
        await Promise.resolve();
        await Promise.resolve();

        expect(onUpdate).toHaveBeenCalledWith(
            expect.objectContaining({ publicKey: address }),
        );

        stop();
    });

    it('should stop polling when the returned cleanup function is called', async () => {
        const onUpdate = jest.fn();
        const address = 'GSTOP_ACCOUNT';

        const stop = pollAccountState(address, 'testnet', 1000, onUpdate);

        await Promise.resolve();
        await Promise.resolve();

        const callsAfterFirstPoll = onUpdate.mock.calls.length;
        stop();

        jest.advanceTimersByTime(5000);
        await Promise.resolve();

        // No additional calls after stop
        expect(onUpdate.mock.calls.length).toBe(callsAfterFirstPoll);
    });

    it('should accept an onError callback without throwing during setup', () => {
        // pollAccountState internal error path can't be triggered via module spy
        // (same-module calls bypass the spy). Verify the parameter is accepted and
        // the function returns a valid cleanup handle.
        const onError = jest.fn();
        const stop = pollAccountState('GERROR_ACCT', 'testnet', 5000, undefined, onError);
        expect(typeof stop).toBe('function');
        stop();
    });
});
