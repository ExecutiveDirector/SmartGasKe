// ============================================================
// FILE: src/pages/account/profile.tsx
// Profile Settings Page - Edit user profile
// ============================================================

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Save,
  ArrowLeft,
  Loader,
  Eye,
  EyeOff,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { authService } from '@/lib/api';
import { isValidEmail, isValidPhone } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
  const [submitting, setSubmitting] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Form validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/account/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Populate form with user data
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    }
  }, [user]);

  // Validate profile form
  const validateProfileForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!profileForm.name || profileForm.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!profileForm.email) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(profileForm.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!profileForm.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!isValidPhone(profileForm.phone)) {
      newErrors.phone = 'Invalid phone number (use format: +254712345678 or 0712345678)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate password form
  const validatePasswordForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!passwordForm.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!passwordForm.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordForm.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }

    if (!passwordForm.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (passwordForm.currentPassword === passwordForm.newPassword) {
      newErrors.newPassword = 'New password must be different from current password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle profile update
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateProfileForm()) {
      return;
    }

    setSubmitting(true);
    try {
      await authService.updateProfile(profileForm);
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle password change
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePasswordForm()) {
      return;
    }

    setSubmitting(true);
    try {
      await authService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success('Password changed successfully!');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setErrors({});
    } catch (error: any) {
      toast.error(error.message || 'Failed to change password');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Profile Settings - AquaGas</title>
      </Head>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Link
            href="/account"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-semibold"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Profile Settings</h1>
            <p className="text-gray-600">Manage your account information and security</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-4 space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    activeTab === 'profile'
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <User size={20} />
                  <span className="font-semibold">Profile</span>
                </button>
                <button
                  onClick={() => setActiveTab('password')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    activeTab === 'password'
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <Lock size={20} />
                  <span className="font-semibold">Password</span>
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {activeTab === 'profile' ? (
                /* Profile Form */
                <div className="bg-white rounded-lg shadow-md p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile Information</h2>

                  <form onSubmit={handleProfileSubmit} className="space-y-6">
                    {/* Name Field */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                          type="text"
                          value={profileForm.name}
                          onChange={(e) =>
                            setProfileForm({ ...profileForm, name: e.target.value })
                          }
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                            errors.name ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="John Doe"
                        />
                      </div>
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                      )}
                    </div>

                    {/* Email Field */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                          type="email"
                          value={profileForm.email}
                          onChange={(e) =>
                            setProfileForm({ ...profileForm, email: e.target.value })
                          }
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                            errors.email ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="you@example.com"
                        />
                      </div>
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                      )}
                    </div>

                    {/* Phone Field */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                          type="tel"
                          value={profileForm.phone}
                          onChange={(e) =>
                            setProfileForm({ ...profileForm, phone: e.target.value })
                          }
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                            errors.phone ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="+254712345678"
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                      )}
                    </div>

                    {/* Address Field */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Delivery Address
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                        <textarea
                          rows={3}
                          value={profileForm.address}
                          onChange={(e) =>
                            setProfileForm({ ...profileForm, address: e.target.value })
                          }
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                          placeholder="123 Main Street, Nairobi"
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex items-center gap-4">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {submitting ? (
                          <>
                            <Loader className="animate-spin" size={20} />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save size={20} />
                            Save Changes
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => router.push('/account')}
                        className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 font-semibold transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                /* Password Form */
                <div className="bg-white rounded-lg shadow-md p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Change Password</h2>

                  <form onSubmit={handlePasswordSubmit} className="space-y-6">
                    {/* Current Password */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={passwordForm.currentPassword}
                          onChange={(e) =>
                            setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                          }
                          className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                            errors.currentPassword ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                          {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                      {errors.currentPassword && (
                        <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>
                      )}
                    </div>

                    {/* New Password */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={passwordForm.newPassword}
                          onChange={(e) =>
                            setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                          }
                          className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                            errors.newPassword ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                          {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                      {errors.newPassword && (
                        <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
                      )}
                    </div>

                    {/* Confirm New Password */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={passwordForm.confirmPassword}
                          onChange={(e) =>
                            setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                          }
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                            errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="••••••••"
                        />
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                      )}
                    </div>

                    {/* Password Requirements */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 mb-2">Password Requirements:</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li className="flex items-center gap-2">
                          <CheckCircle size={16} className="text-blue-600" />
                          At least 6 characters long
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle size={16} className="text-blue-600" />
                          Different from current password
                        </li>
                      </ul>
                    </div>

                    {/* Submit Button */}
                    <div className="flex items-center gap-4">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {submitting ? (
                          <>
                            <Loader className="animate-spin" size={20} />
                            Changing...
                          </>
                        ) : (
                          <>
                            <Lock size={20} />
                            Change Password
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => router.push('/account')}
                        className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 font-semibold transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
