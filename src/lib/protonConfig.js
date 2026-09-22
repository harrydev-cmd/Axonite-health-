/**
 * protonConfig.js
 *
 * Proton configuration and credentials
 * Add your Proton API credentials here
 */

export const PROTON_CONFIG = {
  // Your Proton account email
  email: process.env.REACT_APP_PROTON_EMAIL || 'your-email@proton.me',

  // Your Proton API key or password (use environment variables in production)
  apiKey: process.env.REACT_APP_PROTON_API_KEY || 'your-api-key-here',

  // Proton API endpoint
  apiUrl: 'https://mail-api.proton.me/api',

  // Enable cloud sync (disabled by default until Proton API is properly configured)
  enableCloudSync: false,

  // Auto-sync interval (ms)
  autoSyncInterval: 30000, // 30 seconds

  // Retry attempts for failed syncs
  maxRetries: 3,

  // Debug mode
  debug: false,
};

/**
 * Initialize Proton with your credentials
 * Usage in App.jsx:
 * import { PROTON_CONFIG } from './lib/protonConfig';
 * 
 * // In your useEffect:
 * await initProtonSession(PROTON_CONFIG.email, PROTON_CONFIG.apiKey);
 */

export function setupProtonCredentials(email, apiKey) {
  PROTON_CONFIG.email = email;
  PROTON_CONFIG.apiKey = apiKey;
}

/**
 * Environment variables setup
 * Create a .env file in your project root with:
 * 
 * REACT_APP_PROTON_EMAIL=your-email@proton.me
 * REACT_APP_PROTON_API_KEY=your-api-key-here
 */
