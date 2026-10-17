import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import StatusBadge from '../components/StatusBadge';

describe('StatusBadge', () => {
  it('renders pending status badge correctly', () => {
    render(<StatusBadge status="pending" />);
    expect(screen.getByText(/Pending Review/i)).toBeInTheDocument();
  });

  it('renders accepted status badge correctly', () => {
    render(<StatusBadge status="accepted" />);
    expect(screen.getByText(/Accepted/i)).toBeInTheDocument();
  });

  it('renders rejected status badge correctly', () => {
    render(<StatusBadge status="rejected" />);
    expect(screen.getByText(/Closed \/ Declined/i)).toBeInTheDocument();
  });

  it('renders open for mentorship availability badge', () => {
    render(<StatusBadge status={true} type="availability" />);
    expect(screen.getByText(/Open for Mentorship/i)).toBeInTheDocument();
  });

  it('renders unavailable status badge', () => {
    render(<StatusBadge status={false} type="availability" />);
    expect(screen.getByText(/Unavailable/i)).toBeInTheDocument();
  });
});
