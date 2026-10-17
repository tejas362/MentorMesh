import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, MessageSquare, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function RequestCard({ request, isAlumniView = false, onStatusChange }) {
  const [isResponding, setIsResponding] = useState(false);
  const [responseAction, setResponseAction] = useState(null); // 'accepted' or 'rejected'
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const targetUser = isAlumniView ? request.student : request.alumni;
  const targetProfile = isAlumniView ? request.student?.student_profile : request.alumni?.alumni_profile;

  const handleOpenResponse = (action) => {
    setResponseAction(action);
    setNote(action === 'accepted' ? 'Happy to connect! Let us schedule a 20-minute Zoom call.' : 'Thank you for reaching out. Unfortunately, I am at mentorship capacity this term.');
    setIsResponding(true);
  };

  const handleSubmitResponse = async (e) => {
    e.preventDefault();
    if (!responseAction) return;

    setSubmitting(true);
    try {
      await onStatusChange(request.id, responseAction, note);
      setIsResponding(false);
    } catch (err) {
      console.error('Failed to update status', err);
    } finally {
      setSubmitting(false);
    }
  };

  const formattedDate = new Date(request.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="card" style={{
      backgroundColor: 'var(--color-white)',
      border: '1px solid var(--color-gray-200)',
      borderRadius: 'var(--radius-lg)',
      padding: '1.5rem',
      marginBottom: '1rem'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        marginBottom: '1rem',
        paddingBottom: '0.875rem',
        borderBottom: '1px solid var(--color-gray-100)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {targetUser?.avatar_url ? (
            <img
              src={targetUser.avatar_url}
              alt={targetUser.full_name}
              style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-primary-700)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700
            }}>
              {targetUser?.full_name?.charAt(0) || 'U'}
            </div>
          )}

          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-primary-900)' }}>
              {isAlumniView ? (
                <span>Student: {targetUser?.full_name}</span>
              ) : (
                <Link to={`/alumni/${targetUser?.id}`} style={{ textDecoration: 'none' }}>
                  Mentor: {targetUser?.full_name}
                </Link>
              )}
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--color-gray-500)' }}>
              {isAlumniView ? (
                <span>{targetProfile?.major || 'Student'} &bull; Class of {targetProfile?.graduation_year || 'N/A'}</span>
              ) : (
                <span>{targetProfile?.current_role} at {targetProfile?.company}</span>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-gray-400)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Calendar size={13} /> {formattedDate}
          </span>
          <StatusBadge status={request.status} />
        </div>
      </div>

      {/* Request Details */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-gray-500)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
          Discussion Topic
        </div>
        <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-primary-800)', marginBottom: '0.5rem' }}>
          {request.topic}
        </div>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-700)', lineHeight: 1.5, whiteSpace: 'pre-line' }}>
          "{request.message}"
        </p>
      </div>

      {/* Alumni Response Note if exists */}
      {request.response_note && (
        <div style={{
          backgroundColor: request.status === 'accepted' ? 'var(--color-success-50)' : 'var(--color-gray-100)',
          borderLeft: `4px solid ${request.status === 'accepted' ? '#16a34a' : '#94a3b8'}`,
          padding: '0.875rem 1rem',
          borderRadius: '0 var(--radius-md) var(--radius-md) 0',
          marginBottom: '1rem',
          fontSize: '0.875rem'
        }}>
          <div style={{ fontWeight: 600, color: 'var(--color-gray-800)', marginBottom: '0.2rem' }}>
            Alumni Response Note:
          </div>
          <div style={{ color: 'var(--color-gray-700)' }}>
            {request.response_note}
          </div>
        </div>
      )}

      {/* Alumni Action Controls (Only visible to Alumni on pending requests) */}
      {isAlumniView && request.status === 'pending' && !isResponding && (
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--color-gray-100)' }}>
          <button
            onClick={() => handleOpenResponse('accepted')}
            className="btn btn-sm"
            style={{ backgroundColor: 'var(--color-success-600)', color: '#fff', border: 'none' }}
          >
            <CheckCircle size={15} /> Accept Mentorship Request
          </button>
          <button
            onClick={() => handleOpenResponse('rejected')}
            className="btn btn-sm btn-secondary"
            style={{ color: 'var(--color-danger-600)' }}
          >
            <XCircle size={15} /> Decline
          </button>
        </div>
      )}

      {/* Response Note Form Drawer */}
      {isResponding && (
        <form onSubmit={handleSubmitResponse} style={{
          marginTop: '1rem',
          padding: '1rem',
          backgroundColor: 'var(--color-gray-50)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-gray-300)'
        }}>
          <div className="form-group" style={{ marginBottom: '0.75rem' }}>
            <label className="form-label" style={{ fontSize: '0.8125rem' }}>
              {responseAction === 'accepted' ? 'Add meeting instructions or Zoom/Google Meet link for student:' : 'Add a brief polite reason for declining:'}
            </label>
            <textarea
              className="form-textarea"
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Happy to chat! Please pick a time on my calendar at..."
              required
            />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="btn btn-sm btn-secondary"
              onClick={() => setIsResponding(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-sm"
              style={{
                backgroundColor: responseAction === 'accepted' ? 'var(--color-success-600)' : 'var(--color-danger-600)',
                color: '#fff',
                border: 'none'
              }}
            >
              {submitting ? 'Updating...' : `Confirm ${responseAction === 'accepted' ? 'Acceptance' : 'Decline'}`}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
