'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import RegisterPage from '@/features/Login/form/RegisterForm';

export default function Register() {
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    
    if (isAuthenticated === 'true') {
      router.push('/dashboard');
    }
  }, [router]);

  return <RegisterPage />;
}