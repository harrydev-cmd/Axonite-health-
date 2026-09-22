/**
 * cloudStorage.js
 *
 * Cloud storage abstraction layer using Proton API
 * Syncs data with Proton backend while maintaining localStorage as fallback
 */

import { PROTON_CONFIG } from './protonConfig.js';

const STORAGE_KEYS = {
  patients: 'axonite_patients',
  staff: 'axonite_staff',
  lastSync: 'axonite_lastSync',
  syncStatus: 'axonite_syncStatus',
};

let protonSession = null;
let syncInProgress = false;

/**
 * Initialize Proton session with credentials
 */
export async function initProtonSession(email = PROTON_CONFIG.email, apiKey = PROTON_CONFIG.apiKey) {
  if (!PROTON_CONFIG.enableCloudSync) {
    if (PROTON_CONFIG.debug) console.log('Cloud sync disabled');
    return null;
  }

  try {
    if (PROTON_CONFIG.debug) console.log('Initializing Proton session...');

    // This is a placeholder for Proton authentication
    // In production, implement proper OAuth flow with Proton
    const response = await fetch(`${PROTON_CONFIG.apiUrl}/auth`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        username: email, 
        password: apiKey,
      }),
    });

    if (response.ok) {
      protonSession = await response.json();
      localStorage.setItem('protonSession', JSON.stringify(protonSession));
      localStorage.setItem(STORAGE_KEYS.syncStatus, 'connected');
      
      if (PROTON_CONFIG.debug) console.log('Proton session initialized');
      return protonSession;
    } else {
      console.warn('Proton authentication failed, using localStorage fallback');
      localStorage.setItem(STORAGE_KEYS.syncStatus, 'offline');
      return null;
    }
  } catch (error) {
    console.warn('Proton connection failed, using localStorage fallback:', error.message);
    localStorage.setItem(STORAGE_KEYS.syncStatus, 'offline');
    return null;
  }
}

/**
 * Sync patients data to Proton cloud
 */
export async function syncPatientsToCloud(patients) {
  if (syncInProgress || !PROTON_CONFIG.enableCloudSync) {
    // Still save to localStorage even if sync disabled
    localStorage.setItem(STORAGE_KEYS.patients, JSON.stringify(patients));
    return;
  }

  syncInProgress = true;
  try {
    // Store locally first
    localStorage.setItem(STORAGE_KEYS.patients, JSON.stringify(patients));

    // Try to sync to Proton only if session exists
    if (protonSession && protonSession.accessToken) {
      try {
        const response = await fetch(`${PROTON_CONFIG.apiUrl}/data/patients`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${protonSession.accessToken}`,
          },
          body: JSON.stringify({
            data: patients,
            timestamp: new Date().toISOString(),
          }),
          timeout: 5000,
        });

        if (response.ok) {
          localStorage.setItem(STORAGE_KEYS.lastSync, new Date().toISOString());
          localStorage.setItem(STORAGE_KEYS.syncStatus, 'synced');
          if (PROTON_CONFIG.debug) console.log('Patients synced to cloud');
        } else {
          localStorage.setItem(STORAGE_KEYS.syncStatus, 'local-only');
        }
      } catch (fetchErr) {
        // API not available, just use local storage
        if (PROTON_CONFIG.debug) console.warn('Proton API unavailable, using localStorage:', fetchErr.message);
        localStorage.setItem(STORAGE_KEYS.syncStatus, 'local-only');
      }
    } else {
      localStorage.setItem(STORAGE_KEYS.syncStatus, 'local-only');
    }
  } catch (error) {
    console.error('Failed to sync patients to cloud:', error);
    localStorage.setItem(STORAGE_KEYS.syncStatus, 'local-only');
  } finally {
    syncInProgress = false;
  }
}

/**
 * Sync staff data to Proton cloud
 */
export async function syncStaffToCloud(staff) {
  if (syncInProgress || !PROTON_CONFIG.enableCloudSync) {
    // Still save to localStorage even if sync disabled
    localStorage.setItem(STORAGE_KEYS.staff, JSON.stringify(staff));
    return;
  }

  syncInProgress = true;
  try {
    // Store locally first
    localStorage.setItem(STORAGE_KEYS.staff, JSON.stringify(staff));

    // Try to sync to Proton only if session exists
    if (protonSession && protonSession.accessToken) {
      try {
        const response = await fetch(`${PROTON_CONFIG.apiUrl}/data/staff`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${protonSession.accessToken}`,
          },
          body: JSON.stringify({
            data: staff,
            timestamp: new Date().toISOString(),
          }),
          timeout: 5000,
        });

        if (response.ok) {
          localStorage.setItem(STORAGE_KEYS.lastSync, new Date().toISOString());
          localStorage.setItem(STORAGE_KEYS.syncStatus, 'synced');
          if (PROTON_CONFIG.debug) console.log('Staff synced to cloud');
        } else {
          localStorage.setItem(STORAGE_KEYS.syncStatus, 'local-only');
        }
      } catch (fetchErr) {
        // API not available, just use local storage
        if (PROTON_CONFIG.debug) console.warn('Proton API unavailable, using localStorage:', fetchErr.message);
        localStorage.setItem(STORAGE_KEYS.syncStatus, 'local-only');
      }
    } else {
      localStorage.setItem(STORAGE_KEYS.syncStatus, 'local-only');
    }
  } catch (error) {
    console.error('Failed to sync staff to cloud:', error);
    localStorage.setItem(STORAGE_KEYS.syncStatus, 'local-only');
  } finally {
    syncInProgress = false;
  }
}

/**
 * Fetch patients from cloud, fallback to localStorage
 */
export async function fetchPatientsFromCloud() {
  try {
    if (protonSession && protonSession.accessToken && PROTON_CONFIG.enableCloudSync) {
      try {
        const response = await fetch(`${PROTON_CONFIG.apiUrl}/data/patients`, {
          headers: {
            'Authorization': `Bearer ${protonSession.accessToken}`,
          },
          timeout: 5000,
        });

        if (response.ok) {
          const cloudData = await response.json();
          const patients = cloudData.data || [];
          // Update local cache
          localStorage.setItem(STORAGE_KEYS.patients, JSON.stringify(patients));
          if (PROTON_CONFIG.debug) console.log('Patients fetched from cloud');
          return patients;
        }
      } catch (err) {
        if (PROTON_CONFIG.debug) console.warn('Proton API fetch failed:', err.message);
      }
    }
  } catch (error) {
    console.warn('Failed to fetch patients from cloud:', error.message);
  }

  // Fallback to localStorage
  try {
    const local = localStorage.getItem(STORAGE_KEYS.patients);
    return local ? JSON.parse(local) : [];
  } catch {
    return [];
  }
}

/**
 * Fetch staff from cloud, fallback to localStorage
 */
export async function fetchStaffFromCloud() {
  try {
    if (protonSession && protonSession.accessToken && PROTON_CONFIG.enableCloudSync) {
      try {
        const response = await fetch(`${PROTON_CONFIG.apiUrl}/data/staff`, {
          headers: {
            'Authorization': `Bearer ${protonSession.accessToken}`,
          },
          timeout: 5000,
        });

        if (response.ok) {
          const cloudData = await response.json();
          const staff = cloudData.data || [];
          // Update local cache
          localStorage.setItem(STORAGE_KEYS.staff, JSON.stringify(staff));
          if (PROTON_CONFIG.debug) console.log('Staff fetched from cloud');
          return staff;
        }
      } catch (err) {
        if (PROTON_CONFIG.debug) console.warn('Proton API fetch failed:', err.message);
      }
    }
  } catch (error) {
    console.warn('Failed to fetch staff from cloud:', error.message);
  }

  // Fallback to localStorage
  try {
    const local = localStorage.getItem(STORAGE_KEYS.staff);
    return local ? JSON.parse(local) : [];
  } catch {
    return [];
  }
}

/**
 * Get sync status
 */
export function getSyncStatus() {
  return {
    status: localStorage.getItem(STORAGE_KEYS.syncStatus) || 'unknown',
    lastSync: localStorage.getItem(STORAGE_KEYS.lastSync) || 'never',
    inProgress: syncInProgress,
    isConnected: !!protonSession,
  };
}

/**
 * Clear all cloud data
 */
export async function clearCloudData() {
  try {
    if (protonSession && PROTON_CONFIG.enableCloudSync) {
      await fetch(`${PROTON_CONFIG.apiUrl}/data/clear`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${protonSession.accessToken}`,
        },
      });
    }
  } catch (error) {
    console.error('Failed to clear cloud data:', error);
  }

  // Clear local cache
  localStorage.removeItem(STORAGE_KEYS.patients);
  localStorage.removeItem(STORAGE_KEYS.staff);
  localStorage.removeItem(STORAGE_KEYS.lastSync);
  localStorage.removeItem(STORAGE_KEYS.syncStatus);
}

/**
 * Check if cloud is connected
 */
export function isCloudConnected() {
  return !!protonSession;
}
