/**
 * cloudStorage.js
 *
 * Cloud storage abstraction layer using Proton API
 * Syncs data with Proton backend while maintaining localStorage as fallback
 */

const PROTON_API_URL = 'https://mail-api.proton.me/api';
const STORAGE_KEYS = {
  patients: 'axonite_patients',
  staff: 'axonite_staff',
  lastSync: 'axonite_lastSync',
  syncStatus: 'axonite_syncStatus',
};

let protonSession = null;
let syncInProgress = false;

/**
 * Initialize Proton session
 * Note: In production, implement proper OAuth flow with Proton
 */
export async function initProtonSession(email, password) {
  try {
    // This is a placeholder for Proton authentication
    // In production, use Proton's OAuth or API key
    const response = await fetch(`${PROTON_API_URL}/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      protonSession = await response.json();
      localStorage.setItem('protonSession', JSON.stringify(protonSession));
      return protonSession;
    } else {
      console.warn('Proton authentication failed, using localStorage fallback');
      return null;
    }
  } catch (error) {
    console.warn('Proton connection failed, using localStorage fallback:', error);
    return null;
  }
}

/**
 * Sync patients data to Proton cloud
 */
export async function syncPatientsToCloud(patients) {
  if (syncInProgress) return;

  syncInProgress = true;
  try {
    // Store locally first
    localStorage.setItem(STORAGE_KEYS.patients, JSON.stringify(patients));

    // Try to sync to Proton
    if (protonSession) {
      await fetch(`${PROTON_API_URL}/data/patients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${protonSession.accessToken}`,
        },
        body: JSON.stringify({
          data: patients,
          timestamp: new Date().toISOString(),
        }),
      });

      localStorage.setItem(STORAGE_KEYS.lastSync, new Date().toISOString());
      localStorage.setItem(STORAGE_KEYS.syncStatus, 'synced');
    } else {
      localStorage.setItem(STORAGE_KEYS.syncStatus, 'pending');
    }
  } catch (error) {
    console.error('Failed to sync patients to cloud:', error);
    localStorage.setItem(STORAGE_KEYS.syncStatus, 'failed');
  } finally {
    syncInProgress = false;
  }
}

/**
 * Sync staff data to Proton cloud
 */
export async function syncStaffToCloud(staff) {
  if (syncInProgress) return;

  syncInProgress = true;
  try {
    // Store locally first
    localStorage.setItem(STORAGE_KEYS.staff, JSON.stringify(staff));

    // Try to sync to Proton
    if (protonSession) {
      await fetch(`${PROTON_API_URL}/data/staff`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${protonSession.accessToken}`,
        },
        body: JSON.stringify({
          data: staff,
          timestamp: new Date().toISOString(),
        }),
      });

      localStorage.setItem(STORAGE_KEYS.lastSync, new Date().toISOString());
      localStorage.setItem(STORAGE_KEYS.syncStatus, 'synced');
    } else {
      localStorage.setItem(STORAGE_KEYS.syncStatus, 'pending');
    }
  } catch (error) {
    console.error('Failed to sync staff to cloud:', error);
    localStorage.setItem(STORAGE_KEYS.syncStatus, 'failed');
  } finally {
    syncInProgress = false;
  }
}

/**
 * Fetch patients from cloud, fallback to localStorage
 */
export async function fetchPatientsFromCloud() {
  try {
    if (protonSession) {
      const response = await fetch(`${PROTON_API_URL}/data/patients`, {
        headers: {
          'Authorization': `Bearer ${protonSession.accessToken}`,
        },
      });

      if (response.ok) {
        const cloudData = await response.json();
        const patients = cloudData.data || [];
        // Update local cache
        localStorage.setItem(STORAGE_KEYS.patients, JSON.stringify(patients));
        return patients;
      }
    }
  } catch (error) {
    console.warn('Failed to fetch from cloud, using localStorage:', error);
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
    if (protonSession) {
      const response = await fetch(`${PROTON_API_URL}/data/staff`, {
        headers: {
          'Authorization': `Bearer ${protonSession.accessToken}`,
        },
      });

      if (response.ok) {
        const cloudData = await response.json();
        const staff = cloudData.data || [];
        // Update local cache
        localStorage.setItem(STORAGE_KEYS.staff, JSON.stringify(staff));
        return staff;
      }
    }
  } catch (error) {
    console.warn('Failed to fetch staff from cloud, using localStorage:', error);
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
    if (protonSession) {
      await fetch(`${PROTON_API_URL}/data/clear`, {
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
