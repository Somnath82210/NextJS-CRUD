import React from 'react';
 import { ProductivityCardProps } from '@/features/Dashboard/types/types';
const ProductivityCard: React.FC<ProductivityCardProps> = ({ title, description }) => {
  return (
    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl p-6 text-white">
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-indigo-100 text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default ProductivityCard;