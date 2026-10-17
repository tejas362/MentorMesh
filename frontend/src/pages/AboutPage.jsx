import React, { useState } from 'react';
import { 
  GraduationCap, 
  Sparkles, 
  Users, 
  ShieldCheck, 
  Heart, 
  CheckCircle2, 
  HelpCircle,
  RefreshCw
} from 'lucide-react';
import { api } from '../services/api';
import Toast from '../components/Toast';

export default function AboutPage() {
  const [resetting, setResetting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleResetDemo = async () => {
    if (!window.confirm('Reset demo data? This will re-seed all fictional demo users and requests.')) {
      return;
    }
    setResetting(true);
    try {
      await api.users.resetDemo();
      setToastMessage('Demo data reloaded successfully!');
    } catch (err) {
      alert('Failed to reset demo data: ' + err.message);
    } finally {
      setResetting(false);
    }
  };

  const faqs = [
    {
      q: 'What is MentorMesh (AlumniLink AI)?',
      a: 'MentorMesh is a modern university alumni networking and mentorship platform designed to connect ambitious college students with experienced graduates across leading industries.'
    },
    {
      q: 'Is MentorMesh free for students?',
      a: 'Yes! MentorMesh is completely free for college students and alumni mentors. No paid tiers, subscriptions, or external paid API dependencies are required.'
    },
    {
      q: 'How does the AI-Inspired Matching Engine work?',
      a: 'Our matching algorithm is deterministic, transparent, and explainable. It analyzes industry alignment (30%), key skill overlap (40%), career goal relevance (20%), and mentor availability/experience (10%) to generate an explainable score between 0 and 100% without relying on opaque black-box LLMs.'
    },
    {
      q: 'What can students request from alumni mentors?',
      a: 'Students can request resume reviews, mock technical interviews, system design discussions, career transition advice, or general industry insights.'
    },
    {
      q: 'Can alumni decline requests if they are busy?',
      a: 'Yes. Alumni can review incoming student requests and choose to accept (adding an optional Zoom link or meeting note) or decline with a polite reason, or pause their availability in profile settings.'
    }
  ];

  return (
    <div style={{ padding: '3rem 0 5rem' }}>
      <div className="container" style={{ maxWidth: '880px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{
            width: '3.5rem',
            height: '3.5rem',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--color-primary-800)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem',
            boxShadow: 'var(--shadow-md)'
          }}>
            <GraduationCap size={32} />
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>
            About MentorMesh
          </h1>
          <p style={{ color: 'var(--color-gray-600)', fontSize: '1.125rem', maxWidth: '650px', margin: '0 auto' }}>
            AlumniLink AI — Connect with Alumni. Build Your Future.
          </p>
        </div>

        {/* Mission Card */}
        <div className="card" style={{ padding: '2.25rem', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-primary-900)' }}>
            Our Mission
          </h2>
          <p style={{ color: 'var(--color-gray-700)', lineHeight: 1.7, fontSize: '1rem', marginBottom: '1.25rem' }}>
            Securing meaningful mentorship is one of the highest-leverage catalysts for college student success. 
            However, traditional alumni outreach often feels intimidating, untargeted, and difficult to manage.
          </p>
          <p style={{ color: 'var(--color-gray-700)', lineHeight: 1.7, fontSize: '1rem' }}>
            MentorMesh bridges this gap by combining verified alumni discovery, explainable AI-inspired matching, 
            smart personalized message generation, and an accountable mentorship request tracking system.
          </p>
        </div>

        {/* Core Pillars Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3.5rem'
        }}>
          <div className="card" style={{ padding: '1.5rem' }}>
            <Sparkles size={24} color="#2563eb" style={{ marginBottom: '0.75rem' }} />
            <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Explainable Matching</h3>
            <p style={{ color: 'var(--color-gray-600)', fontSize: '0.875rem', lineHeight: 1.5 }}>
              Transparent scoring that highlights matching skills, target industry alignment, and shared goals.
            </p>
          </div>

          <div className="card" style={{ padding: '1.5rem' }}>
            <ShieldCheck size={24} color="#16a34a" style={{ marginBottom: '0.75rem' }} />
            <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Safe & Accountable</h3>
            <p style={{ color: 'var(--color-gray-600)', fontSize: '0.875rem', lineHeight: 1.5 }}>
              Structured requests with status tracking, anti-spam protections, and permission verification.
            </p>
          </div>

          <div className="card" style={{ padding: '1.5rem' }}>
            <Heart size={24} color="#dc2626" style={{ marginBottom: '0.75rem' }} />
            <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Alumni Giving Back</h3>
            <p style={{ color: 'var(--color-gray-600)', fontSize: '0.875rem', lineHeight: 1.5 }}>
              Enabling university graduates to volunteer guidance on their own schedules without friction.
            </p>
          </div>
        </div>

        {/* FAQs Section */}
        <div style={{ marginBottom: '3.5rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.5rem', textAlign: 'center' }}>
            Frequently Asked Questions
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {faqs.map((faq, idx) => (
              <div key={idx} className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontWeight: 700, fontSize: '1.0625rem', color: 'var(--color-primary-900)', marginBottom: '0.5rem' }}>
                  <HelpCircle size={20} color="#2563eb" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{faq.q}</span>
                </div>
                <p style={{ color: 'var(--color-gray-600)', fontSize: '0.9375rem', lineHeight: 1.6, paddingLeft: '2rem' }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Demo Utilities Card for Evaluator */}
        <div className="card" style={{
          backgroundColor: '#eff6ff',
          border: '1px solid #bfdbfe',
          padding: '1.75rem',
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '0.5rem' }}>
            Local Evaluator Tooling
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#1e40af', maxWidth: '540px', margin: '0 auto 1.25rem' }}>
            This local installation uses fictional demo data. You can safely reload the default seed profiles and requests at any time.
          </p>
          <button
            onClick={handleResetDemo}
            disabled={resetting}
            className="btn btn-primary"
            style={{ fontSize: '0.875rem' }}
          >
            <RefreshCw size={15} className={resetting ? 'loading-spinner' : ''} />
            {resetting ? 'Reloading...' : 'Reload Demo Seed Data'}
          </button>
        </div>
      </div>

      <Toast message={toastMessage} onClose={() => setToastMessage('')} />
    </div>
  );
}
