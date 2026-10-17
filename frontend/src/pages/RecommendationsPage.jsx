import React, { useEffect, useState } from 'react';
import { Sparkles, SlidersHorizontal, RefreshCw, Info, ArrowRight } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import RecommendationCard from '../components/RecommendationCard';

export default function RecommendationsPage() {
  const { user } = useAuth();

  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search criteria form
  const [targetIndustry, setTargetIndustry] = useState(user?.student_profile?.target_industry || 'Technology');
  const [careerGoal, setCareerGoal] = useState(user?.student_profile?.career_goal || 'Software Engineer');
  const [skillsToLearn, setSkillsToLearn] = useState(
    user?.student_profile?.skills_to_learn ? user.student_profile.skills_to_learn.join(', ') : 'Python, React, System Design'
  );

  const fetchRecommendations = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.recommendations.get({
        target_industry: targetIndustry,
        career_goal: careerGoal,
        skills_to_learn: skillsToLearn
      });
      setRecommendations(data);
    } catch (err) {
      setError(err.message || 'Failed to calculate recommendations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const handleTuneSubmit = (e) => {
    e.preventDefault();
    fetchRecommendations();
  };

  return (
    <div style={{ padding: '2.5rem 0 4.5rem' }}>
      <div className="container">
        {/* Header */}
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
            <Sparkles size={14} /> AI-Inspired Matching Engine
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Recommended Alumni Mentors
          </h1>
          <p style={{ color: 'var(--color-gray-600)', fontSize: '1.0625rem', maxWidth: '750px' }}>
            Our deterministic algorithm compares your career aspirations, target industry, and desired skills 
            against verified alumni profiles to calculate explainable match scores.
          </p>
        </div>

        {/* Matching Criteria Tuning Drawer */}
        <div className="card" style={{ padding: '1.5rem', marginBottom: '2.5rem', backgroundColor: 'var(--color-white)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <SlidersHorizontal size={18} color="var(--color-primary-700)" />
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700 }}>
              Customize Your Matching Criteria
            </h2>
          </div>

          <form onSubmit={handleTuneSubmit}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1rem',
              marginBottom: '1.25rem'
            }}>
              <div>
                <label className="form-label" style={{ fontSize: '0.8125rem' }}>Target Industry</label>
                <select
                  className="form-select"
                  value={targetIndustry}
                  onChange={(e) => setTargetIndustry(e.target.value)}
                >
                  <option value="Technology">Technology & Software</option>
                  <option value="Data Science & AI">Data Science & AI</option>
                  <option value="Financial Services">Financial Services & Quant</option>
                  <option value="Healthcare Tech">Healthcare & HealthTech</option>
                  <option value="Design & Creative Tech">Design & UI/UX</option>
                  <option value="Management Consulting">Management Consulting</option>
                  <option value="BioTech & Pharma">BioTech & Life Sciences</option>
                </select>
              </div>

              <div>
                <label className="form-label" style={{ fontSize: '0.8125rem' }}>Dream Career Goal</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Distributed Systems Engineer"
                  value={careerGoal}
                  onChange={(e) => setCareerGoal(e.target.value)}
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: '0.8125rem' }}>Skills You Want to Learn</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Python, Docker, System Design"
                  value={skillsToLearn}
                  onChange={(e) => setSkillsToLearn(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
              >
                <RefreshCw size={15} className={loading ? 'loading-spinner' : ''} />
                {loading ? 'Calculating...' : 'Recalculate AI Match Scores'}
              </button>
            </div>
          </form>
        </div>

        {/* Results */}
        {loading ? (
          <div className="state-container">
            <div className="loading-spinner" />
            <div style={{ marginTop: '1rem', color: 'var(--color-gray-500)' }}>
              Analyzing alumni profiles & calculating match coefficients...
            </div>
          </div>
        ) : error ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: 'var(--color-danger-600)', marginBottom: '1rem' }}>{error}</p>
            <button onClick={fetchRecommendations} className="btn btn-secondary">
              Try Again
            </button>
          </div>
        ) : recommendations.length === 0 ? (
          <div className="card state-container">
            <h3 className="state-title">No Recommendations Available</h3>
            <p className="state-desc">Try adjusting your matching criteria above to discover mentors.</p>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: '0.9375rem', color: 'var(--color-gray-600)', marginBottom: '1.5rem', fontWeight: 500 }}>
              Found <strong>{recommendations.length}</strong> mentors ranked by alignment:
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '1.5rem'
            }}>
              {recommendations.map((rec, idx) => (
                <RecommendationCard key={idx} recommendation={rec} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
