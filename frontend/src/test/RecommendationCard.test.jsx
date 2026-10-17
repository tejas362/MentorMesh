import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import RecommendationCard from '../components/RecommendationCard';

describe('RecommendationCard', () => {
  const mockRec = {
    alumni: {
      id: 2,
      user_id: 12,
      full_name: 'Elena Rostova',
      company: 'Vertex AI',
      current_role: 'Senior ML Scientist',
      industry: 'Data Science & AI',
      graduation_year: 2019,
      is_available_for_mentorship: true,
      skills: ['Python', 'PyTorch', 'Machine Learning']
    },
    match_score: 95,
    reasons: [
      'Direct industry match in Data Science & AI',
      'Shares key skills you want to learn: Python, PyTorch',
      'Current role directly aligns with your career target'
    ],
    matching_skills: ['Python', 'PyTorch'],
    industry_match: true,
    career_goal_match: true
  };

  it('renders match score, reasons, and actions', () => {
    render(
      <BrowserRouter>
        <RecommendationCard recommendation={mockRec} />
      </BrowserRouter>
    );

    expect(screen.getByText('95% Match Score')).toBeInTheDocument();
    expect(screen.getByText('Elena Rostova')).toBeInTheDocument();
    expect(screen.getByText(/Vertex AI/i)).toBeInTheDocument();
    expect(screen.getByText(/Direct industry match in Data Science & AI/i)).toBeInTheDocument();
    expect(screen.getByText('Connect')).toBeInTheDocument();
    expect(screen.getByText('Draft Message')).toBeInTheDocument();
  });
});
