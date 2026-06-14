import { StellarWalletError, ErrorMessageMap, StellarWalletErrorCode } from '../errors/StellarWalletError';

describe('StellarWalletError', () => {
    it('should use the default message from ErrorMessageMap when no custom message is provided', () => {
        const err = new StellarWalletError('W001');
        expect(err.message).toBe(ErrorMessageMap['W001']);
        expect(err.code).toBe('W001');
    });

    it('should use a custom message when provided', () => {
        const err = new StellarWalletError('W002', 'Custom rejection message');
        expect(err.message).toBe('Custom rejection message');
        expect(err.code).toBe('W002');
    });

    it('should attach raw details when provided', () => {
        const rawDetails = { status: 400, body: 'bad_request' };
        const err = new StellarWalletError('H001', undefined, rawDetails);
        expect(err.raw).toEqual(rawDetails);
    });

    it('should be an instance of both Error and StellarWalletError', () => {
        const err = new StellarWalletError('S001');
        expect(err).toBeInstanceOf(Error);
        expect(err).toBeInstanceOf(StellarWalletError);
    });

    it('should have name set to StellarWalletError', () => {
        const err = new StellarWalletError('W003');
        expect(err.name).toBe('StellarWalletError');
    });

    it('should cover all defined error codes', () => {
        const codes: StellarWalletErrorCode[] = [
            'W001', 'W002', 'W003', 'W004',
            'S001', 'S002', 'S003', 'S004',
            'H001', 'H002', 'H003',
        ];
        for (const code of codes) {
            const err = new StellarWalletError(code);
            expect(err.code).toBe(code);
            expect(err.message).toBe(ErrorMessageMap[code]);
        }
    });

    it('should have a stack trace', () => {
        const err = new StellarWalletError('W001');
        expect(err.stack).toBeDefined();
    });
});
