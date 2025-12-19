'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks/hooks';
import { updateProduct } from '@/store/slices/productSlices';
import { addActivity } from '@/store/slices/activitySlice';
import DynamicForm from '@/components/form/DynamicForm';
import {
  Product,
  ProductStatus,
  ProductFormData
} from '../types/types';
import { FormField } from '@/components/form/type';
import { PRODUCT_CATEGORIES } from '../constants/productInfo';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.products.products);

  /** Memoized productId */
  const productId = useMemo(
    () => parseInt(params.id as string, 10),
    [params.id]
  );

  const product = useMemo(
    () => products.find((p) => p.id === productId),
    [products, productId]
  );

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    category: '',
    price: '',
    stock: '',
    image: ''
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form fields configuration with dropdown
  const formFields = useMemo(() => [
    {
      name: 'name',
      label: 'Product Name',
      type: 'text',
      placeholder: 'Enter product name',
      required: true,
      colSpan: 2,
    },
    {
      name: 'category',
      label: 'Category',
      type: 'select',
      placeholder: 'Select a category',
      options: PRODUCT_CATEGORIES,
      required: true,
      colSpan: 2
    },
    {
      name: 'price',
      label: 'Price',
      type: 'number',
      placeholder: '0.00',
      required: true,
      colSpan: 1,
      min: 0,
      step: '0.01'
    },
    {
      name: 'stock',
      label: 'Stock',
      type: 'number',
      placeholder: '0',
      required: false,
      colSpan: 1,
      min: 0,
      step: '1'
    }
  ], []);

  useEffect(() => {
    if (!product) {
      router.push('/products');
      return;
    }

    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      image: product.image || ''
    });

    if (product.image) {
      setImagePreview(product.image);
    }
  }, [product, router]);

  const getProductStatus = useCallback((stock: number): ProductStatus => {
    if (stock === 0) return 'Out of Stock';
    if (stock < 15) return 'Low Stock';
    return 'In Stock';
  }, []);

  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        setFormErrors((prev) => ({
          ...prev,
          image: 'Image size should be less than 5MB'
        }));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setFormData((prev) => ({ ...prev, image: result }));
        setFormErrors((prev) => ({ ...prev, image: '' }));
      };
      reader.readAsDataURL(file);
    },
    []
  );

  const removeImage = useCallback(() => {
    setImagePreview('');
    setFormData((prev) => ({ ...prev, image: '' }));
  }, []);

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
    if (formData.stock) {
      const stock = Number(formData.stock);
      if (stock < 0) {
          errors.stock = 'Stock must be greater than 0';
        }
      }
      if (!formData.price) {
        errors.price = 'Price cannot be empty';
      } else {
        const price = Number(formData.price);
        if (Number.isNaN(price)) {
          errors.price = 'Valid price is required';
        } else if (price <= 0) {
          errors.price = 'Price must be greater than 0';
        } else if (price > 999999) {
          errors.price = 'Price must be less than 1,000,000';
        }
      }

    const stock = parseInt(formData.stock, 10);
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

  const handleFormChange = useCallback(
    (name: string, value: string) => {
      if ((name === 'price' || name === 'stock') && value.startsWith('-')) {
        return;
      }
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (formErrors[name]) {
        setFormErrors((prev) => ({ ...prev, [name]: '' }));
      }
    },
    [formErrors]
  );

  const stockNum = useMemo(
    () => parseInt(formData.stock, 10),
    [formData.stock]
  );

  const updatedProduct = useMemo(() => {
    if (!product) return null;

    return {
      ...product,
      name: formData.name.trim(),
      category: formData.category.trim(),
      price: parseFloat(formData.price),
      stock: stockNum,
      status: getProductStatus(stockNum),
      lastUpdated: new Date().toISOString().split('T')[0],
      image: formData.image || undefined
    } as Product;
  }, [product, formData, stockNum, getProductStatus]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validateForm() || !updatedProduct) return;

      setIsSubmitting(true);

      dispatch(updateProduct(updatedProduct));
      dispatch(
        addActivity({
          type: 'edited',
          productId: updatedProduct.id,
          productName: updatedProduct.name,
          userId: ''
        })
      );

      router.push('/products');
    },
    [validateForm, updatedProduct, dispatch, router]
  );

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Product not found</p>
          <button
            onClick={() => router.push('/products')}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
            type="button"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Products
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
          <p className="mt-2 text-gray-600">Update product details</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Image
              </label>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="h-32 w-32 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden bg-gray-50 flex items-center justify-center">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <svg
                        className="h-12 w-12 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <svg
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                      />
                    </svg>
                    Change Image
                  </label>
                  {imagePreview && (
                    <button
                      type="button"
                      onClick={removeImage}
                      className="ml-3 inline-flex items-center px-4 py-2 border border-red-300 rounded-lg shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 transition-colors"
                    >
                      Remove
                    </button>
                  )}
                  <p className="mt-2 text-xs text-gray-500">
                    PNG, JPG, GIF up to 5MB
                  </p>
                  {formErrors.image && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.image}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Dynamic Form Fields with Dropdown */}
            <DynamicForm
              formData={formData}
              onChange={handleFormChange}
              formFields={formFields as FormField[]}
              errors={formErrors}
              colSpan={2}
            />

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Updating...' : 'Update Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}