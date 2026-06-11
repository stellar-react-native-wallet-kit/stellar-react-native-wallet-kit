import { Linking } from 'react-native';

/**
 * Configuration options for deep linking.
 */
export interface DeepLinkConfig {
  /**
   * The custom URI scheme of the client app (e.g. "myapp://") for returning from Freighter.
   */
  callbackScheme?: string;
}

/**
 * Handles deep linking redirect calls to Freighter Mobile on iOS and Android.
 */
export const FreighterDeepLink = {
  /**
   * Generates a deep link URL for WalletConnect pairing.
   * 
   * @param wcUri The raw wc: URI returned by WalletConnect SignClient.
   * @returns Formatted deep link target for Freighter.
   */
  formatWalletConnectLink(wcUri: string): string {
    // Expected logic:
    // Encodes the wcUri and suffixes it to the freighter scheme:
    // "freighter://wc?uri=" + encodeURIComponent(wcUri)
    const encoded = encodeURIComponent(wcUri);
    return `freighter://wc?uri=${encoded}`;
  },

  /**
   * Directly opens Freighter Mobile to approve a pending request.
   * Useful when a JSON-RPC signing event is sent and the user needs to switch to the wallet.
   */
  async openFreighter(): Promise<boolean> {
    const targetUrl = 'freighter://';
    try {
      const supported = await Linking.canOpenURL(targetUrl);
      if (supported) {
        await Linking.openURL(targetUrl);
        return true;
      } else {
        console.warn('Freighter Mobile app is not installed or the scheme is not registered');
        return false;
      }
    } catch (error) {
      console.error('Failed to open Freighter via deep link:', error);
      return false;
    }
  },

  /**
   * Opens the Freighter deep link with the WalletConnect URI payload.
   * 
   * @param wcUri The raw walletconnect connection URI.
   * @returns boolean indicating if the deep link was successfully handled.
   */
  async openWalletConnect(wcUri: string): Promise<boolean> {
    const targetUrl = this.formatWalletConnectLink(wcUri);
    try {
      const supported = await Linking.canOpenURL(targetUrl);
      if (supported) {
        await Linking.openURL(targetUrl);
        return true;
      } else {
        console.warn('Freighter Mobile is not configured to handle WalletConnect URIs locally.');
        return false;
      }
    } catch (error) {
      console.error('Error opening WalletConnect deep link:', error);
      return false;
    }
  }
};
