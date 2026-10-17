import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: 'var(--color-primary-900)',
      color: 'var(--color-gray-400)',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '3.5rem 0 2rem',
      marginTop: 'auto'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2.5rem',
          marginBottom: '2.5rem'
        }}>
          {/* Brand Col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1rem' }}>
              <div style={{
                width: '2rem',
                height: '2rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-primary-600)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <GraduationCap size={18} color="#ffffff" />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-white)' }}>
                MentorMesh
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1rem', color: 'var(--color-gray-300)' }}>
              AlumniLink AI — Connect with Alumni. Build Your Future. Bridging the gap between ambitious university students and accomplished alumni mentors worldwide.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#4ade80' }}>
              <ShieldCheck size={14} /> Local MVP Environment Active & Verified
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: 'var(--color-white)', fontSize: '0.9375rem', fontWeight: 600, marginBottom: '1rem' }}>
              Platform Navigation
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.875rem' }}>
              <li><Link to="/directory" style={{ color: 'var(--color-gray-300)' }}>Alumni Directory</Link></li>
              <li><Link to="/recommendations" style={{ color: 'var(--color-gray-300)' }}>AI Mentor Matching</Link></li>
              <li><Link to="/generator" style={{ color: 'var(--color-gray-300)' }}>Networking Message Generator</Link></li>
              <li><Link to="/requests" style={{ color: 'var(--color-gray-300)' }}>Mentorship Requests</Link></li>
              <li><Link to="/about" style={{ color: 'var(--color-gray-300)' }}>About & FAQ</Link></li>
            </ul>
          </div>

          {/* Seed Data Notice */}
          <div>
            <h4 style={{ color: 'var(--color-white)', fontSize: '0.9375rem', fontWeight: 600, marginBottom: '1rem' }}>
              Prototype Demo Notice
            </h4>
            <p style={{ fontSize: '0.8125rem', lineHeight: 1.6, color: 'var(--color-gray-300)' }}>
              All alumni profiles, companies, and student requests featured in this local installation are fictional demo records created for development and evaluation.
            </p>
            <div style={{ marginTop: '0.75rem', fontSize: '0.8125rem' }}>
              <span style={{ color: 'var(--color-primary-400)', fontWeight: 600 }}>Default demo logins:</span>
              <br />
              <span style={{ fontFamily: 'monospace', color: '#cbd5e1' }}>student@mentormesh.edu</span> (pw: demo123)
              <br />
              <span style={{ fontFamily: 'monospace', color: '#cbd5e1' }}>alumni@mentormesh.edu</span> (pw: demo123)
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          fontSize: '0.8125rem'
        }}>
          <div>
            &copy; {new Date().getFullYear()} MentorMesh (AlumniLink AI). All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            Built with modern React, Vite & FastAPI
          </div>
        </div>
      </div>
    </footer>
  );
}
