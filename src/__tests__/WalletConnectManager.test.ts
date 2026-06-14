import { WalletConnectManager } from '../session/WalletConnectManager';

const baseConfig = {
    projectId: 'test-project-id',
    network: 'testnet' as const,
    metadata: {
        name: 'Test App',
        description: 'Test',
        url: 'https://example.com',
        icons: [],
    },
};

describe('WalletConnectManager', () => {
    it('should instantiate without throwing', () => {
        expect(() => new WalletConnectManager(baseConfig)).not.toThrow();
    });

    it('getSession should return null before connecting', () => {
        const manager = new WalletConnectManager(baseConfig);
        expect(manager.getSession()).toBeNull();
    });

    it('initialize should resolve without throwing', async () => {
        const manager = new WalletConnectManager(baseConfig);
        await expect(manager.initialize()).resolves.toBeUndefined();
    });

    it('connect should throw when not initialized', async () => {
        const manager = new WalletConnectManager(baseConfig);
        await expect(manager.connect()).rejects.toThrow('WalletConnectManager not initialized');
    });

    it('disconnect should resolve gracefully with no active session', async () => {
        const manager = new WalletConnectManager(baseConfig);
        await expect(manager.disconnect()).resolves.toBeUndefined();
    });

    it('signTransaction should throw when no active session', async () => {
        const manager = new WalletConnectManager(baseConfig);
        await expect(manager.signTransaction('FAKE_XDR')).rejects.toThrow('No active WalletConnect session');
    });

    it('signMessage should throw when no active session', async () => {
        const manager = new WalletConnectManager(baseConfig);
        await expect(manager.signMessage('hello')).rejects.toThrow('No active WalletConnect session');
    });
});
