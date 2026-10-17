// Centralized API Service for MentorMesh

const API_BASE = '/api';

export const getStoredToken = () => localStorage.getItem('mentormesh_token');
export const setStoredToken = (token) => {
  if (token) {
    localStorage.setItem('mentormesh_token', token);
  } else {
    localStorage.removeItem('mentormesh_token');
  }
};

async function apiRequest(endpoint, options = {}) {
  const token = getStoredToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type');
  let data = null;
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  }

  if (!response.ok) {
    const errorMsg = data?.detail || `Request failed with status ${response.status}`;
    const error = new Error(errorMsg);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  // Authentication
  auth: {
    login: (credentials) => apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    }),
    register: (userData) => apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    }),
    me: () => apiRequest('/auth/me'),
  },

  // Alumni Directory
  alumni: {
    getAll: (params = {}) => {
      const searchParams = new URLSearchParams();
      if (params.q) searchParams.append('q', params.q);
      if (params.industry && params.industry !== 'all') searchParams.append('industry', params.industry);
      if (params.skill && params.skill !== 'all') searchParams.append('skill', params.skill);
      if (params.graduation_year) searchParams.append('graduation_year', params.graduation_year);
      if (params.available_only) searchParams.append('available_only', 'true');
      const queryStr = searchParams.toString() ? `?${searchParams.toString()}` : '';
      return apiRequest(`/alumni${queryStr}`);
    },
    getById: (id) => apiRequest(`/alumni/${id}`),
    getFiltersMeta: () => apiRequest('/alumni/filters/meta'),
  },

  // AI-inspired Mentor Matching Recommendations
  recommendations: {
    get: (params = {}) => {
      const searchParams = new URLSearchParams();
      if (params.target_industry) searchParams.append('target_industry', params.target_industry);
      if (params.career_goal) searchParams.append('career_goal', params.career_goal);
      if (params.skills_to_learn) searchParams.append('skills_to_learn', params.skills_to_learn);
      const queryStr = searchParams.toString() ? `?${searchParams.toString()}` : '';
      return apiRequest(`/recommendations${queryStr}`);
    }
  },

  // Mentorship Requests
  requests: {
    create: (data) => apiRequest('/requests', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    getStudentRequests: () => apiRequest('/requests/student'),
    getAlumniRequests: () => apiRequest('/requests/alumni'),
    updateStatus: (id, data) => apiRequest(`/requests/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    }),
  },

  // Networking Message Generator
  messages: {
    generate: (data) => apiRequest('/messages/generate', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },

  // User Profile & Platform Stats
  users: {
    updateProfile: (data) => apiRequest('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    getStats: () => apiRequest('/users/stats'),
    resetDemo: () => apiRequest('/users/reset-demo', {
      method: 'POST'
    })
  }
};
