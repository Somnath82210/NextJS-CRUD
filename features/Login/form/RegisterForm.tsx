import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { UserService } from '@/utils/userService';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface ValidationErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export const RegisterPage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [serverError, setServerError] = useState('');

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateName = (name: string): boolean => {
    const nameRegex = /^[a-zA-Z\s]+$/;
    return nameRegex.test(name) && name.length >= 2;
  };

  const validatePassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
    validateField(field, formData[field as keyof RegisterFormData]);
  };

  const validateField = (field: string, value: string) => {
    const newErrors: ValidationErrors = { ...errors };

    switch (field) {
      case 'name':
        if (!value) {
          newErrors.name = 'Name is required';
        } else if (!validateName(value)) {
          newErrors.name = 'Name must contain only letters and be at least 2 characters';
        } else {
          delete newErrors.name;
        }
        break;

      case 'email':
        if (!value) {
          newErrors.email = 'Email is required';
        } else if (!validateEmail(value)) {
          newErrors.email = 'Please enter a valid email address';
        } else {
          delete newErrors.email;
        }
        break;

      case 'password':
        if (!value) {
          newErrors.password = 'Password is required';
        } else if (!validatePassword(value)) {
          newErrors.password = 'Password must be at least 8 characters with letters, numbers, and symbols';
        } else {
          delete newErrors.password;
        }
        if (formData.confirmPassword) {
          if (formData.confirmPassword !== value) {
            newErrors.confirmPassword = 'Passwords do not match';
          } else {
            delete newErrors.confirmPassword;
          }
        }
        break;

      case 'confirmPassword':
        if (!value) {
          newErrors.confirmPassword = 'Please confirm your password';
        } else if (value !== formData.password) {
          newErrors.confirmPassword = 'Passwords do not match';
        } else {
          delete newErrors.confirmPassword;
        }
        break;
    }

    setErrors(newErrors);
  };

  const handleChange = (field: keyof RegisterFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (touched[field]) {
      validateField(field, value);
    }
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    setServerError('');
    
    // Mark all fields as touched
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    // Validate all fields
    Object.keys(formData).forEach(field => {
      validateField(field, formData[field as keyof RegisterFormData]);
    });

    // Check if there are any errors
    const newErrors: ValidationErrors = {};
    if (!formData.name || !validateName(formData.name)) {
      newErrors.name = 'Invalid name';
    }
    if (!formData.email || !validateEmail(formData.email)) {
      newErrors.email = 'Invalid email';
    }
    if (!formData.password || !validatePassword(formData.password)) {
      newErrors.password = 'Invalid password';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      // Register user using UserService
      const result = UserService.registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      if (result.success) {
        setSuccessMessage('Registration successful! Redirecting to login...');
        
        // Optional: Download updated users.json
        downloadUsersJson();
        
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setServerError(result.message);
        setIsLoading(false);
      }
    } catch (error) {
      setServerError('An error occurred during registration');
      setIsLoading(false);
    }
  };

  const downloadUsersJson = () => {
    const jsonData = UserService.exportUsers();
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'users.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getFieldStatus = (field: keyof RegisterFormData) => {
    if (!touched[field]) return null;
    if (errors[field]) return 'error';
    if (formData[field]) return 'success';
    return null;
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white overflow-y-auto">
        <div className="w-full max-w-md py-8">
          {/* Logo */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <div>
                <div className="text-lg font-bold text-gray-800">Practice Project</div>
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-500 text-sm mb-8">
            Join us today! Please fill in your details to register.
          </p>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <p className="text-sm text-green-600">{successMessage}</p>
            </div>
          )}

          {/* Server Error Message */}
          {serverError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-600" />
              <p className="text-sm text-red-600">{serverError}</p>
            </div>
          )}

          <div>
            {/* Name Input */}
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  onBlur={() => handleBlur('name')}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 text-gray-900 ${
                    getFieldStatus('name') === 'error'
                      ? 'border-red-300 focus:ring-red-500'
                      : getFieldStatus('name') === 'success'
                      ? 'border-green-300 focus:ring-green-500'
                      : 'border-gray-300 focus:ring-indigo-500'
                  }`}
                  placeholder="John Doe"
                />
                {getFieldStatus('name') === 'success' && (
                  <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />
                )}
                {getFieldStatus('name') === 'error' && (
                  <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600" />
                )}
              </div>
              {errors.name && touched.name && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email Input */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 text-gray-900 ${
                    getFieldStatus('email') === 'error'
                      ? 'border-red-300 focus:ring-red-500'
                      : getFieldStatus('email') === 'success'
                      ? 'border-green-300 focus:ring-green-500'
                      : 'border-gray-300 focus:ring-indigo-500'
                  }`}
                  placeholder="john@example.com"
                />
                {getFieldStatus('email') === 'success' && (
                  <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />
                )}
                {getFieldStatus('email') === 'error' && (
                  <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600" />
                )}
              </div>
              {errors.email && touched.email && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  onBlur={() => handleBlur('password')}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 text-gray-900 ${
                    getFieldStatus('password') === 'error'
                      ? 'border-red-300 focus:ring-red-500'
                      : getFieldStatus('password') === 'success'
                      ? 'border-green-300 focus:ring-green-500'
                      : 'border-gray-300 focus:ring-indigo-500'
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && touched.password && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.password}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Must be at least 8 characters with letters, numbers, and symbols (@$!%*?&)
              </p>
            </div>

            {/* Confirm Password Input */}
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  onBlur={() => handleBlur('confirmPassword')}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 text-gray-900 ${
                    getFieldStatus('confirmPassword') === 'error'
                      ? 'border-red-300 focus:ring-red-500'
                      : getFieldStatus('confirmPassword') === 'success'
                      ? 'border-green-300 focus:ring-green-500'
                      : 'border-gray-300 focus:ring-indigo-500'
                  }`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && touched.confirmPassword && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Register Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>

            {/* Sign In Link */}
            <p className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
                Sign In
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 opacity-20 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-800 opacity-20 rounded-full translate-y-32 -translate-x-32"></div>
        
        <div className="relative z-10 text-center max-w-lg">
          <div className="mb-8 relative">
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop" 
              alt="Team collaboration" 
              className="rounded-2xl shadow-2xl w-full h-auto object-cover"
            />
            <div className="absolute -left-8 top-1/4 w-16 h-16 bg-green-400 rounded-2xl opacity-80 transform rotate-12"></div>
            <div className="absolute -right-8 top-1/3 w-12 h-12 bg-yellow-400 rounded-full opacity-80"></div>
            <div className="absolute -left-12 bottom-1/4 w-20 h-20 bg-purple-400 rounded-full opacity-60"></div>
          </div>

          <h2 className="text-4xl font-bold text-white mb-4">
            Register Form
          </h2>
          <p className="text-indigo-100 text-lg">
            This page will take the inputs and Create a JSON file with id, which will be used to check for Login Validation later
          </p>

          <div className="flex justify-center gap-2 mt-8">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <div className="w-8 h-2 bg-white rounded-full"></div>
            <div className="w-2 h-2 bg-white opacity-50 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;