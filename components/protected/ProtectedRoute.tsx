'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks/hooks';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const router = useRouter();

  const isAuthenticated = useAppSelector(state => state.auth.token);
  const currentUser = useAppSelector(state => state.auth.currentUser);

  useEffect(() => {
    if (!isAuthenticated || !currentUser) {
      router.replace('/');
    }
  }, [isAuthenticated, currentUser, router]);

  if (!isAuthenticated || !currentUser) return null;

  return <>{children}</>;
}
