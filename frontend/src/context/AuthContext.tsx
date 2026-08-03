import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  username: string;
  name: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, pass: string) => boolean;
  logout: () => void;
  authError: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('pegma_auth_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [authError, setAuthError] = useState<string | null>(null);

  const login = (username: string, pass: string): boolean => {
    setAuthError(null);
    if (username.trim() === 'pegmaadmin' && pass === 'admin123') {
      const loggedUser: User = {
        username: 'pegmaadmin',
        name: 'Pegma Admin',
        role: 'Administrator'
      };
      setUser(loggedUser);
      localStorage.setItem('pegma_auth_user', JSON.stringify(loggedUser));
      return true;
    } else {
      setAuthError('Invalid credentials. Use username: pegmaadmin / pass: admin123');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('pegma_auth_user');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, login, logout, authError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
