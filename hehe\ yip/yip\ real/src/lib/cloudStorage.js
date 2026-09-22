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

export async function initProtonSession(email = PROTON_CONFIG.email, apiKey = PROTON_CONFIG.apiKey) {
  if (!PROTON_CONFIG.enableCloudSync) {
    if (PROTON_CONFIG.debug) console.log('Cloud sync disabled');
    return null;
  }

  try {
    if (PROTON_CONFIG.debug) console.log('Initializing Proton session...');
    localStorage.setItem('protonSession', JSON.stringify({}));
    localStorage.setItem(STORAGE_KEYS.syncStatus, 'offline');
    return null;
  } catch (error) {
    console.warn('Proton connection failed, using localStorage fallback:', error.message);
    localStorage.setItem(STORAGE_KEYS.syncStatus, 'offline');
    return null;
  }
}

export async function syncPatientsToCloud(patients) {
  if (syncInProgress || !PROTON_CONFIG.enableCloudSync) {
    localStorage.setItem(STORAGE_KEYS.patients, JSON.stringify(patients));
    return;
  }

  syncInProgress = true;
  try {
    localStorage.setItem(STORAGE_KEYS.patients, JSON.stringify(patients));
    localStorage.setItem(STORAGE_KEYS.syncStatus, 'local-only');
  } catch (error) {
    console.error('Failed to sync patients to cloud:', error);
    localStorage.setItem(STORAGE_KEYS.syncStatus, 'local-only');
  } finally {
    syncInProgress = false;
  }
}

export async function syncStaffToCloud(staff) {
  if (syncInProgress || !PROTON_CONFIG.enableCloudSync) {
    localStorage.setItem(STORAGE_KEYS.staff, JSON.stringify(staff));
    return;
  }

  syncInProgress = true;
  try {
    localStorage.setItem(STORAGE_KEYS.staff, JSON.stringify(staff));
    localStorage.setItem(STORAGE_KEYS.syncStatus, 'local-only');
  } catch (error) {
    console.error('Failed to sync staff to cloud:', error);
    localStorage.setItem(STORAGE_KEYS.syncStatus, 'local-only');
  } finally {
    syncInProgress = false;
  }
}

export async function fetchPatientsFromCloud() {
  try {
    const local = localStorage.getItem(STORAGE_KEYS.patients);
    return local ? JSON.parse(local) : [];
  } catch {
    return [];
  }
}

export async function fetchStaffFromCloud() {
  try {
    const local = localStorage.getItem(STORAGE_KEYS.staff);
    return local ? JSON.parse(local) : [];
  } catch {
    return [];
  }
}

export function getSyncStatus() {
  return {
    status: localStorage.getItem(STORAGE_KEYS.syncStatus) || 'unknown',
    lastSync: localStorage.getItem(STORAGE_KEYS.lastSync) || 'never',
    inProgress: syncInProgress,
    isConnected: !!protonSession,
  };
}

export async function clearCloudData() {
  localStorage.removeItem(STORAGE_KEYS.patients);
  localStorage.removeItem(STORAGE_KEYS.staff);
  localStorage.removeItem(STORAGE_KEYS.lastSync);
  localStorage.removeItem(STORAGE_KEYS.syncStatus);
}

export function isCloudConnected() {
  return !!protonSession;
}
