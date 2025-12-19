'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import DynamicForm from '@/components/form/DynamicForm';
import { CREDENTIALS, loginFields } from '../constants/loginInfo';
import { useAppDispatch, useAppSelector } from '@/store/hooks/hooks';
import { loginUser } from '@/store/slices/authSlice';
import { LoginFormProps } from '../types/types';

const LoginForm: React.FC<LoginFormProps> = ({ onToggle }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const users = useAppSelector(state => state.auth.users);
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for the field being edited
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 500));

    const newErrors: Record<string, string> = {};

    // Check if both email and password are empty
    if (!formData.email.trim() && !formData.password.trim()) {
      newErrors.email = 'Email is empty';
      newErrors.password = 'Password is empty';
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    // Check if email is empty
    if (!formData.email.trim()) {
      newErrors.email = 'Email is empty';
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    // Check if email format is valid
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }
    if (!emailRegex.test(formData.email) && !formData.password.trim()) {
      newErrors.email = 'Invalid email format';
      newErrors.password = 'Password is empty';
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    // Check if password is empty
    if (!formData.password.trim()) {
      newErrors.password = 'Password is empty';
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    // Check if email exists in Redux store
    const userWithEmail = users.find(u => u.email === formData.email);

    if (!userWithEmail) {
      newErrors.email = 'Email is wrong';
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    // Check if password matches
    if (userWithEmail.password !== formData.password) {
      newErrors.password = 'Password is wrong';
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }
    if (userWithEmail.password !== formData.password && !userWithEmail) {
      newErrors.password = 'Password is wrong';
      newErrors.email = 'Email is wrong';
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    // If all checks pass, login the user
    dispatch(loginUser({ email: formData.email, password: formData.password }));
    router.push('/dashboard');
    setIsLoading(false);
  };

  return (
    <div className="w-full">
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <DynamicForm
          formData={formData}
          onChange={handleChange}
          formFields={loginFields}
          errors={errors}
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </button>

        {onToggle && (
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={onToggle}
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Register
              </button>
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
export default LoginForm