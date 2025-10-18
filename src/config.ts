// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// API Endpoints
export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  VERIFY: `${API_BASE_URL}/api/auth/verify`,
  HEALTH: `${API_BASE_URL}/api/health`,
};

// Helper function to build API endpoint URLs
export const getApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};
