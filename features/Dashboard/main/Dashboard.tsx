'use client';

import { useMemo, useCallback, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks/hooks';
import { updateStatsHistory } from '@/store/slices/statsSlice';
import { Stat } from '../types/types';
import { ActivityType } from '@/store/slices/types';

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const allProducts = useAppSelector((state) => state.products.products);
  const statsHistory = useAppSelector((state) => state.stats.history);
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const allActivities = useAppSelector((state) => state.activity.activities); 

  const products = useMemo(
    () => allProducts.filter(p => p.userId === currentUser?.id),
    [allProducts, currentUser]
  );
  const userActivities = useMemo(
    () => {
      if (!currentUser?.id) return [];
      return allActivities
        .filter(a => a.userId === currentUser.id)
        .slice(0, 5)
        .map(activity => ({
          ...activity,
          timestamp: new Date(activity.timestamp).toLocaleString()
        }));
    },
    [allActivities, currentUser]
  );
   const getTimeAgo = useCallback((timestamp: number): string => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    
    if (seconds < 60) return `${seconds} seconds ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  }, []);

   const getActivityIcon = useCallback((type: ActivityType): string => {
    const icons: Record<ActivityType, string> = {
      added: '✅',
      edited: '✏️',
      removed: '🗑️'
    };
    return icons[type];
  }, []);

   const getActivityText = useCallback((type: ActivityType, productName: string): string => {
    const texts: Record<ActivityType, string> = {
      added: `New Product added: ${productName}`,
      edited: `Product Edited: ${productName}`,
      removed: `Product Removed: ${productName}`
    };
    return texts[type];
  }, []);

   const StatIcon = useCallback(({ isPositive }: { isPositive: boolean }) => (
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

  // Calculate current stats
  const currentStats = useMemo(() => {
    const inStock = products.filter(p => p.status === 'In Stock').length;
    const lowStock = products.filter(p => p.status === 'Low Stock').length;
    const outOfStock = products.filter(p => p.status === 'Out of Stock').length;

    return {
      totalProducts: products.length,
      inStock,
      lowStock,
      outOfStock
    };
  }, [products]);

  // Update stats history when products change
  useEffect(() => {
    dispatch(updateStatsHistory(currentStats));
  }, [currentStats.totalProducts, currentStats.inStock, currentStats.lowStock, currentStats.outOfStock, dispatch]);

  
  // Calculate percentage change
  const calculateChange = useCallback((current: number, category: 'totalProducts' | 'inStock' | 'lowStock' | 'outOfStock'): { change: string; isPositive: boolean } => {
    if (statsHistory.length < 2) {
      return { change: 'N/A', isPositive: true };
    }

    const previous = statsHistory[statsHistory.length - 2][category];
    
    if (previous === 0) {
      return { change: current > 0 ? '+100%' : '0%', isPositive: current > 0 };
    }

    const percentChange = ((current - previous) / previous) * 100;
    const isPositive = percentChange >= 0;
    const formattedChange = `${isPositive ? '+' : ''}${percentChange.toFixed(1)}%`;

    return { change: formattedChange, isPositive };
  }, [statsHistory]);

  // Build stats with dynamic changes
  const stats = useMemo((): Stat[] => {
    const totalChange = calculateChange(currentStats.totalProducts, 'totalProducts');
    const inStockChange = calculateChange(currentStats.inStock, 'inStock');
    const lowStockChange = calculateChange(currentStats.lowStock, 'lowStock');
    const outOfStockChange = calculateChange(currentStats.outOfStock, 'outOfStock');

    return [
      { 
        name: 'Total Products', 
        value: currentStats.totalProducts.toString(), 
        change: totalChange.change, 
        isPositive: totalChange.isPositive 
      },
      { 
        name: 'In Stock', 
        value: currentStats.inStock.toString(), 
        change: inStockChange.change, 
        isPositive: inStockChange.isPositive 
      },
      { 
        name: 'Low Stock', 
        value: currentStats.lowStock.toString(), 
        change: lowStockChange.change, 
        isPositive: lowStockChange.isPositive 
      },
      { 
        name: 'Out of Stock', 
        value: currentStats.outOfStock.toString(), 
        change: outOfStockChange.change, 
        isPositive: outOfStockChange.isPositive 
      }
    ];
  }, [currentStats, calculateChange]);


  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <p className="text-sm font-medium text-gray-600">{stat.name}</p>
            <div className="mt-2 flex items-baseline justify-between">
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              {stat.change !== 'N/A' && (
                <span className={`inline-flex items-center text-sm font-medium ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  <StatIcon isPositive={stat.isPositive} />
                  {stat.change}
                </span>
              )}
              {stat.change === 'N/A' && (
                <span className="inline-flex items-center text-sm font-medium text-gray-400">
                  {stat.change}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {userActivities.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">No recent activity</p>
            </div>
          ) : (
            userActivities.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="relative">
                  <span className="text-2xl">{getActivityIcon(activity.type)}</span>
                  {activity.count > 1 && (
                    <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md">
                      {activity.count}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {getActivityText(activity.type, activity.productName)}
                    {activity.count > 1 && (
                      <span className="text-gray-500 ml-1">({activity.count} times)</span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500">{getTimeAgo(Number(activity.timestamp))}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
