import React, { useState } from 'react';
import {
  approvePrescription,
  rejectPrescription,
  applyPrescription,
} from '../lib/prescriptions.js';

export function PrescriptionsList({ prescriptions, patients, onUpdate }) {
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const handleApprove = (prescriptionId) => {
    try {
      approvePrescription(prescriptionId);
      onUpdate();
    } catch (err) {
      alert('Error approving prescription: ' + err.message);
    }
  };

  const handleApply = (prescriptionId) => {
    try {
      applyPrescription(prescriptionId, patients);
      onUpdate();
      alert('Prescription applied successfully');
    } catch (err) {
      alert('Error applying prescription: ' + err.message);
    }
  };

  const handleReject = (prescriptionId) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    try {
      rejectPrescription(prescriptionId, rejectionReason);
      setSelectedPrescription(null);
      setRejectionReason('');
      onUpdate();
    } catch (err) {
      alert('Error rejecting prescription: ' + err.message);
    }
  };

  const statusColor = {
    pending: '#FFA500',
    approved: '#4CAF50',
    completed: '#2196F3',
    rejected: '#f44336',
  };

  if (prescriptions.length === 0) {
    return (
      <div className="prescriptions-empty">
        <span>📋</span>
        <p>No prescriptions at this time</p>
      </div>
    );
  }

  return (
    <div className="prescriptions-list">
      <div className="prescriptions-header">
        <h3>📋 Pending Prescriptions</h3>
        <span className="badge">{prescriptions.length}</span>
      </div>

      {prescriptions.map((rx) => (
        <div key={rx.id} className="prescription-card">
          <div className="prescription-top">
            <div>
              <h4>{rx.description}</h4>
              <p className="prescription-doctor">Dr. {rx.doctorName}</p>
            </div>
            <span
              className="prescription-status"
              style={{ backgroundColor: statusColor[rx.status] }}
            >
              {rx.status.toUpperCase()}
            </span>
          </div>

          <div className="prescription-details">
            <div className="detail">
              <span className="label">Type:</span>
              <span className="value">{rx.changeType.replace('_', ' ')}</span>
            </div>
            <div className="detail">
              <span className="label">Created:</span>
              <span className="value">
                {new Date(rx.createdAt).toLocaleDateString()}
              </span>
            </div>
            {rx.notes && (
              <div className="detail full-width">
                <span className="label">Notes:</span>
                <p className="value">{rx.notes}</p>
              </div>
            )}
          </div>

          <div className="prescription-actions">
            {rx.status === 'pending' && (
              <>
                <button
                  className="btn-approve"
                  onClick={() => handleApprove(rx.id)}
                >
                  ✓ Approve
                </button>
                <button
                  className="btn-reject"
                  onClick={() => setSelectedPrescription(rx.id)}
                >
                  ✕ Reject
                </button>
              </>
            )}

            {rx.status === 'approved' && (
              <button className="btn-apply" onClick={() => handleApply(rx.id)}>
                ▶ Apply Change
              </button>
            )}

            {rx.status === 'completed' && (
              <span className="completed-text">✓ Applied</span>
            )}
          </div>

          {selectedPrescription === rx.id && (
            <div className="rejection-form">
              <textarea
                placeholder="Reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows="2"
              />
              <div className="rejection-buttons">
                <button
                  onClick={() => {
                    setSelectedPrescription(null);
                    setRejectionReason('');
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleReject(rx.id)}
                  className="btn-reject"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
