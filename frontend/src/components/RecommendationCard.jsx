import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Building2, Check, Send, ArrowRight } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function RecommendationCard({ recommendation }) {
  const { alumni, match_score, reasons, matching_skills } = recommendation;

  // Determine score color
  let scoreColor = '#2563eb';
  let scoreBg = '#eff6ff';
  if (match_score >= 85) {
    scoreColor = '#16a34a';
    scoreBg = '#f0fdf4';
  } else if (match_score >= 70) {
    scoreColor = '#2563eb';
    scoreBg = '#eff6ff';
  } else {
    scoreColor = '#d97706';
    scoreBg = '#fffbeb';
  }

  return (
    <div className="card card-hover" style={{
      backgroundColor: 'var(--color-white)',
      border: '1px solid var(--color-gray-200)',
      borderRadius: 'var(--radius-lg)',
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }}>
      {/* Top Banner: Match Score & Availability */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          backgroundColor: scoreBg,
          color: scoreColor,
          padding: '0.35rem 0.75rem',
          borderRadius: 'var(--radius-full)',
          fontWeight: 700,
          fontSize: '0.875rem',
          border: `1px solid ${scoreColor}30`
        }}>
          <Sparkles size={15} />
          {match_score}% Match Score
        </div>

        <StatusBadge status={alumni.is_available_for_mentorship} type="availability" />
      </div>

      {/* Alumni Details */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1rem' }}>
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
            backgroundColor: 'var(--color-primary-700)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem',
            fontWeight: 700
          }}>
            {alumni.full_name.charAt(0)}
          </div>
        )}

        <div style={{ flex: 1 }}>
          <Link
            to={`/alumni/${alumni.user_id}`}
            style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-primary-900)' }}
          >
            {alumni.full_name}
          </Link>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-primary-600)', fontWeight: 600, marginTop: '0.1rem' }}>
            <Building2 size={13} style={{ display: 'inline', marginRight: '4px' }} />
            {alumni.current_role} at {alumni.company}
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--color-gray-500)', marginTop: '0.2rem' }}>
            {alumni.industry} &bull; Class of {alumni.graduation_year}
          </div>
        </div>
      </div>

      {/* Explainable Match Reasons */}
      <div style={{
        backgroundColor: 'var(--color-gray-50)',
        border: '1px solid var(--color-gray-200)',
        borderRadius: 'var(--radius-md)',
        padding: '0.875rem 1rem',
        marginBottom: '1rem'
      }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-gray-600)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
          Why this match?
        </div>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {reasons.slice(0, 3).map((reason, idx) => (
            <li key={idx} style={{ fontSize: '0.8125rem', color: 'var(--color-gray-700)', display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
              <Check size={14} style={{ color: '#16a34a', marginTop: '2px', flexShrink: 0 }} />
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Matching Skills */}
      {matching_skills && matching_skills.length > 0 && (
        <div style={{ marginBottom: '1.25rem', flex: 1 }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-gray-500)', marginBottom: '0.35rem' }}>
            Common Skills:
          </div>
          <div>
            {matching_skills.map((s, idx) => (
              <span key={idx} className="skill-tag" style={{ backgroundColor: '#f0fdf4', color: '#166534', borderColor: '#bbf7d0' }}>
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '0.5rem',
        marginTop: 'auto',
        paddingTop: '0.875rem',
        borderTop: '1px solid var(--color-gray-100)'
      }}>
        <Link
          to={`/generator?alumniId=${alumni.user_id}`}
          className="btn btn-sm btn-secondary"
          style={{ width: '100%', fontSize: '0.8125rem' }}
        >
          <Send size={13} /> Draft Message
        </Link>
        <Link
          to={`/request/${alumni.user_id}`}
          className="btn btn-sm btn-primary"
          style={{ width: '100%', fontSize: '0.8125rem' }}
        >
          Connect <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}
