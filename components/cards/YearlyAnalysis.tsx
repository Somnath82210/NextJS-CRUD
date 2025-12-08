import React from 'react';

const YearlyAnalysis: React.FC = () => {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">Yearly Analysis</h3>
      <div className="flex gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
          <span className="text-sm text-gray-600">Total Product Cost</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>
          <span className="text-sm text-gray-600">Target Value</span>
        </div>
      </div>
      <div className="relative h-64">
        {/* Chart labels */}
        <div className="absolute inset-0 flex items-end justify-around pb-8">
          <div className="text-xs text-gray-500 absolute top-0 left-0">50 M</div>
          <div className="text-xs text-gray-500 absolute left-0" style={{ top: '25%' }}>
            Target Value<br />$500,000,00
          </div>
          <div className="text-lime-500 bg-lime-500/10 px-3 py-1 rounded text-sm font-semibold absolute" style={{ top: '35%', right: '20%' }}>
            $231,032,444
          </div>
        </div>
        
        {/* Months */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 px-4">
          <span>Feb</span>
          <span>Mar</span>
          <span>Apr</span>
          <span>Jun</span>
          <span>Jul</span>
          <span>Aug</span>
          <span>Sep</span>
          <span>Oct</span>
          <span>Nov</span>
          <span>Des</span>
        </div>
        
        {/* Chart visualization */}
        <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
          {/* Yellow curve - Total Product Cost */}
          <path
            d="M 50 150 Q 150 100, 250 120 T 550 80"
            stroke="#facc15"
            strokeWidth="3"
            fill="none"
          />
          {/* Blue dashed curve - Target Value */}
          <path
            d="M 50 140 Q 150 90, 250 110 T 550 70"
            stroke="#4f46e5"
            strokeWidth="3"
            fill="none"
            strokeDasharray="5,5"
          />
        </svg>
      </div>
    </div>
  );
};

export default YearlyAnalysis;