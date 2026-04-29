import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Mail, Lock, User, Phone, Eye, EyeOff, Loader, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import toast from 'react-hot-toast';

// Enhanced validation functions
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhone = (phone: string): boolean => {
  // Accepts: +254712345678 or 0712345678
  const phoneRegex = /^(\+254|0)[17]\d{8}$/;
  return phoneRegex.test(phone);
};

const formatPhoneNumber = (phone: string): string => {
  // Convert 0712345678 to +254712345678
  if (phone.startsWith('0')) {
    return '+254' + phone.substring(1);
  }
  return phone;
};

const getPasswordStrength = (password: string): { strength: number; label: string; color: string } => {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  const labels = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-green-600'];

  return {
    strength,
    label: labels[strength - 1] || 'Weak',
    color: colors[strength - 1] || 'bg-red-500'
  };
};

export default function LoginPage() {
  const router = useRouter();
  const { login, register, isAuthenticated, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });

  // Register form state
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  // Form validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Password strength
  const [passwordStrength, setPasswordStrength] = useState({ strength: 0, label: '', color: '' });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !loading) {
      router.push('/account');
    }
  }, [isAuthenticated, loading, router]);

  // Update password strength when typing
  useEffect(() => {
    if (!isLogin && registerForm.password) {
      setPasswordStrength(getPasswordStrength(registerForm.password));
    }
  }, [registerForm.password, isLogin]);

  // Validate login form
  const validateLoginForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!loginForm.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(loginForm.email.trim())) {
      newErrors.email = 'Invalid email format';
    }

    if (!loginForm.password) {
      newErrors.password = 'Password is required';
    } else if (loginForm.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate register form
  const validateRegisterForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!registerForm.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (registerForm.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!registerForm.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(registerForm.email.trim())) {
      newErrors.email = 'Invalid email format';
    }

    if (!registerForm.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!isValidPhone(registerForm.phone.trim())) {
      newErrors.phone = 'Invalid phone number. Use format: +254712345678 or 0712345678';
    }

    if (!registerForm.password) {
      newErrors.password = 'Password is required';
    } else if (registerForm.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/[A-Z]/.test(registerForm.password) || !/[a-z]/.test(registerForm.password) || !/\d/.test(registerForm.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    if (!registerForm.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (registerForm.password !== registerForm.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle login submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateLoginForm()) {
      return;
    }

    setSubmitting(true);
    try {
      await login(loginForm.email.trim().toLowerCase(), loginForm.password);
      toast.success('Welcome back!');
      router.push('/account');
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error?.response?.data?.error || error?.message || 'Login failed. Please check your credentials.';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle register submit
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateRegisterForm()) {
      return;
    }

    setSubmitting(true);
    try {
      // Format phone number
      const formattedPhone = formatPhoneNumber(registerForm.phone.trim());

      await register({
  fullName: registerForm.name.trim(),   
  email: registerForm.email.trim().toLowerCase(),
  phone: formattedPhone,
  password: registerForm.password,
});

      toast.success('Account created successfully!');
      router.push('/account');
    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMessage = error?.response?.data?.error || error?.message || 'Registration failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle between login and register
  const toggleForm = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setLoginForm({ email: '', password: '' });
    setRegisterForm({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
    setPasswordStrength({ strength: 0, label: '', color: '' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{isLogin ? 'Login' : 'Register'} - AquaGas</title>
        <meta name="description" content={isLogin ? 'Login to your AquaGas account' : 'Create your AquaGas account'} />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center py-12 px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              {isLogin ? <Lock className="text-blue-600" size={32} /> : <User className="text-blue-600" size={32} />}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-gray-600">
              {isLogin ? 'Login to your AquaGas account' : 'Join AquaGas today'}
            </p>
          </div>

          {/* Login Form */}
          {isLogin ? (
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="email"
                    value={loginForm.email}
                    onChange={(e) => {
                      setLoginForm({ ...loginForm, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: '' });
                    }}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="you@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <XCircle size={14} />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginForm.password}
                    onChange={(e) => {
                      setLoginForm({ ...loginForm, password: e.target.value });
                      if (errors.password) setErrors({ ...errors, password: '' });
                    }}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <XCircle size={14} />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" className="mr-2 w-4 h-4 text-blue-600 rounded" />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-green-700 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
              >
                {submitting ? (
                  <>
                    <Loader className="animate-spin" size={20} />
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </button>
            </form>
          ) : (
            /* Register Form */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={registerForm.name}
                    onChange={(e) => {
                      setRegisterForm({ ...registerForm, name: e.target.value });
                      if (errors.name) setErrors({ ...errors, name: '' });
                    }}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <XCircle size={14} />
                    {errors.name}
                  </p>
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
                    value={registerForm.email}
                    onChange={(e) => {
                      setRegisterForm({ ...registerForm, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: '' });
                    }}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="you@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <XCircle size={14} />
                    {errors.email}
                  </p>
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
                    value={registerForm.phone}
                    onChange={(e) => {
                      setRegisterForm({ ...registerForm, phone: e.target.value });
                      if (errors.phone) setErrors({ ...errors, phone: '' });
                    }}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="+254712345678 or 0712345678"
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <XCircle size={14} />
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={registerForm.password}
                    onChange={(e) => {
                      setRegisterForm({ ...registerForm, password: e.target.value });
                      if (errors.password) setErrors({ ...errors, password: '' });
                    }}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {/* Password Strength Indicator */}
                {registerForm.password && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded ${
                            level <= passwordStrength.strength ? passwordStrength.color : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-600">
                      Password strength: <span className="font-semibold">{passwordStrength.label}</span>
                    </p>
                  </div>
                )}
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <XCircle size={14} />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={registerForm.confirmPassword}
                    onChange={(e) => {
                      setRegisterForm({ ...registerForm, confirmPassword: e.target.value });
                      if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                    }}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="••••••••"
                  />
                  {registerForm.confirmPassword && registerForm.password === registerForm.confirmPassword && (
                    <CheckCircle className="absolute right-3 top-3 text-green-600" size={20} />
                  )}
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <XCircle size={14} />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start">
                <input type="checkbox" className="mt-1 mr-2 w-4 h-4 text-blue-600 rounded" required />
                <span className="text-sm text-gray-600">
                  I agree to the{' '}
                  <button type="button" className="text-blue-600 hover:text-blue-700 font-semibold">
                    Terms
                  </button>
                  {' '}and{' '}
                  <button type="button" className="text-blue-600 hover:text-blue-700 font-semibold">
                    Privacy Policy
                  </button>
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-green-700 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
              >
                {submitting ? (
                  <>
                    <Loader className="animate-spin" size={20} />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>
          )}

          {/* Toggle Form */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                onClick={toggleForm}
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                {isLogin ? 'Register' : 'Login'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
    } 