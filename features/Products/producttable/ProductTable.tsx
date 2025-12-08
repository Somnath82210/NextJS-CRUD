import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/sidebar/Sidebar';
import Header from '@/components/header/Header';
import { Search, Download, Plus, Eye, Edit2, Trash2, ChevronDown, ChevronUp, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { setProducts, deleteProduct, updateProduct } from '@/store/slices/productSlice';
import { ProductSlice } from '../types/types';
import EditProductModal from "@/components/modal/EditProductsModal";

// Toast Notification Component
interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = React.memo(({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  };

  const icons = {
    success: <CheckCircle className="text-green-500" size={20} />,
    error: <AlertCircle className="text-red-500" size={20} />,
    warning: <AlertCircle className="text-yellow-500" size={20} />,
  };

  return (
    <div className={`fixed top-4 right-4 z-[60] flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg animate-slide-in ${styles[type]}`}>
      {icons[type]}
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-70">
        <X size={16} />
      </button>
    </div>
  );
});

Toast.displayName = 'Toast';

type SortField = 'name' | 'price' | 'pageSize' | 'qty' | 'date' | 'status';
type SortOrder = 'asc' | 'desc' | null;

// Sort icon component - memoized
const SortIcon = React.memo<{ field: SortField; sortField: SortField | null; sortOrder: SortOrder }>(
  ({ field, sortField, sortOrder }) => {
    if (sortField !== field) {
      return <ChevronDown size={14} className="text-gray-400" />;
    }
    return sortOrder === 'asc' ? (
      <ChevronUp size={14} className="text-indigo-600" />
    ) : (
      <ChevronDown size={14} className="text-indigo-600" />
    );
  }
);

SortIcon.displayName = 'SortIcon';

const ProductsLayout: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const productsFromRedux = useAppSelector((state) => state.products.products);
  const [activeNav, setActiveNav] = useState('Product');
  const [activeTab, setActiveTab] = useState('Reports');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewProductData, setViewProductData] = useState<ProductSlice | null>(null);
  const [editProductData, setEditProductData] = useState({
    id: '',
    name: '',
    price: '',
    pageSize: '',
  });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);

  // Toast notification function - memoized
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'warning') => {
    setToast({ message, type });
  }, []);

  // Load products from localStorage on mount
  useEffect(() => {
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      try {
        const parsedProducts = JSON.parse(storedProducts);
        dispatch(setProducts(parsedProducts));
      } catch (error) {
        console.error('Error parsing stored products:', error);
        showToast('Failed to load products', 'error');
      }
    }
  }, [dispatch, showToast]);

  // Sorting function - memoized
  const handleSort = useCallback((field: SortField) => {
    setSortField(prevField => {
      if (prevField === field) {
        setSortOrder(prevOrder => {
          if (prevOrder === 'asc') return 'desc';
          if (prevOrder === 'desc') {
            setSortField(null);
            return null;
          }
          return 'asc';
        });
        return prevField;
      } else {
        setSortOrder('asc');
        return field;
      }
    });
  }, []);

  // View product details - memoized
  const handleViewProduct = useCallback((product: ProductSlice) => {
    setViewProductData(product);
    setIsViewModalOpen(true);
  }, []);

  // Edit product - memoized
  const handleEditProduct = useCallback((product: ProductSlice) => {
    console.log('Editing product:', product);
    setEditProductData({
      id: product.id,
      name: product.name,
      price: String(product.price),
      pageSize: String(product.pageSize),
    });
    setIsEditModalOpen(true);
  }, []);

  // SAVE UPDATED PRODUCT - memoized
  const handleUpdateProduct = useCallback(() => {
    // Validation
    if (!editProductData.name.trim()) {
      showToast('Product name is required', 'error');
      return;
    }
    
    const priceNum = parseFloat(editProductData.price);
    const pageSizeNum = parseInt(editProductData.pageSize);
    
    if (isNaN(priceNum) || priceNum < 0) {
      showToast('Please enter a valid price', 'error');
      return;
    }
    
    if (isNaN(pageSizeNum) || pageSizeNum < 1) {
      showToast('Please enter a valid page size', 'error');
      return;
    }

    const originalProduct = productsFromRedux.find(p => p.id === editProductData.id);
    
    if (!originalProduct) {
      showToast('Product not found', 'error');
      return;
    }

    const updatedProduct: ProductSlice = {
      ...originalProduct,
      name: editProductData.name,
      price: priceNum,
      pageSize: pageSizeNum,
    };
  
    dispatch(updateProduct(updatedProduct));
  
    // update localStorage
    const updatedProducts = productsFromRedux.map(p =>
      p.id === updatedProduct.id ? updatedProduct : p
    );
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    setIsEditModalOpen(false);
    showToast('Product updated successfully!', 'success');
  }, [editProductData, productsFromRedux, dispatch, showToast]);

  // Memoized tabs
  const tabs = useMemo(() => [
    { name: 'Reports', count: 50 },
    { name: "API's", count: 26 },
    { name: 'Data Feeds', count: 121 },
    { name: 'Datasets', count: 21 },
  ], []);

  // Select all handler - memoized
  const handleSelectAll = useCallback(() => {
    setSelectedProducts(prev => 
      prev.length === productsFromRedux.length ? [] : productsFromRedux.map(p => p.id)
    );
  }, [productsFromRedux]);

  // Select product handler - memoized
  const handleSelectProduct = useCallback((id: string) => {
    setSelectedProducts(prev =>
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
  }, []);

  // Delete product handler - memoized
  const handleDeleteProduct = useCallback((id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteProduct(id));
      const updatedProducts = productsFromRedux.filter(p => p.id !== id);
      localStorage.setItem('products', JSON.stringify(updatedProducts));
      showToast('Product deleted successfully!', 'success');
    }
  }, [productsFromRedux, dispatch, showToast]);

  // Filtered products - memoized
  const filteredProducts = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return productsFromRedux.filter(product =>
      product.id.toLowerCase().includes(query) ||
      product.name.toLowerCase().includes(query)
    );
  }, [productsFromRedux, searchQuery]);

  // Sort comparators - memoized lookup object
  const sortComparators = useMemo(() => ({
    name: (a: ProductSlice, b: ProductSlice) => a.name.localeCompare(b.name),
    price: (a: ProductSlice, b: ProductSlice) => a.price - b.price,
    pageSize: (a: ProductSlice, b: ProductSlice) => a.pageSize - b.pageSize,
    qty: (a: ProductSlice, b: ProductSlice) => a.qty - b.qty,
    date: (a: ProductSlice, b: ProductSlice) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    status: (a: ProductSlice, b: ProductSlice) => a.status.localeCompare(b.status),
  }), []);

  // Sorted products - memoized
  const sortedProducts = useMemo(() => {
    if (!sortField || !sortOrder) return filteredProducts;

    const comparator = sortComparators[sortField];
    
    return [...filteredProducts].sort((a, b) => {
      const comparison = comparator(a, b);
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [filteredProducts, sortField, sortOrder, sortComparators]);

  // Check if all products are selected - memoized
  const allProductsSelected = useMemo(() => 
    selectedProducts.length === productsFromRedux.length && productsFromRedux.length > 0,
    [selectedProducts.length, productsFromRedux.length]
  );

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />
      <div className="flex-1 ml-64">
        <Header />
        
        {/* Toast Notification */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
        
        {/* Edit Modal */}
        <EditProductModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          productData={editProductData}
          setProductData={setEditProductData}
          onSubmit={handleUpdateProduct}
        />

        {/* View Modal */}
        {isViewModalOpen && viewProductData && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
            onClick={() => setIsViewModalOpen(false)}
          >
            <div
              className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Product Details
                </h2>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Product ID
                  </label>
                  <p className="mt-1 text-sm font-medium text-indigo-600">
                    {viewProductData.id}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Product Name
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {viewProductData.name}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Price
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    ${viewProductData.price.toFixed(2)}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Page Size
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {viewProductData.pageSize}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Quantity
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {viewProductData.qty}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Date
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {viewProductData.date}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </label>
                  <div className="mt-1">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                        viewProductData.status === 'Available'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {viewProductData.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setIsViewModalOpen(false);
                    handleEditProduct(viewProductData);
                  }}
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-2"
                >
                  <Edit2 size={16} />
                  Edit Product
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Products Page Content */}
        <div className="p-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Product</h1>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Dashboard</span>
              <span>▶</span>
              <span className="text-indigo-600">Product</span>
              <span>▶</span>
              <span className="text-indigo-600">Reports</span>
            </div>
          </div>

          {/* Search and Actions */}
          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search for id, name product"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                />
              </div>
              <div className="flex items-center gap-3">
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                  <Download size={18} />
                  Export
                </button>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2" onClick={() => router.push('/products/create')}>
                  <Plus size={18} />
                  New Product
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-gray-200">
              {tabs.map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`pb-3 px-2 text-sm font-medium transition-colors relative ${activeTab === tab.name
                    ? 'text-indigo-600'
                    : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  {tab.name} ({tab.count})
                  {activeTab === tab.name && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left">
                      <input
                        type="checkbox"
                        checked={allProductsSelected}
                        onChange={handleSelectAll}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <button
                        onClick={() => handleSort('name')}
                        className="flex items-center gap-2 hover:text-gray-900 transition-colors"
                      >
                        Product
                        <SortIcon field="name" sortField={sortField} sortOrder={sortOrder} />
                      </button>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <button
                        onClick={() => handleSort('price')}
                        className="flex items-center gap-2 hover:text-gray-900 transition-colors"
                      >
                        Price
                        <SortIcon field="price" sortField={sortField} sortOrder={sortOrder} />
                      </button>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <button
                        onClick={() => handleSort('pageSize')}
                        className="flex items-center gap-2 hover:text-gray-900 transition-colors"
                      >
                        Page Size
                        <SortIcon field="pageSize" sortField={sortField} sortOrder={sortOrder} />
                      </button>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <button
                        onClick={() => handleSort('qty')}
                        className="flex items-center gap-2 hover:text-gray-900 transition-colors"
                      >
                        QTY
                        <SortIcon field="qty" sortField={sortField} sortOrder={sortOrder} />
                      </button>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <button
                        onClick={() => handleSort('date')}
                        className="flex items-center gap-2 hover:text-gray-900 transition-colors"
                      >
                        Date
                        <SortIcon field="date" sortField={sortField} sortOrder={sortOrder} />
                      </button>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <button
                        onClick={() => handleSort('status')}
                        className="flex items-center gap-2 hover:text-gray-900 transition-colors"
                      >
                        Status
                        <SortIcon field="status" sortField={sortField} sortOrder={sortOrder} />
                      </button>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sortedProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => handleSelectProduct(product.id)}
                          className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-indigo-600">{product.id}</div>
                          <div className="text-sm text-gray-600">{product.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">${product.price.toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{product.pageSize}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{product.qty}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{product.date}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${product.status === 'Available'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                            }`}
                        >
                          {product.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button 
                            className="p-1 hover:bg-gray-100 rounded" 
                            title="View"
                            onClick={() => handleViewProduct(product)}
                          >
                            <Eye size={18} className="text-gray-600" />
                          </button>
                          <button
                            className="p-1 hover:bg-gray-100 rounded"
                            title="Edit"
                            onClick={() => handleEditProduct(product)}
                          >
                            <Edit2 size={18} className="text-gray-600" />
                          </button>

                          <button className="p-1 hover:bg-gray-100 rounded" title="Delete" onClick={() => handleDeleteProduct(product.id)}>
                            <Trash2 size={18} className="text-gray-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsLayout;