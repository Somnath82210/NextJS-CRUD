import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { MetricCardProps } from '@/features/Dashboard/types/types';

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  change, 
  isPositive, 
  subtitle, 
  bgColor 
}) => {
  return (
    <div className={`${bgColor || 'bg-white'} rounded-xl p-6 ${!bgColor && 'border border-gray-200'}`}>
      <div className={`text-sm ${bgColor ? 'text-white/80' : 'text-gray-600'} mb-2`}>
        {title}
      </div>
      <div className="flex items-end justify-between">
        <div className={`text-3xl font-bold ${bgColor ? 'text-white' : 'text-gray-900'}`}>
          {value}
        </div>
        <div className={`flex items-center gap-1 text-sm font-semibold ${
          isPositive ? 'text-green-500' : 'text-red-500'
        }`}>
          {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          {change}
        </div>
      </div>
      <div className={`text-xs mt-1 ${bgColor ? 'text-white/70' : 'text-gray-500'}`}>
        {subtitle}
      </div>
    </div>
  );
};

export default MetricCard;