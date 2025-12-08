"use client";
import React, { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/sidebar/Sidebar';
import Header from '@/components/header/Header';
import { Upload, Image, AlertCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { addProduct } from '@/store/slices/productSlice';
import { ProductFormData, ValidationErrors } from '../types/types';
import toast from "react-hot-toast";

const CreateProductPage: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.products.products);

  const [activeNav, setActiveNav] = useState('Product');
  const [formData, setFormData] = useState<ProductFormData>({
    productName: '',
    pageSize: '',
    format: '',
    category: '',
    price: '',
    quantity: '',
    status: '',
    photos: ['', '', '', ''],
    reportFile: null,
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (field: keyof ProductFormData, value: string): string | undefined => {
    switch (field) {
      case 'productName':
        if (!value.trim()) return 'Product name is required';
        if (value.trim().length < 3) return 'Product name must be at least 3 characters';
        if (value.trim().length > 100) return 'Product name must be less than 100 characters';
        return undefined;

      case 'pageSize':
        if (value && !/^\d+$/.test(value)) return 'Page size must be a number';
        if (value && parseInt(value) <= 0) return 'Page size must be greater than 0';
        if (value && parseInt(value) > 10000) return 'Page size must be less than 10000';
        return undefined;

      case 'format':
        if (value && !/^[a-zA-Z]+$/.test(value)) return 'Format must contain only letters';
        if (value && value.length > 20) return 'Format must be less than 20 characters';
        return undefined;

      case 'category':
        if (!value) return 'Product category is required';
        return undefined;

      case 'price':
        if (!value) return 'Price is required';
        if (!/^\d+(\.\d{1,2})?$/.test(value)) return 'Price must be a valid number (e.g., 10 or 10.99)';
        if (parseFloat(value) <= 0) return 'Price must be greater than 0';
        if (parseFloat(value) > 1000000) return 'Price must be less than 1,000,000';
        return undefined;

      case 'quantity':
        if (!value) return 'Quantity is required';
        if (!/^\d+$/.test(value)) return 'Quantity must be a whole number';
        if (parseInt(value) < 0) return 'Quantity cannot be negative';
        if (parseInt(value) > 1000000) return 'Quantity must be less than 1,000,000';
        return undefined;

      case 'status':
        if (!value) return 'Status is required';
        return undefined;

      default:
        return undefined;
    }
  };

  const handleInputChange = (field: keyof ProductFormData, value: string) => {
    setFormData({ ...formData, [field]: value });

    if (touched[field]) {
      const error = validateField(field, value);
      setErrors({ ...errors, [field]: error });
    }
  };

  const handleBlur = (field: keyof ProductFormData) => {
    setTouched({ ...touched, [field]: true });
    const error = validateField(field, formData[field] as string);
    setErrors({ ...errors, [field]: error });
  };

  const handlePhotoUpload = (index: number) => {
    console.log(`Upload photo ${index + 1}`);
  };

  const handleReportUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const maxSize = 4 * 1024 * 1024;

      if (file.size > maxSize) {
        toast.error('File size must be less than 4MB');
        return;
      }

      const validTypes = [
        'application/pdf',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv'
      ];

      if (!validTypes.includes(file.type)) {
        toast.error('Only PDF, XLSX, and CSV files are allowed');
        return;
      }

      setFormData({ ...formData, reportFile: file });
    }
  }, [formData]);

  const validateAllFields = (): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    (Object.keys(formData) as Array<keyof ProductFormData>).forEach((field) => {
      if (field !== 'photos' && field !== 'reportFile' && field !== 'format' && field !== 'pageSize') {
        const error = validateField(field, formData[field] as string);
        if (error) {
          newErrors[field as keyof ValidationErrors] = error;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    setTouched({
      productName: true,
      pageSize: true,
      format: true,
      category: true,
      price: true,
      quantity: true,
      status: true,
    });

    return isValid;
  };

  const maxId = useMemo(() => {
    return products.reduce((max, product) => {
      const id = parseInt(product.id.replace(/\D/g, ''));
      return id > max ? id : max;
    }, 21248);
  }, [products]);

  const newId = useMemo(() => `0${maxId + 1}`, [maxId]);

  const handleSaveProduct = async () => {
    if (!validateAllFields()) {
      toast.error('Please fix all validation errors before submitting');
      return;
    }

    setIsSubmitting(true);

    try {
      const newProduct = {
        id: newId,
        name: formData.productName.trim(),
        price: parseFloat(formData.price),
        pageSize: parseInt(formData.pageSize) || 40,
        qty: parseInt(formData.quantity),
        date: new Date().toLocaleString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }).replace(',', ' at'),
        status: formData.status as 'Available' | 'Out of Stock',
      };

      dispatch(addProduct(newProduct));
      const updatedProducts = [...products, newProduct];
      localStorage.setItem('products', JSON.stringify(updatedProducts));

      toast.success('Product created successfully!');
      router.push('/products');
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Failed to create product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldError = useCallback((field: keyof ValidationErrors) => {
    return touched[field] && errors[field];
  }, [touched, errors]);

  const getInputClassName = useCallback((field: keyof ValidationErrors) => {
    const baseClass =
      "w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 text-gray-900";

    if (touched[field] && errors[field]) {
      return `${baseClass} border-red-300 focus:ring-red-500`;
    }
    if (touched[field] && !errors[field] && formData[field as keyof ProductFormData]) {
      return `${baseClass} border-green-300 focus:ring-green-500`;
    }
    return `${baseClass} border-gray-300 focus:ring-indigo-500`;
  }, [touched, errors, formData]);

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />
      <div className="flex-1 ml-64">
        <Header />

        <div className="p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Product</h1>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Dashboard</span>
              <span>▶</span>
              <span>Product</span>
              <span>▶</span>
              <span>Reports</span>
              <span>▶</span>
              <span className="text-indigo-600">Add Product</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Side Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Product Information</h2>
                <p className="text-sm text-gray-500 mb-6">
                  Lorem ipsum dolor sit amet consectetur. Non ac nulla aliquam aenean in velit mattis.
                </p>

                <div className="space-y-6">
                  {/* Product Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter a product name"
                      value={formData.productName}
                      onChange={(e) => handleInputChange('productName', e.target.value)}
                      onBlur={() => handleBlur('productName')}
                      className={getInputClassName('productName')}
                    />
                    {getFieldError('productName') && (
                      <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.productName}
                      </p>
                    )}
                  </div>

                  {/* Page Size + Format */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Page Size</label>
                      <input
                        type="text"
                        placeholder="Input Page Size"
                        value={formData.pageSize}
                        onChange={(e) => handleInputChange('pageSize', e.target.value)}
                        onBlur={() => handleBlur('pageSize')}
                        className={getInputClassName('pageSize')}
                      />
                      {getFieldError('pageSize') && (
                        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.pageSize}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
                      <input
                        type="text"
                        placeholder="Format (e.g., PDF)"
                        value={formData.format}
                        onChange={(e) => handleInputChange('format', e.target.value)}
                        onBlur={() => handleBlur('format')}
                        className={getInputClassName('format')}
                      />
                      {getFieldError('format') && (
                        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.format}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Category + Price */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        onBlur={() => handleBlur('category')}
                        className={getInputClassName('category')}
                      >
                        <option value="">Select product category</option>
                        <option value="Reports">Reports</option>
                        <option value="API's">API's</option>
                        <option value="Data Feeds">Data Feeds</option>
                        <option value="Datasets">Datasets</option>
                      </select>
                      {getFieldError('category') && (
                        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.category}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Input Price (e.g., 99.99)"
                        value={formData.price}
                        onChange={(e) => handleInputChange('price', e.target.value)}
                        onBlur={() => handleBlur('price')}
                        className={getInputClassName('price')}
                      />
                      {getFieldError('price') && (
                        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.price}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Quantity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Input stock"
                      value={formData.quantity}
                      onChange={(e) => handleInputChange('quantity', e.target.value)}
                      onBlur={() => handleBlur('quantity')}
                      className={getInputClassName('quantity')}
                    />
                    {getFieldError('quantity') && (
                      <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.quantity}
                      </p>
                    )}
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status Product <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      onBlur={() => handleBlur('status')}
                      className={getInputClassName('status')}
                    >
                      <option value="">Select status product</option>
                      <option value="Available">Available</option>
                      <option value="Out of Stock">Out of Stock</option>
                    </select>
                    {getFieldError('status') && (
                      <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.status}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side Uploads */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Sample Report</h3>
                <p className="text-xs text-gray-500 mb-4">
                  Note: Format photos: SVG, JPG, or PNG (Max size 4mb)
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {[0, 1, 2, 3].map((index) => (
                    <button
                      key={index}
                      className="aspect-square border-2 border-dashed border-indigo-300 rounded-lg flex flex-col items-center justify-center hover:border-indigo-500 transition-colors bg-indigo-50"
                      onClick={() => handlePhotoUpload(index)}
                    >
                      <Image size={24} className="text-indigo-400 mb-2" />
                      <span className="text-xs text-indigo-600">Photo {index + 1}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Report</h3>
                <p className="text-xs text-gray-500 mb-4">
                  Note: Format PDF, XLSX & CSV (Max size 4mb)
                </p>

                <label className="block">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-500 transition-colors cursor-pointer bg-gray-50">
                    <input
                      type="file"
                      onChange={handleReportUpload}
                      accept=".pdf,.xlsx,.xls,.csv"
                      className="hidden"
                    />
                    <Upload size={32} className="text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      {formData.reportFile ? formData.reportFile.name : 'Upload'}
                    </p>
                  </div>
                </label>
              </div>

              <button
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSaveProduct}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Product'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProductPage;
