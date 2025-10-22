import React from 'react';
import './Login.css';
import './Screensaver.css';

interface ScreensaverProps {
  onDismiss: () => void;
  timeRemaining: number; // seconds until auto-logout
}

const Screensaver: React.FC<ScreensaverProps> = ({ onDismiss, timeRemaining }) => {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  const arkiTechLogo = '/ArkiTech.png';

  // Handle click anywhere to dismiss
  const handleClick = (e: React.MouseEvent) => {
    onDismiss();
  };

  return (
    <div className="login-container screensaver-fullscreen" onClick={handleClick}>
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

          <div style={{
            textAlign: 'center',
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
              fontWeight: 500
            }}>
              Logged in as: <strong>{localStorage.getItem('username')}</strong>
            </p>

            <div style={{
              padding: '1rem',
              background: 'rgba(26, 188, 156, 0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(26, 188, 156, 0.3)'
            }}>
              {timeRemaining > 0 ? (
                <p style={{
                  margin: 0,
                  color: '#1abc9c',
                  fontSize: '0.875rem',
                  fontWeight: 500
                }}>
                  Session will expire in {minutes}:{seconds.toString().padStart(2, '0')}
                  <br />
                  <small style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                    You will be logged out automatically
                  </small>
                </p>
              ) : (
                <p style={{
                  margin: 0,
                  color: '#dc3545',
                  fontSize: '0.875rem',
                  fontWeight: 600
                }}>
                  Session expired - Logging out...
                </p>
              )}
            </div>

            <p style={{
              fontSize: '0.875rem',
              color: '#666',
              opacity: 0.7,
              margin: 0,
              animation: 'fadeInOut 2s ease-in-out infinite'
            }}>
              Click anywhere to resume
            </p>
          </div>
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
