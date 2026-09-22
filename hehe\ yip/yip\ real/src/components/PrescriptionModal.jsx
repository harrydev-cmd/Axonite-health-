import React, { useState } from 'react';

export function PrescriptionModal({ patient, doctor, onClose, onSubmit }) {
  const [changeType, setChangeType] = useState('medication');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [medicationName, setMedicationName] = useState('');
  const [medicationStatus, setMedicationStatus] = useState('As needed');
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    let changes = {};

    if (changeType === 'medication') {
      changes = {
        action: 'add',
        value: { name: medicationName, status: medicationStatus },
      };
    } else {
      changes = { value };
    }

    onSubmit({
      patientId: patient.id,
      doctorName: doctor.name,
      doctorEmail: doctor.email,
      changeType,
      description,
      changes,
      notes,
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card prescription-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        <h2>Create Prescription</h2>
        <p className="modal-subtitle">
          Modify data for <strong>{patient.name}</strong>
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Change Type</label>
            <select
              value={changeType}
              onChange={(e) => setChangeType(e.target.value)}
              className="form-control"
            >
              <option value="medication">Add Medication</option>
              <option value="medical_history">Add Medical History</option>
              <option value="allergy">Update Allergies</option>
              <option value="emergency_contact">Update Emergency Contact</option>
              <option value="health_status">Update Health Status</option>
              <option value="blood_group">Update Blood Group</option>
            </select>
          </div>

          {changeType === 'medication' && (
            <>
              <div className="form-group">
                <label>Medication Name</label>
                <input
                  type="text"
                  value={medicationName}
                  onChange={(e) => setMedicationName(e.target.value)}
                  placeholder="e.g., Ibuprofen 400mg"
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <label>Frequency</label>
                <select
                  value={medicationStatus}
                  onChange={(e) => setMedicationStatus(e.target.value)}
                  className="form-control"
                >
                  <option value="Daily">Daily</option>
                  <option value="Twice daily">Twice daily</option>
                  <option value="As needed">As needed</option>
                  <option value="Once weekly">Once weekly</option>
                </select>
              </div>
            </>
          )}

          {changeType !== 'medication' && (
            <div className="form-group">
              <label>New Value</label>
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Enter new value"
                className="form-control"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Clinical Reason</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Why is this change necessary?"
              className="form-control"
              rows="3"
              required
            />
          </div>

          <div className="form-group">
            <label>Additional Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional information..."
              className="form-control"
              rows="2"
            />
          </div>

          <div className="modal-buttons">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Create Prescription
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
