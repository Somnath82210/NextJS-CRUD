'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from '@/features/login/loginform/Login';
import RegisterForm from '@/features/register/registerform/RegisterForm';
import { useAppSelector } from '@/store/hooks/hooks';

export default function AuthPage() {
  const [showLogin, setShowLogin] = useState(true);
  const router = useRouter();
  const currentUser = useAppSelector(state => state.auth.currentUser);

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (currentUser) {
      router.push('/dashboard');
    }
  }, [currentUser, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {showLogin ? 'Sign in to your account' : 'Create your account'}
          </h2>
        </div>

        {showLogin ? (
          <LoginForm onToggle={() => setShowLogin(false)} />
        ) : (
          <RegisterForm onToggle={() => setShowLogin(true)} />
        )}
      </div>
    </div>
  );
}