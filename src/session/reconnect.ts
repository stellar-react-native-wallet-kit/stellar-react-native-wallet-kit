import { AppState, AppStateStatus } from 'react-native';
import { WalletConnectManager } from './WalletConnectManager';

/**
 * Handles automatic reconnect checks and session ping validations on app resume.
 */
export class SessionReconnectHandler {
  private manager: WalletConnectManager;
  private appStateSubscription: { remove: () => void } | null = null;

  constructor(manager: WalletConnectManager) {
    this.manager = manager;
  }

  /**
   * Starts listening to React Native AppState changes.
   * On transition to 'active', check the WalletConnect session.
   */
  public startListening(): void {
    if (this.appStateSubscription) return;

    this.appStateSubscription = AppState.addEventListener(
      'change',
      this.handleAppStateChange
    );
  }

  /**
   * Cleans up AppState listeners.
   */
  public stopListening(): void {
    if (this.appStateSubscription) {
      this.appStateSubscription.remove();
      this.appStateSubscription = null;
    }
  }

  /**
   * Handler for app state changes.
   * 
   * Expected Logic:
   * 1. If transitioning from background/inactive to active, check if activeSession exists.
   * 2. Ping the wallet to verify the session hasn't expired.
   * 3. Disconnect if ping fails (or triggers reconnect flow).
   */
  private handleAppStateChange = async (nextAppState: AppStateStatus): Promise<void> => {
    if (nextAppState === 'active') {
      const activeSession = this.manager.getSession();
      if (activeSession) {
        console.log('SessionReconnectHandler: App resumed. Validating session...');
        try {
          // TODO: Ping session to verify connection is alive
          // await this.manager.ping();
        } catch (error) {
          console.warn('SessionReconnectHandler: Session verification failed on resume:', error);
          // TODO: Trigger disconnect or event indicating session died
        }
      }
    }
  };
}
