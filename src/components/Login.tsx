import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();

  const arkiTechLogo = '/ArkiTech.png';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!username || !password) {
      setError('Please enter both username and password');
      setIsLoading(false);
      return;
    }

    try {
      const success = await login(username, password);
      if (!success) {
        setError('Invalid username or password');
        setPassword('');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        {/* Logo/Brand Section */}
        <div className="login-brand">
          <div className="logo-container">
            <img src={arkiTechLogo} alt="ArkiTech Systems" className="logo-image" />
          </div>
          <h1 className="brand-title">ArkiTech Systems</h1>
          <p className="brand-subtitle">Financial Dashboard</p>
        </div>

        {/* Login Card */}
        <div className="glass-card">
          <h2 className="card-title">Login</h2>

          <form onSubmit={handleSubmit} className="login-form" noValidate>
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder=""
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-input"
                autoFocus
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder=""
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="remember-me-container">
              <label className="remember-me-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="remember-me-checkbox"
                />
                <span>Remember me</span>
              </label>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button
              type="submit"
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="button-spinner"></span>
                  <span>Logging in...</span>
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>

          <div className="forgot-password">
            <a href="#" onClick={(e) => { e.preventDefault(); alert('Please contact your administrator to reset your password.'); }}>
              Forgot your password?
            </a>
          </div>
        </div>

        {/* Footer */}
        <p className="login-footer">
          © {new Date().getFullYear()} ArkiTech Systems. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
