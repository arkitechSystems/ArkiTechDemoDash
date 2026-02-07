import React, { createContext, useContext } from 'react';

interface LoginResult {
  success: boolean;
  mfaRequired?: boolean;
  mfaEnabled?: boolean;
  firstLogin?: boolean;
  passwordResetRequired?: boolean;
  error?: string;
  errorType?: 'auth' | 'server' | 'network';
}

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string, mfaToken?: string, backupCode?: string) => Promise<LoginResult>;
  logout: () => void;
  unlock: (password: string) => Promise<LoginResult>;
  username: string | null;
  role: string | null;
  isLoading: boolean;
  mfaEnabled: boolean;
  firstLogin: boolean;
  passwordResetRequired: boolean;
  completeFirstLogin: () => void;
  hasRole: (requiredRole: 'dashboard' | 'accountant' | 'admin') => boolean;
  isAdmin: () => boolean;
  showScreensaver: boolean;
  dismissScreensaver: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // No-auth mode: always authenticated with default user
  const login = async (): Promise<LoginResult> => ({ success: true });
  const logout = () => {};
  const unlock = async (): Promise<LoginResult> => ({ success: true });
  const completeFirstLogin = () => {};
  const dismissScreensaver = () => {};
  const hasRole = () => true;
  const isAdmin = () => true;

  return (
    <AuthContext.Provider value={{
      isAuthenticated: true,
      login,
      logout,
      unlock,
      username: 'User',
      role: 'admin',
      isLoading: false,
      mfaEnabled: false,
      firstLogin: false,
      passwordResetRequired: false,
      completeFirstLogin,
      hasRole,
      isAdmin,
      showScreensaver: false,
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
