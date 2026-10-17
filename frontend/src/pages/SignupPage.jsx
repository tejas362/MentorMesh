import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Briefcase, User, Mail, Lock, Building2, BookOpen, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Common fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [headline, setHeadline] = useState('');

  // Student fields
  const [major, setMajor] = useState('');
  const [studentGradYear, setStudentGradYear] = useState('2026');
  const [careerGoal, setCareerGoal] = useState('');
  const [targetIndustry, setTargetIndustry] = useState('Technology');
  const [skillsToLearn, setSkillsToLearn] = useState('');

  // Alumni fields
  const [company, setCompany] = useState('');
  const [currentRole, setCurrentRole] = useState('');
  const [industry, setIndustry] = useState('Technology');
  const [alumniGradYear, setAlumniGradYear] = useState('2020');
  const [degree, setDegree] = useState("B.S. in Computer Science");
  const [location, setLocation] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [yearsExperience, setYearsExperience] = useState('3');
  const [skills, setSkills] = useState('');
  const [mentoringInterests, setMentoringInterests] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    const payload = {
      email,
      password,
      full_name: fullName,
      role,
      headline: headline || (role === 'student' ? `${major} Student` : `${currentRole} at ${company}`),
    };

    if (role === 'student') {
      payload.major = major;
      payload.student_grad_year = parseInt(studentGradYear, 10);
      payload.career_goal = careerGoal;
      payload.target_industry = targetIndustry;
      payload.skills_to_learn = skillsToLearn;
    } else {
      payload.company = company;
      payload.current_role = currentRole;
      payload.industry = industry;
      payload.alumni_grad_year = parseInt(alumniGradYear, 10);
      payload.degree = degree;
      payload.location = location;
      payload.linkedin_url = linkedinUrl;
      payload.years_of_experience = parseInt(yearsExperience, 10);
      payload.skills = skills;
      payload.mentoring_interests = mentoringInterests;
    }

    try {
      await signup(payload);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your information.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '3.5rem 1rem', display: 'flex', justifyContent: 'center' }}>
      <div className="card" style={{ maxWidth: '640px', width: '100%', padding: '2.5rem', boxShadow: 'var(--shadow-lg)' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Create Your Account</h1>
          <p style={{ color: 'var(--color-gray-500)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Join MentorMesh to build meaningful university career connections
          </p>

          {/* Role selector pill toggle */}
          <div style={{
            display: 'inline-flex',
            backgroundColor: 'var(--color-gray-100)',
            padding: '0.25rem',
            borderRadius: 'var(--radius-lg)',
            marginTop: '1.25rem',
            border: '1px solid var(--color-gray-200)'
          }}>
            <button
              type="button"
              onClick={() => setRole('student')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1.25rem',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                backgroundColor: role === 'student' ? 'var(--color-white)' : 'transparent',
                color: role === 'student' ? 'var(--color-primary-900)' : 'var(--color-gray-600)',
                boxShadow: role === 'student' ? 'var(--shadow-sm)' : 'none',
                transition: 'all var(--transition-fast)'
              }}
            >
              <GraduationCap size={16} /> I am a Student
            </button>
            <button
              type="button"
              onClick={() => setRole('alumni')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1.25rem',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                backgroundColor: role === 'alumni' ? 'var(--color-white)' : 'transparent',
                color: role === 'alumni' ? 'var(--color-primary-900)' : 'var(--color-gray-600)',
                boxShadow: role === 'alumni' ? 'var(--shadow-sm)' : 'none',
                transition: 'all var(--transition-fast)'
              }}
            >
              <Briefcase size={16} /> I am an Alumnus
            </button>
          </div>
        </div>

        {error && (
          <div style={{
            backgroundColor: 'var(--color-danger-50)',
            border: '1px solid var(--color-danger-100)',
            color: 'var(--color-danger-700)',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.875rem',
            marginBottom: '1.25rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Base credentials */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                type="text"
                className="form-input"
                placeholder="Jane Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="signupEmail">Email Address</label>
              <input
                id="signupEmail"
                type="email"
                className="form-input"
                placeholder="jane@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="signupPassword">Password</label>
              <input
                id="signupPassword"
                type="password"
                className="form-input"
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="headline">Professional Headline</label>
              <input
                id="headline"
                type="text"
                className="form-input"
                placeholder={role === 'student' ? 'e.g. Aspiring Software Engineer | Junior CS' : 'e.g. Senior Software Engineer at Tech Co'}
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
              />
            </div>
          </div>

          {/* Role specific inputs */}
          {role === 'student' ? (
            <div style={{ borderTop: '1px solid var(--color-gray-200)', paddingTop: '1.25rem', marginTop: '0.5rem' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-primary-800)', marginBottom: '1rem' }}>
                Student Background & Goals
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="major">Major / Field of Study</label>
                  <input
                    id="major"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Computer Science, Finance, Biology"
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="studentGradYear">Expected Graduation Year</label>
                  <input
                    id="studentGradYear"
                    type="number"
                    min="2024"
                    max="2032"
                    className="form-input"
                    value={studentGradYear}
                    onChange={(e) => setStudentGradYear(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="targetIndustry">Target Industry</label>
                  <select
                    id="targetIndustry"
                    className="form-select"
                    value={targetIndustry}
                    onChange={(e) => setTargetIndustry(e.target.value)}
                  >
                    <option value="Technology">Technology & Software</option>
                    <option value="Data Science & AI">Data Science & AI</option>
                    <option value="Financial Services">Financial Services & Banking</option>
                    <option value="Healthcare Tech">Healthcare & HealthTech</option>
                    <option value="Design & Creative Tech">Design & UI/UX</option>
                    <option value="Management Consulting">Management Consulting</option>
                    <option value="BioTech & Pharma">BioTech & Life Sciences</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="careerGoal">Dream Role / Career Goal</label>
                  <input
                    id="careerGoal"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Full-Stack Engineer, Product Manager"
                    value={careerGoal}
                    onChange={(e) => setCareerGoal(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="skillsToLearn">Skills You Want to Learn (comma-separated)</label>
                <input
                  id="skillsToLearn"
                  type="text"
                  className="form-input"
                  placeholder="e.g. React, Python, System Design, Cloud Architecture"
                  value={skillsToLearn}
                  onChange={(e) => setSkillsToLearn(e.target.value)}
                />
              </div>
            </div>
          ) : (
            <div style={{ borderTop: '1px solid var(--color-gray-200)', paddingTop: '1.25rem', marginTop: '0.5rem' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-primary-800)', marginBottom: '1rem' }}>
                Alumni Experience & Mentoring Preferences
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="company">Company / Organization</label>
                  <input
                    id="company"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Google, CloudScale, Apex Financial"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="currentRole">Current Job Title</label>
                  <input
                    id="currentRole"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Staff Engineer, Product Manager"
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
                  <label className="form-label" htmlFor="alumniGradYear">Alumni Graduation Year</label>
                  <input
                    id="alumniGradYear"
                    type="number"
                    min="1970"
                    max="2024"
                    className="form-input"
                    value={alumniGradYear}
                    onChange={(e) => setAlumniGradYear(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="location">Location</label>
                  <input
                    id="location"
                    type="text"
                    className="form-input"
                    placeholder="e.g. San Francisco, CA / Remote"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="yearsExperience">Years of Experience</label>
                  <input
                    id="yearsExperience"
                    type="number"
                    min="1"
                    max="45"
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
                  placeholder="e.g. Python, System Design, Cloud Architecture, Leadership"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="mentoringInterests">Mentoring Topics / Interests</label>
                <input
                  id="mentoringInterests"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Mock Interviews, Resume Review, Career Transition"
                  value={mentoringInterests}
                  onChange={(e) => setMentoringInterests(e.target.value)}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.875rem', marginTop: '1.5rem' }}
          >
            {loading ? 'Creating account...' : `Complete Registration as ${role === 'student' ? 'Student' : 'Alumnus'}`}
            <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--color-gray-600)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ fontWeight: 600 }}>
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
}
