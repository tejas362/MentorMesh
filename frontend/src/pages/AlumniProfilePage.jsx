import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  Award, 
  ExternalLink, 
  Send, 
  Sparkles, 
  ArrowLeft, 
  CheckCircle,
  Briefcase,
  GraduationCap
} from 'lucide-react';
import { api } from '../services/api';
import StatusBadge from '../components/StatusBadge';

export default function AlumniProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [alumni, setAlumni] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const data = await api.alumni.getById(id);
        setAlumni(data);
      } catch (err) {
        setError(err.message || 'Alumni profile not found.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="state-container" style={{ minHeight: '60vh' }}>
        <div className="loading-spinner" />
        <div style={{ marginTop: '1rem', color: 'var(--color-gray-500)' }}>Loading alumni profile...</div>
      </div>
    );
  }

  if (error || !alumni) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: '500px', margin: '0 auto', padding: '2.5rem' }}>
          <h2>Profile Not Found</h2>
          <p style={{ color: 'var(--color-gray-600)', margin: '1rem 0 1.5rem' }}>
            The alumni profile you requested could not be located.
          </p>
          <Link to="/directory" className="btn btn-primary">
            <ArrowLeft size={16} /> Return to Alumni Directory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2.5rem 0 4.5rem' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        {/* Back Link */}
        <Link
          to="/directory"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            marginBottom: '1.5rem',
            fontSize: '0.875rem',
            fontWeight: 600
          }}
        >
          <ArrowLeft size={16} /> Back to Alumni Directory
        </Link>

        {/* Profile Header Card */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1.5rem',
            flexWrap: 'wrap'
          }}>
            {alumni.avatar_url ? (
              <img
                src={alumni.avatar_url}
                alt={alumni.full_name}
                style={{
                  width: '96px',
                  height: '96px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid var(--color-primary-100)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              />
            ) : (
              <div style={{
                width: '96px',
                height: '96px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary-800)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.5rem',
                fontWeight: 700
              }}>
                {alumni.full_name.charAt(0)}
              </div>
            )}

            <div style={{ flex: 1, minWidth: '260px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary-900)' }}>
                  {alumni.full_name}
                </h1>
                <StatusBadge status={alumni.is_available_for_mentorship} type="availability" />
              </div>

              <div style={{
                fontSize: '1.125rem',
                fontWeight: 600,
                color: 'var(--color-primary-600)',
                marginTop: '0.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Building2 size={18} /> {alumni.current_role} &bull; {alumni.company}
              </div>

              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1.25rem',
                marginTop: '0.75rem',
                fontSize: '0.875rem',
                color: 'var(--color-gray-600)'
              }}>
                {alumni.location && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <MapPin size={15} /> {alumni.location}
                  </span>
                )}
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Calendar size={15} /> Class of {alumni.graduation_year}
                </span>
                {alumni.degree && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <GraduationCap size={15} /> {alumni.degree}
                  </span>
                )}
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Briefcase size={15} /> {alumni.years_of_experience}+ yrs exp
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            marginTop: '1.75rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid var(--color-gray-200)',
            flexWrap: 'wrap'
          }}>
            <Link
              to={`/request/${alumni.user_id}`}
              className="btn btn-primary"
              style={{ flex: 1, minWidth: '200px' }}
            >
              <Sparkles size={16} /> Request 1-on-1 Mentorship
            </Link>

            <Link
              to={`/generator?alumniId=${alumni.user_id}`}
              className="btn btn-secondary"
              style={{ flex: 1, minWidth: '200px' }}
            >
              <Send size={16} /> Generate Outreach Email
            </Link>

            {alumni.linkedin_url && (
              <a
                href={alumni.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                LinkedIn <ExternalLink size={14} />
              </a>
            )}
          </div>
        </div>

        {/* Detailed Sections */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {/* Left Column: Biography & Background */}
          <div className="card">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
              About & Career Journey
            </h2>
            <p style={{ color: 'var(--color-gray-700)', lineHeight: 1.6, fontSize: '0.9375rem', whiteSpace: 'pre-line' }}>
              {alumni.bio || 'No detailed background provided.'}
            </p>
          </div>

          {/* Right Column: Mentoring Focus & Skills */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Mentoring Topics */}
            <div className="card">
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                Mentoring Topics & Interests
              </h2>
              {alumni.mentoring_interests && alumni.mentoring_interests.length > 0 ? (
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {alumni.mentoring_interests.map((interest, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--color-gray-700)' }}>
                      <CheckCircle size={15} style={{ color: '#16a34a', flexShrink: 0 }} />
                      <span>{interest}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-500)' }}>General career advice & networking.</p>
              )}
            </div>

            {/* Professional Skills */}
            <div className="card">
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                Skills & Technologies
              </h2>
              <div>
                {alumni.skills && alumni.skills.map((skill, idx) => (
                  <span key={idx} className="skill-tag" style={{ fontSize: '0.8125rem', padding: '0.3rem 0.65rem' }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
