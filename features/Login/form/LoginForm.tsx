import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { LoginFormData } from '../types/types';
import { UserService } from '@/utils/userService';

export const LoginPage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initialize users from default data
    UserService.initializeUsers();
  }, []);

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      // Authenticate using UserService
      const result = UserService.authenticateUser(formData.email, formData.password);

      if (result.success && result.user) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify(result.user));
        router.push('/dashboard');
      } else {
        setError(result.message);
        setIsLoading(false);
      }
    }, 500);
  };

  const handleGoogleSignIn = () => {
    console.log('Google sign in clicked');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h1>
          <p className="text-gray-500 text-sm mb-8">
            Welcome back! Please login to your account.
          </p>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div>
            {/* Google Sign In Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors mb-6"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M19.8055 10.2292C19.8055 9.55155 19.7501 8.86906 19.6319 8.2027H10.2V12.0498H15.6014C15.3773 13.2911 14.6571 14.3898 13.6025 15.0879V17.5866H16.8251C18.7174 15.8449 19.8055 13.2728 19.8055 10.2292Z" fill="#4285F4"/>
                <path d="M10.2 20.0006C12.897 20.0006 15.1714 19.1151 16.8288 17.5865L13.6062 15.0879C12.7099 15.6979 11.5521 16.0433 10.2037 16.0433C7.59474 16.0433 5.38272 14.2832 4.58904 11.9169H1.26367V14.4927C2.96127 17.8695 6.41892 20.0006 10.2 20.0006Z" fill="#34A853"/>
                <path d="M4.58537 11.917C4.16858 10.6757 4.16858 9.32935 4.58537 8.08802V5.51221H1.26367C-0.154055 8.33736 -0.154055 11.6677 1.26367 14.4929L4.58537 11.917Z" fill="#FBBC04"/>
                <path d="M10.2 3.95789C11.6244 3.93594 13.0011 4.47268 14.0343 5.45722L16.8914 2.60107C15.0816 0.904968 12.6857 -0.0287217 10.2 0.000232466C6.41892 0.000232466 2.96127 2.13132 1.26367 5.51214L4.58537 8.08795C5.37538 5.71797 7.59107 3.95789 10.2 3.95789Z" fill="#EA4335"/>
              </svg>
              <span className="text-gray-700 font-medium">Sign In with Google</span>
            </button>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>

            {/* Email Input */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
                  placeholder="sample@gmail.com"
                />
                {formData.email && (
                  <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-600" />
                )}
              </div>
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
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
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
            </div>

            {/* Remember Me & Forget Password */}
            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700">Remember me?</span>
              </label>
              <a href="#" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                Forget Password
              </a>
            </div>

            {/* Sign In Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-gray-600">
              Do not have account?{' '}
              <a href="/register" className="text-indigo-600 hover:text-indigo-700 font-medium">
                Sign Up
              </a>
            </p>

            {/* Demo Credentials */}
            <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-700 font-medium mb-1">Demo Credentials:</p>
              <p className="text-xs text-blue-600">Email: sample@gmail.com</p>
              <p className="text-xs text-blue-600">Password: 1234abcd@</p>
            </div>
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
              src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop" 
              alt="Team collaboration" 
              className="rounded-2xl shadow-2xl w-full h-auto object-cover"
            />
            <div className="absolute -left-8 top-1/4 w-16 h-16 bg-green-400 rounded-2xl opacity-80 transform rotate-12"></div>
            <div className="absolute -right-8 top-1/3 w-12 h-12 bg-yellow-400 rounded-full opacity-80"></div>
            <div className="absolute -left-12 bottom-1/4 w-20 h-20 bg-purple-400 rounded-full opacity-60"></div>
          </div>

          <h2 className="text-4xl font-bold text-white mb-4">
           This is Login Form
          </h2>
          <p className="text-indigo-100 text-lg">
            If you delete your users JSON file, do not worry, it will save the Credentials in Cache, 
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

export default LoginPage;