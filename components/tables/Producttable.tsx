import React from 'react';
import { FileText, ChevronRight } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  type: string;
  price: number;
  sales: number;
  status: 'Success' | 'Pending';
}

interface ProductTableProps {
  products: Product[];
}

const ProductTable: React.FC<ProductTableProps> = ({ products }) => {
  const getIconColor = (type: string) => {
    switch (type.toUpperCase()) {
      case 'PDF':
        return 'bg-red-100 text-red-500';
      case 'DOC':
        return 'bg-blue-100 text-blue-500';
      case 'XLS':
        return 'bg-green-100 text-green-500';
      default:
        return 'bg-gray-100 text-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Product Popular</h3>
        <button className="text-sm text-gray-600 hover:text-indigo-600 flex items-center gap-1">
          Show All
          <ChevronRight size={16} />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Product</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Price</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Sales</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded flex items-center justify-center ${getIconColor(product.type)}`}>
                      <FileText size={20} />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{product.id}</div>
                      <div className="text-xs text-gray-500">{product.name}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-sm text-gray-700">${product.price.toFixed(2)}</td>
                <td className="py-4 px-4 text-sm text-gray-700">{product.sales}</td>
                <td className="py-4 px-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    product.status === 'Success' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {product.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;