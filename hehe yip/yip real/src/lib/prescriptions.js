/**
 * prescriptions.js
 *
 * Prescription system for doctors to authorize changes to patient data
 * Each prescription creates an audit trail of modifications
 */

import { syncPatientsToCloud } from './cloudStorage.js';

const STORAGE_KEY = 'axonite_prescriptions';

/**
 * Create a new prescription for patient data modification
 */
export function createPrescription({
  patientId,
  doctorName,
  doctorEmail,
  changeType,
  description,
  changes,
  notes,
}) {
  const prescriptions = getAllPrescriptions();

  const newPrescription = {
    id: crypto.randomUUID(),
    patientId,
    doctorName,
    doctorEmail,
    changeType,
    description,
    changes,
    notes,
    status: 'pending',
    createdAt: new Date().toISOString(),
    approvedAt: null,
    appliedAt: null,
  };

  prescriptions.push(newPrescription);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prescriptions));

  return newPrescription;
}

/**
 * Get all prescriptions
 */
export function getAllPrescriptions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Get prescriptions for a specific patient
 */
export function getPrescriptionsByPatient(patientId) {
  return getAllPrescriptions().filter((p) => p.patientId === patientId);
}

/**
 * Get pending prescriptions for a doctor
 */
export function getPendingPrescriptionsByDoctor(doctorEmail) {
  return getAllPrescriptions().filter(
    (p) => p.doctorEmail === doctorEmail && p.status === 'pending'
  );
}

/**
 * Approve a prescription
 */
export function approvePrescription(prescriptionId) {
  const prescriptions = getAllPrescriptions();
  const prescription = prescriptions.find((p) => p.id === prescriptionId);

  if (!prescription) {
    throw new Error('Prescription not found');
  }

  prescription.status = 'approved';
  prescription.approvedAt = new Date().toISOString();

  localStorage.setItem(STORAGE_KEY, JSON.stringify(prescriptions));
  return prescription;
}

/**
 * Reject a prescription
 */
export function rejectPrescription(prescriptionId, reason) {
  const prescriptions = getAllPrescriptions();
  const prescription = prescriptions.find((p) => p.id === prescriptionId);

  if (!prescription) {
    throw new Error('Prescription not found');
  }

  prescription.status = 'rejected';
  prescription.rejectionReason = reason;
  prescription.approvedAt = new Date().toISOString();

  localStorage.setItem(STORAGE_KEY, JSON.stringify(prescriptions));
  return prescription;
}

/**
 * Apply an approved prescription to patient data
 */
export function applyPrescription(prescriptionId, patients) {
  const prescriptions = getAllPrescriptions();
  const prescription = prescriptions.find((p) => p.id === prescriptionId);

  if (!prescription) {
    throw new Error('Prescription not found');
  }

  if (prescription.status !== 'approved') {
    throw new Error('Prescription must be approved before applying');
  }

  if (prescription.status === 'completed') {
    throw new Error('Prescription has already been applied');
  }

  const patientIndex = patients.findIndex((p) => p.id === prescription.patientId);
  if (patientIndex === -1) {
    throw new Error('Patient not found');
  }

  const patient = patients[patientIndex];

  switch (prescription.changeType) {
    case 'medication':
      if (!patient.medications) patient.medications = [];
      if (prescription.changes.action === 'add') {
        patient.medications.push(prescription.changes.value);
      } else if (prescription.changes.action === 'remove') {
        patient.medications = patient.medications.filter(
          (m) => m.name !== prescription.changes.value.name
        );
      }
      break;

    case 'medical_history':
      if (!patient.medicalHistory) patient.medicalHistory = [];
      if (prescription.changes.action === 'add') {
        patient.medicalHistory.push(prescription.changes.value);
      }
      break;

    case 'allergy':
      patient.allergies = prescription.changes.value;
      break;

    case 'emergency_contact':
      patient.emergencyContact = prescription.changes.value;
      break;

    case 'health_status':
      patient.healthStatus = prescription.changes.value;
      break;

    case 'blood_group':
      patient.bloodGroup = prescription.changes.value;
      break;

    default:
      throw new Error(`Unknown change type: ${prescription.changeType}`);
  }

  prescription.status = 'completed';
  prescription.appliedAt = new Date().toISOString();

  localStorage.setItem(STORAGE_KEY, JSON.stringify(prescriptions));
  syncPatientsToCloud(patients);

  return {
    prescription,
    updatedPatient: patient,
  };
}

/**
 * Get prescription history for a patient
 */
export function getPrescriptionHistory(patientId) {
  return getAllPrescriptions()
    .filter((p) => p.patientId === patientId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

/**
 * Get audit log for a patient
 */
export function getPatientAuditLog(patientId) {
  return getPrescriptionHistory(patientId).map((p) => ({
    timestamp: p.appliedAt || p.createdAt,
    doctor: p.doctorName,
    action: p.changeType,
    description: p.description,
    status: p.status,
    changes: p.changes,
    notes: p.notes,
  }));
}
