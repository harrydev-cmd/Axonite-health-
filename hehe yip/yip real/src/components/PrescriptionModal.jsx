import React, { useState } from 'react';
import { createPrescription } from '../lib/prescriptions';

export function PrescriptionModal({ patient, doctor, onClose, onPrescriptionCreated }) {
  const [changeType, setChangeType] = useState('medication');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [medicationName, setMedicationName] = useState('');
  const [medicationDosage, setMedicationDosage] = useState('');
  const [medicationFrequency, setMedicationFrequency] = useState('');
  const [medicationAction, setMedicationAction] = useState('add');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let changes = {};

      if (changeType === 'medication') {
        if (!medicationName.trim()) {
          setError('Please enter medication name');
          setLoading(false);
          return;
        }

        changes = {
          action: medicationAction,
          value: {
            name: medicationName,
            dosage: medicationDosage,
            frequency: medicationFrequency,
            prescribedAt: new Date().toISOString(),
          },
        };
      } else if (changeType === 'allergy') {
        if (!description.trim()) {
          setError('Please enter allergy information');
          setLoading(false);
          return;
        }
        changes = { value: description };
      } else if (changeType === 'emergency_contact') {
        if (!description.trim()) {
          setError('Please enter emergency contact');
          setLoading(false);
          return;
        }
        changes = { value: description };
      } else if (changeType === 'health_status') {
        if (!description.trim()) {
          setError('Please enter health status');
          setLoading(false);
          return;
        }
        changes = { value: description };
      } else if (changeType === 'blood_group') {
        if (!description.trim()) {
          setError('Please enter blood group');
          setLoading(false);
          return;
        }
        changes = { value: description };
      } else if (changeType === 'medical_history') {
        if (!description.trim()) {
          setError('Please enter medical history entry');
          setLoading(false);
          return;
        }
        changes = {
          action: 'add',
          value: {
            title: description,
            date: new Date().toISOString(),
            details: notes,
          },
        };
      }

      const prescription = createPrescription({
        patientId: patient.id,
        doctorName: doctor.name,
        doctorEmail: doctor.email,
        changeType,
        description: description || medicationName,
        changes,
        notes,
      });

      onPrescriptionCreated(prescription);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create prescription');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        <h2>Create Prescription</h2>
        <p className="modal-subtitle">
          for <strong>{patient.name}</strong>
        </p>

        <form onSubmit={handleSubmit} className="prescription-form">
          {/* CHANGE TYPE */}
          <div className="form-group">
            <label>Type of Change</label>
            <select
              value={changeType}
              onChange={(e) => setChangeType(e.target.value)}
              className="form-control"
            >
              <option value="medication">Add/Remove Medication</option>
              <option value="allergy">Update Allergy Information</option>
              <option value="emergency_contact">Update Emergency Contact</option>
              <option value="health_status">Update Health Status</option>
              <option value="blood_group">Update Blood Group</option>
              <option value="medical_history">Add Medical History Entry</option>
            </select>
          </div>

          {/* MEDICATION-SPECIFIC FIELDS */}
          {changeType === 'medication' && (
            <>
              <div className="form-group">
                <label>Action</label>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      value="add"
                      checked={medicationAction === 'add'}
                      onChange={(e) => setMedicationAction(e.target.value)}
                    />
                    Add medication
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="remove"
                      checked={medicationAction === 'remove'}
                      onChange={(e) => setMedicationAction(e.target.value)}
                    />
                    Remove medication
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label>Medication Name</label>
                <input
                  type="text"
                  placeholder="e.g., Ibuprofen, Amoxicillin"
                  value={medicationName}
                  onChange={(e) => setMedicationName(e.target.value)}
                  className="form-control"
                />
              </div>

              {medicationAction === 'add' && (
                <>
                  <div className="form-group">
                    <label>Dosage</label>
                    <input
                      type="text"
                      placeholder="e.g., 500mg, 2 tablets"
                      value={medicationDosage}
                      onChange={(e) => setMedicationDosage(e.target.value)}
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label>Frequency</label>
                    <input
                      type="text"
                      placeholder="e.g., Twice daily, Once at bedtime"
                      value={medicationFrequency}
                      onChange={(e) => setMedicationFrequency(e.target.value)}
                      className="form-control"
                    />
                  </div>
                </>
              )}
            </>
          )}

          {/* OTHER CHANGE TYPES */}
          {changeType !== 'medication' && (
            <div className="form-group">
              <label>
                {changeType === 'allergy' && 'Allergy Information'}
                {changeType === 'emergency_contact' && 'Emergency Contact'}
                {changeType === 'health_status' && 'Health Status'}
                {changeType === 'blood_group' && 'Blood Group'}
                {changeType === 'medical_history' && 'Medical History Title'}
              </label>
              <input
                type="text"
                placeholder={
                  changeType === 'blood_group'
                    ? 'e.g., O+, A-, AB+'
                    : changeType === 'health_status'
                    ? 'e.g., Stable, Critical'
                    : 'Enter details'
                }
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="form-control"
              />
            </div>
          )}

          {/* NOTES */}
          <div className="form-group">
            <label>Clinical Notes</label>
            <textarea
              placeholder="Additional notes for this prescription (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="form-control"
              rows={3}
            />
          </div>

          {error && <div className="error-message">⚠ {error}</div>}

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Prescription'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
