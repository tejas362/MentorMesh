import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Inbox, CheckCircle2, Clock, XCircle, RefreshCw, Send, Plus } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import RequestCard from '../components/RequestCard';
import Toast from '../components/Toast';

export default function RequestManagementPage() {
  const { user, isStudent, isAlumni } = useAuth();

  const [activeTab, setActiveTab] = useState(isAlumni ? 'incoming' : 'sent');
  const [statusFilter, setStatusFilter] = useState('all');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  const fetchRequests = async () => {
    setLoading(true);
    try {
      if (activeTab === 'incoming') {
        const data = await api.requests.getAlumniRequests();
        setRequests(data);
      } else {
        const data = await api.requests.getStudentRequests();
        setRequests(data);
      }
    } catch (err) {
      console.error('Failed to load mentorship requests', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [activeTab]);

  const handleStatusUpdate = async (requestId, newStatus, responseNote) => {
    try {
      await api.requests.updateStatus(requestId, {
        status: newStatus,
        response_note: responseNote
      });
      setToastMessage(`Request status updated to ${newStatus}!`);
      // Refresh list
      fetchRequests();
    } catch (err) {
      alert(err.message || 'Failed to update request status.');
    }
  };

  // Filter requests based on status pill
  const filteredRequests = requests.filter((r) => {
    if (statusFilter === 'all') return true;
    return r.status.toLowerCase() === statusFilter.toLowerCase();
  });

  return (
    <div style={{ padding: '2.5rem 0 4.5rem' }}>
      <div className="container" style={{ maxWidth: '880px' }}>
        {/* Title */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Mentorship Requests
            </h1>
            <p style={{ color: 'var(--color-gray-600)', fontSize: '1.0625rem' }}>
              Track the status of your mentorship inquiries and manage incoming student requests.
            </p>
          </div>

          <Link to="/directory" className="btn btn-primary">
            <Plus size={16} /> New Request
          </Link>
        </div>

        {/* Tab Selector & Filter Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
          {/* Main Tab Toggle (Sent vs Incoming) */}
          <div style={{
            display: 'inline-flex',
            backgroundColor: 'var(--color-gray-200)',
            padding: '0.25rem',
            borderRadius: 'var(--radius-lg)'
          }}>
            <button
              onClick={() => setActiveTab('sent')}
              style={{
                padding: '0.45rem 1rem',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                backgroundColor: activeTab === 'sent' ? 'var(--color-white)' : 'transparent',
                color: activeTab === 'sent' ? 'var(--color-primary-900)' : 'var(--color-gray-700)',
                boxShadow: activeTab === 'sent' ? 'var(--shadow-sm)' : 'none',
                transition: 'all var(--transition-fast)'
              }}
            >
              Sent Requests (Student)
            </button>
            <button
              onClick={() => setActiveTab('incoming')}
              style={{
                padding: '0.45rem 1rem',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                backgroundColor: activeTab === 'incoming' ? 'var(--color-white)' : 'transparent',
                color: activeTab === 'incoming' ? 'var(--color-primary-900)' : 'var(--color-gray-700)',
                boxShadow: activeTab === 'incoming' ? 'var(--shadow-sm)' : 'none',
                transition: 'all var(--transition-fast)'
              }}
            >
              Incoming Requests (Alumni)
            </button>
          </div>

          {/* Status Filter Pills */}
          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
            {['all', 'pending', 'accepted', 'rejected'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid',
                  borderColor: statusFilter === s ? 'var(--color-primary-600)' : 'var(--color-gray-300)',
                  backgroundColor: statusFilter === s ? 'var(--color-primary-50)' : 'var(--color-white)',
                  color: statusFilter === s ? 'var(--color-primary-700)' : 'var(--color-gray-600)',
                  fontWeight: statusFilter === s ? 700 : 500,
                  fontSize: '0.8125rem',
                  textTransform: 'capitalize',
                  cursor: 'pointer'
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Content List */}
        {loading ? (
          <div className="state-container">
            <div className="loading-spinner" />
            <div style={{ marginTop: '1rem', color: 'var(--color-gray-500)' }}>
              Loading mentorship records...
            </div>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="card state-container">
            <Inbox size={48} className="state-icon" />
            <h3 className="state-title">No Requests Found</h3>
            <p className="state-desc">
              {activeTab === 'sent'
                ? "You haven't submitted any mentorship requests matching this filter yet."
                : "You don't have any incoming student mentorship requests matching this filter."}
            </p>
            {activeTab === 'sent' && (
              <Link to="/directory" className="btn btn-primary">
                Browse Alumni Mentors
              </Link>
            )}
          </div>
        ) : (
          <div>
            {filteredRequests.map((req) => (
              <RequestCard
                key={req.id}
                request={req}
                isAlumniView={activeTab === 'incoming'}
                onStatusChange={handleStatusUpdate}
              />
            ))}
          </div>
        )}
      </div>

      <Toast message={toastMessage} onClose={() => setToastMessage('')} />
    </div>
  );
}
