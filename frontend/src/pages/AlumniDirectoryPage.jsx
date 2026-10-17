import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, X, Users, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import AlumniCard from '../components/AlumniCard';

export default function AlumniDirectoryPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [alumniList, setAlumniList] = useState([]);
  const [meta, setMeta] = useState({ industries: [], skills: [], graduation_years: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter States initialized from URL params if present
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedIndustry, setSelectedIndustry] = useState(searchParams.get('industry') || 'all');
  const [selectedSkill, setSelectedSkill] = useState(searchParams.get('skill') || 'all');
  const [selectedGradYear, setSelectedGradYear] = useState(searchParams.get('graduation_year') || 'all');
  const [availableOnly, setAvailableOnly] = useState(searchParams.get('available_only') === 'true');

  // Load filter metadata
  useEffect(() => {
    const loadMeta = async () => {
      try {
        const metadata = await api.alumni.getFiltersMeta();
        setMeta(metadata);
      } catch (err) {
        console.error('Failed to load filter metadata', err);
      }
    };
    loadMeta();
  }, []);

  // Fetch alumni whenever search or filter options change
  const fetchAlumni = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (searchQuery.trim()) params.q = searchQuery.trim();
      if (selectedIndustry !== 'all') params.industry = selectedIndustry;
      if (selectedSkill !== 'all') params.skill = selectedSkill;
      if (selectedGradYear !== 'all') params.graduation_year = parseInt(selectedGradYear, 10);
      if (availableOnly) params.available_only = true;

      // Update URL query string for shareability & reload persistence
      const newSearchParams = new URLSearchParams();
      if (params.q) newSearchParams.set('q', params.q);
      if (params.industry) newSearchParams.set('industry', params.industry);
      if (params.skill) newSearchParams.set('skill', params.skill);
      if (params.graduation_year) newSearchParams.set('graduation_year', params.graduation_year);
      if (params.available_only) newSearchParams.set('available_only', 'true');
      setSearchParams(newSearchParams, { replace: true });

      const data = await api.alumni.getAll(params);
      setAlumniList(data);
    } catch (err) {
      setError(err.message || 'Failed to load alumni directory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlumni();
  }, [selectedIndustry, selectedSkill, selectedGradYear, availableOnly]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchAlumni();
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedIndustry('all');
    setSelectedSkill('all');
    setSelectedGradYear('all');
    setAvailableOnly(false);
    setSearchParams({}, { replace: true });
  };

  const hasActiveFilters = searchQuery || selectedIndustry !== 'all' || selectedSkill !== 'all' || selectedGradYear !== 'all' || availableOnly;

  return (
    <div style={{ padding: '2.5rem 0 4.5rem' }}>
      <div className="container">
        {/* Page Title */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Alumni Directory
          </h1>
          <p style={{ color: 'var(--color-gray-600)', fontSize: '1.0625rem' }}>
            Discover and connect with university graduates across top companies and industries.
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="Search alumni by name, role, company, or skills (e.g. Marcus, Google, Python)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search size={18} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray-400)' }} />
            </div>
            <button type="submit" className="btn btn-primary">
              <Search size={16} /> Search
            </button>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="btn btn-secondary"
                title="Reset all filters"
              >
                <X size={16} /> Clear Filters
              </button>
            )}
          </form>

          {/* Filters row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
            alignItems: 'center'
          }}>
            {/* Industry Filter */}
            <div>
              <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Industry</label>
              <select
                className="form-select"
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                style={{ fontSize: '0.875rem' }}
              >
                <option value="all">All Industries</option>
                {meta.industries.map((ind) => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>

            {/* Skill Filter */}
            <div>
              <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Skill</label>
              <select
                className="form-select"
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                style={{ fontSize: '0.875rem' }}
              >
                <option value="all">All Skills</option>
                {meta.skills.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Graduation Year */}
            <div>
              <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Graduation Year</label>
              <select
                className="form-select"
                value={selectedGradYear}
                onChange={(e) => setSelectedGradYear(e.target.value)}
                style={{ fontSize: '0.875rem' }}
              >
                <option value="all">All Years</option>
                {meta.graduation_years.map((year) => (
                  <option key={year} value={year}>Class of {year}</option>
                ))}
              </select>
            </div>

            {/* Available Toggle */}
            <div style={{ paddingTop: '1.25rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}>
                <input
                  type="checkbox"
                  checked={availableOnly}
                  onChange={(e) => setAvailableOnly(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary-600)' }}
                />
                Open for Mentorship only
              </label>
            </div>
          </div>
        </div>

        {/* Results Counter & Status */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.9375rem', color: 'var(--color-gray-600)', fontWeight: 500 }}>
            Showing <strong>{alumniList.length}</strong> alumni {hasActiveFilters && '(filtered)'}
          </div>
        </div>

        {/* Content States */}
        {loading ? (
          <div className="state-container">
            <div className="loading-spinner" />
            <div style={{ marginTop: '1rem', color: 'var(--color-gray-500)', fontSize: '0.9375rem' }}>
              Loading alumni directory...
            </div>
          </div>
        ) : error ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
            <p style={{ color: 'var(--color-danger-600)', marginBottom: '1rem' }}>{error}</p>
            <button onClick={fetchAlumni} className="btn btn-secondary">
              <RefreshCw size={15} /> Try Again
            </button>
          </div>
        ) : alumniList.length === 0 ? (
          <div className="card state-container">
            <Users size={48} className="state-icon" />
            <h3 className="state-title">No Alumni Found</h3>
            <p className="state-desc">
              We couldn't find any alumni matching your specific search query or active filter criteria.
            </p>
            <button onClick={handleClearFilters} className="btn btn-primary">
              Clear Filters & Show All
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.5rem'
          }}>
            {alumniList.map((alumni) => (
              <AlumniCard key={alumni.id} alumni={alumni} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
