import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Users, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div style={{
      padding: '5rem 1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '65vh',
      textAlign: 'center'
    }}>
      <div className="card" style={{ maxWidth: '480px', padding: '3rem 2rem' }}>
        <div style={{
          fontSize: '4.5rem',
          fontWeight: 900,
          color: 'var(--color-primary-800)',
          lineHeight: 1,
          marginBottom: '1rem',
          letterSpacing: '-0.04em'
        }}>
          404
        </div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>
          Page Not Found
        </h1>
        <p style={{ color: 'var(--color-gray-600)', fontSize: '0.9375rem', marginBottom: '2rem' }}>
          The page or route you are looking for does not exist or may have been moved.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-primary">
            <Home size={16} /> Home
          </Link>
          <Link to="/directory" className="btn btn-secondary">
            <Users size={16} /> Alumni Directory
          </Link>
        </div>
      </div>
    </div>
  );
}
