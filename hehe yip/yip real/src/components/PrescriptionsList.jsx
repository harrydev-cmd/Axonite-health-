import React, { useState } from 'react';
import {
  getPendingPrescriptionsByDoctor,
  approvePrescription,
  rejectPrescription,
  applyPrescription,
} from '../lib/prescriptions';

export function PrescriptionsList({ doctor, allPatients, onPrescriptionsUpdated }) {
  const [prescriptions, setPrescriptions] = useState(() =>
    getPendingPrescriptionsByDoctor(doctor.email)
  );
  const [expandedId, setExpandedId] = useState(null);
  const [rejectReason, setRejectReason] = useState({});
  const [loading, setLoading] = useState({});
  const [error, setError] = useState('');

  const getPatientName = (patientId) => {
    const patient = allPatients.find((p) => p.id === patientId);
    return patient ? patient.name : 'Unknown Patient';
  };

  const handleApprove = async (prescriptionId) => {
    setLoading({ ...loading, [prescriptionId]: true });
    try {
      approvePrescription(prescriptionId);
      setPrescriptions(prescriptions.map((p) =>
        p.id === prescriptionId ? { ...p, status: 'approved' } : p
      ));
      onPrescriptionsUpdated();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading({ ...loading, [prescriptionId]: false });
    }
  };

  const handleReject = async (prescriptionId) => {
    const reason = rejectReason[prescriptionId] || 'No reason provided';
    setLoading({ ...loading, [prescriptionId]: true });
    try {
      rejectPrescription(prescriptionId, reason);
      setPrescriptions(prescriptions.filter((p) => p.id !== prescriptionId));
      onPrescriptionsUpdated();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading({ ...loading, [prescriptionId]: false });
    }
  };

  const handleApply = async (prescriptionId) => {
    setLoading({ ...loading, [prescriptionId]: true });
    try {
      applyPrescription(prescriptionId, allPatients);
      setPrescriptions(prescriptions.map((p) =>
        p.id === prescriptionId ? { ...p, status: 'completed' } : p
      ));
      onPrescriptionsUpdated();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading({ ...loading, [prescriptionId]: false });
    }
  };

  const pending = prescriptions.filter((p) => p.status === 'pending');
  const approved = prescriptions.filter((p) => p.status === 'approved');
  const completed = prescriptions.filter((p) => p.status === 'completed');

  const renderPrescription = (rx) => (
    <div
      key={rx.id}
      className="prescription-item"
      style={{
        opacity: rx.status === 'completed' ? 0.7 : 1,
      }}
    >
      <div className="prescription-header" onClick={() =>
        setExpandedId(expandedId === rx.id ? null : rx.id)
      }>
        <div className="prescription-info">
          <strong>{getPatientName(rx.patientId)}</strong>
          <span className="prescription-type">
            {rx.changeType.replace('_', ' ').toUpperCase()}
          </span>
          <span className="prescription-date">
            {new Date(rx.createdAt).toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </span>
        </div>
        <div className={`prescription-badge status-${rx.status}`}>
          {rx.status.charAt(0).toUpperCase() + rx.status.slice(1)}
        </div>
      </div>

      {expandedId === rx.id && (
        <div className="prescription-details">
          <div className="detail-row">
            <span>Description:</span>
            <strong>{rx.description}</strong>
          </div>

          {rx.changes && (
            <div className="detail-row">
              <span>Changes:</span>
              <div className="changes-preview">
                {rx.changeType === 'medication' && (
                  <>
                    <p>
                      <strong>{rx.changes.action === 'add' ? 'Add' : 'Remove'}:</strong>{' '}
                      {rx.changes.value.name}
                      {rx.changes.action === 'add' &&
                        rx.changes.value.dosage &&
                        ` - ${rx.changes.value.dosage}`}
                    </p>
                    {rx.changes.action === 'add' && rx.changes.value.frequency && (
                      <p>
                        <strong>Frequency:</strong> {rx.changes.value.frequency}
                      </p>
                    )}
                  </>
                )}
                {rx.changeType === 'medical_history' && (
                  <>
                    <p>
                      <strong>Entry:</strong> {rx.changes.value.title}
                    </p>
                    {rx.changes.value.details && (
                      <p>
                        <strong>Details:</strong> {rx.changes.value.details}
                      </p>
                    )}
                  </>
                )}
                {!['medication', 'medical_history'].includes(rx.changeType) && (
                  <p>
                    <strong>Update:</strong> {rx.changes.value}
                  </p>
                )}
              </div>
            </div>
          )}

          {rx.notes && (
            <div className="detail-row">
              <span>Notes:</span>
              <p>{rx.notes}</p>
            </div>
          )}

          <div className="prescription-actions">
            {rx.status === 'pending' && (
              <>
                <button
                  className="btn-approve"
                  onClick={() => handleApprove(rx.id)}
                  disabled={loading[rx.id]}
                >
                  {loading[rx.id] ? '...' : '✓ Approve'}
                </button>
                <button
                  className="btn-reject"
                  onClick={() => handleReject(rx.id)}
                  disabled={loading[rx.id]}
                >
                  {loading[rx.id] ? '...' : '✕ Reject'}
                </button>
              </>
            )}
            {rx.status === 'approved' && (
              <button
                className="btn-apply"
                onClick={() => handleApply(rx.id)}
                disabled={loading[rx.id]}
              >
                {loading[rx.id] ? '...' : '→ Apply Changes'}
              </button>
            )}
            {rx.status === 'completed' && (
              <span className="status-completed">Applied</span>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="prescriptions-list-card">
      <div className="records-header">
        <div>
          <span className="card-icon">💊</span>
          <h2>Prescription Management</h2>
          <p>Review, approve, and apply patient data modifications.</p>
        </div>
      </div>

      {error && <div className="error-message">⚠ {error}</div>}

      {pending.length === 0 && approved.length === 0 && completed.length === 0 ? (
        <div className="records-empty">
          <span>📋</span>
          <p>No prescriptions yet.</p>
        </div>
      ) : (
        <>
          {pending.length > 0 && (
            <div className="prescription-section">
              <h3 className="section-title">
                Pending ({pending.length})
              </h3>
              <div className="prescription-list">
                {pending.map(renderPrescription)}
              </div>
            </div>
          )}

          {approved.length > 0 && (
            <div className="prescription-section">
              <h3 className="section-title">
                Approved ({approved.length})
              </h3>
              <div className="prescription-list">
                {approved.map(renderPrescription)}
              </div>
            </div>
          )}

          {completed.length > 0 && (
            <div className="prescription-section">
              <h3 className="section-title">
                Applied ({completed.length})
              </h3>
              <div className="prescription-list">
                {completed.map(renderPrescription)}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
