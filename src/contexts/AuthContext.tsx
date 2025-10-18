import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  username: string | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Verify token on mount
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('authToken');
      const savedUsername = localStorage.getItem('username');

      if (token && savedUsername) {
        try {
          const response = await fetch(API_ENDPOINTS.VERIFY, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            setIsAuthenticated(true);
            setUsername(savedUsername);
          } else {
            // Token is invalid, clear it
            localStorage.removeItem('authToken');
            localStorage.removeItem('username');
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('username');
        }
      }
      setIsLoading(false);
    };

    verifyToken();
  }, []);

  const login = async (inputUsername: string, inputPassword: string): Promise<boolean> => {
    try {
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: inputUsername,
          password: inputPassword,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(true);
        setUsername(data.user.username);
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('username', data.user.username);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUsername(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, username, isLoading }}>
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
