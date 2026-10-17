import React, { useState, useEffect } from 'react';
import { User, Building2, Briefcase, Sparkles, Check, ArrowRight, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

export default function ProfileEditPage() {
  const { user, isStudent, isAlumni, refreshUser } = useAuth();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [headline, setHeadline] = useState(user?.headline || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');

  // Student Profile fields
  const [major, setMajor] = useState(user?.student_profile?.major || '');
  const [careerGoal, setCareerGoal] = useState(user?.student_profile?.career_goal || '');
  const [targetIndustry, setTargetIndustry] = useState(user?.student_profile?.target_industry || 'Technology');
  const [skillsToLearn, setSkillsToLearn] = useState(
    user?.student_profile?.skills_to_learn ? user.student_profile.skills_to_learn.join(', ') : ''
  );

  // Alumni Profile fields
  const [company, setCompany] = useState(user?.alumni_profile?.company || '');
  const [currentRole, setCurrentRole] = useState(user?.alumni_profile?.current_role || '');
  const [industry, setIndustry] = useState(user?.alumni_profile?.industry || 'Technology');
  const [graduationYear, setGraduationYear] = useState(user?.alumni_profile?.graduation_year || 2020);
  const [degree, setDegree] = useState(user?.alumni_profile?.degree || '');
  const [location, setLocation] = useState(user?.alumni_profile?.location || '');
  const [linkedinUrl, setLinkedinUrl] = useState(user?.alumni_profile?.linkedin_url || '');
  const [yearsExperience, setYearsExperience] = useState(user?.alumni_profile?.years_of_experience || 3);
  const [availableForMentorship, setAvailableForMentorship] = useState(
    user?.alumni_profile?.is_available_for_mentorship ?? true
  );
  const [skills, setSkills] = useState(
    user?.alumni_profile?.skills ? user.alumni_profile.skills.join(', ') : ''
  );
  const [mentoringInterests, setMentoringInterests] = useState(
    user?.alumni_profile?.mentoring_interests ? user.alumni_profile.mentoring_interests.join(', ') : ''
  );

  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      full_name: fullName,
      headline,
      bio,
      avatar_url: avatarUrl
    };

    if (isStudent) {
      payload.major = major;
      payload.career_goal = careerGoal;
      payload.target_industry = targetIndustry;
      payload.skills_to_learn = skillsToLearn;
    } else if (isAlumni) {
      payload.company = company;
      payload.current_role = currentRole;
      payload.industry = industry;
      payload.graduation_year = parseInt(graduationYear, 10);
      payload.degree = degree;
      payload.location = location;
      payload.linkedin_url = linkedinUrl;
      payload.years_of_experience = parseInt(yearsExperience, 10);
      payload.is_available_for_mentorship = availableForMentorship;
      payload.skills = skills;
      payload.mentoring_interests = mentoringInterests;
    }

    try {
      await api.users.updateProfile(payload);
      await refreshUser();
      setToastMessage('Profile changes saved successfully!');
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2.5rem 0 4.5rem' }}>
      <div className="container" style={{ maxWidth: '780px' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Edit Profile
          </h1>
          <p style={{ color: 'var(--color-gray-600)', fontSize: '1.0625rem' }}>
            Keep your credentials, career aspirations, and mentorship interests up to date.
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: 'var(--color-danger-50)',
            color: 'var(--color-danger-700)',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem'
          }}>
            {error}
          </div>
        )}

        <div className="card" style={{ padding: '2rem', boxShadow: 'var(--shadow-md)' }}>
          <form onSubmit={handleSubmit}>
            {/* General Profile Section */}
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--color-primary-900)' }}>
              General Information
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="name">Full Name</label>
                <input
                  id="name"
                  type="text"
                  className="form-input"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="avatar">Avatar Image URL</label>
                <input
                  id="avatar"
                  type="url"
                  className="form-input"
                  placeholder="https://..."
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="headline">Headline</label>
              <input
                id="headline"
                type="text"
                className="form-input"
                placeholder="e.g. Senior Software Engineer at Tech Co"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="bio">Biography / Narrative</label>
              <textarea
                id="bio"
                className="form-textarea"
                rows={4}
                placeholder="Share your journey, interests, or background..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            {/* Role specific section */}
            {isStudent && (
              <div style={{ borderTop: '1px solid var(--color-gray-200)', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--color-primary-900)' }}>
                  Student Career Preferences
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="major">Major</label>
                    <input
                      id="major"
                      type="text"
                      className="form-input"
                      value={major}
                      onChange={(e) => setMajor(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="targetInd">Target Industry</label>
                    <select
                      id="targetInd"
                      className="form-select"
                      value={targetIndustry}
                      onChange={(e) => setTargetIndustry(e.target.value)}
                    >
                      <option value="Technology">Technology & Software</option>
                      <option value="Data Science & AI">Data Science & AI</option>
                      <option value="Financial Services">Financial Services</option>
                      <option value="Healthcare Tech">Healthcare Tech</option>
                      <option value="Design & Creative Tech">Design & UI/UX</option>
                      <option value="Management Consulting">Management Consulting</option>
                      <option value="BioTech & Pharma">BioTech & Life Sciences</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="careerGoal">Career Goal</label>
                  <input
                    id="careerGoal"
                    type="text"
                    className="form-input"
                    value={careerGoal}
                    onChange={(e) => setCareerGoal(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="skillsLearn">Skills to Learn (comma-separated)</label>
                  <input
                    id="skillsLearn"
                    type="text"
                    className="form-input"
                    value={skillsToLearn}
                    onChange={(e) => setSkillsToLearn(e.target.value)}
                  />
                </div>
              </div>
            )}

            {isAlumni && (
              <div style={{ borderTop: '1px solid var(--color-gray-200)', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--color-primary-900)' }}>
                  Alumni Mentoring & Professional Info
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="company">Company</label>
                    <input
                      id="company"
                      type="text"
                      className="form-input"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="role">Current Role</label>
                    <input
                      id="role"
                      type="text"
                      className="form-input"
                      value={currentRole}
                      onChange={(e) => setCurrentRole(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="industry">Industry</label>
                    <select
                      id="industry"
                      className="form-select"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                    >
                      <option value="Technology">Technology</option>
                      <option value="Data Science & AI">Data Science & AI</option>
                      <option value="Financial Services">Financial Services</option>
                      <option value="Healthcare Tech">Healthcare Tech</option>
                      <option value="Design & Creative Tech">Design & Creative Tech</option>
                      <option value="Management Consulting">Management Consulting</option>
                      <option value="BioTech & Pharma">BioTech & Pharma</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="exp">Years of Experience</label>
                    <input
                      id="exp"
                      type="number"
                      min="1"
                      className="form-input"
                      value={yearsExperience}
                      onChange={(e) => setYearsExperience(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="skills">Professional Skills (comma-separated)</label>
                  <input
                    id="skills"
                    type="text"
                    className="form-input"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="interests">Mentoring Interests</label>
                  <input
                    id="interests"
                    type="text"
                    className="form-input"
                    value={mentoringInterests}
                    onChange={(e) => setMentoringInterests(e.target.value)}
                  />
                </div>

                {/* Availability Toggle */}
                <div className="form-group" style={{ backgroundColor: 'var(--color-gray-50)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', cursor: 'pointer', fontWeight: 600 }}>
                    <input
                      type="checkbox"
                      checked={availableForMentorship}
                      onChange={(e) => setAvailableForMentorship(e.target.checked)}
                      style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary-600)' }}
                    />
                    <span>Available to receive new 1-on-1 student mentorship inquiries</span>
                  </label>
                </div>
              </div>
            )}

            <div style={{ marginTop: '2rem' }}>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.875rem' }}
              >
                {loading ? 'Saving Changes...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <Toast message={toastMessage} onClose={() => setToastMessage('')} />
    </div>
  );
}
