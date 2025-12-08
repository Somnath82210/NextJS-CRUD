'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {DashboardPage} from '@/features/Dashboard/page';

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    
    if (!isAuthenticated || isAuthenticated !== 'true') {
      router.push('/login');
    }
  }, [router]);

  return <DashboardPage />;
}