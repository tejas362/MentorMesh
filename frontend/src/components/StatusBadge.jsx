import React from 'react';
import { Clock, CheckCircle2, XCircle, Sparkles, AlertCircle } from 'lucide-react';

export default function StatusBadge({ status, type = 'status' }) {
  if (type === 'availability') {
    if (status) {
      return (
        <span className="badge badge-available">
          <Sparkles size={12} /> Open for Mentorship
        </span>
      );
    }
    return (
      <span className="badge badge-unavailable">
        <Clock size={12} /> Unavailable
      </span>
    );
  }

  const s = (status || '').toLowerCase();

  if (s === 'accepted') {
    return (
      <span className="badge badge-accepted">
        <CheckCircle2 size={13} /> Accepted
      </span>
    );
  }
  if (s === 'rejected') {
    return (
      <span className="badge badge-rejected">
        <XCircle size={13} /> Closed / Declined
      </span>
    );
  }
  return (
    <span className="badge badge-pending">
      <Clock size={13} /> Pending Review
    </span>
  );
}
