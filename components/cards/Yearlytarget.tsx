import React from 'react';
import {YearlyTargetProps} from "@/features/Dashboard/types/types"

const YearlyTarget: React.FC<YearlyTargetProps> = ({ 
  totalCost, 
  targetValue, 
  percentage 
}) => {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-gray-600 text-sm mb-1">Yearly Target</div>
          <div className="flex items-baseline gap-4">
            <div>
              <div className="text-xs text-gray-500">Total Product Cost</div>
              <div className="text-2xl font-bold text-gray-900">{totalCost}</div>
            </div>
            <div className="ml-auto">
              <div className="text-xs text-gray-500">Target Value</div>
              <div className="text-lg font-semibold text-gray-700">{targetValue}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative pt-2">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-indigo-600 h-2 rounded-full transition-all duration-500" 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default YearlyTarget;