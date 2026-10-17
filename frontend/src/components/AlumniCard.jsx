import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, MapPin, Calendar, Award, Sparkles, Send, ArrowRight } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function AlumniCard({ alumni }) {
  const skills = alumni.skills || [];
  const displaySkills = skills.slice(0, 4);
  const remainingSkills = skills.length - displaySkills.length;

  return (
    <div className="card card-hover" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: 'var(--color-white)',
      border: '1px solid var(--color-gray-200)',
      borderRadius: 'var(--radius-lg)',
      padding: '1.5rem',
      position: 'relative'
    }}>
      {/* Header Info */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
        {alumni.avatar_url ? (
          <img
            src={alumni.avatar_url}
            alt={alumni.full_name}
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid var(--color-primary-100)',
              flexShrink: 0
            }}
          />
        ) : (
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-primary-700)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem',
            fontWeight: 700,
            flexShrink: 0
          }}>
            {alumni.full_name.charAt(0)}
          </div>
        )}

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap' }}>
            <Link
              to={`/alumni/${alumni.user_id}`}
              style={{
                fontSize: '1.125rem',
                fontWeight: 700,
                color: 'var(--color-primary-900)',
                textDecoration: 'none'
              }}
            >
              {alumni.full_name}
            </Link>
          </div>

          <div style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'var(--color-primary-600)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            marginTop: '0.15rem'
          }}>
            <Building2 size={14} /> {alumni.current_role} &bull; {alumni.company}
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.875rem',
            fontSize: '0.8125rem',
            color: 'var(--color-gray-500)',
            marginTop: '0.4rem',
            flexWrap: 'wrap'
          }}>
            {alumni.location && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <MapPin size={13} /> {alumni.location}
              </span>
            )}
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Calendar size={13} /> Class of {alumni.graduation_year}
            </span>
          </div>
        </div>
      </div>

      {/* Availability Status */}
      <div style={{ marginBottom: '0.875rem' }}>
        <StatusBadge status={alumni.is_available_for_mentorship} type="availability" />
      </div>

      {/* Bio snippet */}
      {alumni.bio && (
        <p style={{
          fontSize: '0.875rem',
          color: 'var(--color-gray-600)',
          lineHeight: 1.5,
          marginBottom: '1rem',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {alumni.bio}
        </p>
      )}

      {/* Skills tags */}
      <div style={{ marginBottom: '1.25rem', flex: 1 }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-gray-500)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Expertise & Skills
        </div>
        <div>
          {displaySkills.map((skill, idx) => (
            <span key={idx} className="skill-tag">
              {skill}
            </span>
          ))}
          {remainingSkills > 0 && (
            <span style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)', fontWeight: 500 }}>
              +{remainingSkills} more
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '0.5rem',
        paddingTop: '0.875rem',
        borderTop: '1px solid var(--color-gray-100)'
      }}>
        <Link
          to={`/alumni/${alumni.user_id}`}
          className="btn btn-sm btn-secondary"
          style={{ width: '100%' }}
        >
          View Profile
        </Link>
        <Link
          to={`/request/${alumni.user_id}`}
          className="btn btn-sm btn-primary"
          style={{ width: '100%' }}
        >
          Connect <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
