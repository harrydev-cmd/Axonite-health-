/**
 * patients.js
 *
 * Simple patient store backed by localStorage.
 * All registered patient records are kept under the key "axonite_patients".
 *
 * Record shape:
 * {
 *   id        : string   – auto-generated unique ID
 *   name      : string
 *   email     : string
 *   password  : string   – stored as plain text (demo only; hash in production)
 *   idType    : string   – e.g. "aadhaar", "passport", …
 *   idFileName: string   – original filename of the uploaded ID proof
 *   registeredAt: string – ISO 8601 date-time string
 * }
 */

const STORAGE_KEY = "axonite_patients";

/** Return all stored patient records as an array. */
export function getAllPatients() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/** Save a new patient record. Returns the saved record (with generated id). */
export function registerPatient({ name, email, password, idType, idFileName }) {
  const patients = getAllPatients();

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
  localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
  return newPatient;
}

/** Find a patient by email. Returns the record or undefined. */
export function findPatientByEmail(email) {
  return getAllPatients().find(
    (p) => p.email.toLowerCase() === email.toLowerCase()
  );
}

/** Check email + password for login. Returns the patient record or null. */
export function authenticatePatient(email, password) {
  const patient = findPatientByEmail(email);
  if (patient && patient.password === password) return patient;
  return null;
}
