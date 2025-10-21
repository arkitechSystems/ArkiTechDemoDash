import React, { useState } from 'react';
import './Screensaver.css';

interface ScreensaverProps {
  onDismiss: () => void;
  timeRemaining: number; // seconds until auto-logout
}

const Screensaver: React.FC<ScreensaverProps> = ({ onDismiss, timeRemaining }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const username = localStorage.getItem('username');
      const response = await fetch('http://localhost:3001/api/auth/verify-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        onDismiss();
      } else {
        setError('Incorrect password');
        setPassword('');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle click on the backdrop to allow dismissing
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onDismiss();
    }
  };

  return (
    <div className="screensaver-overlay" onClick={handleBackdropClick}>
      <div className="screensaver-content">
        <div className="screensaver-logo">
          <img
            src="https://willdash-login-suite.lovable.app/arkitechlogo.png"
            alt="ArkiTech Logo"
          />
        </div>

        <h2>Screen Locked</h2>
        <p className="screensaver-username">{localStorage.getItem('username')}</p>

        <form onSubmit={handleSubmit} className="screensaver-form">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password to unlock"
            className="screensaver-input"
            autoFocus
            disabled={isLoading}
          />

          {error && <div className="screensaver-error">{error}</div>}

          <button
            type="submit"
            className="screensaver-button"
            disabled={isLoading || !password}
          >
            {isLoading ? 'Verifying...' : 'Unlock'}
          </button>
        </form>

        <div className="screensaver-warning">
          {timeRemaining > 0 ? (
            <p>
              Session will expire in {minutes}:{seconds.toString().padStart(2, '0')}
              <br />
              <small>You will be logged out automatically</small>
            </p>
          ) : (
            <p className="screensaver-expired">Session expired - Logging out...</p>
          )}
        </div>

        <div className="screensaver-hint">
          Click anywhere or enter your password to resume
        </div>
      </div>
    </div>
  );
};

export default Screensaver;
