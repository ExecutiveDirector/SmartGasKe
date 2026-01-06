// ============================================================
// FILE: src/lib/context/AuthContext.tsx
// Auth Context - Global authentication state management
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

  // Check if we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check authentication status on mount
  useEffect(() => {
    if (isClient) {
      checkAuth();
    }
  }, [isClient]);

  // Check if user is authenticated
  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        // Fetch user profile
        const response = await authService.getProfile();
        setUser(response.data);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Clear invalid token
      localStorage.removeItem('authToken');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      
      // Save token
      localStorage.setItem('authToken', response.data.token);
      
      // Set user
      setUser(response.data.user);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  // Register new user
  const register = async (userData: {
    name: string;
    email: string;
    password: string;
    phone: string;
  }) => {
    try {
      const response = await authService.register(userData);
      
      // Save token
      localStorage.setItem('authToken', response.data.token);
      
      // Set user
      setUser(response.data.user);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      // Clear token and user regardless of API call result
      localStorage.removeItem('authToken');
      setUser(null);
    }
  };

  // Update user data locally
  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  // Refresh user data from server
  const refreshUser = async () => {
    try {
      const response = await authService.getProfile();
      setUser(response.data);
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

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
