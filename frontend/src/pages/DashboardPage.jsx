import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Sparkles, 
  Send, 
  Inbox, 
  Briefcase, 
  GraduationCap, 
  ArrowRight, 
  Building2, 
  CheckCircle, 
  Clock, 
  Settings
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import RecommendationCard from '../components/RecommendationCard';
import StatusBadge from '../components/StatusBadge';

export default function DashboardPage() {
  const { user, isStudent, isAlumni } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (isStudent) {
          const [recs, reqs] = await Promise.all([
            api.recommendations.get(),
            api.requests.getStudentRequests()
          ]);
          setRecommendations(recs.slice(0, 3));
          setRequests(reqs.slice(0, 4));
        } else if (isAlumni) {
          const reqs = await api.requests.getAlumniRequests();
          setRequests(reqs.slice(0, 5));
        }
      } catch (err) {
        console.error('Error loading dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isStudent, isAlumni]);

  const studentProfile = user?.student_profile;
  const alumniProfile = user?.alumni_profile;

  return (
    <div style={{ padding: '2.5rem 0 4rem' }}>
      <div className="container">
        {/* Welcome Section */}
        <div style={{
          backgroundColor: 'var(--color-primary-900)',
          borderRadius: 'var(--radius-xl)',
          padding: '2.25rem',
          color: 'var(--color-white)',
          marginBottom: '2.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
          boxShadow: 'var(--shadow-md)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.full_name}
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid rgba(255, 255, 255, 0.2)'
                }}
              />
            ) : (
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary-600)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.75rem',
                fontWeight: 700
              }}>
                {user?.full_name?.charAt(0) || 'U'}
              </div>
            )}

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.25rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-white)' }}>
                  Welcome back, {user?.full_name}!
                </h1>
                <span style={{
                  fontSize: '0.75rem',
                  backgroundColor: isStudent ? '#1e3a8a' : '#065f46',
                  color: isStudent ? '#93c5fd' : '#6ee7b7',
                  padding: '0.2rem 0.6rem',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 700,
                  textTransform: 'uppercase'
                }}>
                  {user?.role}
                </span>
              </div>
              <p style={{ color: 'var(--color-gray-300)', fontSize: '0.9375rem', maxWidth: '600px' }}>
                {user?.headline || (isStudent ? 'Track your mentorship inquiries and discover alumni.' : 'Manage incoming student requests and guide future graduates.')}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/profile" className="btn btn-sm btn-outline-white">
              <Settings size={15} /> Edit Profile
            </Link>
          </div>
        </div>

        {/* Quick Shortcuts Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.5rem'
        }}>
          <Link to="/directory" className="card card-hover" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
            <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: 'var(--radius-md)', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--color-primary-900)', fontSize: '0.9375rem' }}>Alumni Directory</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--color-gray-500)' }}>Browse mentors</div>
            </div>
          </Link>

          <Link to="/recommendations" className="card card-hover" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
            <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: 'var(--radius-md)', backgroundColor: '#faf5ff', color: '#9333ea', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--color-primary-900)', fontSize: '0.9375rem' }}>AI Matching</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--color-gray-500)' }}>Ranked recommendations</div>
            </div>
          </Link>

          <Link to="/generator" className="card card-hover" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
            <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: 'var(--radius-md)', backgroundColor: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Send size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--color-primary-900)', fontSize: '0.9375rem' }}>Message Generator</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--color-gray-500)' }}>Draft outreach emails</div>
            </div>
          </Link>

          <Link to="/requests" className="card card-hover" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
            <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: 'var(--radius-md)', backgroundColor: '#fffbeb', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Inbox size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--color-primary-900)', fontSize: '0.9375rem' }}>Request Center</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--color-gray-500)' }}>{requests.length} Active tracking</div>
            </div>
          </Link>
        </div>

        {/* Main Content Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {/* Left Column: Recent Mentorship Requests */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.375rem', fontWeight: 800 }}>
                {isStudent ? 'Your Mentorship Inquiries' : 'Incoming Student Requests'}
              </h2>
              <Link to="/requests" style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                View All <ArrowRight size={14} style={{ display: 'inline' }} />
              </Link>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div className="loading-spinner" />
              </div>
            ) : requests.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
                <Inbox size={36} color="#94a3b8" style={{ margin: '0 auto 0.75rem' }} />
                <div style={{ fontWeight: 600, color: 'var(--color-gray-700)', marginBottom: '0.35rem' }}>
                  No mentorship requests yet
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-500)', marginBottom: '1.25rem' }}>
                  {isStudent ? 'Find a mentor and send your first request!' : 'You have no pending student inquiries.'}
                </p>
                {isStudent && (
                  <Link to="/recommendations" className="btn btn-sm btn-primary">
                    Find a Mentor
                  </Link>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {requests.map((req) => {
                  const otherUser = isStudent ? req.alumni : req.student;
                  return (
                    <div key={req.id} className="card" style={{ padding: '1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-primary-900)' }}>
                            {otherUser?.full_name}
                          </div>
                          <div style={{ fontSize: '0.8125rem', color: 'var(--color-gray-500)' }}>
                            {req.topic}
                          </div>
                        </div>
                        <StatusBadge status={req.status} />
                      </div>

                      <p style={{ fontSize: '0.8125rem', color: 'var(--color-gray-600)', lineClamp: 1, WebkitLineClamp: 1, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                        "{req.message}"
                      </p>

                      {req.response_note && (
                        <div style={{ fontSize: '0.75rem', color: '#16a34a', backgroundColor: '#f0fdf4', padding: '0.35rem 0.6rem', borderRadius: '4px', marginTop: '0.5rem' }}>
                          Note: {req.response_note}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: AI Recommendations for Students OR Mentoring Stats for Alumni */}
          <div>
            {isStudent ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h2 style={{ fontSize: '1.375rem', fontWeight: 800 }}>
                    Top Recommended Mentors
                  </h2>
                  <Link to="/recommendations" style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                    See All <ArrowRight size={14} style={{ display: 'inline' }} />
                  </Link>
                </div>

                {loading ? (
                  <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <div className="loading-spinner" />
                  </div>
                ) : recommendations.length === 0 ? (
                  <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                    <p style={{ color: 'var(--color-gray-500)' }}>No recommendations calculated yet.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {recommendations.slice(0, 2).map((rec, idx) => (
                      <RecommendationCard key={idx} recommendation={rec} />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div>
                <h2 style={{ fontSize: '1.375rem', fontWeight: 800, marginBottom: '1.25rem' }}>
                  Alumni Mentoring Profile
                </h2>
                <div className="card" style={{ padding: '1.5rem' }}>
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>
                      Current Role
                    </div>
                    <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-primary-900)' }}>
                      {alumniProfile?.current_role} at {alumniProfile?.company}
                    </div>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>
                      Industry & Experience
                    </div>
                    <div style={{ fontSize: '0.9375rem', color: 'var(--color-gray-800)' }}>
                      {alumniProfile?.industry} &bull; {alumniProfile?.years_of_experience}+ years
                    </div>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-gray-500)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                      Mentoring Interests
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--color-gray-700)' }}>
                      {alumniProfile?.mentoring_interests?.join(', ') || 'Career Guidance, Resume Review'}
                    </div>
                  </div>

                  <Link to="/profile" className="btn btn-secondary" style={{ width: '100%', marginTop: '0.5rem' }}>
                    Update Mentorship Availability
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
