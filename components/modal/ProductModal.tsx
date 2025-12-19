import { Product, ProductModalProps } from './type';
import { STATUS_COLORS } from '@/features/products/constants/productInfo';

export const ProductModal = ({ product, onClose, onEdit }: ProductModalProps) => {
  const stockColor = product.stock === 0 ? 'text-red-600' : product.stock < 15 ? 'text-orange-600' : 'text-green-600';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-2xl font-bold text-white">Product Details</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors" type="button">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {typeof product.image === 'string' && (
            <div className="flex justify-center">
              <img src={product.image} alt={product.name} className="h-48 w-48 object-cover rounded-xl shadow-md" />
            </div>
          )}

          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Product ID</p>
              <p className="text-lg font-semibold text-gray-900">#{product.id}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Status</p>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[product.status]}`}>
                {product.status}
              </span>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Product Name</p>
            <p className="text-xl font-bold text-gray-900">{product.name}</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Category</p>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">{product.category}</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Price</p>
              <p className="text-2xl font-bold text-indigo-600">${product.price.toFixed(2)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Stock Quantity</p>
              <p className={`text-2xl font-bold ${stockColor}`}>{product.stock}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Last Updated</p>
              <p className="text-lg font-medium text-gray-900">{product.lastUpdated}</p>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 flex gap-3">
            <button onClick={onEdit} className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
              Edit Product
            </button>
            <button onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
