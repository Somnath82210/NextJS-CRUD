'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {Products} from '@/features/Products/page';

export default function ProductMain() {
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    
    if (!isAuthenticated || isAuthenticated !== 'true') {
      router.push('/login');
    }
  }, [router]);

  return <Products />;
}