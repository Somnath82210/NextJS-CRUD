'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CreateProductPage from '@/features/Products/create/CreateProducts';

export default function CreateProduct() {
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    
    if (!isAuthenticated || isAuthenticated !== 'true') {
      router.push('/login');
    }
  }, [router]);

  return <CreateProductPage />;
}