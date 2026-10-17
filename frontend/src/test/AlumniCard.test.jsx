import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import AlumniCard from '../components/AlumniCard';

describe('AlumniCard', () => {
  const mockAlumni = {
    id: 1,
    user_id: 10,
    full_name: 'Dr. Marcus Vance',
    company: 'CloudScale Systems',
    current_role: 'Staff Software Engineer',
    industry: 'Technology',
    graduation_year: 2018,
    location: 'San Francisco, CA',
    is_available_for_mentorship: true,
    bio: 'Distributed systems engineer with 8+ years experience.',
    skills: ['Python', 'System Design', 'Cloud Architecture', 'FastAPI', 'Docker']
  };

  it('renders alumni name, role, company, and skills', () => {
    render(
      <BrowserRouter>
        <AlumniCard alumni={mockAlumni} />
      </BrowserRouter>
    );

    expect(screen.getByText('Dr. Marcus Vance')).toBeInTheDocument();
    expect(screen.getByText(/Staff Software Engineer/i)).toBeInTheDocument();
    expect(screen.getByText(/CloudScale Systems/i)).toBeInTheDocument();
    expect(screen.getByText('Python')).toBeInTheDocument();
    expect(screen.getByText('System Design')).toBeInTheDocument();
    expect(screen.getByText(/Open for Mentorship/i)).toBeInTheDocument();
    expect(screen.getByText('View Profile')).toBeInTheDocument();
  });
});
