import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config';

interface LoginResult {
  success: boolean;
  mfaRequired?: boolean;
  mfaEnabled?: boolean;
  firstLogin?: boolean;
  passwordResetRequired?: boolean;
}

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string, mfaToken?: string, backupCode?: string) => Promise<LoginResult>;
  logout: () => void;
  username: string | null;
  role: string | null; // 'dashboard', 'accountant', 'both', 'admin'
  isLoading: boolean;
  mfaEnabled: boolean;
  firstLogin: boolean;
  passwordResetRequired: boolean;
  completeFirstLogin: () => void;
  hasRole: (requiredRole: 'dashboard' | 'accountant' | 'admin') => boolean;
  isAdmin: () => boolean;
  showScreensaver: boolean;
  timeUntilLogout: number;
  dismissScreensaver: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [mfaEnabled, setMfaEnabled] = useState<boolean>(false);
  const [firstLogin, setFirstLogin] = useState<boolean>(false);
  const [passwordResetRequired, setPasswordResetRequired] = useState<boolean>(false);
  const [showScreensaver, setShowScreensaver] = useState<boolean>(false);
  const [timeUntilLogout, setTimeUntilLogout] = useState<number>(540); // 9 minutes in seconds (10 min total - 1 min before screensaver)
  const [lastActivity, setLastActivity] = useState<number>(Date.now());

  // Inactivity tracking - show screensaver after 1 minute, logout after 10 minutes
  useEffect(() => {
    if (!isAuthenticated) return;

    const handleActivity = () => {
      setLastActivity(Date.now());
      setShowScreensaver(false);
      setTimeUntilLogout(540); // Reset to 9 minutes (10 min total - 1 min before screensaver)
    };

    // Track user activity
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    // Check inactivity every second
    const interval = setInterval(() => {
      const inactiveTime = Date.now() - lastActivity;
      const inactiveSeconds = Math.floor(inactiveTime / 1000);

      // Show screensaver after 1 minute (60 seconds)
      if (inactiveSeconds >= 60) {
        setShowScreensaver(true);

        // Calculate time until logout (10 minutes total - current inactive time)
        const remainingSeconds = Math.max(0, 600 - inactiveSeconds);
        setTimeUntilLogout(remainingSeconds);

        // Auto-logout after 10 minutes (600 seconds)
        if (inactiveSeconds >= 600) {
          logout();
        }
      }
    }, 1000);

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
      clearInterval(interval);
    };
  }, [isAuthenticated, lastActivity]);

  // Verify token on mount
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('authToken');
      const savedUsername = localStorage.getItem('username');
      const savedRole = localStorage.getItem('userRole');

      if (token && savedUsername) {
        try {
          const response = await fetch(API_ENDPOINTS.VERIFY, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setIsAuthenticated(true);
            setUsername(savedUsername);
            setRole(savedRole || 'both');
            setMfaEnabled(data.user?.mfa_enabled || false);
          } else {
            // Token is invalid, clear it
            localStorage.removeItem('authToken');
            localStorage.removeItem('username');
            localStorage.removeItem('userRole');
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('username');
          localStorage.removeItem('userRole');
        }
      }
      setIsLoading(false);
    };

    verifyToken();
  }, []);

  const login = async (
    inputUsername: string,
    inputPassword: string,
    mfaToken?: string,
    backupCode?: string
  ): Promise<LoginResult> => {
    try {
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: inputUsername,
          password: inputPassword,
          mfaToken,
          backupCode,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Check if MFA is required
        if (data.mfaRequired) {
          return {
            success: false,
            mfaRequired: true,
            mfaEnabled: data.mfaEnabled || false
          };
        }

        // Login successful
        setIsAuthenticated(true);
        setUsername(data.user.username);
        setRole(data.user.role || 'both');
        setMfaEnabled(data.user.mfa_enabled || false);
        setFirstLogin(data.firstLogin || false);
        setPasswordResetRequired(data.passwordResetRequired || false);
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('username', data.user.username);
        localStorage.setItem('userRole', data.user.role || 'both');
        return {
          success: true,
          mfaEnabled: data.user.mfa_enabled || false,
          firstLogin: data.firstLogin || false,
          passwordResetRequired: data.passwordResetRequired || false
        };
      } else {
        return { success: false };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false };
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUsername(null);
    setRole(null);
    setFirstLogin(false);
    setPasswordResetRequired(false);
    setShowScreensaver(false);
    setLastActivity(Date.now());
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    localStorage.removeItem('userRole');
  };

  const dismissScreensaver = () => {
    setShowScreensaver(false);
    setLastActivity(Date.now());
    setTimeUntilLogout(540);
  };

  const completeFirstLogin = () => {
    setFirstLogin(false);
    setPasswordResetRequired(false);
  };

  const hasRole = (requiredRole: 'dashboard' | 'accountant' | 'admin'): boolean => {
    if (!role) return false;
    // Admin has access to everything
    if (role === 'admin') return true;
    // 'both' has access to dashboard and accountant views
    if (role === 'both' && requiredRole !== 'admin') return true;
    // Specific role match
    return role === requiredRole;
  };

  const isAdmin = (): boolean => {
    return role === 'admin';
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      login,
      logout,
      username,
      role,
      isLoading,
      mfaEnabled,
      firstLogin,
      passwordResetRequired,
      completeFirstLogin,
      hasRole,
      isAdmin,
      showScreensaver,
      timeUntilLogout,
      dismissScreensaver
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
