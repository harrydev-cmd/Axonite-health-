/**
 * protonConfig.js
 *
 * Proton configuration and credentials
 */

export const PROTON_CONFIG = {
  email: process.env.REACT_APP_PROTON_EMAIL || 'your-email@proton.me',
  apiKey: process.env.REACT_APP_PROTON_API_KEY || 'your-api-key-here',
  apiUrl: 'https://mail-api.proton.me/api',
  enableCloudSync: false,
  autoSyncInterval: 30000,
  maxRetries: 3,
  debug: false,
};

export function setupProtonCredentials(email, apiKey) {
  PROTON_CONFIG.email = email;
  PROTON_CONFIG.apiKey = apiKey;
}
