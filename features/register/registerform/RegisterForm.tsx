'use client';

import { useState, FormEvent } from 'react';
import DynamicForm from '@/components/form/DynamicForm';
import { registerFields } from '../constants/registerInfo';
import { RegisterFormData } from '../types/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks/hooks';
import { registerUser } from '@/store/slices/authSlice';
import { RegisterFormProps } from '../types/types';

export default function RegisterForm({ onToggle }: RegisterFormProps) {
  const dispatch = useAppDispatch();
  const users = useAppSelector(state => state.auth.users);
  
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for the field being edited
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else {
      const namePattern = /^[a-zA-Z\s]{2,50}$/;
      if (!namePattern.test(formData.name)) {
        newErrors.name = 'Name must contain only letters and spaces (2-50 characters)';
      }
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(formData.email)) {
        newErrors.email = 'Invalid email format';
      }
    }

    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    } else {
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
      if (!passwordRegex.test(formData.password)) {
        newErrors.password = 'Password must contain letters, numbers, and special characters';
      }
    }

    // Confirm password validation
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Check if email already exists
    const existingUser = users.find(user => user.email === formData.email);
    
    if (existingUser) {
      setErrors({ email: 'Email already registered. Please login instead.' });
      setIsLoading(false);
      return;
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Register user in Redux store
    dispatch(registerUser({
      name: formData.name,
      email: formData.email,
      password: formData.password
    }));

    console.log('Registration successful:', { 
      name: formData.name, 
      email: formData.email 
    });

    setSuccess(true);
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    
    // Auto-switch to login after 2 seconds
    setTimeout(() => {
      if (onToggle) onToggle();
    }, 2000);

    setIsLoading(false);
  };

  return (
    <div className="w-full">
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <DynamicForm
          formData={formData}
          onChange={handleChange}
          formFields={registerFields}
          errors={errors}
        />

        {success && (
          <div className="rounded-md bg-green-50 p-4">
            <p className="text-sm text-green-800">
              Registration successful! Redirecting to login...
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isLoading ? 'Creating account...' : 'Register'}
        </button>

        {onToggle && (
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onToggle}
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Sign in
              </button>
            </p>
          </div>
        )}
      </form>
    </div>
  );
}