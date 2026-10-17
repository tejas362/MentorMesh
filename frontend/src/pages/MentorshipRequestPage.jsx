import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Send, ArrowLeft, Sparkles, Building2, AlertCircle, CheckCircle } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

export default function MentorshipRequestPage() {
  const { alumniId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isStudent } = useAuth();

  const [alumni, setAlumni] = useState(null);
  const [topic, setTopic] = useState('Career Transition Advice & Interview Prep');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Fetch mentor details
  useEffect(() => {
    const fetchAlumni = async () => {
      setLoading(true);
      try {
        const data = await api.alumni.getById(alumniId);
        setAlumni(data);

        // Pre-populate a helpful starter message if empty
        if (!message) {
          setMessage(
            `Hi ${data.full_name.split(' ')[0]},\n\n` +
            `I am a university student interested in your work as a ${data.current_role} at ${data.company}. ` +
            `I would love to connect for 15-20 minutes to ask a few questions regarding your career path and get your advice on entering this field.\n\n` +
            `Thank you for your time and guidance!`
          );
        }
      } catch (err) {
        setError('Mentor not found or unavailable.');
      } finally {
        setLoading(false);
      }
    };

    if (alumniId) {
      fetchAlumni();
    }
  }, [alumniId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/request/${alumniId}` } } });
      return;
    }

    if (user.id === parseInt(alumniId, 10)) {
      setError('You cannot submit a mentorship request to yourself.');
      return;
    }

    setSubmitting(true);
    try {
      await api.requests.create({
        alumni_id: parseInt(alumniId, 10),
        topic,
        message
      });

      setToastMessage('Mentorship request successfully submitted!');
      setTimeout(() => {
        navigate('/requests');
      }, 1200);
    } catch (err) {
      setError(err.message || 'Failed to submit request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="state-container" style={{ minHeight: '60vh' }}>
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div style={{ padding: '2.5rem 0 4.5rem' }}>
      <div className="container" style={{ maxWidth: '720px' }}>
        {/* Back Link */}
        <Link
          to={alumni ? `/alumni/${alumni.user_id}` : '/directory'}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.5rem', fontWeight: 600, fontSize: '0.875rem' }}
        >
          <ArrowLeft size={16} /> Back to Profile
        </Link>

        {/* Selected Mentor Banner */}
        {alumni && (
          <div className="card" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
            padding: '1.25rem',
            marginBottom: '1.75rem',
            backgroundColor: '#eff6ff',
            borderColor: '#bfdbfe'
          }}>
            {alumni.avatar_url ? (
              <img
                src={alumni.avatar_url}
                alt={alumni.full_name}
                style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary-800)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700
              }}>
                {alumni.full_name.charAt(0)}
              </div>
            )}

            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary-700)', textTransform: 'uppercase' }}>
                Requesting Mentorship With
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary-900)' }}>
                {alumni.full_name}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-primary-600)', fontWeight: 600 }}>
                {alumni.current_role} at {alumni.company}
              </div>
            </div>
          </div>
        )}

        {/* Request Form Card */}
        <div className="card" style={{ padding: '2.25rem', boxShadow: 'var(--shadow-md)' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Submit Mentorship Request
          </h1>
          <p style={{ color: 'var(--color-gray-600)', fontSize: '0.9375rem', marginBottom: '1.75rem' }}>
            Introduce yourself clearly, specify what you hope to learn, and suggest a timeframe for connecting.
          </p>

          {error && (
            <div style={{
              backgroundColor: 'var(--color-danger-50)',
              border: '1px solid var(--color-danger-100)',
              color: 'var(--color-danger-700)',
              padding: '0.875rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.875rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="requestTopic">
                Primary Discussion Topic
              </label>
              <select
                id="requestTopic"
                className="form-select"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
              >
                <option value="Career Transition Advice & Interview Prep">Career Transition Advice & Interview Prep</option>
                <option value="Resume & Portfolio Review">Resume & Portfolio Review</option>
                <option value="Mock Technical Interview & System Design">Mock Technical Interview & System Design</option>
                <option value="Industry Insights & Company Culture">Industry Insights & Company Culture</option>
                <option value="Graduate School & Research Opportunities">Graduate School & Research Opportunities</option>
                <option value="General Professional Networking">General Professional Networking</option>
              </select>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <label className="form-label" htmlFor="requestMessage" style={{ margin: 0 }}>
                  Personalized Message to Mentor
                </label>
                {alumni && (
                  <Link
                    to={`/generator?alumniId=${alumni.user_id}`}
                    style={{ fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}
                  >
                    <Sparkles size={13} /> Need inspiration? Open AI Message Generator
                  </Link>
                )}
              </div>
              <textarea
                id="requestMessage"
                className="form-textarea"
                rows={7}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write a clear, respectful request..."
                required
                minLength={10}
              />
              <div className="form-hint" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Keep your request concise, specific, and polite.</span>
                <span>{message.length} characters</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary"
                style={{ flex: 1, padding: '0.875rem' }}
              >
                <Send size={16} /> {submitting ? 'Submitting Request...' : 'Send Mentorship Request'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <Toast message={toastMessage} onClose={() => setToastMessage('')} />
    </div>
  );
}
