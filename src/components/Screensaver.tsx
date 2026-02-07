import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';
import './Screensaver.css';

interface ScreensaverProps {
  onDismiss: () => void;
}

const Screensaver: React.FC<ScreensaverProps> = ({ onDismiss }) => {
  const { username, unlock } = useAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const arkiTechLogo = '/ArkiTech.png';

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await unlock(password);

      if (result.success) {
        setPassword('');
        // Screen will automatically dismiss via AuthContext
      } else {
        setError(result.error || 'Invalid password');
        setPassword('');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container screensaver-fullscreen">
      <div className="login-wrapper">
        {/* Logo/Brand Section - Exactly like Login */}
        <div className="login-brand">
          <div className="logo-container">
            <img src={arkiTechLogo} alt="ArkiTech Systems" className="logo-image" />
          </div>
          <h1 className="brand-title">ArkiTech Systems</h1>
          <p className="brand-subtitle">Financial Dashboard for Healthcare Data Analytics</p>
        </div>

        {/* Glass Card - Exactly like Login */}
        <div className="glass-card">
          <h2 className="card-title">Screen Locked</h2>

          <form onSubmit={handleUnlock} style={{
            position: 'relative',
            zIndex: 1,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}>
            <p style={{
              fontSize: '1.125rem',
              color: '#0f2027',
              margin: 0,
              fontWeight: 500,
              textAlign: 'center'
            }}>
              Logged in as: <strong>{username}</strong>
            </p>

            <p style={{
              fontSize: '0.875rem',
              color: '#666',
              margin: 0,
              textAlign: 'center'
            }}>
              Enter your password to unlock
            </p>

            {error && (
              <div style={{
                padding: '0.75rem',
                background: 'rgba(220, 53, 69, 0.1)',
                borderRadius: '8px',
                border: '1px solid rgba(220, 53, 69, 0.3)',
                textAlign: 'center'
              }}>
                <p style={{
                  margin: 0,
                  color: '#000',
                  fontSize: '0.875rem',
                  fontWeight: 500
                }}>
                  {error}
                </p>
              </div>
            )}

            <div className="input-group">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input"
                autoFocus
                disabled={isLoading}
              />
              <label className="login-label">Password</label>
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={isLoading || !password}
            >
              {isLoading ? (
                <div className="loading-spinner"></div>
              ) : (
                'Unlock'
              )}
            </button>
          </form>
        </div>

        {/* Footer - Exactly like Login */}
        <p className="login-footer">
          © {new Date().getFullYear()} ArkiTech Systems. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Screensaver;
