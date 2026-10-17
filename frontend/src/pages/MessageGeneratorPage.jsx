import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Send, Copy, Check, Sparkles, RefreshCw, ArrowRight } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

export default function MessageGeneratorPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const preselectedAlumniId = searchParams.get('alumniId') || '';

  const [alumniList, setAlumniList] = useState([]);
  const [selectedAlumniId, setSelectedAlumniId] = useState(preselectedAlumniId);
  const [careerGoal, setCareerGoal] = useState(user?.student_profile?.career_goal || 'break into software engineering');
  const [reason, setReason] = useState('learn about your daily engineering responsibilities and system architecture');
  const [tone, setTone] = useState('professional');

  const [generatedSubject, setGeneratedSubject] = useState('');
  const [generatedBody, setGeneratedBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Load alumni options
  useEffect(() => {
    const loadAlumni = async () => {
      try {
        const data = await api.alumni.getAll();
        setAlumniList(data);
        if (!selectedAlumniId && data.length > 0) {
          setSelectedAlumniId(data[0].user_id.toString());
        }
      } catch (err) {
        console.error('Failed to load alumni list', err);
      }
    };
    loadAlumni();
  }, []);

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    if (!selectedAlumniId) return;

    setLoading(true);
    setCopied(false);
    try {
      const res = await api.messages.generate({
        alumni_id: parseInt(selectedAlumniId, 10),
        career_goal: careerGoal,
        reason: reason,
        tone: tone
      });
      setGeneratedSubject(res.subject);
      setGeneratedBody(res.body);
    } catch (err) {
      console.error('Failed to generate message', err);
    } finally {
      setLoading(false);
    }
  };

  // Generate on first mount once alumni list is loaded
  useEffect(() => {
    if (selectedAlumniId) {
      handleGenerate();
    }
  }, [selectedAlumniId, tone]);

  const handleCopy = () => {
    const fullText = `Subject: ${generatedSubject}\n\n${generatedBody}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setToastMessage('Outreach message copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleUseInRequest = () => {
    navigate(`/request/${selectedAlumniId}`);
  };

  return (
    <div style={{ padding: '2.5rem 0 4.5rem' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Title */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            backgroundColor: '#eff6ff',
            color: '#2563eb',
            padding: '0.25rem 0.75rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.8125rem',
            fontWeight: 700,
            marginBottom: '0.75rem'
          }}>
            <Sparkles size={14} /> Smart Networking Generator
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Personalized Networking Outreach Generator
          </h1>
          <p style={{ color: 'var(--color-gray-600)', fontSize: '1.0625rem' }}>
            Generate polite, tailored networking drafts in seconds. Select a mentor, adjust your goal, and pick a communication tone.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {/* Controls Form Column */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem' }}>
              Message Parameters
            </h2>

            <form onSubmit={handleGenerate}>
              {/* Alumni Dropdown */}
              <div className="form-group">
                <label className="form-label" htmlFor="alumniSelect">Select Target Alumnus</label>
                <select
                  id="alumniSelect"
                  className="form-select"
                  value={selectedAlumniId}
                  onChange={(e) => setSelectedAlumniId(e.target.value)}
                >
                  {alumniList.map((a) => (
                    <option key={a.user_id} value={a.user_id}>
                      {a.full_name} &bull; {a.current_role} ({a.company})
                    </option>
                  ))}
                </select>
              </div>

              {/* Tone Selector */}
              <div className="form-group">
                <label className="form-label">Desired Tone</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  {[
                    { id: 'professional', label: 'Professional' },
                    { id: 'enthusiastic', label: 'Enthusiastic' },
                    { id: 'casual', label: 'Casual & Warm' },
                    { id: 'concise', label: 'Concise (Brief)' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTone(t.id)}
                      style={{
                        padding: '0.6rem 0.75rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid',
                        borderColor: tone === t.id ? 'var(--color-primary-600)' : 'var(--color-gray-300)',
                        backgroundColor: tone === t.id ? 'var(--color-primary-50)' : 'var(--color-white)',
                        color: tone === t.id ? 'var(--color-primary-800)' : 'var(--color-gray-700)',
                        fontWeight: tone === t.id ? 700 : 500,
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all var(--transition-fast)'
                      }}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Career Goal Input */}
              <div className="form-group">
                <label className="form-label" htmlFor="goalInput">Your Career Goal / Focus</label>
                <input
                  id="goalInput"
                  type="text"
                  className="form-input"
                  placeholder="e.g. enter high-scale cloud backend engineering"
                  value={careerGoal}
                  onChange={(e) => setCareerGoal(e.target.value)}
                />
              </div>

              {/* Reason for Contacting */}
              <div className="form-group">
                <label className="form-label" htmlFor="reasonInput">Specific Reason for Outreach</label>
                <input
                  id="reasonInput"
                  type="text"
                  className="form-input"
                  placeholder="e.g. ask about distributed systems interview prep and culture"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}
              >
                <RefreshCw size={15} className={loading ? 'loading-spinner' : ''} />
                {loading ? 'Drafting...' : 'Generate New Draft'}
              </button>
            </form>
          </div>

          {/* Generated Output Preview Column */}
          <div className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                Generated Draft
              </h2>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={handleCopy}
                  className="btn btn-sm btn-secondary"
                  title="Copy subject and body to clipboard"
                >
                  {copied ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
                  {copied ? 'Copied!' : 'Copy Draft'}
                </button>
              </div>
            </div>

            {/* Subject preview */}
            <div className="form-group">
              <label className="form-label" htmlFor="draftSubject" style={{ fontSize: '0.75rem' }}>Email Subject</label>
              <input
                id="draftSubject"
                type="text"
                className="form-input"
                value={generatedSubject}
                onChange={(e) => setGeneratedSubject(e.target.value)}
                style={{ fontWeight: 600, fontSize: '0.9375rem' }}
              />
            </div>

            {/* Body editable preview */}
            <div className="form-group" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <label className="form-label" htmlFor="draftBody" style={{ fontSize: '0.75rem' }}>Editable Draft Body</label>
              <textarea
                id="draftBody"
                className="form-textarea"
                style={{ flex: 1, minHeight: '220px', fontFamily: 'inherit', lineHeight: 1.6 }}
                value={generatedBody}
                onChange={(e) => setGeneratedBody(e.target.value)}
              />
            </div>

            {/* Bottom action to link with request */}
            <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--color-gray-200)' }}>
              <button
                onClick={handleUseInRequest}
                className="btn btn-accent"
                style={{ width: '100%' }}
              >
                <Send size={15} /> Send as Mentorship Request <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <Toast message={toastMessage} onClose={() => setToastMessage('')} />
    </div>
  );
}
