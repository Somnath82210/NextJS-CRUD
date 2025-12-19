// app/dashboard/products/page.tsx
'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DynamicTable from '@/components/table/DynamicTable';
import ExportDropdown from '@/components/export/ExportDropdown';
import { TableColumn } from '@/components/table/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks/hooks';
import { deleteProduct, updateProduct } from '@/store/slices/productSlices';
import { addActivity } from '@/store/slices/activitySlice';
import { Product, ProductStatus, StatItem } from '../types/types';
import { STATUS_COLORS, ITEMS_PER_PAGE } from '../constants/productInfo';

export default function Products() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state: { auth: { currentUser: any; }; }) => state.auth.currentUser);
  const allProducts = useAppSelector((state: { products: { products: any; }; }) => state.products.products);

  // Filter products by current user
  const products = useMemo(
    () => allProducts.filter((p: { userId: any; }) => p.userId === currentUser?.id),
    [allProducts, currentUser]
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      router.push('/');
    }
  }, [currentUser, router]);

  // Filtered products
  const filteredProducts = useMemo(
    () =>
      products.filter(
        (p: { name: string; category: string; }) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.category.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [products, searchTerm]
  );

  // Export headers configuration
  const exportHeaders = useMemo(
    () => [
      { key: 'id' as keyof Product, label: 'ID' },
      { key: 'name' as keyof Product, label: 'Product Name' },
      { key: 'category' as keyof Product, label: 'Category' },
      { key: 'price' as keyof Product, label: 'Price' },
      { key: 'stock' as keyof Product, label: 'Stock' },
      { key: 'status' as keyof Product, label: 'Status' },
      { key: 'lastUpdated' as keyof Product, label: 'Last Updated' },
    ],
    []
  );

  const getProductStatus = useCallback((stock: number): ProductStatus => {
    if (stock === 0) return 'Out of Stock';
    if (stock < 15) return 'Low Stock';
    return 'In Stock';
  }, []);

  const stats = useMemo<StatItem[]>(
    () => [
      {
        label: 'Total Products', value: products.length, color: 'text-blue-600',
        id: ''
      },
      {
        label: 'In Stock', value: products.filter((p: { status: string; }) => p.status === 'In Stock').length, color: 'text-green-600',
        id: ''
      },
      {
        label: 'Low Stock', value: products.filter((p: { status: string; }) => p.status === 'Low Stock').length, color: 'text-orange-600',
        id: ''
      },
      {
        label: 'Out of Stock', value: products.filter((p: { status: string; }) => p.status === 'Out of Stock').length, color: 'text-red-600',
        id: ''
      },
    ],
    [products]
  );

  const updateStock = useCallback(
    (product: Product, increment: boolean) => {
      const newStock = increment ? product.stock + 1 : Math.max(0, product.stock - 1);
      const updated: Product = {
        ...product,
        stock: newStock,
        status: getProductStatus(newStock),
        lastUpdated: new Date().toISOString().split('T')[0],
      };
      dispatch(updateProduct(updated));
      dispatch(addActivity({
        type: 'edited',
        productId: product.id,
        productName: product.name,
        userId: currentUser?.id || ''
      }));
    },
    [dispatch, getProductStatus, currentUser]
  );

  const handleView = useCallback((product: Product) => {
    setViewingProduct(product);
    setIsViewModalOpen(true);
  }, []);

  const handleCloseViewModal = useCallback(() => {
    setIsViewModalOpen(false);
    setViewingProduct(null);
  }, []);

  const handleEdit = useCallback((product: Product) => router.push(`/products/edit/${product.id}`), [router]);

  const handleDelete = useCallback(
    (product: Product) => {
      if (!confirm(`Are you sure you want to delete "${product.name}"?`)) return;
      dispatch(deleteProduct({ id: product.id, userId: currentUser?.id || '' }));
      dispatch(addActivity({
        type: 'removed',
        productId: product.id,
        productName: product.name,
        userId: currentUser?.id || ''
      }));
    },
    [dispatch, currentUser]
  );

  const handleRowClick = useCallback((product: Product) => handleView(product), [handleView]);

  const renderStock = useCallback(
    (product: Product) => {
      const colorClass = product.stock === 0 ? 'text-red-600' : product.stock < 15 ? 'text-orange-600' : 'text-green-600';
      return (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              updateStock(product, false);
            }}
            disabled={product.stock === 0}
            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <span className={`font-medium min-w-[2rem] text-center ${colorClass}`}>{product.stock}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              updateStock(product, true);
            }}
            className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
            type="button"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      );
    },
    [updateStock]
  );

  const columns = useMemo<TableColumn<Product>[]>(
    () => [
      {
        key: 'image',
        label: 'Image',
        sortable: false,
        width: '80px',
        render: (value: unknown) => (
          <div className="h-12 w-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
            {value ? (
              <img src={value as string} alt="Product" className="h-full w-full object-cover" />
            ) : (
              <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            )}
          </div>
        ),
      },
      {
        key: 'id',
        label: 'ID',
        sortable: true,
        width: '80px',
        render: (v: unknown) => <span className="font-mono text-gray-600">#{v as string | number}</span>,
      },
      {
        key: 'name',
        label: 'Product Name',
        sortable: true,
        render: (v: unknown) => <span className="font-medium text-gray-900">{v as string | number}</span>,
      },
      {
        key: 'category',
        label: 'Category',
        sortable: true,
        render: (v: unknown) => (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {v as string}
          </span>
        ),
      },
      {
        key: 'price',
        label: 'Price',
        sortable: true,
        render: (v: unknown) => <span className="font-semibold text-gray-900">${(v as number)?.toFixed(2)}</span>,
      },
      { key: 'stock', label: 'Stock', sortable: true, render: (_: any, row: Product) => renderStock(row as Product) },
      {
        key: 'status',
        label: 'Status',
        sortable: true,
        render: (v: unknown) => {
          const status = v as ProductStatus;
          return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[status]}`}>
              {status}
            </span>
          );
        },
      },
      {
        key: 'lastUpdated',
        label: 'Last Updated',
        sortable: true,
        render: (v: unknown) => <span className="text-gray-600">{v as string | number}</span>,
      },
      {
        key: 'actions',
        label: 'Actions',
        sortable: false,
        width: '150px',
        render: (_: unknown, row: Product) => {
          const product = row as Product;
          return (
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleView(product);
                }}
                className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                title="View product"
                type="button"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
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
        },
      },
    ],
    [handleView, handleEdit, handleDelete, renderStock]
  );

  // Don't render if not logged in
  if (!currentUser) {
    return null;
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Products</h1>
        <p className="mt-2 text-gray-600">Manage your product inventory</p>
      </div>

      {/* Search and Action Buttons */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div className="flex gap-3">
          <ExportDropdown<Product>
            data={products as Product[]}
            headers={exportHeaders}
            filename={`products_${currentUser.email}_${new Date().toISOString().split('T')[0]}`}
            buttonText="Export"
            variant="success"
          />
          <button
            onClick={() => router.push('/products/add')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2"
            type="button"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Product
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat: StatItem) => (
          <div key={stat.label} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <p className="text-sm text-gray-600">{stat.label}</p>
            <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {products.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No products yet</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding your first product.</p>
          <div className="mt-6">
            <button
              onClick={() => router.push('/products/add')}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              type="button"
            >
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Your First Product
            </button>
          </div>
        </div>
      ) : (
        /* Table */
        <DynamicTable<Product>
          columns={columns}
          data={filteredProducts as Product[]}
          itemsPerPage={ITEMS_PER_PAGE}
          showPagination
          alwaysShowPagination
          onRowClick={handleRowClick}
          emptyMessage="No products found matching your search"
        />
      )}

      {/* View Product Modal */}
      {isViewModalOpen && viewingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-2xl font-bold text-white">Product Details</h2>
              <button onClick={handleCloseViewModal} className="text-white hover:text-gray-200 transition-colors" type="button">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {viewingProduct.image && (
                <div className="flex justify-center">
                  <img src={viewingProduct.image} alt={viewingProduct.name} className="h-48 w-48 object-cover rounded-xl shadow-md" />
                </div>
              )}

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Product ID</p>
                  <p className="text-lg font-semibold text-gray-900">#{viewingProduct.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Status</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[viewingProduct.status]}`}>
                    {viewingProduct.status}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Product Name</p>
                <p className="text-xl font-bold text-gray-900">{viewingProduct.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Category</p>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {viewingProduct.category}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Price</p>
                  <p className="text-2xl font-bold text-indigo-600">${viewingProduct.price.toFixed(2)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Stock Quantity</p>
                  <p
                    className={`text-2xl font-bold ${viewingProduct.stock === 0 ? 'text-red-600' : viewingProduct.stock < 15 ? 'text-orange-600' : 'text-green-600'
                      }`}
                  >
                    {viewingProduct.stock}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Last Updated</p>
                  <p className="text-lg font-medium text-gray-900">{viewingProduct.lastUpdated}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 flex gap-3">
                <button
                  onClick={() => {
                    handleCloseViewModal();
                    handleEdit(viewingProduct);
                  }}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                  type="button"
                >
                  Edit Product
                </button>
                <button
                  onClick={handleCloseViewModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  type="button"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}