// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3005';

// API Endpoints
export const API_ENDPOINTS = {
  BASE_URL: API_BASE_URL,
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  VERIFY: `${API_BASE_URL}/api/auth/verify`,
  HEALTH: `${API_BASE_URL}/api/health`,
  MFA_SETUP: `${API_BASE_URL}/api/mfa/setup`,
  MFA_ENABLE: `${API_BASE_URL}/api/mfa/enable`,
  MFA_DISABLE: `${API_BASE_URL}/api/mfa/disable`,
  MFA_STATUS: `${API_BASE_URL}/api/mfa/status`,
  RESET_PASSWORD_FIRST_LOGIN: `${API_BASE_URL}/api/auth/reset-password-first-login`,
  COMPLETE_FIRST_LOGIN: `${API_BASE_URL}/api/auth/complete-first-login`,
  SUBMIT_TICKET: `${API_BASE_URL}/api/tickets/submit`,
};

// Helper function to build API endpoint URLs
export const getApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};
