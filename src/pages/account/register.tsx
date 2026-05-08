// src/pages/auth/RegisterPage.jsx

import React, { useMemo, useState, useEffect } from 'react';

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  LinearProgress,
  Paper,
  Stack,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
} from '@mui/material';

import {
  CheckCircle,
  LocalGasStation,
  Lock,
  Person,
  Phone,
  Visibility,
  VisibilityOff,
  Email,
  Security,
  ArrowBack,
} from '@mui/icons-material';

import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/api';

const RegisterPage = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [loading, setLoading] = useState(false);

  const [otpSent, setOtpSent] = useState(false);

  const [otpVerified, setOtpVerified] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [rememberMe, setRememberMe] = useState(true);

  const [countdown, setCountdown] = useState(0);

  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    phone: '',
    otp: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    let timer;

    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    }

    return () => clearTimeout(timer);
  }, [countdown]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError('');
  };

  const passwordChecks = useMemo(() => {
    const password = formData.password;

    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
  }, [formData.password]);

  const passwordStrength = Object.values(passwordChecks).filter(Boolean).length;

  const isStrongPassword = passwordStrength >= 4;

  const getStrengthColor = () => {
    if (passwordStrength <= 2) return 'error';
    if (passwordStrength <= 4) return 'warning';
    return 'success';
  };

  const sendOTP = async () => {
    try {
      setLoading(true);
      setError('');

      const phone = formData.phone.trim();

      if (!phone) {
        return setError('Phone number is required');
      }

      if (!phone.startsWith('+')) {
        return setError('Phone number must start with country code');
      }

      await api.post('/api/auth/send-otp', {
        phone,
      });

      setOtpSent(true);

      setCountdown(60);

      toast.success('OTP sent successfully');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    try {
      setLoading(true);

      setError('');

      const response = await api.post('/api/auth/verify-otp', {
        phone: formData.phone,
        otp: formData.otp,
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);

        toast.success('Login successful');

        navigate('/user/home');

        return;
      }

      if (response.data.verified) {
        setOtpVerified(true);

        setStep(2);

        toast.success('Phone verified successfully');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async () => {
    try {
      setLoading(true);

      setError('');

      if (!formData.firstName || !formData.lastName) {
        return setError('Please complete your names');
      }

      if (formData.email && !formData.password) {
        return setError('Password required when email is provided');
      }

      if (formData.password && !isStrongPassword) {
        return setError('Password is too weak');
      }

      const response = await api.post('/api/auth/register/phone', {
        phone: formData.phone,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email || null,
        password: formData.password || null,
      });

      if (rememberMe) {
        localStorage.setItem('token', response.data.token);
      } else {
        sessionStorage.setItem('token', response.data.token);
      }

      toast.success(response.data.message || 'Registration successful');

      navigate('/user/home');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          md: '1fr 1fr',
        },
        background: '#f1f5f9',
      }}
    >
      {/* LEFT SIDE */}

      <Box
        sx={{
          display: {
            xs: 'none',
            md: 'flex',
          },
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background:
            'linear-gradient(135deg,#0f172a 0%, #1d4ed8 100%)',
          color: '#fff',
          p: 6,
          position: 'relative',
        }}
      >
        <LocalGasStation sx={{ fontSize: 100, mb: 4 }} />

        <Typography
          variant="h3"
          fontWeight={800}
          mb={2}
        >
          AquaGas Delivery
        </Typography>

        <Typography
          variant="h6"
          sx={{
            textAlign: 'center',
            maxWidth: 450,
            lineHeight: 1.8,
            opacity: 0.9,
          }}
        >
          Secure LPG ordering platform with
          fast rider delivery, OTP login,
          vendor integration and real-time tracking.
        </Typography>

        <Stack spacing={2} mt={6}>
          <Feature text="OTP Phone Authentication" />
          <Feature text="Fast LPG Delivery" />
          <Feature text="Live Rider Tracking" />
          <Feature text="Wallet & Rewards" />
          <Feature text="Secure Authentication" />
        </Stack>
      </Box>

      {/* RIGHT SIDE */}

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            maxWidth: 520,
            p: {
              xs: 3,
              md: 5,
            },
            borderRadius: 5,
            boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
            border: '1px solid #e2e8f0',
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            mb={3}
          >
            {step === 2 && (
              <IconButton onClick={() => setStep(1)}>
                <ArrowBack />
              </IconButton>
            )}

            <Typography
              variant="h4"
              fontWeight={800}
            >
              Create Account
            </Typography>
          </Stack>

          <Typography
            color="text.secondary"
            mb={4}
          >
            Securely register with your phone number.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* STEP 1 */}

          {step === 1 && (
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                placeholder="+254712345678"
                value={formData.phone}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone />
                    </InputAdornment>
                  ),
                }}
              />

              {!otpSent ? (
                <Button
                  variant="contained"
                  size="large"
                  onClick={sendOTP}
                  disabled={loading}
                  sx={{
                    py: 1.7,
                    borderRadius: 3,
                    fontWeight: 700,
                  }}
                >
                  {loading ? (
                    <CircularProgress
                      size={24}
                      color="inherit"
                    />
                  ) : (
                    'Send OTP'
                  )}
                </Button>
              ) : (
                <>
                  <Alert severity="info">
                    OTP sent successfully to your phone.
                  </Alert>

                  <TextField
                    fullWidth
                    label="Enter OTP"
                    name="otp"
                    value={formData.otp}
                    onChange={handleChange}
                  />

                  <Button
                    variant="contained"
                    size="large"
                    onClick={verifyOTP}
                    disabled={loading}
                    sx={{
                      py: 1.7,
                      borderRadius: 3,
                      fontWeight: 700,
                    }}
                  >
                    {loading ? (
                      <CircularProgress
                        size={24}
                        color="inherit"
                      />
                    ) : (
                      'Verify OTP'
                    )}
                  </Button>

                  <Button
                    disabled={countdown > 0}
                    onClick={sendOTP}
                  >
                    {countdown > 0
                      ? `Resend OTP in ${countdown}s`
                      : 'Resend OTP'}
                  </Button>
                </>
              )}
            </Stack>
          )}

          {/* STEP 2 */}

          {step === 2 && otpVerified && (
            <Stack spacing={3}>
              <Alert severity="success">
                Phone verified successfully
              </Alert>

              <Stack
                direction={{
                  xs: 'column',
                  sm: 'row',
                }}
                spacing={2}
              >
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </Stack>

              <TextField
                fullWidth
                label="Email Address (Optional)"
                name="email"
                value={formData.email}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Password (Optional)"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),

                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowPassword(!showPassword)
                        }
                      >
                        {showPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {formData.password && (
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    backgroundColor: '#f8fafc',
                  }}
                >
                  <Typography
                    fontWeight={700}
                    mb={2}
                  >
                    Password Strength
                  </Typography>

                  <LinearProgress
                    variant="determinate"
                    value={(passwordStrength / 5) * 100}
                    color={getStrengthColor()}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      mb: 2,
                    }}
                  />

                  <PasswordCheck
                    valid={passwordChecks.length}
                    text="Minimum 8 characters"
                  />

                  <PasswordCheck
                    valid={passwordChecks.uppercase}
                    text="Uppercase letter"
                  />

                  <PasswordCheck
                    valid={passwordChecks.lowercase}
                    text="Lowercase letter"
                  />

                  <PasswordCheck
                    valid={passwordChecks.number}
                    text="At least one number"
                  />

                  <PasswordCheck
                    valid={passwordChecks.special}
                    text="Special character"
                  />
                </Paper>
              )}

              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) =>
                      setRememberMe(e.target.checked)
                    }
                  />
                }
                label="Keep me signed in"
              />

              <Button
                variant="contained"
                size="large"
                onClick={registerUser}
                disabled={loading}
                sx={{
                  py: 1.7,
                  borderRadius: 3,
                  fontWeight: 700,
                }}
              >
                {loading ? (
                  <CircularProgress
                    size={24}
                    color="inherit"
                  />
                ) : (
                  'Complete Registration'
                )}
              </Button>
            </Stack>
          )}

          <Divider sx={{ my: 4 }} />

          <Typography textAlign="center">
            Already have an account?

            <Typography
              component="span"
              sx={{
                ml: 1,
                color: 'primary.main',
                fontWeight: 700,
                cursor: 'pointer',
              }}
              onClick={() => navigate('/login')}
            >
              Sign In
            </Typography>
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

const Feature = ({ text }) => (
  <Stack
    direction="row"
    spacing={2}
    alignItems="center"
  >
    <CheckCircle />

    <Typography>{text}</Typography>
  </Stack>
);

const PasswordCheck = ({ valid, text }) => (
  <Stack
    direction="row"
    spacing={1}
    alignItems="center"
    mb={1}
  >
    <Security
      color={valid ? 'success' : 'disabled'}
      fontSize="small"
    />

    <Typography
      variant="body2"
      color={valid ? 'success.main' : 'text.secondary'}
    >
      {text}
    </Typography>
  </Stack>
);

export default RegisterPage;