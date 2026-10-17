import React from 'react';
import { Check, AlertCircle, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  if (!message) return null;

  return (
    <div className="toast" role="status" aria-live="polite">
      {type === 'success' ? (
        <Check size={18} style={{ color: '#4ade80' }} />
      ) : (
        <AlertCircle size={18} style={{ color: '#f87171' }} />
      )}
      <span>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px', marginLeft: '8px' }}
          aria-label="Close message"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
