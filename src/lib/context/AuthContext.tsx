// ============================================================
// FILE: src/lib/context/AuthContext.tsx
// Auth Context - Global authentication state management
// Fully type-safe for TS/Next.js
// ============================================================

'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { authService } from '../api';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    name: string;
    email: string;
    password: string;
    phone: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  // Detect client-side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check auth on mount
  useEffect(() => {
    if (isClient) checkAuth();
  }, [isClient]);

  // -----------------------------
  // Check if user is authenticated
  // -----------------------------
  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const response = await authService.getProfile();
      if (response?.data) {
        setUser(response.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('authToken');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Login user
  // -----------------------------
  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });

      if (!response?.data) {
        throw new Error('Login failed: No data returned from server.');
      }

      localStorage.setItem('authToken', response.data.token);
      setUser(response.data.user ?? null);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  // -----------------------------
  // Register user
  // -----------------------------
  const register = async (userData: {
    name: string;
    email: string;
    password: string;
    phone: string;
  }) => {
    try {
      const response = await authService.register(userData);

      if (!response?.data) {
        throw new Error('Registration failed: No data returned from server.');
      }

      localStorage.setItem('authToken', response.data.token);
      setUser(response.data.user ?? null);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  // -----------------------------
  // Logout user
  // -----------------------------
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.removeItem('authToken');
      setUser(null);
    }
  };

  // -----------------------------
  // Update user locally
  // -----------------------------
  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  // -----------------------------
  // Refresh user from server
  // -----------------------------
  const refreshUser = async () => {
    try {
      const response = await authService.getProfile();
      if (response?.data) {
        setUser(response.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
      throw error;
    }
  };

  // -----------------------------
  // Context value
  // -----------------------------
  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
    updateUser,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// -----------------------------
// Custom hook
// -----------------------------
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;    phone: string;
  }) => {
    try {
      const response = await authService.register(userData);
      localStorage.setItem('authToken', response.data.token);
      setUser(response.data.user ?? null);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.removeItem('authToken');
      setUser(null);
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const refreshUser = async () => {
    try {
      const response = await authService.getProfile();
      setUser(response.data ?? null);
    } catch (error) {
      console.error('Failed to refresh user:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
    updateUser,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export default AuthContext;
