import { ActivityType } from '@/store/slices/types';
import { useCallback } from 'react';



export const getTimeAgo = useCallback((timestamp: number): string => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    
    if (seconds < 60) return `${seconds} seconds ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  }, []);

  export const getActivityIcon = useCallback((type: ActivityType): string => {
    const icons: Record<ActivityType, string> = {
      added: '✅',
      edited: '✏️',
      removed: '🗑️'
    };
    return icons[type];
  }, []);

  export const getActivityText = useCallback((type: ActivityType, productName: string): string => {
    const texts: Record<ActivityType, string> = {
      added: `New Product added: ${productName}`,
      edited: `Product Edited: ${productName}`,
      removed: `Product Removed: ${productName}`
    };
    return texts[type];
  }, []);

  export const StatIcon = useCallback(({ isPositive }: { isPositive: boolean }) => (
    isPositive ? (
      <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
      </svg>
    ) : (
      <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
    )
  ), []);