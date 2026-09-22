/**
 * patients.js
 *
 * Patient store with cloud sync support.
 * All registered patient records are kept under the key "axonite_patients".
 * Data syncs to Proton cloud with localStorage as fallback.
 *
 * Record shape:
 * {
 *   id        : string   – auto-generated unique ID
 *   name      : string
 *   email     : string
 *   password  : string   – stored as plain text (demo only; hash in production)
 *   idType    : string   – e.g. "passport", "aadhaar", …
 *   idFileName: string   – original filename of the uploaded ID proof
 *   registeredAt: string – ISO 8601 date-time string
 * }
 */

import { syncPatientsToCloud, fetchPatientsFromCloud } from './cloudStorage.js';

const STORAGE_KEY = "axonite_patients";

/** Return all stored patient records as an array. */
export async function getAllPatients() {
  try {
    // Try to fetch from cloud first, fallback to localStorage
    const patients = await fetchPatientsFromCloud();
    return patients;
  } catch {
    // Fallback to localStorage
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
}

/** Save a new patient record. Returns the saved record (with generated id). */
export async function registerPatient({ name, email, password, idType, idFileName }) {
  const patients = await getAllPatients();

  const newPatient = {
    id: crypto.randomUUID(),
    name,
    email,
    password,           // ⚠ plain text – replace with a hash before going to production
    idType,
    idFileName,
    registeredAt: new Date().toISOString(),
  };

  patients.push(newPatient);
  
  // Sync to cloud and localStorage
  await syncPatientsToCloud(patients);
  
  return newPatient;
}

/** Find a patient by email. Returns the record or undefined. */
export async function findPatientByEmail(email) {
  const patients = await getAllPatients();
  return patients.find(
    (p) => p.email.toLowerCase() === email.toLowerCase()
  );
}

/** Check email + password for login. Returns the patient record or null. */
export async function authenticatePatient(email, password) {
  const patient = await findPatientByEmail(email);
  if (patient && patient.password === password) return patient;
  return null;
}



