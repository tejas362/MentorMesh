import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  GraduationCap, 
  Users, 
  Sparkles, 
  Send, 
  Inbox, 
  User, 
  LogOut, 
  Menu, 
  X, 
  LayoutDashboard,
  Info
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, isStudent, isAlumni, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header style={{
      backgroundColor: 'var(--color-primary-900)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '4.25rem'
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          textDecoration: 'none',
          color: 'var(--color-white)'
        }}>
          <div style={{
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--color-primary-600)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(37, 99, 235, 0.4)'
          }}>
            <GraduationCap size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              MentorMesh
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--color-primary-400)', fontWeight: 500, letterSpacing: '0.04em' }}>
              Alumni Mentorship Platform
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav style={{ display: 'none', alignItems: 'center', gap: '1.5rem' }} className="desktop-nav">
          <Link
            to="/directory"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: isActive('/directory') ? 'var(--color-white)' : 'var(--color-gray-300)',
              fontWeight: isActive('/directory') ? 600 : 500,
              fontSize: '0.9375rem',
              transition: 'color var(--transition-fast)'
            }}
          >
            <Users size={16} /> Directory
          </Link>

          <Link
            to="/recommendations"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: isActive('/recommendations') ? 'var(--color-white)' : 'var(--color-gray-300)',
              fontWeight: isActive('/recommendations') ? 600 : 500,
              fontSize: '0.9375rem'
            }}
          >
            <Sparkles size={16} style={{ color: '#60a5fa' }} /> AI Matching
          </Link>

          <Link
            to="/generator"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: isActive('/generator') ? 'var(--color-white)' : 'var(--color-gray-300)',
              fontWeight: isActive('/generator') ? 600 : 500,
              fontSize: '0.9375rem'
            }}
          >
            <Send size={16} /> Outreach Generator
          </Link>

          {isAuthenticated && (
            <Link
              to="/requests"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: isActive('/requests') ? 'var(--color-white)' : 'var(--color-gray-300)',
                fontWeight: isActive('/requests') ? 600 : 500,
                fontSize: '0.9375rem'
              }}
            >
              <Inbox size={16} /> Requests
            </Link>
          )}

          <Link
            to="/about"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: isActive('/about') ? 'var(--color-white)' : 'var(--color-gray-300)',
              fontWeight: isActive('/about') ? 600 : 500,
              fontSize: '0.9375rem'
            }}
          >
            <Info size={16} /> About
          </Link>
        </nav>

        {/* Right CTA / Auth Status */}
        <div style={{ display: 'none', alignItems: 'center', gap: '0.875rem' }} className="desktop-auth">
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link
                to="/dashboard"
                className="btn btn-sm btn-outline-white"
                style={{ fontSize: '0.8125rem' }}
              >
                <LayoutDashboard size={14} /> Dashboard
              </Link>

              <Link
                to="/profile"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  textDecoration: 'none',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid rgba(255, 255, 255, 0.15)'
                }}
              >
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.full_name}
                    style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-primary-600)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700
                  }}>
                    {user.full_name.charAt(0)}
                  </div>
                )}
                <span style={{ fontSize: '0.8125rem', color: 'var(--color-white)', fontWeight: 600 }}>
                  {user.full_name.split(' ')[0]}
                </span>
                <span style={{
                  fontSize: '0.6875rem',
                  padding: '0.1rem 0.4rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: isStudent ? '#1e3a8a' : '#065f46',
                  color: isStudent ? '#93c5fd' : '#6ee7b7',
                  textTransform: 'uppercase',
                  fontWeight: 700
                }}>
                  {user.role}
                </span>
              </Link>

              <button
                onClick={handleLogout}
                className="btn btn-sm"
                style={{
                  backgroundColor: 'transparent',
                  color: 'var(--color-gray-400)',
                  border: 'none',
                  padding: '0.375rem'
                }}
                title="Sign Out"
                aria-label="Sign Out"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/login" className="btn btn-sm btn-outline-white">
                Log In
              </Link>
              <Link to="/signup" className="btn btn-sm btn-accent">
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'block',
            background: 'none',
            border: 'none',
            color: 'var(--color-white)',
            cursor: 'pointer',
            padding: '0.5rem'
          }}
          className="mobile-toggle"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: 'var(--color-primary-900)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <Link
            to="/directory"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: 'var(--color-white)', padding: '0.5rem 0', fontWeight: 500 }}
          >
            Explore Alumni Directory
          </Link>
          <Link
            to="/recommendations"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: 'var(--color-white)', padding: '0.5rem 0', fontWeight: 500 }}
          >
            AI Mentor Recommendations
          </Link>
          <Link
            to="/generator"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: 'var(--color-white)', padding: '0.5rem 0', fontWeight: 500 }}
          >
            Networking Message Generator
          </Link>
          {isAuthenticated && (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                style={{ color: 'var(--color-white)', padding: '0.5rem 0', fontWeight: 500 }}
              >
                Dashboard
              </Link>
              <Link
                to="/requests"
                onClick={() => setMobileMenuOpen(false)}
                style={{ color: 'var(--color-white)', padding: '0.5rem 0', fontWeight: 500 }}
              >
                Mentorship Requests
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                style={{ color: 'var(--color-white)', padding: '0.5rem 0', fontWeight: 500 }}
              >
                Edit Profile
              </Link>
            </>
          )}
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: 'var(--color-white)', padding: '0.5rem 0', fontWeight: 500 }}
          >
            About MentorMesh
          </Link>
          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '1rem', display: 'flex', gap: '0.75rem' }}>
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="btn btn-secondary"
                style={{ width: '100%' }}
              >
                Sign Out
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-accent"
                  style={{ flex: 1 }}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* Inline styles for responsive layout */}
      <style>{`
        @media (min-width: 840px) {
          .desktop-nav { display: flex !important; }
          .desktop-auth { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </header>
  );
}
