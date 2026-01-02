// ============================================================
// FILE: src/lib/services/authService.ts
// Authentication Service - Wrapper around auth API calls
// ============================================================

import api, { authService as authApi } from '../api';
import { LoginCredentials, RegisterData, User } from '../types';

class AuthService {
  /**
   * Login user with email and password
   */
  async login(credentials: LoginCredentials) {
    const response = await authApi.login(credentials);
    return response;
  }

  /**
   * Register new user
   */
  async register(userData: RegisterData) {
    const response = await authApi.register(userData);
    return response;
  }

  /**
   * Logout current user
   */
  async logout() {
    const response = await authApi.logout();
    // Clear token from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
    return response;
  }

  /**
   * Get current user profile
   */
  async getProfile() {
    const response = await authApi.getProfile();
    return response;
  }

  /**
   * Update user profile
   */
  async updateProfile(profileData: Partial<User>) {
    const response = await authApi.updateProfile(profileData);
    return response;
  }

  /**
   * Change password
   */
  async changePassword(currentPassword: string, newPassword: string) {
    const response = await authApi.changePassword({
      current_password: currentPassword,
      new_password: newPassword,
    });
    return response;
  }

  /**
   * Request password reset
   */
  async forgotPassword(email: string) {
    const response = await authApi.forgotPassword(email);
    return response;
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string) {
    const response = await authApi.resetPassword(token, newPassword);
    return response;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem('authToken');
    return !!token;
  }

  /**
   * Get stored auth token
   */
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('authToken');
  }

  /**
   * Set auth token
   */
  setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
  }

  /**
   * Remove auth token
   */
  removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
  }
}

export default new AuthService();
