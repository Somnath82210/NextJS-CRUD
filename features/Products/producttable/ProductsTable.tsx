// features/products/Products.tsx
'use client';

import { useState, useMemo, useCallback } from 'react';
import DynamicTable from '@/components/table/DynamicTable';
import DynamicForm from '@/components/form/DynamicForm';
import { TableColumn } from '@/components/table/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks/hooks';
import { addProduct, updateProduct, deleteProduct } from '@/store/slices/productSlices';
import { addActivity } from '@/store/slices/activitySlice';
import { Product, ProductStatus, StatItem, ProductFormData } from '../types/types';
import { INITIAL_FORM_DATA, FORM_FIELDS, STATUS_COLORS } from '../constants/productInfo';

export default function Products() {
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.products.products);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Memoized filtered products
  const filteredProducts = useMemo(() => 
    products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [products, searchTerm]
  );

  // Memoized stats
  const stats = useMemo((): StatItem[] => [
    { label: 'Total Products', value: products.length, color: 'text-blue-600' },
    { label: 'In Stock', value: products.filter(p => p.status === 'In Stock').length, color: 'text-green-600' },
    { label: 'Low Stock', value: products.filter(p => p.status === 'Low Stock').length, color: 'text-orange-600' },
    { label: 'Out of Stock', value: products.filter(p => p.status === 'Out of Stock').length, color: 'text-red-600' }
  ], [products]);

  // Get product status based on stock
  const getProductStatus = useCallback((stock: number): ProductStatus => {
    if (stock === 0) return 'Out of Stock';
    if (stock < 15) return 'Low Stock';
    return 'In Stock';
  }, []);

  // Update stock with inline controls
  const updateStock = useCallback((product: Product, increment: boolean) => {
    const newStock = increment ? product.stock + 1 : Math.max(0, product.stock - 1);
    const updatedProduct: Product = {
      ...product,
      stock: newStock,
      status: getProductStatus(newStock),
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    dispatch(updateProduct(updatedProduct));
    dispatch(addActivity({ 
      type: 'edited', 
      productId: product.id,
      productName: product.name 
    }));
  }, [dispatch, getProductStatus]);

  // Validate form
  const validateForm = useCallback((): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = 'Product name is required';
    } else if (formData.name.trim().length < 3) {
      errors.name = 'Product name must be at least 3 characters';
    }

    if (!formData.category.trim()) {
      errors.category = 'Category is required';
    }

    const price = parseFloat(formData.price);
    if (!formData.price || isNaN(price)) {
      errors.price = 'Valid price is required';
    } else if (price <= 0) {
      errors.price = 'Price must be greater than 0';
    } else if (price > 999999) {
      errors.price = 'Price must be less than 1,000,000';
    }

    const stock = parseInt(formData.stock);
    if (!formData.stock || isNaN(stock)) {
      errors.stock = 'Valid stock quantity is required';
    } else if (stock < 0) {
      errors.stock = 'Stock cannot be negative';
    } else if (stock > 999999) {
      errors.stock = 'Stock must be less than 1,000,000';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  // Handle form field change
  const handleFormChange = useCallback((name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [formErrors]);

  // Close modal and reset form
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData(INITIAL_FORM_DATA);
    setFormErrors({});
  }, []);

  // Handle edit
  const handleEdit = useCallback((product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString()
    });
    setIsModalOpen(true);
  }, []);

  // Handle delete
  const handleDelete = useCallback((product: Product) => {
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      dispatch(deleteProduct(product.id));
      dispatch(addActivity({ 
        type: 'removed', 
        productId: product.id,
        productName: product.name 
      }));
    }
  }, [dispatch]);

  // Handle submit
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const stockNum = parseInt(formData.stock);
    const productData = {
      name: formData.name.trim(),
      category: formData.category.trim(),
      price: parseFloat(formData.price),
      stock: stockNum,
      status: getProductStatus(stockNum),
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    if (editingProduct) {
      const updatedProduct: Product = { ...editingProduct, ...productData };
      dispatch(updateProduct(updatedProduct));
      dispatch(addActivity({ 
        type: 'edited', 
        productId: updatedProduct.id,
        productName: updatedProduct.name 
      }));
    } else {
      const newProduct: Product = {
        ...productData,
        id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1
      };
      dispatch(addProduct(newProduct));
      dispatch(addActivity({ 
        type: 'added', 
        productId: newProduct.id,
        productName: newProduct.name 
      }));
    }
    handleCloseModal();
  }, [formData, editingProduct, products, dispatch, validateForm, getProductStatus, handleCloseModal]);

  // Table columns configuration
  const columns = useMemo((): TableColumn<Product>[] => [
    {
      key: 'id',
      label: 'ID',
      sortable: true,
      width: '80px',
      render: (value) => <span className="font-mono text-gray-600">#{value as string | number}</span>
    },
    {
      key: 'name',
      label: 'Product Name',
      sortable: true,
      render: (value) => <span className="font-medium text-gray-900">{value as string | number}</span>
    },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
      render: (value) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {value as string | number}
        </span>
      )
    },
    {
      key: 'price',
      label: 'Price',
      sortable: true,
      render: (value) => {
        const price = typeof value === 'number' ? value : 0;
        return <span className="font-semibold text-gray-900">${price.toFixed(2)}</span>;
      }
    },
    {
      key: 'stock',
      label: 'Stock',
      sortable: true,
      render: (value, row) => {
        const product = row as Product;
        const stock = typeof value === 'number' ? value : 0;
        const colorClass = stock === 0 ? 'text-red-600' : stock < 15 ? 'text-orange-600' : 'text-green-600';
        
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                updateStock(product, false);
              }}
              className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Decrease stock"
              type="button"
              disabled={stock === 0}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <span className={`font-medium min-w-[2rem] text-center ${colorClass}`}>{stock}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                updateStock(product, true);
              }}
              className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
              title="Increase stock"
              type="button"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        );
      }
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value) => {
        const status = value as ProductStatus;
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[status]}`}>
            {status}
          </span>
        );
      }
    },
    {
      key: 'lastUpdated',
      label: 'Last Updated',
      sortable: true,
      render: (value) => <span className="text-gray-600">{value as string | number}</span>
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      width: '120px',
      render: (_, row) => {
        const product = row as Product;
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(product);
              }}
              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit product"
              type="button"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(product);
              }}
              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete product"
              type="button"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        );
      }
    }
  ], [handleEdit, handleDelete, updateStock]);

  const handleRowClick = useCallback((product: Product) => {
    console.log('Clicked product:', product);
  }, []);

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        <p className="mt-2 text-gray-600">Manage your product inventory</p>
      </div>

      {/* Search and Actions */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2"
          type="button"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <p className="text-sm text-gray-600">{stat.label}</p>
            <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <DynamicTable<Product>
        columns={columns}
        data={filteredProducts as Product[]}
        onRowClick={handleRowClick}
        emptyMessage="No products found"
      />

      {/* Add/Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                type="button"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <DynamicForm
                formData={formData}
                onChange={handleFormChange}
                formFields={FORM_FIELDS}
                errors={formErrors}
                colSpan={2}
              />

              <div className="mt-6 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}